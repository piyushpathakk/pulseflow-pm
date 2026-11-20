import React from 'react';
import { Bug, Sparkles, CheckSquare, Zap, MessageSquare, Paperclip, Calendar, AlertTriangle } from 'lucide-react';

export default function TaskCard({ task, onOpen, onDragStart }) {
  const typeIcons = {
    bug: <Bug className="w-3.5 h-3.5 text-rose-400" />,
    feature: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
    task: <CheckSquare className="w-3.5 h-3.5 text-blue-400" />,
    improvement: <Zap className="w-3.5 h-3.5 text-emerald-400" />,
  };

  const priorityColors = {
    urgent: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    high: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    medium: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    low: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  };

  const severityBadges = {
    blocker: 'bg-rose-950/60 text-rose-300 border-rose-500 shadow-sm shadow-rose-500/30',
    critical: 'bg-orange-950/60 text-orange-300 border-orange-500',
    major: 'bg-amber-950/60 text-amber-300 border-amber-500/50',
    minor: 'bg-slate-900 text-slate-400 border-slate-700',
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'done';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={() => onOpen(task)}
      className="glass-card group relative rounded-xl p-3.5 cursor-grab active:cursor-grabbing border border-purple-500/15 bg-slate-900/60 hover:border-purple-500/40 hover:bg-slate-900/80 transition-all select-none shadow-md"
    >
      {/* Top Header: Key + Type + Severity */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="p-1 rounded-md bg-slate-800/80 border border-purple-500/10">
            {typeIcons[task.type] || typeIcons.task}
          </span>
          <span className="font-mono text-[11px] font-bold text-purple-300 tracking-wider">
            {task.key}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {task.type === 'bug' && task.severity && (
            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${severityBadges[task.severity] || severityBadges.minor}`}>
              {task.severity}
            </span>
          )}
          <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded border ${priorityColors[task.priority] || priorityColors.medium}`}>
            {task.priority}
          </span>
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-xs font-semibold text-slate-100 group-hover:text-purple-200 transition-colors line-clamp-2 leading-relaxed">
        {task.title}
      </h4>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {task.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-500/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Footer: Assignee + Deadline + Counts */}
      <div className="mt-3.5 pt-2.5 border-t border-purple-500/10 flex items-center justify-between text-slate-400 text-[11px]">
        {/* Assignee Avatar */}
        <div className="flex items-center gap-1.5">
          {task.assignee ? (
            <img
              src={task.assignee.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
              alt={task.assignee.name}
              title={`Assigned to ${task.assignee.name}`}
              className="w-5 h-5 rounded-full object-cover border border-purple-500/30"
            />
          ) : (
            <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] text-slate-400">
              ?
            </span>
          )}
          <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
            {task.assignee ? task.assignee.name.split(' ')[0] : 'Unassigned'}
          </span>
        </div>

        {/* Metadata Badges */}
        <div className="flex items-center gap-2 text-slate-400">
          {task.deadline && (
            <div className={`flex items-center gap-1 text-[10px] ${isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
              {isOverdue && <AlertTriangle className="w-3 h-3 text-rose-400" />}
              <span>{new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          )}

          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center gap-0.5" title={`${task.attachments.length} attachments`}>
              <Paperclip className="w-3 h-3 text-slate-400" />
              <span className="text-[10px]">{task.attachments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
