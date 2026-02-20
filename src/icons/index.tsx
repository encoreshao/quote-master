// Icons — all UI icons from src/icons/*.svg
import type React from 'react';
import type { WidgetId } from '../types';
import type { LayoutType } from '../types';

import IconClock from './icon-clock.svg';
import IconSearch from './icon-search.svg';
import IconTasks from './icon-tasks.svg';
import IconLink from './icon-link.svg';
import IconBookmark from './icon-bookmark.svg';
import IconNotes from './icon-notes.svg';
import IconPomodoro from './icon-pomodoro.svg';
import IconRss from './icon-rss.svg';
import IconWeather from './icon-weather.svg';
import IconGitlab from './icon-gitlab.svg';
import IconGithub from './icon-github.svg';
import IconEmbed from './icon-embed.svg';
import IconShortcuts from './icon-shortcuts.svg';
import IconAi from './icon-ai.svg';
import IconSettings from './icon-settings.svg';
import IconGrid from './icon-grid.svg';
import IconThemeLight from './icon-theme-light.svg';
import IconThemeDark from './icon-theme-dark.svg';
import IconThemeSystem from './icon-theme-system.svg';
import IconLayoutFocus from './icon-layout-focus.svg';
import IconLayoutDashboard from './icon-layout-dashboard.svg';
import IconLayoutWorkflow from './icon-layout-workflow.svg';

export { default as IconClock } from './icon-clock.svg';
export { default as IconSearch } from './icon-search.svg';
export { default as IconTasks } from './icon-tasks.svg';
export { default as IconLink } from './icon-link.svg';
export { default as IconBookmark } from './icon-bookmark.svg';
export { default as IconNotes } from './icon-notes.svg';
export { default as IconPomodoro } from './icon-pomodoro.svg';
export { default as IconRss } from './icon-rss.svg';
export { default as IconWeather } from './icon-weather.svg';
export { default as IconGitlab } from './icon-gitlab.svg';
export { default as IconGithub } from './icon-github.svg';
export { default as IconEmbed } from './icon-embed.svg';
export { default as IconShortcuts } from './icon-shortcuts.svg';
export { default as IconAi } from './icon-ai.svg';
export { default as IconClose } from './icon-close.svg';
export { default as IconPlus } from './icon-plus.svg';
export { default as IconSettings } from './icon-settings.svg';
export { default as IconGrid } from './icon-grid.svg';
export { default as IconThemeLight } from './icon-theme-light.svg';
export { default as IconThemeDark } from './icon-theme-dark.svg';
export { default as IconThemeSystem } from './icon-theme-system.svg';
export { default as IconCheck } from './icon-check.svg';
export { default as IconLayoutFocus } from './icon-layout-focus.svg';
export { default as IconLayoutDashboard } from './icon-layout-dashboard.svg';
export { default as IconLayoutWorkflow } from './icon-layout-workflow.svg';

type SvgComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;
export const WIDGET_ICONS: Partial<Record<WidgetId, SvgComponent>> = {
  clock: IconClock,
  search: IconSearch,
  tasks: IconTasks,
  quicklinks: IconLink,
  bookmarks: IconBookmark,
  notes: IconNotes,
  pomodoro: IconPomodoro,
  rss: IconRss,
  weather: IconWeather,
  gitlab: IconGitlab,
  github: IconGithub,
  embed: IconEmbed,
  shortcuts: IconShortcuts,
};

export const TAB_ICONS = {
  general: IconSettings,
  widgets: IconGrid,
  ai: IconAi,
};

export const THEME_ICONS = {
  light: IconThemeLight,
  dark: IconThemeDark,
  system: IconThemeSystem,
};

export const LAYOUT_ICONS: Record<LayoutType, SvgComponent> = {
  focus: IconLayoutFocus,
  dashboard: IconLayoutDashboard,
  workflow: IconLayoutWorkflow,
};
