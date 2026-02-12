import React, { useState, useEffect, useCallback } from 'react';
import WidgetCard from './WidgetCard';
import { getWidgetConfig, setWidgetConfig } from '../../utils/storage';
import { NotesWidgetConfig } from '../../types';

const DEFAULTS: NotesWidgetConfig = { content: '' };

const NotesWidget: React.FC = () => {
  const [config, setConfig] = useState<NotesWidgetConfig>(DEFAULTS);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getWidgetConfig('notes', DEFAULTS, setConfig);
  }, []);

  const handleChange = useCallback((content: string) => {
    setConfig({ content });
    if (saveTimeout) clearTimeout(saveTimeout);
    setSaveTimeout(setTimeout(() => {
      setWidgetConfig('notes', { content });
    }, 500));
  }, [saveTimeout]);

  return (
    <WidgetCard
      title="Notes"
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      }
      noPadding
    >
      <textarea
        value={config.content}
        onChange={e => handleChange(e.target.value)}
        placeholder="Quick notes..."
        className="w-full h-40 bg-transparent text-white/80 text-sm p-4 resize-none focus:outline-none placeholder-white/20"
      />
    </WidgetCard>
  );
};

export default NotesWidget;
