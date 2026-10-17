import React from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface KanbanViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({ tasks, onEdit }) => {
  const todoTasks = tasks.filter(t => t.status === 'todo' && t.currentAmount < t.targetAmount);
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress' && t.currentAmount < t.targetAmount);
  const completedTasks = tasks.filter(t => t.status === 'completed' || t.currentAmount >= t.targetAmount);

  const columns = [
    {
      id: 'todo',
      title: 'Noch offen / Wartend',
      icon: '⏳',
      tasks: todoTasks,
      color: 'border-slate-700/60',
      badgeColor: 'text-slate-400',
    },
    {
      id: 'in_progress',
      title: 'Aktiv in Arbeit (Wird gesammelt)',
      icon: '⛏️',
      tasks: inProgressTasks,
      color: 'border-amber-500/30',
      badgeColor: 'text-amber-400',
    },
    {
      id: 'completed',
      title: 'Vollständig erfüllt / Im Lager',
      icon: '✅',
      tasks: completedTasks,
      color: 'border-emerald-500/30',
      badgeColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {columns.map(col => (
        <div
          key={col.id}
          className={`bg-slate-950/40 rounded-2xl border ${col.color} p-4 flex flex-col min-h-[450px] shadow-sm`}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span>{col.icon}</span>
              <h3 className="font-bold text-sm text-white">{col.title}</h3>
            </div>
            <span className={`text-xs font-mono font-bold ${col.badgeColor}`}>
              {col.tasks.length}
            </span>
          </div>

          {/* Cards */}
          <div className="space-y-4 flex-1">
            {col.tasks.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-xs text-slate-500 italic">
                Keine Aufgaben in diesem Status
              </div>
            ) : (
              col.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
