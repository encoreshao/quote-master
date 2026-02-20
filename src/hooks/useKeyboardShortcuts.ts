import { useEffect, useCallback } from 'react';
import type { AIChatShortcut } from '../types/ai';

export interface ShortcutAction {
  key: string;
  label: string;
  description: string;
  action: () => void;
  /** If true, fires even when an input/textarea is focused (default: false) */
  global?: boolean;
}

function isInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

function matchesShortcut(e: KeyboardEvent, shortcut: AIChatShortcut): boolean {
  // Use e.code so modifier+Space works on Mac (Option+Space changes e.key to non-breaking space)
  if (e.code !== 'Space') return false;
  switch (shortcut) {
    case 'ctrl+space': return e.ctrlKey && !e.metaKey && !e.altKey;
    case 'alt+space': return e.altKey && !e.ctrlKey && !e.metaKey;
    case 'meta+space': return e.metaKey && !e.ctrlKey && !e.altKey;
    default: return false;
  }
}

export function useKeyboardShortcuts(shortcuts: ShortcutAction[]) {
  const handler = useCallback((e: KeyboardEvent) => {
    // Ignore when modifier keys are held (except Shift for ?)
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const focused = isInputFocused();

    for (const shortcut of shortcuts) {
      if (e.key === shortcut.key) {
        if (!shortcut.global && focused) continue;
        e.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);
}

export function useAIChatShortcut(shortcut: AIChatShortcut, action: () => void, enabled: boolean) {
  const handler = useCallback((e: KeyboardEvent) => {
    if (!enabled || !matchesShortcut(e, shortcut)) return;
    e.preventDefault();
    e.stopPropagation();
    action();
  }, [shortcut, action, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [handler]);
}

export const SHORTCUT_MAP = {
  SETTINGS: ',',
  ADD_WIDGET: 'a',
  SEARCH: '/',
  ESCAPE: 'Escape',
  HELP: '?',
  LAYOUT_FOCUS: '1',
  LAYOUT_DASHBOARD: '2',
  LAYOUT_WORKFLOW: '3',
};
