// ============================================================
// Nexus Tab — Storage Utilities
// ============================================================

import {
  NexusProfile,
  LayoutType,
  NexusLayouts,
  NexusStorage,
  Task,
  QuickLink,
} from '../types';
import type { AIConfig } from '../types/ai';

// ---- Defaults ----

export const DEFAULT_PROFILE: NexusProfile = {
  username: '',
  greeting: '',
  backgroundUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
  accentColor: '#3B82F6',
  theme: 'system',
};

export const DEFAULT_LAYOUT: LayoutType = 'dashboard';

export const DEFAULT_LAYOUTS: NexusLayouts = {
  focus: {
    widgets: ['clock', 'search', 'quicklinks', 'tasks'],
  },
  dashboard: {
    widgets: ['clock', 'weather', 'search', 'tasks', 'quicklinks', 'pomodoro', 'rss', 'notes'],
  },
  workflow: {
    widgets: ['tasks', 'clock', 'pomodoro', 'quicklinks', 'notes'],
  },
};

export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'openai',
  chatShortcut: 'alt+space',
  confirmDestructiveActions: true,
  openai: { apiKey: '', model: 'gpt-4o-mini', baseUrl: '' },
  claude: { apiKey: '', model: 'claude-3-5-sonnet-20241022' },
  gemini: { apiKey: '', model: 'gemini-1.5-flash' },
};

export const DEFAULT_QUICK_LINKS: QuickLink[] = [
  { id: '1', name: 'Gmail', url: 'https://mail.google.com', icon: 'mail' },
  { id: '2', name: 'GitHub', url: 'https://github.com', icon: 'github' },
  { id: '3', name: 'ChatGPT', url: 'https://chatgpt.com', icon: 'bot' },
  { id: '4', name: 'Google', url: 'https://google.com', icon: 'search' },
];

// ---- Chrome Storage Helpers ----

export function getStorage<T = any>(
  keys: string | string[],
  callback: (result: T) => void
): void {
  if (chrome?.storage) {
    chrome.storage.local.get(keys, (result: any) => callback(result as T));
  } else {
    console.warn('Chrome storage not available');
    callback({} as T);
  }
}

export function setStorage(obj: Record<string, any>, callback?: () => void): void {
  if (chrome?.storage) {
    chrome.storage.local.set(obj, callback ?? (() => {}));
  } else {
    console.warn('Chrome storage not available');
    callback?.();
  }
}

export function removeStorage(keys: string | string[], callback?: () => void): void {
  if (chrome?.storage) {
    chrome.storage.local.remove(keys, callback ?? (() => {}));
  } else {
    console.warn('Chrome storage not available');
    callback?.();
  }
}

// ---- Typed getters / setters ----

export function getNexusProfile(callback: (profile: NexusProfile) => void): void {
  getStorage(['nexus.profile'], (result: any) => {
    callback(result['nexus.profile'] || DEFAULT_PROFILE);
  });
}

export function setNexusProfile(profile: NexusProfile, callback?: () => void): void {
  setStorage({ 'nexus.profile': profile }, callback);
}

export function getActiveLayout(callback: (layout: LayoutType) => void): void {
  getStorage(['nexus.activeLayout'], (result: any) => {
    callback(result['nexus.activeLayout'] || DEFAULT_LAYOUT);
  });
}

export function setActiveLayout(layout: LayoutType, callback?: () => void): void {
  setStorage({ 'nexus.activeLayout': layout }, callback);
}

export function getAIConfig(callback: (config: AIConfig) => void): void {
  getStorage(['nexus.aiConfig'], (result: any) => {
    const stored = result['nexus.aiConfig'];
    if (!stored) {
      callback({ ...DEFAULT_AI_CONFIG });
      return;
    }
    callback({
      provider: stored.provider ?? DEFAULT_AI_CONFIG.provider,
      chatShortcut: stored.chatShortcut ?? DEFAULT_AI_CONFIG.chatShortcut,
      confirmDestructiveActions: stored.confirmDestructiveActions ?? DEFAULT_AI_CONFIG.confirmDestructiveActions ?? true,
      openai: { ...DEFAULT_AI_CONFIG.openai, ...stored.openai },
      claude: { ...DEFAULT_AI_CONFIG.claude, ...stored.claude },
      gemini: { ...DEFAULT_AI_CONFIG.gemini, ...stored.gemini },
    });
  });
}

export function setAIConfig(config: AIConfig, callback?: () => void): void {
  setStorage({ 'nexus.aiConfig': config }, callback);
}

export function getNexusLayouts(callback: (layouts: NexusLayouts) => void): void {
  getStorage(['nexus.layouts'], (result: any) => {
    callback(result['nexus.layouts'] || DEFAULT_LAYOUTS);
  });
}

export function getWidgetConfig<T>(widgetId: string, defaults: T, callback: (config: T) => void): void {
  const key = `nexus.widget.${widgetId}`;
  getStorage([key], (result: any) => {
    callback(result[key] || defaults);
  });
}

export function setWidgetConfig(widgetId: string, config: any, callback?: () => void): void {
  setStorage({ [`nexus.widget.${widgetId}`]: config }, callback);
}

// ---- Migration from Quote Master ----

