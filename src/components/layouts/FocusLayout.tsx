import React from 'react';
import { WidgetId } from '../../types';

interface FocusLayoutProps {
  widgets: WidgetId[];
  renderWidget: (id: WidgetId) => React.ReactNode;
}

const FocusLayout: React.FC<FocusLayoutProps> = ({ widgets, renderWidget }) => {
  const has = (id: WidgetId) => widgets.includes(id);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      {/* Clock — centered hero */}
      {has('clock') && (
        <div className="w-full max-w-2xl mb-8">
          {renderWidget('clock')}
        </div>
      )}

      {/* Search bar */}
      {has('search') && (
        <div className="w-full max-w-xl mb-10">
          {renderWidget('search')}
        </div>
      )}

      {/* Bottom row: quick links + tasks side by side */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {has('quicklinks') && (
          <div>{renderWidget('quicklinks')}</div>
        )}
        {has('tasks') && (
          <div>{renderWidget('tasks')}</div>
        )}
      </div>

      {/* Any remaining widgets */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {widgets
          .filter(id => !['clock', 'search', 'quicklinks', 'tasks'].includes(id))
          .map(id => (
            <div key={id}>{renderWidget(id)}</div>
          ))}
      </div>
    </div>
  );
};

export default FocusLayout;
