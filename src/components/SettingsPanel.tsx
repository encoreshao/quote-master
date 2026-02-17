import React, { useState, useEffect } from 'react';
import { NexusProfile, LayoutType, NexusLayouts, WidgetId, ThemeMode } from '../types';
import { getNexusProfile, setNexusProfile, getNexusLayouts, setStorage } from '../utils/storage';
import { APP } from '../utils/common';

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' },
  { value: 'dark', label: 'Dark', icon: 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z' },
  { value: 'system', label: 'System', icon: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25' },
];

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeLayout: LayoutType;
}

const WIDGET_GROUPS: { label: string; items: { id: WidgetId; name: string; desc: string }[] }[] = [
  {
    label: 'Core',
    items: [
      { id: 'clock', name: 'Clock & Greeting', desc: 'Time, date, personalized message' },
      { id: 'search', name: 'Search Bar', desc: 'Web search and URL navigation' },
      { id: 'tasks', name: 'Tasks', desc: 'Task manager with list & board views' },
      { id: 'quicklinks', name: 'Quick Links', desc: 'Favorite links with favicons' },
    ],
  },
  {
    label: 'Productivity',
    items: [
      { id: 'bookmarks', name: 'Bookmarks', desc: 'Browse Chrome bookmarks' },
      { id: 'notes', name: 'Notes', desc: 'Quick scratchpad' },
      { id: 'pomodoro', name: 'Pomodoro Timer', desc: 'Focus timer with work/break' },
      { id: 'rss', name: 'RSS Feeds', desc: 'Auto-refresh article reader' },
    ],
  },
  {
    label: 'Integrations',
    items: [
      { id: 'weather', name: 'Weather', desc: 'Current weather via OpenWeather' },
      { id: 'gitlab', name: 'GitLab Activity', desc: 'Issues, events, projects' },
      { id: 'github', name: 'GitHub Activity', desc: 'PRs, issues, contributions' },
      { id: 'embed', name: 'Custom Embed', desc: 'Embed any URL in an iframe' },
      { id: 'shortcuts', name: 'Shortcuts', desc: 'Keyboard launcher' },
    ],
  },
];

const ACCENT_PRESETS = [
  { color: '#3B82F6', name: 'Blue' },
  { color: '#8B5CF6', name: 'Violet' },
  { color: '#EC4899', name: 'Pink' },
  { color: '#10B981', name: 'Emerald' },
  { color: '#F59E0B', name: 'Amber' },
  { color: '#EF4444', name: 'Red' },
  { color: '#06B6D4', name: 'Cyan' },
  { color: '#F97316', name: 'Orange' },
];

