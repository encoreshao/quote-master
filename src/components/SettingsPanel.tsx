import React, { useState, useEffect } from 'react';
import { NexusProfile, LayoutType, NexusLayouts, WidgetId, ThemeMode } from '../types';
import { getNexusProfile, setNexusProfile, getNexusLayouts, setStorage } from '../utils/storage';
import { APP } from '../utils/common';
import AIAssistantTab from './settings/AIAssistantTab';
import { WIDGET_ICONS, TAB_ICONS, THEME_ICONS, IconClose, IconCheck } from '../icons';

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeLayout: LayoutType;
}

const WIDGET_GROUPS: { label: string; items: { id: WidgetId; name: string; desc: string }[] }[] = [
  { label: 'Core', items: [
    { id: 'clock', name: 'Clock & Greeting', desc: 'Time, date, personalized message' },
    { id: 'search', name: 'Search Bar', desc: 'Web search and URL navigation' },
    { id: 'tasks', name: 'Tasks', desc: 'Task manager with list & board views' },
    { id: 'quicklinks', name: 'Quick Links', desc: 'Favorite links with favicons' },
  ]},
  { label: 'Productivity', items: [
    { id: 'bookmarks', name: 'Bookmarks', desc: 'Browse Chrome bookmarks' },
    { id: 'notes', name: 'Notes', desc: 'Quick scratchpad' },
    { id: 'pomodoro', name: 'Pomodoro Timer', desc: 'Focus timer with work/break' },
    { id: 'rss', name: 'RSS Feeds', desc: 'Auto-refresh article reader' },
  ]},
  { label: 'Integrations', items: [
    { id: 'weather', name: 'Weather', desc: 'Current weather via OpenWeather' },
    { id: 'gitlab', name: 'GitLab Activity', desc: 'Issues, events, projects' },
    { id: 'github', name: 'GitHub Activity', desc: 'PRs, issues, contributions' },
    { id: 'embed', name: 'Custom Embed', desc: 'Embed any URL in an iframe' },
    { id: 'shortcuts', name: 'Shortcuts', desc: 'Keyboard launcher' },
  ]},
];

const ACCENT_PRESETS = [
  { color: '#3B82F6', name: 'Blue' }, { color: '#8B5CF6', name: 'Violet' }, { color: '#EC4899', name: 'Pink' },
  { color: '#10B981', name: 'Emerald' }, { color: '#F59E0B', name: 'Amber' }, { color: '#EF4444', name: 'Red' },
  { color: '#06B6D4', name: 'Cyan' }, { color: '#F97316', name: 'Orange' },
];

const LAYOUT_LABELS: Record<LayoutType, { name: string; desc: string }> = {
  focus: { name: 'Focus', desc: 'Minimal — clock, search, essentials' },
  dashboard: { name: 'Dashboard', desc: 'Full bento grid — everything visible' },
  workflow: { name: 'Workflow', desc: 'Split view — tasks + side stack' },
};

