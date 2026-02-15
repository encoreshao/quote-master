// ============================================================
// Nexus Tab — Type Definitions
// ============================================================

export type ThemeMode = 'light' | 'dark' | 'system';

export type LayoutType = 'focus' | 'dashboard' | 'workflow';

export type WidgetId =
  | 'clock'
  | 'search'
  | 'tasks'
  | 'quicklinks'
  | 'bookmarks'
  | 'notes'
  | 'pomodoro'
  | 'weather'
  | 'gitlab'
  | 'github'
  | 'rss'
  | 'embed'
  | 'shortcuts';

export type WidgetSize = 'small' | 'medium' | 'large' | 'wide';

export interface WidgetMeta {
  id: WidgetId;
  name: string;
  icon: string;
  defaultSize: WidgetSize;
  description: string;
}

export interface NexusProfile {
  username: string;
  greeting: string;
  backgroundUrl: string;
  accentColor: string;
  theme: ThemeMode;
}

export interface LayoutConfig {
  widgets: WidgetId[];
}

export interface NexusLayouts {
  focus: LayoutConfig;
  dashboard: LayoutConfig;
  workflow: LayoutConfig;
}

// Task types (migrated from existing)
export type TaskStatus = 'todo' | 'in-progress' | 'postponed' | 'done' | 'closed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskViewMode = 'board' | 'list' | 'timeline';

export interface Task {
  id: string;
  text: string;
  link: string;
  completed: boolean;
  date: string;
  status: TaskStatus;
  description?: string;
  priority?: TaskPriority;
}

// Quick Link
export interface QuickLink {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

// RSS Feed
export interface RSSFeed {
  id: string;
  name: string;
  url: string;
}

export interface RSSArticle {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

// Widget-specific configs
export interface TasksWidgetConfig {
  items: Task[];
  viewMode: TaskViewMode;
}

export interface QuickLinksWidgetConfig {
  links: QuickLink[];
}

export interface NotesWidgetConfig {
  content: string;
}

export interface PomodoroWidgetConfig {
  workMinutes: number;
  breakMinutes: number;
}

export interface WeatherWidgetConfig {
  latitude: number | null;
  longitude: number | null;
  city: string;
  units: 'metric' | 'imperial';
  autoDetect: boolean;
}

export interface GitLabWidgetConfig {
  url: string;
  token: string;
  apiVersion: string;
}

export interface GitHubWidgetConfig {
  token: string;
  username: string;
}

export interface RSSWidgetConfig {
  feeds: RSSFeed[];
  refreshInterval: number;
}

export interface SearchWidgetConfig {
  engine: string;
}

export interface EmbedWidgetConfig {
  url: string;
  title: string;
}

export interface ShortcutsWidgetConfig {
  items: { key: string; label: string; action: string }[];
}

export interface BookmarksWidgetConfig {
  showSearch: boolean;
}

// Full storage shape
export interface NexusStorage {
  'nexus.profile': NexusProfile;
  'nexus.activeLayout': LayoutType;
  'nexus.layouts': NexusLayouts;
  'nexus.widget.tasks': TasksWidgetConfig;
  'nexus.widget.quicklinks': QuickLinksWidgetConfig;
  'nexus.widget.notes': NotesWidgetConfig;
  'nexus.widget.pomodoro': PomodoroWidgetConfig;
  'nexus.widget.weather': WeatherWidgetConfig;
  'nexus.widget.gitlab': GitLabWidgetConfig;
  'nexus.widget.github': GitHubWidgetConfig;
  'nexus.widget.rss': RSSWidgetConfig;
  'nexus.widget.search': SearchWidgetConfig;
  'nexus.widget.embed': EmbedWidgetConfig;
  'nexus.widget.shortcuts': ShortcutsWidgetConfig;
  'nexus.widget.bookmarks': BookmarksWidgetConfig;
  'nexus.migrated': boolean;
}
