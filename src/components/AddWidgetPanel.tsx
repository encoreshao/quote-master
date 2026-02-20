import React from 'react';
import { WidgetId } from '../types';
import { IconClose, WIDGET_ICONS } from '../icons';

interface AddWidgetPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentWidgets: WidgetId[];
  onAddWidget: (id: WidgetId) => void;
  accentColor: string;
}

const ALL_WIDGETS: { id: WidgetId; name: string; desc: string; group: string }[] = [
  { id: 'clock', name: 'Clock & Greeting', desc: 'Time, date, personalized message', group: 'Core' },
  { id: 'search', name: 'Search Bar', desc: 'Web search and URL navigation', group: 'Core' },
  { id: 'tasks', name: 'Tasks', desc: 'Task manager with list & board views', group: 'Core' },
  { id: 'quicklinks', name: 'Quick Links', desc: 'Favorite links with favicons', group: 'Core' },
  { id: 'bookmarks', name: 'Bookmarks', desc: 'Browse Chrome bookmarks', group: 'Productivity' },
  { id: 'notes', name: 'Notes', desc: 'Quick scratchpad', group: 'Productivity' },
  { id: 'pomodoro', name: 'Pomodoro Timer', desc: 'Focus timer with work/break', group: 'Productivity' },
  { id: 'rss', name: 'RSS Feeds', desc: 'Auto-refresh article reader', group: 'Productivity' },
  { id: 'weather', name: 'Weather', desc: 'Current weather via Open-Meteo', group: 'Integrations' },
  { id: 'gitlab', name: 'GitLab Activity', desc: 'Issues, events, projects', group: 'Integrations' },
  { id: 'github', name: 'GitHub Activity', desc: 'PRs, issues, contributions', group: 'Integrations' },
  { id: 'embed', name: 'Custom Embed', desc: 'Embed any URL in an iframe', group: 'Integrations' },
  { id: 'shortcuts', name: 'Shortcuts', desc: 'Keyboard launcher', group: 'Integrations' },
];

const AddWidgetPanel: React.FC<AddWidgetPanelProps> = ({
  isOpen,
  onClose,
  currentWidgets,
  onAddWidget,
  accentColor,
}) => {
  if (!isOpen) return null;

  const available = ALL_WIDGETS.filter(w => !currentWidgets.includes(w.id));
  const groups = available.map(w => w.group).filter((g, i, arr) => arr.indexOf(g) === i);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm z-40"
        style={{ backgroundColor: 'var(--backdrop-overlay)' }}
        onClick={onClose}
      />

      {/* Panel — centered modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--panel-border)' }}>
            <div>
              <h2 className="text-base font-semibold t-primary">Add Widget</h2>
              <p className="text-[11px] t-muted mt-0.5">
                {available.length === 0 ? 'All widgets are active' : `${available.length} widget${available.length !== 1 ? 's' : ''} available`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl t-muted transition-all duration-200 cursor-pointer"
            >
              <IconClose className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto p-4">
            {available.length === 0 ? (
              <p className="text-sm t-muted text-center py-8">
                All widgets are already on this layout. Remove one in Settings to free a slot.
              </p>
            ) : (
              <div className="space-y-4">
                {groups.map(group => {
                  const items = available.filter(w => w.group === group);
                  return (
                    <div key={group}>
                      <p className="text-[10px] font-medium t-ghost uppercase tracking-wider mb-1.5">{group}</p>
                      <div className="space-y-1">
                        {items.map(({ id, name, desc }) => (
                          <button
                            key={id}
                            onClick={() => {
                              onAddWidget(id);
                              onClose();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer text-left group"
                            style={{ backgroundColor: 'var(--glass-bg-subtle)' }}
                          >
                            {/* Widget icon */}
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `${accentColor}20` }}
                            >
                              {WIDGET_ICONS[id] && (() => {
                                const WidgetIcon = WIDGET_ICONS[id]!;
                                return <WidgetIcon className="w-4 h-4" style={{ color: accentColor }} />;
                              })()}
                            </div>
                            {/* Label */}
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-medium t-secondary transition-colors">{name}</p>
                              <p className="text-[10px] t-faint truncate">{desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddWidgetPanel;
