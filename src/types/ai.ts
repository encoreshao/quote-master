// ============================================================
// AI Assistant — Type Definitions
// ============================================================

export type AIProvider = 'openai' | 'claude' | 'gemini';

export type AIChatShortcut = 'ctrl+space' | 'alt+space' | 'meta+space';

export interface AIConfig {
  provider: AIProvider;
  chatShortcut: AIChatShortcut;
  confirmDestructiveActions?: boolean;
  openai: { apiKey: string; model: string; baseUrl?: string };
  claude: { apiKey: string; model: string };
  gemini: { apiKey: string; model: string };
}

export const AI_CHAT_SHORTCUTS: { value: AIChatShortcut; label: string }[] = [
  { value: 'ctrl+space', label: 'Ctrl + Space' },
  { value: 'alt+space', label: 'Alt + Space (Option + Space)' },
  { value: 'meta+space', label: '⌘ + Space (Cmd + Space)' },
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface WidgetAction {
  type:
    | 'add_task' | 'add_link' | 'add_note' | 'add_rss_feed'
    | 'delete_task' | 'delete_link' | 'remove_link'
    | 'remove_rss_feed' | 'clear_notes'
    | 'refresh_weather' | 'start_pomodoro' | 'layout_change';
  payload?: Record<string, unknown>;
}

export const AI_PROVIDERS: { id: AIProvider; name: string; models: string[] }[] = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { id: 'claude', name: 'Claude', models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'] },
  { id: 'gemini', name: 'Gemini', models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'] },
];
