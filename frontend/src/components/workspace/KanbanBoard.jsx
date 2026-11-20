import React, { useState, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axiosClient';
import { Search, Filter, Bug, CheckSquare, Plus, Sparkles, User, RefreshCw } from 'lucide-react';

export default function KanbanBoard({
  projectId,
  tasks,
  setTasks,
  onOpenTask,
  onAddTaskWithStatus,
  teamMembers = [],
}) {
  const { socket, joinProject, leaveProject, emitTaskMoved } = useSocket();
  const { showToast } = useToast();

  const [draggedTask, setDraggedTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');

  // Join project Socket room for live collaboration
  useEffect(() => {
    if (projectId) {
      joinProject(projectId);
    }
    return () => {
      if (projectId) leaveProject(projectId);
    };
  }, [projectId]);

  // Listen for live updates from peers
  useEffect(() => {
    if (!socket) return;

    const handlePeerTaskMoved = (data) => {
      setTasks((prev) =>
        prev.map((t) => {
          if ((t._id || t.id) === data.taskId) {
            return { ...t, status: data.status };
          }
          return t;
        })
      );
      if (data.updatedBy) {
        showToast(`${data.updatedBy} updated ticket status`, 'info', 2500);
      }
    };

    const handlePeerTaskCreated = (newTask) => {
      setTasks((prev) => [newTask, ...prev]);
    };

    const handlePeerTaskUpdated = (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === (updatedTask._id || updatedTask.id) ? updatedTask : t))
      );
    };

    const handlePeerTaskDeleted = ({ taskId }) => {
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== taskId));
    };

    socket.on('board_task_moved', handlePeerTaskMoved);
    socket.on('task_created', handlePeerTaskCreated);
    socket.on('task_updated', handlePeerTaskUpdated);
    socket.on('task_deleted', handlePeerTaskDeleted);

    return () => {
      socket.off('board_task_moved', handlePeerTaskMoved);
      socket.off('task_created', handlePeerTaskCreated);
      socket.off('task_updated', handlePeerTaskUpdated);
      socket.off('task_deleted', handlePeerTaskDeleted);
    };
  }, [socket]);

  // Drag Handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('text/plain', task._id || task.id);
  };

  const handleDropTask = async (targetStatus) => {
    if (!draggedTask) return;
    if (draggedTask.status === targetStatus) {
      setDraggedTask(null);
      return;
    }

    const taskId = draggedTask._id || draggedTask.id;
    const oldStatus = draggedTask.status;

    // Optimistic UI state update
    setTasks((prev) =>
      prev.map((t) => ((t._id || t.id) === taskId ? { ...t, status: targetStatus } : t))
    );

    // Broadcast through socket
    emitTaskMoved({
      projectId,
      taskId,
      status: targetStatus,
    });

    try {
      const res = await api.put(`/tasks/${taskId}/status`, { status: targetStatus });
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
    } catch (err) {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === taskId ? { ...t, status: oldStatus } : t))
      );
      showToast('Failed to sync status change with server.', 'error');
    } finally {
      setDraggedTask(null);
    }
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        t.title.toLowerCase().includes(q) ||
        t.key.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;

    if (filterAssignee !== 'all') {
      const aId = (t.assigneeId || t.assignee?._id || t.assignee?.id || '').toString();
      if (filterAssignee === 'unassigned' && aId) return false;
      if (filterAssignee !== 'unassigned' && aId !== filterAssignee) return false;
    }

    return true;
  });

  const columns = [
    { status: 'todo', title: 'To Do' },
    { status: 'in-progress', title: 'In Progress' },
    { status: 'in-review', title: 'In Review' },
    { status: 'done', title: 'Done' },
  ];

  return (
    <div className="space-y-4">
      {/* Filters & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/50 border border-purple-500/15 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[260px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter tasks, bugs, or key..."
              className="glass-input w-full pl-9 pr-3 py-1.5 text-xs rounded-xl"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="glass-input px-3 py-1.5 text-xs rounded-xl cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="bug">Bugs Only</option>
            <option value="feature">Features Only</option>
            <option value="task">Tasks Only</option>
            <option value="improvement">Improvements</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="glass-input px-3 py-1.5 text-xs rounded-xl cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Assignee Filter */}
          {teamMembers.length > 0 && (
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="glass-input px-3 py-1.5 text-xs rounded-xl cursor-pointer"
            >
              <option value="all">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              {teamMembers.map((m) => {
                const u = m.user;
                if (!u) return null;
                return (
                  <option key={u._id || u.id} value={u._id || u.id}>
                    {u.name}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {/* Board Count Indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Showing <strong className="text-white">{filteredTasks.length}</strong> of {tasks.length} items</span>
        </div>
      </div>

      {/* 4-Column Kanban Canvas */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);
          return (
            <KanbanColumn
              key={col.status}
              status={col.status}
              title={col.title}
              tasks={colTasks}
              onOpenTask={onOpenTask}
              onAddTask={onAddTaskWithStatus}
              onDragStart={handleDragStart}
              onDropTask={handleDropTask}
            />
          );
        })}
      </div>
    </div>
  );
}
