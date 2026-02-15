import React from 'react';
import { WidgetId } from '../../types';

interface DashboardLayoutProps {
  widgets: WidgetId[];
  renderWidget: (id: WidgetId) => React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ widgets, renderWidget }) => {
  const has = (id: WidgetId) => widgets.includes(id);
  const remaining = widgets.filter(
    id => !['clock', 'weather', 'search', 'tasks', 'quicklinks', 'pomodoro', 'rss', 'notes', 'bookmarks'].includes(id)
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Row 1: Clock + Weather + Search */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        {has('clock') && (
          <div className="col-span-12 md:col-span-3">{renderWidget('clock')}</div>
        )}
        {has('weather') && (
          <div className="col-span-12 md:col-span-3">{renderWidget('weather')}</div>
        )}
        {has('search') && (
          <div className={`col-span-12 ${has('clock') || has('weather') ? 'md:col-span-6' : 'md:col-span-12'}`}>
            {renderWidget('search')}
          </div>
        )}
      </div>

      {/* Row 2: Tasks (large) + Side stack */}
      {(has('tasks') || has('quicklinks') || has('pomodoro')) && (
        <div className="grid grid-cols-12 gap-4 mb-4">
          {has('tasks') && (
            <div className="col-span-12 lg:col-span-8">{renderWidget('tasks')}</div>
          )}
          <div className={`col-span-12 ${has('tasks') ? 'lg:col-span-4' : 'lg:col-span-12'} flex flex-col gap-4`}>
            {has('quicklinks') && renderWidget('quicklinks')}
            {has('pomodoro') && renderWidget('pomodoro')}
          </div>
        </div>
      )}

      {/* Row 3: RSS + Notes + Bookmarks */}
      {(has('rss') || has('notes') || has('bookmarks')) && (
        <div className="grid grid-cols-12 gap-4 mb-4">
          {has('rss') && (
            <div className={`col-span-12 ${has('notes') || has('bookmarks') ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
              {renderWidget('rss')}
            </div>
          )}
          {(has('notes') || has('bookmarks')) && (
            <div className={`col-span-12 ${has('rss') ? 'lg:col-span-4' : 'lg:col-span-12'} flex flex-col gap-4`}>
              {has('notes') && renderWidget('notes')}
              {has('bookmarks') && renderWidget('bookmarks')}
            </div>
          )}
        </div>
      )}

      {/* Remaining widgets */}
      {remaining.length > 0 && (
        <div className="grid grid-cols-12 gap-4">
          {remaining.map(id => (
            <div key={id} className="col-span-12 md:col-span-6 lg:col-span-4">{renderWidget(id)}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
