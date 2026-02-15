import React from 'react';
import { WidgetId } from '../../types';
import DraggableWidgetGrid from '../DraggableWidgetGrid';

interface FocusLayoutProps {
  widgets: WidgetId[];
  renderWidget: (id: WidgetId) => React.ReactNode;
  onReorder: (widgets: WidgetId[]) => void;
}

// Focus layout: centered, minimal. Clock & search span full width, rest in 2-col grid.
const FULL_WIDTH: WidgetId[] = ['clock', 'search'];

const FocusLayout: React.FC<FocusLayoutProps> = ({ widgets, renderWidget, onReorder }) => {
  const colSpans: Partial<Record<WidgetId, string>> = {};
  for (const id of widgets) {
    if (FULL_WIDTH.includes(id)) {
      colSpans[id] = 'col-span-1 md:col-span-2';
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <DraggableWidgetGrid
        widgets={widgets}
        renderWidget={renderWidget}
        onReorder={onReorder}
        gridClassName="grid-cols-1 md:grid-cols-2"
        colSpans={colSpans}
      />
    </div>
  );
};

export default FocusLayout;