type SettingsTab = 'general' | 'widgets' | 'ai';

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'widgets', label: 'Widgets' },
  { id: 'ai', label: 'AI Assistant' },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, activeLayout }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [profile, setProfile] = useState<NexusProfile>({
    username: '', greeting: '', backgroundUrl: '', accentColor: '#3B82F6', theme: 'system',
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
    if (field === 'accentColor') document.documentElement.style.setProperty('--accent-color', value);
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
    const updated = currentConfig.widgets.includes(widgetId)
      ? currentConfig.widgets.filter(id => id !== widgetId)
      : [...currentConfig.widgets, widgetId];
    const newLayouts = { ...layouts, [activeLayout]: { ...currentConfig, widgets: updated } };
    setLayouts(newLayouts);
    setStorage({ 'nexus.layouts': newLayouts });
  };

  if (!isOpen) return null;

  const enabledCount = layouts ? layouts[activeLayout].widgets.length : 0;

  return (
    <>
      <div
        className="fixed inset-0 backdrop-blur-sm z-40 animate-fade-in"
        style={{ backgroundColor: 'var(--backdrop-overlay)' }}
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-[720px] z-50 animate-slide-in">
        <div className="h-full backdrop-blur-2xl shadow-2xl flex flex-col" style={{ backgroundColor: 'var(--panel-bg)', borderLeft: '1px solid var(--panel-border)' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: '1px solid var(--panel-border)' }}>
            <div>
              <h2 className="text-lg font-semibold t-primary">Settings</h2>
              <p className="text-xs t-muted mt-0.5">Personalize your {APP.shortName}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl t-muted hover:t-primary transition-colors cursor-pointer">
              <IconClose className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 pt-4 shrink-0" style={{ borderBottom: '1px solid var(--panel-border)' }}>
            {TABS.map(({ id, label }) => {
              const TabIcon = TAB_ICONS[id];
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl transition-all cursor-pointer ${
                    activeTab === id ? 't-primary' : 't-muted hover:t-tertiary'
                  }`}
                  style={activeTab === id ? { backgroundColor: 'var(--glass-bg)', borderBottom: '2px solid var(--accent-color)' } : {}}
                >
                  {TabIcon && <TabIcon className="w-4 h-4" />}
                  {label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {activeTab === 'general' && (
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wider t-faint mb-4">Profile</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs t-tertiary mb-1">Name</label>
                      <input
                        type="text"
                        value={profile.username}
                        onChange={e => handleProfileChange('username', e.target.value)}
                        placeholder="Your name"
                        className="glass-input text-sm w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs t-tertiary mb-1">Custom Greeting</label>
                      <input
                        type="text"
                        value={profile.greeting}
                        onChange={e => handleProfileChange('greeting', e.target.value)}
                        placeholder="e.g. Ready to build something great?"
                        className="glass-input text-sm w-full"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wider t-faint mb-4">Appearance</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs t-tertiary mb-2">Theme</label>
                      <div className="flex gap-2 p-1.5 rounded-xl" style={{ backgroundColor: 'var(--glass-bg)' }}>
                        {THEME_OPTIONS.map(({ value, label }) => {
                          const active = (profile.theme || 'system') === value;
                          const ThemeIcon = THEME_ICONS[value];
                          return (
                            <button
                              key={value}
                              onClick={() => handleProfileChange('theme', value)}
                              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${active ? 't-primary' : 't-muted'}`}
                              style={active ? { backgroundColor: 'var(--glass-bg-hover)', boxShadow: '0 1px 3px var(--shadow-color)' } : {}}
                            >
                              {ThemeIcon && <ThemeIcon className="w-4 h-4" />}
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs t-tertiary mb-1">Background Image URL</label>
                      <input
                        type="text"
                        value={profile.backgroundUrl}
                        onChange={e => handleProfileChange('backgroundUrl', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="glass-input text-sm w-full"
                      />
                      {profile.backgroundUrl && (
                        <div className="mt-2 rounded-xl overflow-hidden h-20 relative">
                          <img src={profile.backgroundUrl} alt="Preview" className="w-full h-full object-cover opacity-60" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          <button onClick={() => handleProfileChange('backgroundUrl', '')} className="absolute top-2 right-2 p-1.5 rounded-lg cursor-pointer" style={{ backgroundColor: 'var(--glass-bg)' }}>
                            <IconClose className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs t-tertiary mb-2">Accent Color</label>
                      <div className="grid grid-cols-8 gap-2 mb-2">
                        {ACCENT_PRESETS.map(({ color, name }) => (
                          <button
                            key={color}
                            onClick={() => handleProfileChange('accentColor', color)}
                            className="group relative w-full aspect-square rounded-xl border-2 transition-all duration-200 cursor-pointer hover:scale-110"
                            style={{ backgroundColor: color, borderColor: profile.accentColor === color ? 'white' : 'transparent', boxShadow: profile.accentColor === color ? `0 0 12px ${color}40` : 'none' }}
                            title={name}
                          >
                            {profile.accentColor === color && (
                              <IconCheck className="w-4 h-4 t-primary absolute inset-0 m-auto" strokeWidth={3} />
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="color" value={profile.accentColor} onChange={e => handleProfileChange('accentColor', e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 p-0" />
                        <input type="text" value={profile.accentColor} onChange={e => handleProfileChange('accentColor', e.target.value)} className="glass-input text-xs flex-1 font-mono" maxLength={7} />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'widgets' && (
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider t-faint">Widgets</h3>
                  <span className="text-xs t-faint">{enabledCount} enabled for <span className="capitalize t-muted">{LAYOUT_LABELS[activeLayout].name}</span></span>
                </div>
                <p className="text-sm t-muted mb-4">{LAYOUT_LABELS[activeLayout].desc}</p>
                <div className="space-y-5">
                  {WIDGET_GROUPS.map(group => (
                    <div key={group.label}>
                      <p className="text-[11px] font-medium t-ghost uppercase tracking-wider mb-2">{group.label}</p>
                      <div className="space-y-1.5">
                        {group.items.map(({ id, name, desc }) => {
                          const enabled = layouts ? layouts[activeLayout].widgets.includes(id) : false;
                          const WidgetIcon = WIDGET_ICONS[id];
                          return (
                            <button
                              key={id}
                              onClick={() => handleToggleWidget(id)}
                              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-left"
                              style={{ backgroundColor: enabled ? 'var(--glass-bg)' : 'transparent' }}
                            >
                              {WidgetIcon && (
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: enabled ? `${profile.accentColor}20` : 'var(--glass-bg)' }}>
                                  <WidgetIcon className="w-4 h-4" style={enabled ? { color: profile.accentColor } : {}} />
                                </div>
                              )}
                              <div className={`w-10 h-6 rounded-full transition-all flex items-center shrink-0 ${enabled ? 'justify-end' : 'justify-start'}`} style={{ backgroundColor: enabled ? `${profile.accentColor}40` : 'var(--glass-bg)' }}>
                                <div className="w-4 h-4 rounded-full mx-[3px]" style={{ backgroundColor: enabled ? 'var(--text-primary)' : 'var(--text-ghost)', boxShadow: enabled ? `0 0 6px ${profile.accentColor}60` : 'none' }} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={`text-sm font-medium ${enabled ? 't-secondary' : 't-muted'}`}>{name}</p>
                                <p className="text-xs t-ghost truncate">{desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ai' && <AIAssistantTab />}
          </div>

          <div className="px-6 py-3 shrink-0" style={{ borderTop: '1px solid var(--divider)' }}>
            <p className="text-[11px] t-ghost text-center">{APP.shortName} v{APP.version} &middot; {APP.authorName}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
