import React, { useState, useRef, useCallback } from 'react';
import { WidgetId, WidgetSize, WidgetStyle, WidgetSettings } from '../types';

const SIZES: { value: WidgetSize; label: string }[] = [
  { value: 'small', label: 'S' },
  { value: 'medium', label: 'M' },
  { value: 'large', label: 'L' },
];

const STYLES: { value: WidgetStyle; label: string; icon: string }[] = [
  { value: 'glass', label: 'Glass', icon: 'M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z' },
  { value: 'solid', label: 'Solid', icon: 'M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z' },
  { value: 'minimal', label: 'Minimal', icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' },
  { value: 'outlined', label: 'Outlined', icon: 'M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z' },
];

interface DraggableWidgetGridProps {
  widgets: WidgetId[];
  renderWidget: (id: WidgetId) => React.ReactNode;
  onReorder: (widgets: WidgetId[]) => void;
  onRemove?: (widgetId: WidgetId) => void;
  onWidgetSettingsChange?: (widgetId: WidgetId, settings: WidgetSettings) => void;
  widgetSettings?: Partial<Record<WidgetId, WidgetSettings>>;
  /** Tailwind grid class, e.g. "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" */
  gridClassName?: string;
  /** Additional container class */
  className?: string;
  /** Widget-specific column span overrides (from layout defaults) */
  colSpans?: Partial<Record<WidgetId, string>>;
  /** Max columns in the grid (used to compute size spans) */
  gridCols?: number;
}

function getSizeColSpan(size: WidgetSize, gridCols: number): string {
  switch (size) {
    case 'small':
      return 'col-span-1';
    case 'medium':
      return gridCols >= 3 ? 'col-span-1 lg:col-span-2' : 'col-span-1 md:col-span-2';
    case 'large':
      return gridCols >= 3 ? 'col-span-1 md:col-span-2 lg:col-span-3' : 'col-span-1 md:col-span-2';
    default:
      return '';
  }
}

const DraggableWidgetGrid: React.FC<DraggableWidgetGridProps> = ({
  widgets,
  renderWidget,
  onReorder,
  onRemove,
  onWidgetSettingsChange,
  widgetSettings = {},
  gridClassName = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  className = '',
  colSpans = {},
  gridCols = 3,
}) => {
  const [draggedId, setDraggedId] = useState<WidgetId | null>(null);
  const [overId, setOverId] = useState<WidgetId | null>(null);
  const [styleMenuOpen, setStyleMenuOpen] = useState<WidgetId | null>(null);
  const dragCounter = useRef<Record<string, number>>({});

  const handleDragStart = useCallback((e: React.DragEvent, id: WidgetId) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
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

    newWidgets.splice(sourceIdx, 1);
    newWidgets.splice(targetIdx, 0, sourceId);

    onReorder(newWidgets);
    setDraggedId(null);
    setOverId(null);
    dragCounter.current = {};
  }, [widgets, onReorder]);

  const handleSizeChange = useCallback((id: WidgetId, size: WidgetSize) => {
    if (!onWidgetSettingsChange) return;
    const current = widgetSettings[id] || {};
    onWidgetSettingsChange(id, { ...current, size });
  }, [onWidgetSettingsChange, widgetSettings]);

  const handleStyleChange = useCallback((id: WidgetId, style: WidgetStyle) => {
    if (!onWidgetSettingsChange) return;
    const current = widgetSettings[id] || {};
    onWidgetSettingsChange(id, { ...current, style });
    setStyleMenuOpen(null);
  }, [onWidgetSettingsChange, widgetSettings]);

  return (
    <div className={`grid ${gridClassName} gap-4 ${className}`}>
      {widgets.map((id) => {
        const isDragged = draggedId === id;
        const isOver = overId === id && draggedId !== id;
        const settings = widgetSettings[id] || {};
        const currentSize = settings.size;
        const currentStyle = settings.style || 'glass';

        // User size override takes precedence over layout default
        const span = currentSize
          ? getSizeColSpan(currentSize, gridCols)
          : (colSpans[id] || '');

        const styleClass = currentStyle !== 'glass' ? `widget-style-${currentStyle}` : '';

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
            className={`group/widget relative transition-all duration-200 ${span} ${styleClass} ${
              isDragged ? 'opacity-50 scale-[0.98]' : ''
            } ${
              isOver ? 'ring-2 ring-offset-0 rounded-2xl' : ''
            }`}
            style={isOver ? { '--tw-ring-color': 'var(--accent-color)' } as React.CSSProperties : {}}
          >
            {/* ── Widget Controls (visible on hover) ── */}
            <div className="absolute top-2 right-2 z-20 opacity-0 group-hover/widget:opacity-100 transition-all duration-200 flex items-center gap-1">
              {/* Size pills */}
              {onWidgetSettingsChange && (
                <div
                  className="flex items-center rounded-lg overflow-hidden backdrop-blur-xl"
                  style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
                >
                  {SIZES.map(({ value, label }) => {
                    const active = currentSize === value;
                    return (
                      <button
                        key={value}
                        onClick={(e) => { e.stopPropagation(); handleSizeChange(id, value); }}
                        className="px-2 py-1 text-[10px] font-semibold transition-all duration-150 cursor-pointer"
                        style={{
                          color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                          backgroundColor: active ? 'var(--accent-color)' : 'transparent',
                        }}
                        title={`Size: ${value}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Style toggle */}
              {onWidgetSettingsChange && (
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setStyleMenuOpen(styleMenuOpen === id ? null : id); }}
                    className="p-1.5 rounded-lg backdrop-blur-xl transition-all duration-150 cursor-pointer"
                    style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}
                    title={`Style: ${currentStyle}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                    </svg>
                  </button>

                  {/* Style dropdown */}
                  {styleMenuOpen === id && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setStyleMenuOpen(null)} />
                      <div
                        className="absolute top-full right-0 mt-1 z-40 rounded-xl overflow-hidden backdrop-blur-xl shadow-lg min-w-[120px]"
                        style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--glass-border)' }}
                      >
                        {STYLES.map(({ value, label }) => (
                          <button
                            key={value}
                            onClick={(e) => { e.stopPropagation(); handleStyleChange(id, value); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-all duration-150 cursor-pointer text-left"
                            style={{
                              color: currentStyle === value ? 'var(--text-primary)' : 'var(--text-muted)',
                              backgroundColor: currentStyle === value ? 'var(--glass-bg)' : 'transparent',
                            }}
                          >
                            {currentStyle === value && (
                              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            <span className={currentStyle === value ? '' : 'ml-5'}>{label}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Remove button */}
              {onRemove && (
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(id); }}
                  className="p-1.5 rounded-lg backdrop-blur-xl transition-all duration-150 cursor-pointer hover:brightness-125"
                  style={{ backgroundColor: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}
                  title="Remove widget"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

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
