import React, { useState, useRef, useCallback } from 'react';
import { WidgetId } from '../types';

interface DraggableWidgetGridProps {
  widgets: WidgetId[];
  renderWidget: (id: WidgetId) => React.ReactNode;
  onReorder: (widgets: WidgetId[]) => void;
  /** Tailwind grid class, e.g. "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" */
  gridClassName?: string;
  /** Additional container class */
  className?: string;
  /** Widget-specific column span overrides */
  colSpans?: Partial<Record<WidgetId, string>>;
}

const DraggableWidgetGrid: React.FC<DraggableWidgetGridProps> = ({
  widgets,
  renderWidget,
  onReorder,
  gridClassName = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  className = '',
  colSpans = {},
}) => {
  const [draggedId, setDraggedId] = useState<WidgetId | null>(null);
  const [overId, setOverId] = useState<WidgetId | null>(null);
  const dragCounter = useRef<Record<string, number>>({});

  const handleDragStart = useCallback((e: React.DragEvent, id: WidgetId) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    // Make the drag image slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedId(null);
    setOverId(null);
    dragCounter.current = {};
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, id: WidgetId) => {
    e.preventDefault();
    dragCounter.current[id] = (dragCounter.current[id] || 0) + 1;
    if (id !== draggedId) {
      setOverId(id);
    }
  }, [draggedId]);

  const handleDragLeave = useCallback((e: React.DragEvent, id: WidgetId) => {
    e.preventDefault();
    dragCounter.current[id] = (dragCounter.current[id] || 0) - 1;
    if (dragCounter.current[id] <= 0) {
      dragCounter.current[id] = 0;
      if (overId === id) {
        setOverId(null);
      }
    }
  }, [overId]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: WidgetId) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') as WidgetId;
    if (!sourceId || sourceId === targetId) {
      setDraggedId(null);
      setOverId(null);
      dragCounter.current = {};
      return;
    }

    const newWidgets = [...widgets];
    const sourceIdx = newWidgets.indexOf(sourceId);
    const targetIdx = newWidgets.indexOf(targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    // Remove from old position, insert at new
    newWidgets.splice(sourceIdx, 1);
    newWidgets.splice(targetIdx, 0, sourceId);

    onReorder(newWidgets);
    setDraggedId(null);
    setOverId(null);
    dragCounter.current = {};
  }, [widgets, onReorder]);

  return (
    <div className={`grid ${gridClassName} gap-4 ${className}`}>
      {widgets.map((id) => {
        const isDragged = draggedId === id;
        const isOver = overId === id && draggedId !== id;
        const span = colSpans[id] || '';

        return (
          <div
            key={id}
            draggable
            onDragStart={(e) => handleDragStart(e, id)}
            onDragEnd={handleDragEnd}
            onDragEnter={(e) => handleDragEnter(e, id)}
            onDragLeave={(e) => handleDragLeave(e, id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, id)}
            className={`relative transition-all duration-200 ${span} ${
              isDragged ? 'opacity-50 scale-[0.98]' : ''
            } ${
              isOver ? 'ring-2 ring-offset-0 rounded-2xl' : ''
            }`}
            style={isOver ? { '--tw-ring-color': 'var(--accent-color)' } as React.CSSProperties : {}}
          >
            {/* Drag handle indicator */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing">
              <div className="flex gap-0.5 px-2 py-1 rounded-lg backdrop-blur-sm" style={{ backgroundColor: 'var(--glass-bg)' }}>
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
              </div>
            </div>
            {renderWidget(id)}
          </div>
        );
      })}
    </div>
  );
};

export default DraggableWidgetGrid;
