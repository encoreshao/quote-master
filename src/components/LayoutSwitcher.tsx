import React from 'react';
import { LayoutType } from '../types';
import { LAYOUT_ICONS } from '../icons';

interface LayoutSwitcherProps {
  activeLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

const layouts: { id: LayoutType; label: string }[] = [
  { id: 'focus', label: 'Focus' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'workflow', label: 'Workflow' },
];

const LayoutSwitcher: React.FC<LayoutSwitcherProps> = ({ activeLayout, onLayoutChange }) => {
  return (
    <div
      className="flex items-center backdrop-blur-xl rounded-xl p-0.5"
      style={{ backgroundColor: 'var(--glass-bg-subtle)', border: '1px solid var(--glass-border-subtle)' }}
    >
      {layouts.map(({ id, label }) => {
        const LayoutIcon = LAYOUT_ICONS[id];
        const active = activeLayout === id;
        return (
          <button
            key={id}
            onClick={() => onLayoutChange(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[11px] font-medium transition-all duration-200 cursor-pointer ${
              active ? 't-primary' : 't-muted'
            }`}
            style={active ? { backgroundColor: 'var(--glass-bg-hover)', boxShadow: '0 1px 3px var(--shadow-color)' } : {}}
            title={label}
          >
            {LayoutIcon && <LayoutIcon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LayoutSwitcher;
