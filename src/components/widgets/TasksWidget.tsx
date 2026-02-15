import React, { useState, useEffect } from 'react';
import WidgetCard from './WidgetCard';
import { getWidgetConfig, setWidgetConfig } from '../../utils/storage';
import { Task, TasksWidgetConfig, TaskStatus } from '../../types';

const DEFAULTS: TasksWidgetConfig = { items: [], viewMode: 'list' };

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

const STATUS_DOT: Record<TaskStatus, string> = {
  'todo': 'bg-blue-400',
  'in-progress': 'bg-amber-400',
  'postponed': 'bg-purple-400',
  'done': 'bg-emerald-400',
  'closed': 'bg-white/30',
};

const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'postponed', 'done', 'closed'];

const TasksWidget: React.FC = () => {
  const [config, setConfig] = useState<TasksWidgetConfig>(DEFAULTS);
  const [newText, setNewText] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  useEffect(() => {
    getWidgetConfig('tasks', DEFAULTS, (loaded) => {
      setConfig(loaded);
      setViewMode(loaded.viewMode === 'timeline' ? 'list' : (loaded.viewMode as any) || 'list');
    });
  }, []);

  const save = (items: Task[], mode?: 'list' | 'board') => {
    const updated = { ...config, items, viewMode: mode || viewMode };
    setConfig(updated);
    setWidgetConfig('tasks', updated);
  };

  const handleAdd = () => {
    if (!newText.trim()) return;
    const task: Task = {
      id: crypto.randomUUID?.() || String(Date.now()),
      text: newText.trim(),
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

  const switchView = (mode: 'list' | 'board') => {
    setViewMode(mode);
    save(config.items, mode);
  };

  const filteredTasks = filter === 'all' ? config.items : config.items.filter(t => t.status === filter);
  const activeTasks = config.items.filter(t => t.status !== 'done' && t.status !== 'closed').length;

  // Board view
  const renderBoard = () => {
    const boardStatuses: TaskStatus[] = ['todo', 'in-progress', 'done', 'postponed'];
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {boardStatuses.map(status => {
          const items = config.items.filter(t => t.status === status);
          return (
            <div key={status} className="min-w-0">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-2.5 px-1">
                <span className={`w-2 h-2 rounded-full ${STATUS_DOT[status]}`} />
                <span className="text-[11px] font-medium text-white/60">{STATUS_LABELS[status]}</span>
                <span className="text-[10px] text-white/25 ml-auto">{items.length}</span>
              </div>
              {/* Cards */}
              <div className="space-y-2">
                {items.map(task => (
                  <div
                    key={task.id}
                    className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl p-3 transition-all duration-200 cursor-default"
                  >
                    <p
                      className={`text-xs leading-relaxed break-words ${
                        expandedTask === task.id ? '' : 'line-clamp-3'
                      } ${task.completed ? 'line-through text-white/30' : 'text-white/80'}`}
                      onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                      title={task.text}
                      style={{ cursor: task.text.length > 60 ? 'pointer' : 'default' }}
                    >
                      {task.text}
                    </p>
                    {task.date && (
                      <p className="text-[10px] text-white/20 mt-1.5">{task.date}</p>
                    )}
                    {/* Actions — show on hover */}
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      {STATUSES.filter(s => s !== status).slice(0, 3).map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(task.id, s)}
                          className={`text-[9px] px-1.5 py-0.5 rounded-md border cursor-pointer hover:brightness-125 transition-all ${STATUS_COLORS[s]}`}
                          title={`Move to ${STATUS_LABELS[s]}`}
                        >
                          {STATUS_LABELS[s]}
                        </button>
                      ))}
                      <button
                        onClick={() => handleRemove(task.id)}
                        className="ml-auto p-0.5 rounded text-white/20 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-[10px] text-white/15">No items</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // List view
  const renderList = () => (
    <div className="space-y-1">
      {filteredTasks.map(task => (
        <div
          key={task.id}
          className="group flex items-start gap-3 bg-white/[0.03] hover:bg-white/[0.07] border border-transparent hover:border-white/5 rounded-xl px-3 py-2.5 transition-all duration-200"
        >
          {/* Checkbox */}
          <button
            onClick={() => handleStatusChange(task.id, task.completed ? 'todo' : 'done')}
            className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-all duration-200 ${
              task.completed
                ? 'border-emerald-400 bg-emerald-400/20'
                : 'border-white/25 hover:border-white/50'
            }`}
          >
            {task.completed && (
              <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Text + meta */}
          <div className="flex-1 min-w-0">
            <p
              className={`text-[13px] leading-relaxed break-words ${
                expandedTask === task.id ? '' : 'line-clamp-2'
              } ${task.completed ? 'line-through text-white/30' : 'text-white/80'}`}
              onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
              style={{ cursor: task.text.length > 80 ? 'pointer' : 'default' }}
              title={task.text.length > 80 ? task.text : undefined}
            >
              {task.text}
            </p>
            {task.date && (
              <p className="text-[10px] text-white/20 mt-0.5">{task.date}</p>
            )}
          </div>

          {/* Status badge */}
          <div className="shrink-0 flex items-center gap-1.5 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[task.status]}`} />
            <select
              value={task.status}
              onChange={e => handleStatusChange(task.id, e.target.value as TaskStatus)}
              className="text-[10px] bg-transparent text-white/40 focus:outline-none cursor-pointer appearance-none hover:text-white/60 transition-colors"
              title="Change status"
            >
              {STATUSES.map(s => (
                <option key={s} value={s} className="bg-slate-800 text-white">{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          {/* Delete */}
          <button
            onClick={() => handleRemove(task.id)}
            className="shrink-0 mt-0.5 p-1 rounded-lg text-white/0 group-hover:text-white/20 hover:!text-red-400 transition-all cursor-pointer"
            title="Delete task"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      {filteredTasks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-white/20 text-xs">
            {filter === 'all' ? 'No tasks yet — add one above' : `No ${STATUS_LABELS[filter as TaskStatus]} tasks`}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <WidgetCard
      title="Tasks"
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      headerRight={
        <div className="flex items-center gap-1.5">
          {activeTasks > 0 && (
            <span className="text-[10px] text-white/30 tabular-nums mr-1">{activeTasks} active</span>
          )}
          <button
            onClick={() => switchView('list')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'text-white/80 bg-white/10' : 'text-white/30 hover:text-white/60'}`}
            title="List view"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>
          <button
            onClick={() => switchView('board')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'board' ? 'text-white/80 bg-white/10' : 'text-white/30 hover:text-white/60'}`}
            title="Board view"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
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
        <button
          onClick={handleAdd}
          disabled={!newText.trim()}
          className={`glass-button text-xs px-3 ${!newText.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          Add
        </button>
      </div>

      {/* Filter (list view only) */}
      {viewMode === 'list' && (
        <div className="flex gap-1 mb-3 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`text-[10px] px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
              filter === 'all' ? 'bg-white/15 text-white border-white/20' : 'text-white/35 border-white/5 hover:border-white/10 hover:text-white/50'
            }`}
          >
            All ({config.items.length})
          </button>
          {STATUSES.filter(s => s !== 'closed').map(s => {
            const count = config.items.filter(t => t.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                  filter === s ? STATUS_COLORS[s] : 'text-white/35 border-white/5 hover:border-white/10 hover:text-white/50'
                }`}
              >
                {STATUS_LABELS[s]} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      )}

      {viewMode === 'board' ? renderBoard() : renderList()}
    </WidgetCard>
  );
};

export default TasksWidget;
