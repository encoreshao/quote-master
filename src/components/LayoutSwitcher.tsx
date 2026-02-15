import React from 'react';
import { LayoutType } from '../types';

interface LayoutSwitcherProps {
  activeLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

const layouts: { id: LayoutType; label: string; icon: React.ReactNode }[] = [
  {
    id: 'focus',
    label: 'Focus',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12a3 3 0 106 0 3 3 0 00-6 0z" />
      </svg>
    ),
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: 'workflow',
    label: 'Workflow',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
];

const LayoutSwitcher: React.FC<LayoutSwitcherProps> = ({ activeLayout, onLayoutChange }) => {
  return (
    <div
      className="flex items-center backdrop-blur-xl rounded-xl p-0.5"
      style={{ backgroundColor: 'var(--glass-bg-subtle)', border: '1px solid var(--glass-border-subtle)' }}
    >
      {layouts.map(({ id, label, icon }) => {
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
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LayoutSwitcher;
