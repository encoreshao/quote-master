import React, { useState, useEffect } from 'react';
import WidgetCard from './WidgetCard';
import { getWidgetConfig, setWidgetConfig } from '../../utils/storage';
import { RSSWidgetConfig, RSSFeed, RSSArticle } from '../../types';

const DEFAULTS: RSSWidgetConfig = { feeds: [], refreshInterval: 15 };

// Simple RSS/Atom XML parser
function parseRSS(xml: string, source: string): RSSArticle[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const articles: RSSArticle[] = [];

  // RSS 2.0
  const items = doc.querySelectorAll('item');
  items.forEach(item => {
    articles.push({
      title: item.querySelector('title')?.textContent || '',
      link: item.querySelector('link')?.textContent || '',
      pubDate: item.querySelector('pubDate')?.textContent || '',
      source,
    });
  });

  // Atom
  if (articles.length === 0) {
    const entries = doc.querySelectorAll('entry');
    entries.forEach(entry => {
      articles.push({
        title: entry.querySelector('title')?.textContent || '',
        link: entry.querySelector('link')?.getAttribute('href') || '',
        pubDate: entry.querySelector('updated')?.textContent || entry.querySelector('published')?.textContent || '',
        source,
      });
    });
  }

  return articles;
}

const RSSWidget: React.FC = () => {
  const [config, setConfig] = useState<RSSWidgetConfig>(DEFAULTS);
  const [articles, setArticles] = useState<RSSArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');

  useEffect(() => {
    getWidgetConfig('rss', DEFAULTS, (loaded) => {
      setConfig(loaded);
      if (loaded.feeds.length > 0) {
        fetchAllFeeds(loaded.feeds);
      }
    });
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail?.widget === 'rss') {
        getWidgetConfig('rss', DEFAULTS, (loaded) => {
          setConfig(loaded);
          if (loaded.feeds.length > 0) {
            fetchAllFeeds(loaded.feeds);
          }
        });
      }
    };
    window.addEventListener('nexus-widget-refresh', handler);
    return () => window.removeEventListener('nexus-widget-refresh', handler);
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (config.feeds.length === 0) return;
    const interval = setInterval(() => {
      fetchAllFeeds(config.feeds);
    }, config.refreshInterval * 60 * 1000);
    return () => clearInterval(interval);
  }, [config]);

  const fetchAllFeeds = async (feeds: RSSFeed[]) => {
    setLoading(true);
    const allArticles: RSSArticle[] = [];
    for (const feed of feeds) {
      try {
        // Use a CORS proxy for RSS feeds
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feed.url)}`;
        const res = await fetch(proxyUrl);
        const text = await res.text();
        const parsed = parseRSS(text, feed.name);
        allArticles.push(...parsed);
      } catch (err) {
        console.error(`Error fetching feed ${feed.name}:`, err);
      }
    }
    // Sort by date, newest first
    allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    setArticles(allArticles.slice(0, 30));
    setLoading(false);
  };

  const handleAddFeed = () => {
    if (!newUrl.trim()) return;
    const feed: RSSFeed = {
      id: String(Date.now()),
      name: newName || new URL(newUrl).hostname,
      url: newUrl,
    };
    const updated = { ...config, feeds: [...config.feeds, feed] };
    setConfig(updated);
    setWidgetConfig('rss', updated);
    fetchAllFeeds(updated.feeds);
    setNewUrl('');
    setNewName('');
    setShowAdd(false);
  };

  const handleRemoveFeed = (id: string) => {
    const updated = { ...config, feeds: config.feeds.filter(f => f.id !== id) };
    setConfig(updated);
    setWidgetConfig('rss', updated);
    fetchAllFeeds(updated.feeds);
  };

  const timeAgo = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      return `${days}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <WidgetCard
      title="RSS Feeds"
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12.75 19.5v-.75a7.5 7.5 0 00-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      }
      collapsible
    >
      {/* Refresh + Add feed — in container to avoid overlapping widget hover bar */}
      <div className="flex items-center gap-2 mb-3">
        {config.feeds.length > 0 && (
          <button
            onClick={() => fetchAllFeeds(config.feeds)}
            className="flex items-center gap-1.5 text-xs t-muted hover:t-secondary transition-colors cursor-pointer"
            title="Refresh"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            <span>Refresh</span>
          </button>
        )}
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 text-xs t-muted hover:t-secondary transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>{showAdd ? 'Cancel' : 'Add feed'}</span>
        </button>
      </div>
      {showAdd && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Feed name"
            className="glass-input text-xs flex-1"
          />
          <input
            type="text"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="RSS feed URL"
            className="glass-input text-xs flex-[2]"
            onKeyDown={e => e.key === 'Enter' && handleAddFeed()}
          />
          <button onClick={handleAddFeed} className="glass-button text-xs px-3">Add</button>
        </div>
      )}

      {/* Active feeds */}
      {config.feeds.length > 0 && (
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {config.feeds.map(feed => (
            <span key={feed.id} className="group inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full t-tertiary" style={{ backgroundColor: 'var(--glass-bg)' }}>
              {feed.name}
              <button
                onClick={() => handleRemoveFeed(feed.id)}
                className="t-ghost hover:text-red-400 cursor-pointer"
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Articles */}
      <div className="max-h-80 overflow-y-auto space-y-1">
        {articles.map((article, i) => (
          <a
            key={`${article.link}-${i}`}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 px-2 py-2 rounded-lg hover:bg-[var(--glass-bg)] transition-all duration-200 cursor-pointer group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs t-tertiary group-hover:t-primary truncate transition-colors">
                {article.title}
              </p>
              <p className="text-[10px] t-faint mt-0.5">
                {article.source} {article.pubDate && `· ${timeAgo(article.pubDate)}`}
              </p>
            </div>
            <svg className="w-3 h-3 t-ghost group-hover:t-tertiary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </a>
        ))}
        {config.feeds.length === 0 && (
          <p className="text-center t-faint text-xs py-4">
            Add feed above to get started
          </p>
        )}
        {config.feeds.length > 0 && articles.length === 0 && !loading && (
          <p className="text-center t-faint text-xs py-4">No articles found</p>
        )}
        {loading && (
          <p className="text-center t-muted text-xs py-4">Loading feeds...</p>
        )}
      </div>
    </WidgetCard>
  );
};

export default RSSWidget;
