// ============================================================
// Widget Actions — Execute actions from AI or commands
// ============================================================

import { WidgetAction } from '../types/ai';
import { getWidgetConfig, setWidgetConfig } from './storage';
import { setActiveLayout } from './storage';
import type { Task, TaskStatus } from '../types';
import type { QuickLink } from '../types';
import type { RSSFeed } from '../types';
import type { LayoutType } from '../types';

export type WidgetActionResult = { ok: boolean; message?: string };

const WIDGET_REFRESH_EVENT = 'nexus-widget-refresh';

function dispatchWidgetRefresh(widgetId: string): void {
  window.dispatchEvent(new CustomEvent(WIDGET_REFRESH_EVENT, { detail: { widget: widgetId } }));
}

export async function executeWidgetAction(action: WidgetAction): Promise<WidgetActionResult> {
  try {
    switch (action.type) {
      case 'add_task': {
        const text = (action.payload?.text as string)?.trim();
        if (!text) return { ok: false, message: 'Task text required' };
        await new Promise<void>((resolve, reject) => {
          getWidgetConfig('tasks', { items: [], viewMode: 'board' }, (cfg) => {
            try {
              const task: Task = {
                id: crypto.randomUUID?.() || String(Date.now()),
                text,
                link: (action.payload?.link as string) || '',
                completed: false,
                date: new Date().toISOString().split('T')[0],
                status: (action.payload?.status as TaskStatus) || 'todo',
              };
              setWidgetConfig('tasks', { ...cfg, items: [...(cfg.items || []), task] }, () => {
                dispatchWidgetRefresh('tasks');
                resolve();
              });
            } catch (e) {
              reject(e);
            }
          });
        });
        return { ok: true, message: `Added task: ${text}` };
      }
      case 'add_link': {
        const name = (action.payload?.name as string)?.trim();
        const url = (action.payload?.url as string)?.trim();
        if (!name || !url) return { ok: false, message: 'Name and URL required' };
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        await new Promise<void>((resolve, reject) => {
          getWidgetConfig('quicklinks', { links: [] }, (cfg) => {
            try {
              const link: QuickLink = { id: String(Date.now()), name, url: fullUrl, icon: 'link' };
              setWidgetConfig('quicklinks', { links: [...(cfg.links || []), link] }, () => {
                dispatchWidgetRefresh('quicklinks');
                resolve();
              });
            } catch (e) {
              reject(e);
            }
          });
        });
        return { ok: true, message: `Added link: ${name}` };
      }
      case 'add_note': {
        const content = (action.payload?.content as string)?.trim();
        if (!content) return { ok: false, message: 'Note content required' };
        await new Promise<void>((resolve, reject) => {
          getWidgetConfig('notes', { content: '' }, (cfg) => {
            try {
              const prev = (cfg.content || '').trim();
              const newContent = prev ? `${prev}\n\n${content}` : content;
              setWidgetConfig('notes', { content: newContent }, () => {
                dispatchWidgetRefresh('notes');
                resolve();
              });
            } catch (e) {
              reject(e);
            }
          });
        });
        return { ok: true, message: 'Note added' };
      }
      case 'add_rss_feed': {
        const feedUrl = (action.payload?.url as string)?.trim();
        const name = ((action.payload?.name as string)?.trim()) || '';
        if (!feedUrl) return { ok: false, message: 'Feed URL required' };
        await new Promise<void>((resolve, reject) => {
          getWidgetConfig('rss', { feeds: [], refreshInterval: 15 }, (cfg) => {
            try {
              const feed: RSSFeed = {
                id: String(Date.now()),
                name: name || new URL(feedUrl).hostname,
                url: feedUrl.startsWith('http') ? feedUrl : `https://${feedUrl}`,
              };
              setWidgetConfig('rss', { ...cfg, feeds: [...(cfg.feeds || []), feed] }, () => {
                dispatchWidgetRefresh('rss');
                resolve();
              });
            } catch (e) {
              reject(e);
            }
          });
        });
        return { ok: true, message: 'RSS feed added' };
      }
      case 'layout_change': {
        const layout = (action.payload?.layout as LayoutType);
        if (layout && ['focus', 'dashboard', 'workflow'].includes(layout)) {
          await new Promise<void>((resolve) => {
            setActiveLayout(layout, () => resolve());
          });
          dispatchWidgetRefresh('layout');
          return { ok: true, message: `Switched to ${layout} layout` };
        }
        return { ok: false, message: 'Invalid layout' };
      }
      case 'delete_task': {
        const id = (action.payload?.id as string)?.trim();
        if (!id) return { ok: false, message: 'Task ID required' };
        await new Promise<void>((resolve, reject) => {
          getWidgetConfig('tasks', { items: [], viewMode: 'board' }, (cfg) => {
            try {
              const items = (cfg.items || []).filter((t: Task) => t.id !== id);
              setWidgetConfig('tasks', { ...cfg, items }, () => {
                dispatchWidgetRefresh('tasks');
                resolve();
              });
            } catch (e) {
              reject(e);
            }
          });
        });
        return { ok: true, message: 'Task removed' };
      }
      case 'delete_link':
      case 'remove_link': {
        const id = (action.payload?.id as string)?.trim();
        const name = (action.payload?.name as string)?.trim();
        const url = (action.payload?.url as string)?.trim();
        if (!id && !name && !url) return { ok: false, message: 'Link ID, name, or URL required' };
        await new Promise<void>((resolve, reject) => {
          getWidgetConfig('quicklinks', { links: [] }, (cfg) => {
            try {
              const links = (cfg.links || []).filter((l: QuickLink) => {
                if (id && l.id === id) return false;
                if (name && l.name?.toLowerCase() === name?.toLowerCase()) return false;
                if (url && l.url === url) return false;
                return true;
              });
              if (links.length === (cfg.links || []).length) {
                reject(new Error('Link not found'));
                return;
              }
              setWidgetConfig('quicklinks', { links }, () => {
                dispatchWidgetRefresh('quicklinks');
                resolve();
              });
            } catch (e) {
              reject(e);
            }
          });
        });
        return { ok: true, message: 'Link removed' };
      }
      case 'remove_rss_feed': {
        const id = (action.payload?.id as string)?.trim();
        const url = (action.payload?.url as string)?.trim();
        if (!id && !url) return { ok: false, message: 'Feed ID or URL required' };
        await new Promise<void>((resolve, reject) => {
          getWidgetConfig('rss', { feeds: [], refreshInterval: 15 }, (cfg) => {
            try {
              const feeds = (cfg.feeds || []).filter(
                (f: RSSFeed) => f.id !== id && f.url !== url
              );
              setWidgetConfig('rss', { ...cfg, feeds }, () => {
                dispatchWidgetRefresh('rss');
                resolve();
              });
            } catch (e) {
              reject(e);
            }
          });
        });
        return { ok: true, message: 'RSS feed removed' };
      }
      case 'clear_notes': {
        await new Promise<void>((resolve) => {
          setWidgetConfig('notes', { content: '' }, () => {
            dispatchWidgetRefresh('notes');
            resolve();
          });
        });
        return { ok: true, message: 'Notes cleared' };
      }
      default:
        return { ok: false, message: `Unknown action: ${action.type}` };
    }
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : 'Action failed' };
  }
}

