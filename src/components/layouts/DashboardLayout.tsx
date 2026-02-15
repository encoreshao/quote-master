import React from 'react';
import { WidgetId } from '../../types';
import DraggableWidgetGrid from '../DraggableWidgetGrid';

interface DashboardLayoutProps {
  widgets: WidgetId[];
  renderWidget: (id: WidgetId) => React.ReactNode;
  onReorder: (widgets: WidgetId[]) => void;
}

// Dashboard: full bento grid, 12-col on large screens.
// Key widgets get larger spans; the rest fill in.
const WIDE_WIDGETS: WidgetId[] = ['tasks', 'rss', 'search'];
const MEDIUM_WIDGETS: WidgetId[] = ['bookmarks', 'notes', 'quicklinks'];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ widgets, renderWidget, onReorder }) => {
  const colSpans: Partial<Record<WidgetId, string>> = {};
  for (const id of widgets) {
    if (WIDE_WIDGETS.includes(id)) {
      colSpans[id] = 'col-span-1 md:col-span-2 lg:col-span-2';
    } else if (MEDIUM_WIDGETS.includes(id)) {
      colSpans[id] = 'col-span-1 md:col-span-1 lg:col-span-1';
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <DraggableWidgetGrid
        widgets={widgets}
        renderWidget={renderWidget}
        onReorder={onReorder}
        gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        colSpans={colSpans}
      />
    </div>
  );
};

export default DashboardLayout;
