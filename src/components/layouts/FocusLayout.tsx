import React from 'react';
import { WidgetId, WidgetSettings } from '../../types';
import DraggableWidgetGrid from '../DraggableWidgetGrid';

interface FocusLayoutProps {
  widgets: WidgetId[];
  renderWidget: (id: WidgetId) => React.ReactNode;
  onReorder: (widgets: WidgetId[]) => void;
  onRemove?: (widgetId: WidgetId) => void;
  onWidgetSettingsChange?: (widgetId: WidgetId, settings: WidgetSettings) => void;
  widgetSettings?: Partial<Record<WidgetId, WidgetSettings>>;
}

// Focus layout: centered, minimal. Clock & search span full width, rest in 2-col grid.
const FULL_WIDTH: WidgetId[] = ['clock', 'search'];

const FocusLayout: React.FC<FocusLayoutProps> = ({
  widgets, renderWidget, onReorder, onRemove, onWidgetSettingsChange, widgetSettings = {},
}) => {
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
        onRemove={onRemove}
        onWidgetSettingsChange={onWidgetSettingsChange}
        widgetSettings={widgetSettings}
        gridClassName="grid-cols-1 md:grid-cols-2"
        colSpans={colSpans}
        gridCols={2}
      />
    </div>
  );
};

export default FocusLayout;