export function migrateFromQuoteMaster(callback: () => void): void {
  getStorage(['nexus.migrated'], (result: any) => {
    if (result['nexus.migrated']) {
      callback();
      return;
    }

    // Read old Quote Master keys
    const oldKeys = [
      'username', 'telphone', 'backgroundUrl', 'github', 'gitlab',
      'gitlabToken', 'gitlabAPIVersion', 'bamboohr', 'tasks',
      'openAIChatBotURL', 'deepSeekChatBotURL', 'geminiChatBotURL',
      'grokChatBotURL', 'searchEngine', 'currentTab',
    ];

    getStorage(oldKeys, (oldData: any) => {
      const hasOldData = Object.keys(oldData).length > 0;

      if (!hasOldData) {
        // Fresh install — set defaults
        setStorage({
          'nexus.migrated': true,
          'nexus.profile': DEFAULT_PROFILE,
          'nexus.activeLayout': DEFAULT_LAYOUT,
          'nexus.layouts': DEFAULT_LAYOUTS,
          'nexus.widget.quicklinks': { links: DEFAULT_QUICK_LINKS },
          'nexus.widget.tasks': { items: [], viewMode: 'board' },
          'nexus.widget.notes': { content: '' },
          'nexus.widget.pomodoro': { workMinutes: 25, breakMinutes: 5 },
          'nexus.widget.search': { engine: 'https://www.google.com/search?q=' },
          'nexus.widget.rss': { feeds: [], refreshInterval: 15 },
          'nexus.widget.weather': { latitude: null, longitude: null, city: '', units: 'metric', autoDetect: true },
          'nexus.widget.bookmarks': { showSearch: true },
        }, callback);
        return;
      }

      // Migrate old data
      const profile: NexusProfile = {
        username: oldData.username || '',
        greeting: '',
        backgroundUrl: oldData.backgroundUrl || DEFAULT_PROFILE.backgroundUrl,
        accentColor: '#3B82F6',
        theme: 'system',
      };

      // Build quick links from old settings
      const quickLinks: QuickLink[] = [...DEFAULT_QUICK_LINKS];
      if (oldData.github) {
        const existing = quickLinks.find(l => l.name === 'GitHub');
        if (existing) existing.url = oldData.github;
      }
      if (oldData.gitlab) {
        quickLinks.push({ id: String(quickLinks.length + 1), name: 'GitLab', url: oldData.gitlab, icon: 'gitlab' });
      }
      if (oldData.bamboohr) {
        quickLinks.push({ id: String(quickLinks.length + 1), name: 'BambooHR', url: oldData.bamboohr, icon: 'building' });
      }
      if (oldData.openAIChatBotURL) {
        const existing = quickLinks.find(l => l.name === 'ChatGPT');
        if (existing) existing.url = oldData.openAIChatBotURL;
      }
      if (oldData.deepSeekChatBotURL) {
        quickLinks.push({ id: String(quickLinks.length + 1), name: 'DeepSeek', url: oldData.deepSeekChatBotURL, icon: 'bot' });
      }
      if (oldData.geminiChatBotURL) {
        quickLinks.push({ id: String(quickLinks.length + 1), name: 'Gemini', url: oldData.geminiChatBotURL, icon: 'bot' });
      }
      if (oldData.grokChatBotURL) {
        quickLinks.push({ id: String(quickLinks.length + 1), name: 'Grok', url: oldData.grokChatBotURL, icon: 'bot' });
      }

      // Migrate tasks
      const migratedTasks: Task[] = Array.isArray(oldData.tasks)
        ? oldData.tasks.map((t: any) => {
            if (typeof t === 'string') {
              return {
                id: crypto.randomUUID?.() || String(Date.now() + Math.random()),
                text: t,
                link: '',
                completed: false,
                date: new Date().toISOString().split('T')[0],
                status: 'todo' as const,
              };
            }
            return {
              id: t.id || crypto.randomUUID?.() || String(Date.now() + Math.random()),
              text: t.text || '',
              link: t.link || '',
              completed: t.completed || false,
              date: t.date || new Date().toISOString().split('T')[0],
              status: t.status || 'todo',
              description: t.description,
              priority: t.priority,
            };
          })
        : [];

      setStorage({
        'nexus.migrated': true,
        'nexus.profile': profile,
        'nexus.activeLayout': DEFAULT_LAYOUT,
        'nexus.layouts': DEFAULT_LAYOUTS,
        'nexus.widget.quicklinks': { links: quickLinks },
        'nexus.widget.tasks': { items: migratedTasks, viewMode: 'board' },
        'nexus.widget.notes': { content: '' },
        'nexus.widget.pomodoro': { workMinutes: 25, breakMinutes: 5 },
        'nexus.widget.search': { engine: oldData.searchEngine || 'https://www.google.com/search?q=' },
        'nexus.widget.rss': { feeds: [], refreshInterval: 15 },
        'nexus.widget.gitlab': {
          url: oldData.gitlab || '',
          token: oldData.gitlabToken || '',
          apiVersion: oldData.gitlabAPIVersion || 'api/v4',
        },
        'nexus.widget.weather': { latitude: null, longitude: null, city: '', units: 'metric', autoDetect: true },
        'nexus.widget.bookmarks': { showSearch: true },
      }, callback);
    });
  });
}
