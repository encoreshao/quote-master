import { useEffect, useState, useCallback } from 'react';
import { LayoutType, NexusLayouts, NexusProfile, WidgetId } from './types';
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

import FocusLayout from './components/layouts/FocusLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import WorkflowLayout from './components/layouts/WorkflowLayout';
import LayoutSwitcher from './components/LayoutSwitcher';
import SettingsPanel from './components/SettingsPanel';
import AddWidgetPanel from './components/AddWidgetPanel';

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
      const updated = { ...prev, [activeLayoutId]: { widgets: newWidgets } };
      setStorage({ 'nexus.layouts': updated });
      return updated;
    });
  }, [activeLayoutId]);

  // Add a widget to the current layout
  const handleAddWidget = useCallback((widgetId: WidgetId) => {
    setLayouts(prev => {
      const current = prev[activeLayoutId].widgets;
      if (current.includes(widgetId)) return prev;
      const updated = { ...prev, [activeLayoutId]: { widgets: [...current, widgetId] } };
      setStorage({ 'nexus.layouts': updated });
      return updated;
    });
  }, [activeLayoutId]);

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

  const currentWidgets = layouts[activeLayoutId]?.widgets || [];

  // Layout renderer
  const renderLayout = () => {
    const props = { widgets: currentWidgets, renderWidget, onReorder: handleReorder };
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: profile.backgroundUrl
          ? `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url("${profile.backgroundUrl}") center/cover fixed no-repeat`
          : 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      }}
    >
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/10 hover:bg-white/[0.12] hover:border-white/20 transition-all duration-200 cursor-pointer"
            title="Settings"
          >
            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            onClick={() => setAddWidgetOpen(true)}
            className="p-2 rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/10 hover:bg-white/[0.12] hover:border-white/20 transition-all duration-200 cursor-pointer"
            title="Add Widget"
          >
            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
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
    </div>
  );
}

export default App;
