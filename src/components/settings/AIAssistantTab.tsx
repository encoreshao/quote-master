import React, { useState, useEffect, useCallback } from 'react';
import { AIConfig, AIProvider, AI_PROVIDERS, AI_CHAT_SHORTCUTS } from '../../types/ai';
import { getAIConfig, setAIConfig } from '../../utils/storage';

const DEFAULT_CONFIG: AIConfig = {
  provider: 'openai',
  chatShortcut: 'alt+space',
  confirmDestructiveActions: true,
  openai: { apiKey: '', model: 'gpt-4o-mini', baseUrl: '' },
  claude: { apiKey: '', model: 'claude-3-5-sonnet-20241022' },
  gemini: { apiKey: '', model: 'gemini-1.5-flash' },
};

const AIAssistantTab: React.FC = () => {
  const [config, setConfig] = useState<AIConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    getAIConfig(setConfig);
  }, []);

  const handleConfigChange = useCallback((updates: Partial<AIConfig>) => {
    const next = { ...config, ...updates };
    setConfig(next);
    setAIConfig(next);
  }, [config]);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold t-primary mb-3">Active Provider</h3>
        <p className="text-xs t-muted mb-3">Choose which AI provider to use when you open the chat popup.</p>
        <div className="flex gap-2 flex-wrap">
          {AI_PROVIDERS.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => handleConfigChange({ provider: id })}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                config.provider === id
                  ? 't-primary'
                  : 't-muted hover:t-tertiary'
              }`}
              style={config.provider === id ? { backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)' } : {}}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={config.confirmDestructiveActions ?? true}
            onChange={e => handleConfigChange({ confirmDestructiveActions: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm t-primary">Confirm delete/destroy actions</span>
        </label>
        <p className="text-xs t-muted mb-4">
          When enabled, the AI will ask for confirmation before removing tasks, links, notes, or RSS feeds.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold t-primary mb-2">Chat Shortcut</h3>
        <p className="text-xs t-muted mb-2">Press this shortcut to open the AI chat popup from anywhere.</p>
        <select
          value={config.chatShortcut}
          onChange={e => handleConfigChange({ chatShortcut: e.target.value as AIConfig['chatShortcut'] })}
          className="glass-input text-sm w-full"
        >
          {AI_CHAT_SHORTCUTS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {AI_PROVIDERS.map(({ id, name, models }) => (
        <div key={id} className={config.provider !== id ? 'hidden' : ''}>
          <h3 className="text-sm font-semibold t-primary mb-2">{name} API Key</h3>
          <input
            type="password"
            placeholder={`Enter ${name} API key (stored locally)`}
            value={
              id === 'openai' ? config.openai.apiKey :
              id === 'claude' ? config.claude.apiKey :
              config.gemini.apiKey
            }
            onChange={e => {
              if (id === 'openai') handleConfigChange({ openai: { ...config.openai, apiKey: e.target.value } });
              else if (id === 'claude') handleConfigChange({ claude: { ...config.claude, apiKey: e.target.value } });
              else handleConfigChange({ gemini: { ...config.gemini, apiKey: e.target.value } });
            }}
            className="glass-input text-sm w-full mb-2"
          />
          <label className="block text-xs t-tertiary mb-1">Model</label>
          <select
            value={
              id === 'openai' ? config.openai.model :
              id === 'claude' ? config.claude.model :
              config.gemini.model
            }
            onChange={e => {
              if (id === 'openai') handleConfigChange({ openai: { ...config.openai, model: e.target.value } });
              else if (id === 'claude') handleConfigChange({ claude: { ...config.claude, model: e.target.value } });
              else handleConfigChange({ gemini: { ...config.gemini, model: e.target.value } });
            }}
            className="glass-input text-sm w-full"
          >
            {models.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {id === 'openai' && (
            <>
              <label className="block text-xs t-tertiary mt-2 mb-1">Base URL (optional)</label>
              <input
                type="text"
                placeholder="https://api.openai.com/v1"
                value={config.openai.baseUrl || ''}
                onChange={e => handleConfigChange({ openai: { ...config.openai, baseUrl: e.target.value } })}
                className="glass-input text-sm w-full"
              />
            </>
          )}
        </div>
      ))}

      <p className="text-xs t-faint">
        The AI can add or remove tasks, links, notes, and RSS feeds, or switch layouts. Add actions run immediately; delete actions can require confirmation if enabled above.
      </p>
    </div>
  );
};

export default AIAssistantTab;