const LAYOUT_LABELS: Record<LayoutType, { name: string; desc: string }> = {
  focus: { name: 'Focus', desc: 'Minimal — clock, search, essentials' },
  dashboard: { name: 'Dashboard', desc: 'Full bento grid — everything visible' },
  workflow: { name: 'Workflow', desc: 'Split view — tasks + side stack' },
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, activeLayout }) => {
  const [profile, setProfile] = useState<NexusProfile>({
    username: '',
    greeting: '',
    backgroundUrl: '',
    accentColor: '#3B82F6',
    theme: 'system',
  });
  const [layouts, setLayouts] = useState<NexusLayouts | null>(null);

  useEffect(() => {
    if (isOpen) {
      getNexusProfile(setProfile);
      getNexusLayouts(setLayouts);
    }
  }, [isOpen]);

  const handleProfileChange = (field: keyof NexusProfile, value: string) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    setNexusProfile(updated);
    if (field === 'accentColor') {
      document.documentElement.style.setProperty('--accent-color', value);
    }
    if (field === 'theme') {
      const resolved = value === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : value;
      document.documentElement.setAttribute('data-theme', resolved);
    }
  };

  const handleToggleWidget = (widgetId: WidgetId) => {
    if (!layouts) return;
    const currentConfig = layouts[activeLayout];
    const current = currentConfig.widgets;
    const updated = current.includes(widgetId)
      ? current.filter(id => id !== widgetId)
      : [...current, widgetId];
    const newLayouts = { ...layouts, [activeLayout]: { ...currentConfig, widgets: updated } };
    setLayouts(newLayouts);
    setStorage({ 'nexus.layouts': newLayouts });
  };

  if (!isOpen) return null;

  const enabledCount = layouts ? layouts[activeLayout].widgets.length : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm z-40 animate-fade-in"
        style={{ backgroundColor: 'var(--backdrop-overlay)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-[400px] z-50 animate-slide-in">
        <div className="h-full backdrop-blur-2xl shadow-2xl flex flex-col" style={{ backgroundColor: 'var(--panel-bg)', borderLeft: '1px solid var(--panel-border)' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--panel-border)' }}>
            <div>
              <h2 className="text-base font-semibold t-primary">Settings</h2>
              <p className="text-[11px] t-muted mt-0.5">Personalize your {APP.shortName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl t-muted transition-all duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            {/* ─── Profile Section ─── */}
            <div className="px-5 pt-5 pb-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider t-faint mb-3">Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs t-tertiary mb-1">Name</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={e => handleProfileChange('username', e.target.value)}
                    placeholder="Your name"
                    className="glass-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs t-tertiary mb-1">Custom Greeting</label>
                  <input
                    type="text"
                    value={profile.greeting}
                    onChange={e => handleProfileChange('greeting', e.target.value)}
                    placeholder="e.g. Ready to build something great?"
                    className="glass-input text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mx-5" style={{ borderTop: '1px solid var(--divider)' }} />

            {/* ─── Appearance Section ─── */}
            <div className="px-5 pt-4 pb-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider t-faint mb-3">Appearance</h3>
              <div className="space-y-4">
                {/* Theme */}
                <div>
                  <label className="block text-xs t-tertiary mb-2">Theme</label>
                  <div className="flex gap-1.5 p-1 rounded-xl" style={{ backgroundColor: 'var(--glass-bg)' }}>
                    {THEME_OPTIONS.map(({ value, label, icon }) => {
                      const active = (profile.theme || 'system') === value;
                      return (
                        <button
                          key={value}
                          onClick={() => handleProfileChange('theme', value)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                            active ? 't-primary' : 't-muted'
                          }`}
                          style={active ? { backgroundColor: 'var(--glass-bg-hover)', boxShadow: '0 1px 3px var(--shadow-color)' } : {}}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                          </svg>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Background */}
                <div>
                  <label className="block text-xs t-tertiary mb-1">Background Image URL</label>
                  <input
                    type="text"
                    value={profile.backgroundUrl}
                    onChange={e => handleProfileChange('backgroundUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="glass-input text-sm"
                  />
                  {profile.backgroundUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden h-16 relative">
                      <img
                        src={profile.backgroundUrl}
                        alt="Preview"
                        className="w-full h-full object-cover opacity-60"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <button
                        onClick={() => handleProfileChange('backgroundUrl', '')}
                        className="absolute top-1 right-1 p-1 rounded-lg btn-overlay-icon cursor-pointer"
                        title="Remove background"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Accent Color */}
                <div>
                  <label className="block text-xs t-tertiary mb-2">Accent Color</label>
                  <div className="grid grid-cols-8 gap-2 mb-2">
                    {ACCENT_PRESETS.map(({ color, name }) => (
                      <button
                        key={color}
                        onClick={() => handleProfileChange('accentColor', color)}
                        className="group relative w-full aspect-square rounded-xl border-2 transition-all duration-200 cursor-pointer hover:scale-110"
                        style={{
                          backgroundColor: color,
                          borderColor: profile.accentColor === color ? 'white' : 'transparent',
                          boxShadow: profile.accentColor === color ? `0 0 12px ${color}40` : 'none',
                        }}
                        title={name}
                      >
                        {profile.accentColor === color && (
                          <svg className="w-3 h-3 t-primary absolute inset-0 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={profile.accentColor}
                      onChange={e => handleProfileChange('accentColor', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                    />
                    <input
                      type="text"
                      value={profile.accentColor}
                      onChange={e => handleProfileChange('accentColor', e.target.value)}
                      className="glass-input text-xs flex-1 font-mono"
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-5" style={{ borderTop: '1px solid var(--divider)' }} />

            {/* ─── Widgets Section ─── */}
            <div className="px-5 pt-4 pb-6">
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider t-faint">
                  Widgets
                </h3>
                <span className="text-[10px] t-faint">
                  {enabledCount} enabled for <span className="capitalize t-muted">{LAYOUT_LABELS[activeLayout].name}</span>
                </span>
              </div>
              <p className="text-[11px] t-faint mb-3">{LAYOUT_LABELS[activeLayout].desc}</p>

              <div className="space-y-4">
                {WIDGET_GROUPS.map(group => (
                  <div key={group.label}>
                    <p className="text-[10px] font-medium t-ghost uppercase tracking-wider mb-1.5">{group.label}</p>
                    <div className="space-y-1">
                      {group.items.map(({ id, name, desc }) => {
                        const enabled = layouts ? layouts[activeLayout].widgets.includes(id) : false;
                        return (
                          <button
                            key={id}
                            onClick={() => handleToggleWidget(id)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left"
                            style={{ backgroundColor: enabled ? 'var(--glass-bg)' : 'transparent' }}
                          >
                            {/* Toggle */}
                            <div className={`w-9 h-5 rounded-full transition-all duration-200 flex items-center shrink-0 ${
                              enabled ? 'justify-end' : 'justify-start'
                            }`} style={{ backgroundColor: enabled ? `${profile.accentColor}40` : 'var(--glass-bg)' }}>
                              <div className="w-3.5 h-3.5 rounded-full mx-[3px] transition-all duration-200"
                                style={{
                                  backgroundColor: enabled ? 'var(--text-primary)' : 'var(--text-ghost)',
                                  boxShadow: enabled ? `0 0 6px ${profile.accentColor}60` : 'none',
                                }} />
                            </div>
                            {/* Label */}
                            <div className="min-w-0 flex-1">
                              <p className={`text-[13px] font-medium transition-colors ${enabled ? 't-secondary' : 't-muted'}`}>{name}</p>
                              <p className="text-[10px] t-ghost truncate">{desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 shrink-0" style={{ borderTop: '1px solid var(--divider)' }}>
            <p className="text-[10px] t-ghost text-center">
              {APP.shortName} v{APP.version} &middot; {APP.authorName}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
