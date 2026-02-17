import React from 'react';
import { WidgetId, WidgetSettings } from '../../types';
import DraggableWidgetGrid from '../DraggableWidgetGrid';

interface WorkflowLayoutProps {
  widgets: WidgetId[];
  renderWidget: (id: WidgetId) => React.ReactNode;
  onReorder: (widgets: WidgetId[]) => void;
  onRemove?: (widgetId: WidgetId) => void;
  onWidgetSettingsChange?: (widgetId: WidgetId, settings: WidgetSettings) => void;
  widgetSettings?: Partial<Record<WidgetId, WidgetSettings>>;
}

// Workflow: tasks-heavy split. Tasks gets wide column, rest stacks in sidebar.
const WorkflowLayout: React.FC<WorkflowLayoutProps> = ({
  widgets, renderWidget, onReorder, onRemove, onWidgetSettingsChange, widgetSettings = {},
}) => {
  const colSpans: Partial<Record<WidgetId, string>> = {};
  for (const id of widgets) {
    if (id === 'tasks') {
      colSpans[id] = 'col-span-1 lg:col-span-2';
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <DraggableWidgetGrid
        widgets={widgets}
        renderWidget={renderWidget}
        onReorder={onReorder}
        onRemove={onRemove}
        onWidgetSettingsChange={onWidgetSettingsChange}
        widgetSettings={widgetSettings}
        gridClassName="grid-cols-1 lg:grid-cols-3"
        colSpans={colSpans}
        gridCols={3}
      />
    </div>
  );
};

export default WorkflowLayout;
