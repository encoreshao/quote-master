import React from 'react';
import { WidgetId } from '../../types';

interface WorkflowLayoutProps {
  widgets: WidgetId[];
  renderWidget: (id: WidgetId) => React.ReactNode;
}

const WorkflowLayout: React.FC<WorkflowLayoutProps> = ({ widgets, renderWidget }) => {
  const has = (id: WidgetId) => widgets.includes(id);
  const rightWidgets = widgets.filter(
    id => !['tasks'].includes(id)
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-12 gap-4 min-h-[calc(100vh-120px)]">
        {/* Left: Tasks (main area) */}
        {has('tasks') && (
          <div className="col-span-12 lg:col-span-8">
            {renderWidget('tasks')}
          </div>
        )}

        {/* Right: Stacked widgets */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          {rightWidgets.map(id => (
            <div key={id}>{renderWidget(id)}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowLayout;
