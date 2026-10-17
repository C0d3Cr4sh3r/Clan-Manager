import React, { useState } from 'react';
import { Task } from '../types';
import { useClan } from '../context/ClanContext';
import {
  Check,
  CheckCircle2,
  Plus,
  Minus,
  Edit2,
  Trash2,
  ArrowUpDown,
  MapPin,
} from 'lucide-react';
import { CATEGORY_LABELS, ROLE_LABELS } from '../data/initialData';

interface TaskTableViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

type SortKey = 'title' | 'member' | 'progress' | 'remaining' | 'category';

export const TaskTableView: React.FC<TaskTableViewProps> = ({ tasks, onEdit }) => {
  const { members, projects, adjustTaskAmount, deleteTask, setTaskAmount } = useClan();
  const [sortKey, setSortKey] = useState<SortKey>('progress');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let comparison = 0;
    if (sortKey === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortKey === 'member') {
      const memA = members.find(m => m.id === a.assignedMemberId)?.name || '';
      const memB = members.find(m => m.id === b.assignedMemberId)?.name || '';
      comparison = memA.localeCompare(memB);
    } else if (sortKey === 'progress') {
      const progA = a.currentAmount / Math.max(1, a.targetAmount);
      const progB = b.currentAmount / Math.max(1, b.targetAmount);
      comparison = progA - progB;
    } else if (sortKey === 'remaining') {
      const remA = Math.max(0, a.targetAmount - a.currentAmount);
      const remB = Math.max(0, b.targetAmount - b.currentAmount);
      comparison = remA - remB;
    } else if (sortKey === 'category') {
      comparison = a.category.localeCompare(b.category);
    }
    return sortAsc ? comparison : -comparison;
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow-md">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium">
            <th className="py-3 px-4">
              <button
                onClick={() => handleSort('title')}
                className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
              >
                <span>Gegenstand / Aufgabe</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th className="py-3 px-4">
              <button
                onClick={() => handleSort('category')}
                className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
              >
                <span>Kategorie</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th className="py-3 px-4">
              <button
                onClick={() => handleSort('member')}
                className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
              >
                <span>Zuständig</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th className="py-3 px-4 text-right">
              <button
                onClick={() => handleSort('progress')}
                className="flex items-center gap-1.5 ml-auto hover:text-slate-200 transition-colors"
              >
                <span>Vorrat / Ziel</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th className="py-3 px-4 text-right">
              <button
                onClick={() => handleSort('remaining')}
                className="flex items-center gap-1.5 ml-auto hover:text-slate-200 transition-colors"
              >
                <span>Noch benötigt</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th className="py-3 px-4">Fortschritt</th>
            <th className="py-3 px-4 text-center">Schnell-Buchung</th>
            <th className="py-3 px-4 text-right">Aktionen</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {sortedTasks.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-8 text-center text-slate-500">
                Keine Aufgaben für die aktuellen Filter gefunden.
              </td>
            </tr>
          ) : (
            sortedTasks.map(task => {
              const assignedMember = members.find(m => m.id === task.assignedMemberId);
              const project = projects.find(p => p.id === task.projectId);
              const remaining = Math.max(0, task.targetAmount - task.currentAmount);
              const percentage = Math.min(100, Math.round((task.currentAmount / Math.max(1, task.targetAmount)) * 100));
              const isCompleted = task.currentAmount >= task.targetAmount || task.status === 'completed';
              const cat = CATEGORY_LABELS[task.category] || CATEGORY_LABELS.resource;

              return (
                <tr
                  key={task.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isCompleted ? 'bg-emerald-950/10' : ''
                  }`}
                >
                  {/* Title & Project */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                      <span className={isCompleted ? 'line-through text-slate-400' : ''}>
                        {task.title}
                      </span>
                      {isCompleted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    {project && (
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                        Projekt: {project.title}
                      </div>
                    )}
                    {task.location && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                        <span className="truncate">{task.location}</span>
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                    <span className="flex items-center gap-1">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                  </td>

                  {/* Member */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {assignedMember ? (
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: assignedMember.avatarColor }}
                        />
                        <span className="font-medium text-slate-200">{assignedMember.name}</span>
                        <span className="text-[11px] text-slate-500">
                          ({ROLE_LABELS[assignedMember.role]?.label || assignedMember.role})
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Offener Pool</span>
                    )}
                  </td>

                  {/* Vorrat / Ziel */}
                  <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                    <span className="font-bold text-white text-sm">{task.currentAmount}</span>
                    <span className="text-slate-400 ml-1">/ {task.targetAmount} {task.unit}</span>
                  </td>

                  {/* Noch benötigt */}
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono tabular-nums">
                    {isCompleted ? (
                      <span className="text-emerald-400 font-semibold flex items-center justify-end gap-1">
                        <Check className="w-3 h-3" />
                        Erfüllt
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold">
                        {remaining} {task.unit}
                      </span>
                    )}
                  </td>

                  {/* Progress bar */}
                  <td className="py-3 px-4 w-32">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isCompleted ? 'bg-emerald-400' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="font-mono tabular-nums text-[11px] text-slate-400 w-8 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </td>

                  {/* Schnell-Buchung (-10, -1, +1, +10) */}
                  <td className="py-3 px-4 whitespace-nowrap text-center">
                    <div className="inline-flex items-center gap-1 bg-slate-950/60 p-1 rounded border border-slate-800">
                      <button
                        onClick={() => adjustTaskAmount(task.id, -10)}
                        disabled={task.currentAmount <= 0}
                        className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 hover:text-white disabled:opacity-30"
                        title="-10"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => adjustTaskAmount(task.id, -1)}
                        disabled={task.currentAmount <= 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="-1"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => adjustTaskAmount(task.id, 1)}
                        className="p-1 text-emerald-400 hover:text-emerald-300"
                        title="+1"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => adjustTaskAmount(task.id, 10)}
                        className="px-1.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-400 hover:text-emerald-300"
                        title="+10"
                      >
                        +10
                      </button>
                    </div>
                  </td>

                  {/* Actions (Edit / Delete / Complete) */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          if (isCompleted) {
                            setTaskAmount(task.id, Math.max(0, task.targetAmount - 1));
                          } else {
                            setTaskAmount(task.id, task.targetAmount);
                          }
                        }}
                        className={`p-1.5 rounded transition-colors ${
                          isCompleted
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            : 'text-emerald-400 hover:bg-emerald-950/50'
                        }`}
                        title={isCompleted ? 'Als unvollständig markieren' : 'Vollständig abschließen'}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                        title="Bearbeiten"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                        title="Löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
