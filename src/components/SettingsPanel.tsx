import React, { useState, useEffect } from 'react';
import { NexusProfile, LayoutType, NexusLayouts, WidgetId } from '../types';
import { getNexusProfile, setNexusProfile, getNexusLayouts, setStorage } from '../utils/storage';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeLayout: LayoutType;
}

const ALL_WIDGETS: { id: WidgetId; name: string }[] = [
  { id: 'clock', name: 'Clock & Greeting' },
  { id: 'search', name: 'Search Bar' },
  { id: 'tasks', name: 'Tasks' },
  { id: 'quicklinks', name: 'Quick Links' },
  { id: 'bookmarks', name: 'Bookmarks' },
  { id: 'notes', name: 'Notes' },
  { id: 'pomodoro', name: 'Pomodoro Timer' },
  { id: 'weather', name: 'Weather' },
  { id: 'gitlab', name: 'GitLab Activity' },
  { id: 'github', name: 'GitHub Activity' },
  { id: 'rss', name: 'RSS Feeds' },
  { id: 'embed', name: 'Custom Embed' },
  { id: 'shortcuts', name: 'Keyboard Shortcuts' },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, activeLayout }) => {
  const [profile, setProfile] = useState<NexusProfile>({
    username: '',
    greeting: '',
    backgroundUrl: '',
    accentColor: '#3B82F6',
  });
  const [layouts, setLayouts] = useState<NexusLayouts | null>(null);
  const [activeSection, setActiveSection] = useState<'profile' | 'widgets'>('profile');

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

    // Update CSS variable for accent color
    if (field === 'accentColor') {
      document.documentElement.style.setProperty('--accent-color', value);
    }
  };

  const handleToggleWidget = (widgetId: WidgetId) => {
    if (!layouts) return;
    const current = layouts[activeLayout].widgets;
    const updated = current.includes(widgetId)
      ? current.filter(id => id !== widgetId)
      : [...current, widgetId];
    const newLayouts = {
      ...layouts,
      [activeLayout]: { widgets: updated },
    };
    setLayouts(newLayouts);
    setStorage({ 'nexus.layouts': newLayouts });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md z-50 animate-slide-in">
        <div className="h-full backdrop-blur-2xl bg-black/60 border-l border-white/10 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-1 px-6 pt-4">
            <button
              onClick={() => setActiveSection('profile')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeSection === 'profile'
                  ? 'bg-white/15 text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveSection('widgets')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeSection === 'widgets'
                  ? 'bg-white/15 text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              Widgets ({activeLayout})
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {activeSection === 'profile' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={e => handleProfileChange('username', e.target.value)}
                    placeholder="Your name"
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Custom Greeting</label>
                  <input
                    type="text"
                    value={profile.greeting}
                    onChange={e => handleProfileChange('greeting', e.target.value)}
                    placeholder="e.g. Ready to build something great?"
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Background Image URL</label>
                  <input
                    type="text"
                    value={profile.backgroundUrl}
                    onChange={e => handleProfileChange('backgroundUrl', e.target.value)}
                    placeholder="https://..."
                    className="glass-input"
                  />
                  {profile.backgroundUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden h-20">
                      <img
                        src={profile.backgroundUrl}
                        alt="Background preview"
                        className="w-full h-full object-cover opacity-60"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={profile.accentColor}
                      onChange={e => handleProfileChange('accentColor', e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={profile.accentColor}
                      onChange={e => handleProfileChange('accentColor', e.target.value)}
                      className="glass-input flex-1"
                    />
                    {/* Preset colors */}
                    <div className="flex gap-1.5">
                      {['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'].map(color => (
                        <button
                          key={color}
                          onClick={() => handleProfileChange('accentColor', color)}
                          className="w-6 h-6 rounded-full border-2 transition-all duration-200 cursor-pointer"
                          style={{
                            backgroundColor: color,
                            borderColor: profile.accentColor === color ? 'white' : 'transparent',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'widgets' && layouts && (
              <>
                <p className="text-xs text-white/40">
                  Toggle widgets for the <span className="text-white/70 font-medium capitalize">{activeLayout}</span> layout.
                </p>
                <div className="space-y-2">
                  {ALL_WIDGETS.map(({ id, name }) => {
                    const enabled = layouts[activeLayout].widgets.includes(id);
                    return (
                      <button
                        key={id}
                        onClick={() => handleToggleWidget(id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                          enabled
                            ? 'bg-white/15 border border-white/20'
                            : 'bg-white/5 border border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span className={`text-sm font-medium ${enabled ? 'text-white' : 'text-white/40'}`}>
                          {name}
                        </span>
                        <div className={`w-10 h-6 rounded-full transition-all duration-200 flex items-center ${
                          enabled ? 'bg-accent justify-end' : 'bg-white/10 justify-start'
                        }`}>
                          <div className={`w-4 h-4 rounded-full mx-1 transition-all duration-200 ${
                            enabled ? 'bg-white' : 'bg-white/30'
                          }`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10">
            <p className="text-xs text-white/30 text-center">
              Nexus Tab v2.0.0 by Encore Shao
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
