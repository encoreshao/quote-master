import React from 'react';

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUT_SECTIONS = [
  {
    label: 'General',
    items: [
      { keys: ['?'], desc: 'Show keyboard shortcuts' },
      { keys: ['Esc'], desc: 'Close panel / blur input' },
      { keys: [','], desc: 'Open Settings' },
      { keys: ['A'], desc: 'Add Widget' },
      { keys: ['/'], desc: 'Focus search bar' },
    ],
  },
  {
    label: 'Layouts',
    items: [
      { keys: ['1'], desc: 'Switch to Focus' },
      { keys: ['2'], desc: 'Switch to Dashboard' },
      { keys: ['3'], desc: 'Switch to Workflow' },
    ],
  },
];

const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm z-40 animate-fade-in"
        style={{ backgroundColor: 'var(--backdrop-overlay)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-sm backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--panel-border)' }}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 t-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <h2 className="text-sm font-semibold t-primary">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg t-muted transition-all duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-4">
            {SHORTCUT_SECTIONS.map(section => (
              <div key={section.label}>
                <p className="text-[10px] font-medium t-ghost uppercase tracking-wider mb-2">{section.label}</p>
                <div className="space-y-1.5">
                  {section.items.map(({ keys, desc }) => (
                    <div key={desc} className="flex items-center justify-between">
                      <span className="text-xs t-secondary">{desc}</span>
                      <div className="flex items-center gap-1">
                        {keys.map(k => (
                          <kbd
                            key={k}
                            className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-md text-[11px] font-mono font-medium"
                            style={{
                              backgroundColor: 'var(--glass-bg)',
                              border: '1px solid var(--glass-border)',
                              color: 'var(--text-primary)',
                              boxShadow: '0 1px 2px var(--shadow-color)',
                            }}
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer hint */}
          <div className="px-5 py-3" style={{ borderTop: '1px solid var(--divider)' }}>
            <p className="text-[10px] t-ghost text-center">
              Shortcuts are disabled while typing in an input field
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShortcutsHelp;
