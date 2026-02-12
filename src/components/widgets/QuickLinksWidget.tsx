import React, { useState, useEffect } from 'react';
import WidgetCard from './WidgetCard';
import { getWidgetConfig, setWidgetConfig, DEFAULT_QUICK_LINKS } from '../../utils/storage';
import { QuickLink, QuickLinksWidgetConfig } from '../../types';

const DEFAULTS: QuickLinksWidgetConfig = { links: DEFAULT_QUICK_LINKS };

const ICON_MAP: Record<string, React.ReactNode> = {
  mail: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  github: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  bot: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  gitlab: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="m23.6004 9.5927-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.4047.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0539.8585.8585 0 0 0-.3362.4047L.4332 9.5013l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0088.03.0213 4.976 3.7264 2.462 1.8633 1.4994 1.1321a1.0085 1.0085 0 0 0 1.2188 0l1.4994-1.1321 2.4619-1.8633 5.006-3.7489.0125-.0101a6.0682 6.0682 0 0 0 2.0094-7.003z" />
    </svg>
  ),
  building: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
);

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return '';
  }
}

const QuickLinksWidget: React.FC = () => {
  const [config, setConfig] = useState<QuickLinksWidgetConfig>(DEFAULTS);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    getWidgetConfig('quicklinks', DEFAULTS, setConfig);
  }, []);

  const handleAdd = () => {
    if (!newName.trim() || !newUrl.trim()) return;
    const url = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
    const updated: QuickLinksWidgetConfig = {
      links: [...config.links, { id: String(Date.now()), name: newName, url, icon: 'link' }],
    };
    setConfig(updated);
    setWidgetConfig('quicklinks', updated);
    setNewName('');
    setNewUrl('');
    setShowAdd(false);
  };

  const handleRemove = (id: string) => {
    const updated: QuickLinksWidgetConfig = {
      links: config.links.filter(l => l.id !== id),
    };
    setConfig(updated);
    setWidgetConfig('quicklinks', updated);
  };

  return (
    <WidgetCard
      title="Quick Links"
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      }
      headerRight={
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-all duration-200 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      }
    >
      {showAdd && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Name"
            className="glass-input text-xs flex-1"
          />
          <input
            type="text"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="URL"
            className="glass-input text-xs flex-[2]"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} className="glass-button text-xs px-3">Add</button>
        </div>
      )}
      <div className="grid grid-cols-4 gap-2">
        {config.links.map(link => (
          <a
            key={link.id}
            href={link.url}
            className="group flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer relative"
            title={link.url}
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-white/20 transition-all duration-200">
              <img
                src={getFaviconUrl(link.url)}
                alt=""
                className="w-5 h-5"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <span className="text-[10px] text-white/50 group-hover:text-white/80 truncate w-full text-center transition-colors">
              {link.name}
            </span>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(link.id); }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500/80 text-white text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              x
            </button>
          </a>
        ))}
      </div>
    </WidgetCard>
  );
};

export default QuickLinksWidget;
