import React, { useState, useEffect } from 'react';
import { getWidgetConfig, setWidgetConfig } from '../../utils/storage';
import { SearchWidgetConfig } from '../../types';

const DEFAULTS: SearchWidgetConfig = {
  engine: 'https://www.google.com/search?q=',
};

const SearchWidget: React.FC = () => {
  const [query, setQuery] = useState('');
  const [config, setConfig] = useState<SearchWidgetConfig>(DEFAULTS);

  useEffect(() => {
    getWidgetConfig('search', DEFAULTS, setConfig);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Check if query is a URL
      if (query.match(/^(https?:\/\/|www\.)/i)) {
        window.location.href = query.startsWith('http') ? query : `https://${query}`;
      } else {
        window.location.href = `${config.engine}${encodeURIComponent(query)}`;
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="glass-card flex items-center px-4 py-3 gap-3 group focus-within:bg-white/15 focus-within:border-white/30 transition-all duration-200">
        <svg className="w-5 h-5 text-white/40 group-focus-within:text-white/70 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search the web or enter a URL..."
          className="flex-1 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none"
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1 rounded-lg text-white/30 hover:text-white/60 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchWidget;