const DESTRUCTIVE_ACTIONS: WidgetAction['type'][] = [
  'delete_task', 'delete_link', 'remove_link', 'remove_rss_feed', 'clear_notes',
];

export function isDestructiveAction(action: WidgetAction): boolean {
  return DESTRUCTIVE_ACTIONS.includes(action.type);
}

export function getActionDescription(action: WidgetAction): string {
  switch (action.type) {
    case 'delete_task':
      return `delete task "${(action.payload?.text as string) || 'this'}"`;
    case 'delete_link':
    case 'remove_link':
      return `remove link "${(action.payload?.name as string) || (action.payload?.url as string) || 'this'}"`;
    case 'remove_rss_feed':
      return `remove RSS feed "${(action.payload?.name as string) || (action.payload?.url as string) || 'this'}"`;
    case 'clear_notes':
      return 'clear all notes';
    default:
      return 'perform this action';
  }
}

/** Extract JSON action from AI response if present. AI uses "action" key, we map to "type". */
export function parseActionFromResponse(text: string): WidgetAction | null {
  if (!text || text.indexOf('"action"') === -1) return null;
  // Strip markdown code blocks if present
  const clean = text.replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1').trim();
  const idx = clean.indexOf('"action"');
  if (idx === -1) return null;
  const start = clean.lastIndexOf('{', idx);
  if (start === -1) return null;
  let depth = 0;
  let end = -1;
  for (let i = start; i < clean.length; i++) {
    const c = clean[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) return null;
  try {
    const parsed = JSON.parse(clean.slice(start, end + 1)) as { action?: string; payload?: Record<string, unknown> };
    if (parsed.action) return { type: parsed.action as WidgetAction['type'], payload: parsed.payload };
  } catch {}
  return null;
}
