import React, { useState, useEffect } from 'react';
import WidgetCard from './WidgetCard';
import { getWidgetConfig, setWidgetConfig } from '../../utils/storage';
import { Task, TasksWidgetConfig, TaskStatus } from '../../types';

const DEFAULTS: TasksWidgetConfig = { items: [], viewMode: 'board' };

const STATUS_COLORS: Record<TaskStatus, string> = {
  'todo': 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  'in-progress': 'bg-amber-400/20 text-amber-300 border-amber-400/30',
  'postponed': 'bg-purple-400/20 text-purple-300 border-purple-400/30',
  'done': 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
  'closed': 'bg-white/10 text-white/40 border-white/10',
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'postponed': 'Postponed',
  'done': 'Done',
  'closed': 'Closed',
};

const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'postponed', 'done', 'closed'];

const TasksWidget: React.FC = () => {
  const [config, setConfig] = useState<TasksWidgetConfig>(DEFAULTS);
  const [newText, setNewText] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');

  useEffect(() => {
    getWidgetConfig('tasks', DEFAULTS, (loaded) => {
      setConfig(loaded);
      setViewMode(loaded.viewMode === 'timeline' ? 'list' : (loaded.viewMode as any) || 'board');
    });
  }, []);

  const save = (items: Task[]) => {
    const updated = { ...config, items, viewMode };
    setConfig(updated);
    setWidgetConfig('tasks', updated);
  };

  const handleAdd = () => {
    if (!newText.trim()) return;
    const task: Task = {
      id: crypto.randomUUID?.() || String(Date.now()),
      text: newText,
      link: '',
      completed: false,
      date: new Date().toISOString().split('T')[0],
      status: 'todo',
    };
    save([...config.items, task]);
    setNewText('');
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    save(config.items.map(t => t.id === id ? { ...t, status, completed: status === 'done' } : t));
  };

  const handleRemove = (id: string) => {
    save(config.items.filter(t => t.id !== id));
  };

  const filteredTasks = filter === 'all' ? config.items : config.items.filter(t => t.status === filter);

  // Board view
  const renderBoard = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {(['todo', 'in-progress', 'done', 'postponed'] as TaskStatus[]).map(status => (
        <div key={status}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[status]}`}>
              {STATUS_LABELS[status]}
            </span>
            <span className="text-[10px] text-white/30">
              {config.items.filter(t => t.status === status).length}
            </span>
          </div>
          <div className="space-y-1.5">
            {config.items.filter(t => t.status === status).map(task => (
              <div key={task.id} className="group bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg p-2.5 transition-all duration-200">
                <p className={`text-xs ${task.completed ? 'line-through text-white/30' : 'text-white/80'}`}>
                  {task.text}
                </p>
                <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {STATUSES.filter(s => s !== status).slice(0, 3).map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(task.id, s)}
                      className={`text-[8px] px-1.5 py-0.5 rounded border ${STATUS_COLORS[s]} cursor-pointer hover:opacity-80`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                  <button
                    onClick={() => handleRemove(task.id)}
                    className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-400/30 cursor-pointer hover:opacity-80 ml-auto"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // List view
  const renderList = () => (
    <div className="space-y-1.5">
      {filteredTasks.map(task => (
        <div key={task.id} className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg px-3 py-2 transition-all duration-200">
          <button
            onClick={() => handleStatusChange(task.id, task.completed ? 'todo' : 'done')}
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${
              task.completed ? 'border-emerald-400 bg-emerald-400' : 'border-white/30 hover:border-white/60'
            }`}
          >
            {task.completed && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <span className={`text-xs flex-1 ${task.completed ? 'line-through text-white/30' : 'text-white/80'}`}>
            {task.text}
          </span>
          <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${STATUS_COLORS[task.status]}`}>
            {STATUS_LABELS[task.status]}
          </span>
          <button
            onClick={() => handleRemove(task.id)}
            className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      {filteredTasks.length === 0 && (
        <p className="text-center text-white/30 text-xs py-4">No tasks yet</p>
      )}
    </div>
  );

  return (
    <WidgetCard
      title={`Tasks (${config.items.length})`}
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      headerRight={
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'text-white/80 bg-white/10' : 'text-white/30 hover:text-white/60'}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('board')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'board' ? 'text-white/80 bg-white/10' : 'text-white/30 hover:text-white/60'}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" />
            </svg>
          </button>
        </div>
      }
    >
      {/* Add task input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add a task..."
          className="glass-input text-xs flex-1"
        />
        <button onClick={handleAdd} className="glass-button text-xs px-3">Add</button>
      </div>

      {/* Filter (list view only) */}
      {viewMode === 'list' && (
        <div className="flex gap-1 mb-3 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`text-[10px] px-2 py-1 rounded-full border cursor-pointer transition-all ${filter === 'all' ? 'bg-white/15 text-white border-white/20' : 'text-white/40 border-white/5 hover:border-white/10'}`}
          >
            All
          </button>
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-[10px] px-2 py-1 rounded-full border cursor-pointer transition-all ${filter === s ? STATUS_COLORS[s] : 'text-white/40 border-white/5 hover:border-white/10'}`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      )}

      {viewMode === 'board' ? renderBoard() : renderList()}
    </WidgetCard>
  );
};

export default TasksWidget;
