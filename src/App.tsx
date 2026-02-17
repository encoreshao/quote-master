import { useEffect, useState, useCallback, useMemo } from 'react';
import { LayoutType, NexusLayouts, NexusProfile, WidgetId, WidgetSettings } from './types';
import {
  migrateFromQuoteMaster,
  getNexusProfile,
  getActiveLayout,
  setActiveLayout,
  getNexusLayouts,
  setStorage,
  DEFAULT_PROFILE,
  DEFAULT_LAYOUT,
  DEFAULT_LAYOUTS,
} from './utils/storage';
import { useKeyboardShortcuts, ShortcutAction, SHORTCUT_MAP } from './hooks/useKeyboardShortcuts';

import FocusLayout from './components/layouts/FocusLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import WorkflowLayout from './components/layouts/WorkflowLayout';
import LayoutSwitcher from './components/LayoutSwitcher';
import SettingsPanel from './components/SettingsPanel';
import AddWidgetPanel from './components/AddWidgetPanel';
import ShortcutsHelp from './components/ShortcutsHelp';

// Widgets
import ClockWidget from './components/widgets/ClockWidget';
import SearchWidget from './components/widgets/SearchWidget';
import QuickLinksWidget from './components/widgets/QuickLinksWidget';
import TasksWidget from './components/widgets/TasksWidget';
import NotesWidget from './components/widgets/NotesWidget';
import BookmarksWidget from './components/widgets/BookmarksWidget';
import PomodoroWidget from './components/widgets/PomodoroWidget';
import WeatherWidget from './components/widgets/WeatherWidget';
import RSSWidget from './components/widgets/RSSWidget';
import PlaceholderWidget from './components/widgets/PlaceholderWidget';

