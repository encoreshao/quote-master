import React, { useState, useEffect } from 'react';
import WidgetCard from './WidgetCard';

interface BookmarkNode {
  id: string;
  title: string;
  url?: string;
  children?: BookmarkNode[];
}

const BookmarksWidget: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkNode[]>([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ action: 'getBookmarks' }, (response: BookmarkNode[]) => {
        if (response) setBookmarks(response);
      });
    }
  }, []);

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  const flattenBookmarks = (nodes: BookmarkNode[]): BookmarkNode[] => {
    const result: BookmarkNode[] = [];
    const walk = (list: BookmarkNode[]) => {
      for (const node of list) {
        if (node.url) result.push(node);
        if (node.children) walk(node.children);
      }
    };
    walk(nodes);
    return result;
  };

  const renderNode = (node: BookmarkNode, depth: number = 0): React.ReactNode => {
    if (node.url) {
      return (
        <a
          key={node.id}
          href={node.url}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[var(--glass-bg)] transition-all duration-200 cursor-pointer group"
          style={{ paddingLeft: `${12 + depth * 16}px` }}
          title={node.url}
        >
          <img
            src={`https://www.google.com/s2/favicons?domain=${new URL(node.url).hostname}&sz=16`}
            alt=""
            className="w-3.5 h-3.5 shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="text-xs t-tertiary group-hover:t-primary truncate transition-colors">
            {node.title || node.url}
          </span>
        </a>
      );
    }

    if (node.children && node.title) {
      const isOpen = expanded.has(node.id);
      return (
        <div key={node.id}>
          <button
            onClick={() => toggleExpand(node.id)}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[var(--glass-bg)] transition-all duration-200 cursor-pointer"
            style={{ paddingLeft: `${12 + depth * 16}px` }}
          >
            <svg className={`w-3 h-3 t-muted transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-xs t-tertiary font-medium">{node.title}</span>
            <span className="text-[10px] t-ghost">{node.children.length}</span>
          </button>
          {isOpen && node.children.map(child => renderNode(child, depth + 1))}
        </div>
      );
    }

    // Root level — render children directly
    return node.children?.map(child => renderNode(child, depth)) ?? null;
  };

  const searchResults = search.trim()
    ? flattenBookmarks(bookmarks).filter(b =>
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.url?.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 20)
    : null;

  return (
    <WidgetCard
      title="Bookmarks"
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
      }
      collapsible
    >
      <div className="mb-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search bookmarks..."
          className="glass-input text-xs"
        />
      </div>
      <div className="max-h-64 overflow-y-auto space-y-0.5">
        {searchResults
          ? searchResults.map(b => renderNode(b))
          : bookmarks.map(b => renderNode(b))
        }
        {bookmarks.length === 0 && (
          <p className="text-center t-faint text-xs py-4">Loading bookmarks...</p>
        )}
      </div>
    </WidgetCard>
  );
};

export default BookmarksWidget;
