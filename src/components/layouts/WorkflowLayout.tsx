import React from 'react';
import { WidgetId } from '../../types';

interface WorkflowLayoutProps {
  widgets: WidgetId[];
  renderWidget: (id: WidgetId) => React.ReactNode;
}

const WorkflowLayout: React.FC<WorkflowLayoutProps> = ({ widgets, renderWidget }) => {
  const has = (id: WidgetId) => widgets.includes(id);
  const rightWidgets = widgets.filter(id => id !== 'tasks');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-12 gap-4 min-h-[calc(100vh-120px)]">
        {/* Left: Tasks (main area) */}
        {has('tasks') && (
          <div className={`col-span-12 ${rightWidgets.length > 0 ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'}`}>
            {renderWidget('tasks')}
          </div>
        )}

        {/* Right: Stacked widgets */}
        {rightWidgets.length > 0 && (
          <div className={`col-span-12 ${has('tasks') ? 'lg:col-span-5 xl:col-span-4' : 'lg:col-span-12'} flex flex-col gap-4`}>
            {rightWidgets.map(id => (
              <div key={id}>{renderWidget(id)}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowLayout;