function App() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<NexusProfile>(DEFAULT_PROFILE);
  const [activeLayoutId, setActiveLayoutId] = useState<LayoutType>(DEFAULT_LAYOUT);
  const [layouts, setLayouts] = useState<NexusLayouts>(DEFAULT_LAYOUTS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addWidgetOpen, setAddWidgetOpen] = useState(false);
  const [shortcutsHelpOpen, setShortcutsHelpOpen] = useState(false);

  // Initialize: migrate then load
  useEffect(() => {
    migrateFromQuoteMaster(() => {
      getNexusProfile(setProfile);
      getActiveLayout(setActiveLayoutId);
      getNexusLayouts(setLayouts);
      setReady(true);
    });
  }, []);

  // Apply accent color
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', profile.accentColor);
  }, [profile.accentColor]);

  // Apply theme (dark / light / system auto-detect)
  useEffect(() => {
    const applyTheme = (resolved: 'dark' | 'light') => {
      document.documentElement.setAttribute('data-theme', resolved);
    };

    if (profile.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mq.matches ? 'dark' : 'light');
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      applyTheme(profile.theme || 'dark');
    }
  }, [profile.theme]);

  // Reload profile/layouts when settings close
  useEffect(() => {
    if (!settingsOpen && ready) {
      getNexusProfile(setProfile);
      getNexusLayouts(setLayouts);
    }
  }, [settingsOpen, ready]);

  const handleLayoutChange = useCallback((layout: LayoutType) => {
    setActiveLayoutId(layout);
    setActiveLayout(layout);
  }, []);

  // Persist widget reorder
  const handleReorder = useCallback((newWidgets: WidgetId[]) => {
    setLayouts(prev => {
      const currentConfig = prev[activeLayoutId];
      const updated = { ...prev, [activeLayoutId]: { ...currentConfig, widgets: newWidgets } };
      setStorage({ 'nexus.layouts': updated });
      return updated;
    });
  }, [activeLayoutId]);

  // Add a widget to the current layout
  const handleAddWidget = useCallback((widgetId: WidgetId) => {
    setLayouts(prev => {
      const currentConfig = prev[activeLayoutId];
      if (currentConfig.widgets.includes(widgetId)) return prev;
      const updated = { ...prev, [activeLayoutId]: { ...currentConfig, widgets: [...currentConfig.widgets, widgetId] } };
      setStorage({ 'nexus.layouts': updated });
      return updated;
    });
  }, [activeLayoutId]);

  // Remove a widget from the current layout
  const handleRemoveWidget = useCallback((widgetId: WidgetId) => {
    setLayouts(prev => {
      const currentConfig = prev[activeLayoutId];
      const newWidgets = currentConfig.widgets.filter(id => id !== widgetId);
      const newSettings = { ...currentConfig.widgetSettings };
      delete newSettings[widgetId];
      const updated = { ...prev, [activeLayoutId]: { ...currentConfig, widgets: newWidgets, widgetSettings: newSettings } };
      setStorage({ 'nexus.layouts': updated });
      return updated;
    });
  }, [activeLayoutId]);

  // Update widget size/style settings for the current layout
  const handleWidgetSettingsChange = useCallback((widgetId: WidgetId, settings: WidgetSettings) => {
    setLayouts(prev => {
      const currentConfig = prev[activeLayoutId];
      const newSettings = { ...currentConfig.widgetSettings, [widgetId]: settings };
      const updated = { ...prev, [activeLayoutId]: { ...currentConfig, widgetSettings: newSettings } };
      setStorage({ 'nexus.layouts': updated });
      return updated;
    });
  }, [activeLayoutId]);

  // ── Keyboard shortcuts ──
  const shortcuts: ShortcutAction[] = useMemo(() => [
    {
      key: SHORTCUT_MAP.ESCAPE,
      label: 'Esc',
      description: 'Close panel / blur input',
      global: true,
      action: () => {
        if (shortcutsHelpOpen) { setShortcutsHelpOpen(false); return; }
        if (settingsOpen) { setSettingsOpen(false); return; }
        if (addWidgetOpen) { setAddWidgetOpen(false); return; }
        // Blur any focused input
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      },
    },
    {
      key: SHORTCUT_MAP.SETTINGS,
      label: ',',
      description: 'Open Settings',
      action: () => { setAddWidgetOpen(false); setShortcutsHelpOpen(false); setSettingsOpen(prev => !prev); },
    },
    {
      key: SHORTCUT_MAP.ADD_WIDGET,
      label: 'A',
      description: 'Add Widget',
      action: () => { setSettingsOpen(false); setShortcutsHelpOpen(false); setAddWidgetOpen(prev => !prev); },
    },
    {
      key: SHORTCUT_MAP.SEARCH,
      label: '/',
      description: 'Focus search bar',
      action: () => {
        setSettingsOpen(false); setAddWidgetOpen(false); setShortcutsHelpOpen(false);
        const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
        searchInput?.focus();
      },
    },
    {
      key: SHORTCUT_MAP.HELP,
      label: '?',
      description: 'Keyboard shortcuts',
      action: () => { setSettingsOpen(false); setAddWidgetOpen(false); setShortcutsHelpOpen(prev => !prev); },
    },
    {
      key: SHORTCUT_MAP.LAYOUT_FOCUS,
      label: '1',
      description: 'Focus layout',
      action: () => handleLayoutChange('focus'),
    },
    {
      key: SHORTCUT_MAP.LAYOUT_DASHBOARD,
      label: '2',
      description: 'Dashboard layout',
      action: () => handleLayoutChange('dashboard'),
    },
    {
      key: SHORTCUT_MAP.LAYOUT_WORKFLOW,
      label: '3',
      description: 'Workflow layout',
      action: () => handleLayoutChange('workflow'),
    },
  ], [settingsOpen, addWidgetOpen, shortcutsHelpOpen, handleLayoutChange]);

  useKeyboardShortcuts(shortcuts);

  // Widget renderer
  const renderWidget = useCallback((id: WidgetId): React.ReactNode => {
    switch (id) {
      case 'clock':
        return <ClockWidget key={id} username={profile.username} greeting={profile.greeting} />;
      case 'search':
        return <SearchWidget key={id} />;
      case 'quicklinks':
        return <QuickLinksWidget key={id} />;
      case 'tasks':
        return <TasksWidget key={id} />;
      case 'notes':
        return <NotesWidget key={id} />;
      case 'bookmarks':
        return <BookmarksWidget key={id} />;
      case 'pomodoro':
        return <PomodoroWidget key={id} />;
      case 'weather':
        return <WeatherWidget key={id} />;
      case 'rss':
        return <RSSWidget key={id} />;
      case 'gitlab':
        return <PlaceholderWidget key={id} name="GitLab Activity" icon="gitlab" />;
      case 'github':
        return <PlaceholderWidget key={id} name="GitHub Activity" icon="github" />;
      case 'embed':
        return <PlaceholderWidget key={id} name="Custom Embed" icon="embed" />;
      case 'shortcuts':
        return <PlaceholderWidget key={id} name="Keyboard Shortcuts" icon="shortcuts" />;
      default:
        return null;
    }
  }, [profile.username, profile.greeting]);

  const currentLayout = layouts[activeLayoutId] || { widgets: [], widgetSettings: {} };
  const currentWidgets = currentLayout.widgets;
  const currentWidgetSettings = currentLayout.widgetSettings || {};

  // Layout renderer
  const renderLayout = () => {
    const props = {
      widgets: currentWidgets,
      renderWidget,
      onReorder: handleReorder,
      onRemove: handleRemoveWidget,
      onWidgetSettingsChange: handleWidgetSettingsChange,
      widgetSettings: currentWidgetSettings,
    };
    switch (activeLayoutId) {
      case 'focus':
        return <FocusLayout {...props} />;
      case 'workflow':
        return <WorkflowLayout {...props} />;
      case 'dashboard':
      default:
        return <DashboardLayout {...props} />;
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--loading-bg)' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--text-ghost)', borderTopColor: 'var(--text-secondary)' }} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: profile.backgroundUrl
          ? `linear-gradient(var(--bg-overlay-from), var(--bg-overlay-to)), url("${profile.backgroundUrl}") center/cover fixed no-repeat`
          : 'var(--bg-gradient)',
      }}
    >
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-xl backdrop-blur-xl transition-all duration-200 cursor-pointer"
            style={{ backgroundColor: 'var(--glass-bg-subtle)', border: '1px solid var(--glass-border-subtle)' }}
            title="Settings (,)"
          >
            <svg className="w-4 h-4 t-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            onClick={() => setAddWidgetOpen(true)}
            className="p-2 rounded-xl backdrop-blur-xl transition-all duration-200 cursor-pointer"
            style={{ backgroundColor: 'var(--glass-bg-subtle)', border: '1px solid var(--glass-border-subtle)' }}
            title="Add Widget (A)"
          >
            <svg className="w-4 h-4 t-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <button
            onClick={() => setShortcutsHelpOpen(true)}
            className="p-2 rounded-xl backdrop-blur-xl transition-all duration-200 cursor-pointer"
            style={{ backgroundColor: 'var(--glass-bg-subtle)', border: '1px solid var(--glass-border-subtle)' }}
            title="Keyboard Shortcuts (?)"
          >
            <svg className="w-4 h-4 t-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </button>
        </div>

        {/* Layout switcher (right) */}
        <LayoutSwitcher activeLayout={activeLayoutId} onLayoutChange={handleLayoutChange} />
      </div>

      {/* Main content */}
      <main className="pt-14 pb-8">
        {renderLayout()}
      </main>

      {/* Settings panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        activeLayout={activeLayoutId}
      />

      {/* Add Widget panel */}
      <AddWidgetPanel
        isOpen={addWidgetOpen}
        onClose={() => setAddWidgetOpen(false)}
        currentWidgets={currentWidgets}
        onAddWidget={handleAddWidget}
        accentColor={profile.accentColor}
      />

      {/* Shortcuts help */}
      <ShortcutsHelp
        isOpen={shortcutsHelpOpen}
        onClose={() => setShortcutsHelpOpen(false)}
      />
    </div>
  );
}

export default App;
