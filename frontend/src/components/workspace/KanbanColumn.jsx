import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

export default function KanbanColumn({
  status,
  title,
  tasks,
  onOpenTask,
  onAddTask,
  onDragStart,
  onDropTask,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const columnThemes = {
    todo: {
      dot: 'bg-slate-400 shadow-slate-500/50',
      badge: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
      borderGlow: 'border-blue-500/60 shadow-blue-500/20',
    },
    'in-progress': {
      dot: 'bg-blue-500 shadow-blue-500/50',
      badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
      borderGlow: 'border-blue-500 shadow-blue-500/30',
    },
    'in-review': {
      dot: 'bg-purple-500 shadow-purple-500/50',
      badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
      borderGlow: 'border-purple-500 shadow-purple-500/30',
    },
    done: {
      dot: 'bg-emerald-500 shadow-emerald-500/50',
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      borderGlow: 'border-emerald-500 shadow-emerald-500/30',
    },
  };

  const theme = columnThemes[status] || columnThemes.todo;

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onDropTask(status);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col flex-1 min-w-[280px] max-w-sm rounded-2xl p-3 bg-slate-950/40 border transition-all duration-200 backdrop-blur-md ${
        isDragOver
          ? `${theme.borderGlow} bg-slate-900/80 ring-2 ring-purple-500/40`
          : 'border-purple-500/15'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${theme.dot} shadow-sm`}></span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {title}
          </h3>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${theme.badge}`}>
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(status)}
          className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task Cards Container */}
      <div className="flex-1 space-y-2.5 overflow-y-auto min-h-[350px] pr-0.5">
        {tasks.map((task) => (
          <TaskCard
            key={task._id || task.id}
            task={task}
            onOpen={onOpenTask}
            onDragStart={onDragStart}
          />
        ))}

        {tasks.length === 0 && (
          <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-purple-500/15 text-center p-4">
            <p className="text-xs text-slate-400">No tickets in {title}</p>
            <button
              onClick={() => onAddTask(status)}
              className="mt-2 text-[11px] font-semibold text-purple-400 hover:text-purple-300 cursor-pointer"
            >
              + Create Issue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
