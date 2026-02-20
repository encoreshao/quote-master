import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AIConfig, ChatMessage, WidgetAction } from '../types/ai';
import { getAIConfig } from '../utils/storage';
import { sendChat } from '../services/ai';
import {
  executeWidgetAction,
  parseActionFromResponse,
  isDestructiveAction,
  getActionDescription,
} from '../utils/widgetActions';

interface AIChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChatPopup: React.FC<AIChatPopupProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{ action: WidgetAction; message: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      getAIConfig(setConfig);
      setInput('');
      setResult(null);
      setError(null);
      setPendingAction(null);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  const hasValidKey = () => {
    if (!config) return false;
    const p = config.provider;
    if (p === 'openai') return !!config.openai.apiKey?.trim();
    if (p === 'claude') return !!config.claude.apiKey?.trim();
    if (p === 'gemini') return !!config.gemini.apiKey?.trim();
    return false;
  };

  const runAction = useCallback(async (action: WidgetAction) => {
    const actionResult = await executeWidgetAction(action);
    const msg = actionResult.ok ? (actionResult.message || 'Done.') : (actionResult.message || 'Action failed.');
    setResult(actionResult.ok ? msg : null);
    setError(actionResult.ok ? null : msg);
    if (actionResult.ok) onClose();
    return actionResult.ok;
  }, [onClose]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading || !config || !hasValidKey()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setPendingAction(null);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    const history = [userMsg];

    try {
      const res = await sendChat(config, history);

      if (res.error) {
        setError(res.error);
        return;
      }

      const action = parseActionFromResponse(res.content);
      if (action) {
        const needsConfirm = isDestructiveAction(action) && (config.confirmDestructiveActions ?? true);

        if (needsConfirm) {
          setPendingAction({
            action,
            message: res.content || '',
          });
        } else {
          await runAction(action);
        }
      } else {
        setResult(res.content || 'No action taken.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }, [input, loading, config, runAction]);

  const handleConfirmAction = useCallback(async () => {
    if (!pendingAction) return;
    setLoading(true);
    setError(null);
    try {
      await runAction(pendingAction.action);
      setPendingAction(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }, [pendingAction, runAction]);

  const handleCancelConfirm = useCallback(() => {
    setPendingAction(null);
    setResult(null);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 backdrop-blur-sm z-40 animate-fade-in"
        style={{ backgroundColor: 'var(--backdrop-overlay)' }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--panel-border)' }}>
            <h2 className="text-sm font-semibold t-primary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 3V4.5M4.5 8.25H3M21 8.25H19.5M4.5 12H3M21 12H19.5M4.5 15.75H3M21 15.75H19.5M8.25 19.5V21M12 3V4.5M12 19.5V21M15.75 3V4.5M15.75 19.5V21M6.75 19.5H17.25C18.4926 19.5 19.5 18.4926 19.5 17.25V6.75C19.5 5.50736 18.4926 4.5 17.25 4.5H6.75C5.50736 4.5 4.5 5.50736 4.5 6.75V17.25C4.5 18.4926 5.50736 19.5 6.75 19.5ZM7.5 7.5H16.5V16.5H7.5V7.5Z" />
              </svg>
              AI Assistant
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-lg t-muted hover:t-primary transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4">
            {!hasValidKey() ? (
              <p className="text-sm t-muted text-center py-6">
                Add an API key in Settings → AI Assistant to use the assistant.
              </p>
            ) : pendingAction ? (
              <div>
                <p className="text-sm t-secondary mb-3">
                  The AI wants to {getActionDescription(pendingAction.action)}. Do you want to proceed?
                </p>
                {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCancelConfirm}
                    className="glass-button-ghost text-sm px-4 py-2"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAction}
                    disabled={loading}
                    className="glass-button text-sm px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Executing...' : 'Confirm'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Add a task, link, note... or ask anything"
                  className="glass-input text-sm w-full mb-3"
                  disabled={loading}
                  autoComplete="off"
                />
                {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
                {result && <p className="text-xs t-secondary mb-2">✓ {result}</p>}
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={onClose} className="glass-button-ghost text-sm px-4 py-2">
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="glass-button text-sm px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Ask'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatPopup;
