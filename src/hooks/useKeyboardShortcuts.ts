import { useEffect, useCallback } from 'react';

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
