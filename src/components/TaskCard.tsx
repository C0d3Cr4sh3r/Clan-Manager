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
  MapPin,
  ListChecks,
} from 'lucide-react';
import { CATEGORY_LABELS } from '../data/initialData';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { members, adjustTaskAmount, setTaskAmount, deleteTask, toggleSubtask, projects } = useClan();
  const [showDetails, setShowDetails] = useState(false);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [inputVal, setInputVal] = useState(task.currentAmount.toString());

  const assignedMember = members.find(m => m.id === task.assignedMemberId);
  const project = projects.find(p => p.id === task.projectId);

  const percentage = Math.min(100, Math.round((task.currentAmount / Math.max(1, task.targetAmount)) * 100));
  const remaining = Math.max(0, task.targetAmount - task.currentAmount);
  const isCompleted = task.currentAmount >= task.targetAmount || task.status === 'completed';
  const categoryInfo = CATEGORY_LABELS[task.category] || CATEGORY_LABELS.resource;

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(inputVal, 10);
    if (!isNaN(parsed)) {
      setTaskAmount(task.id, parsed);
    }
    setIsEditingAmount(false);
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 flex flex-col justify-between p-4 ${
        isCompleted
          ? 'bg-slate-900/60 border-emerald-500/30'
          : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-sm'
      }`}
    >
      <div>
        {/* Top Meta Line: Member & Category */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-2 truncate">
            {assignedMember ? (
              <div className="flex items-center gap-1.5 font-medium text-slate-200">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: assignedMember.avatarColor }}
                />
                <span className="truncate">{assignedMember.name}</span>
              </div>
            ) : (
              <span className="text-slate-500 italic">Offener Pool</span>
            )}
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="truncate text-slate-400">
              {categoryInfo.icon} {categoryInfo.label}
            </span>
          </div>

          {/* Quick Edit & Delete */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 transition-colors"
              title="Bearbeiten"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
              title="Löschen"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Task Title */}
        <h3 className={`text-base font-semibold text-white tracking-tight flex items-start justify-between gap-2 ${
          isCompleted ? 'line-through text-slate-400' : ''
        }`}>
          <span>{task.title}</span>
          {isCompleted && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
          )}
        </h3>

        {/* Optional Project Tag */}
        {project && (
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
            Projekt: {project.title}
          </div>
        )}

        {/* Amount & Remaining Callout */}
        <div className="mt-4 mb-2 flex items-baseline justify-between">
          <div>
            {isEditingAmount ? (
              <form onSubmit={handleAmountSubmit} className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  className="w-16 px-1.5 py-0.5 text-sm font-mono font-bold bg-slate-950 border border-emerald-500 rounded text-white focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1 text-xs bg-emerald-500 text-slate-950 font-bold rounded"
                >
                  OK
                </button>
              </form>
            ) : (
              <button
                onClick={() => {
                  setInputVal(task.currentAmount.toString());
                  setIsEditingAmount(true);
                }}
                className="group flex items-baseline gap-1"
                title="Klicken zum manuellen Eintippen"
              >
                <span className="text-xl font-bold font-mono tabular-nums text-white group-hover:text-emerald-400 transition-colors">
                  {task.currentAmount}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  / {task.targetAmount} {task.unit}
                </span>
              </button>
            )}
          </div>

          <div>
            {isCompleted ? (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Erfüllt
              </span>
            ) : (
              <span className="text-xs font-semibold text-amber-300">
                Noch <strong className="font-mono tabular-nums text-sm text-amber-400">{remaining}</strong> {task.unit}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted ? 'bg-emerald-400' : 'bg-emerald-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Stepper Controls & Complete Button */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => adjustTaskAmount(task.id, -1)}
            disabled={task.currentAmount <= 0}
            className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 flex items-center justify-center transition-colors text-xs font-bold"
            title="1 abziehen"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => adjustTaskAmount(task.id, 1)}
            className="px-2.5 h-7 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors"
            title="1 hinzufügen"
          >
            +1
          </button>
          <button
            onClick={() => adjustTaskAmount(task.id, 10)}
            className="px-2.5 h-7 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors"
            title="10 hinzufügen"
          >
            +10
          </button>
        </div>

        <button
          onClick={() => {
            if (isCompleted) {
              setTaskAmount(task.id, Math.max(0, task.targetAmount - 1));
            } else {
              setTaskAmount(task.id, task.targetAmount);
            }
          }}
          className={`px-3 h-7 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
            isCompleted
              ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
          }`}
          title={isCompleted ? 'Als unvollständig markieren' : 'Quote sofort als voll markieren'}
        >
          <Check className="w-3 h-3" />
          <span>{isCompleted ? 'Offen' : 'Fertig'}</span>
        </button>
      </div>

      {/* Optional Details Toggle (Location, Notes, Subtasks) */}
      {(task.location || task.notes || (task.subtasks && task.subtasks.length > 0)) && (
        <div className="mt-2 pt-2 border-t border-slate-800/40 text-[11px]">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
          >
            <span>{showDetails ? 'Weniger Details' : 'Details & Ort anzeigen'}</span>
          </button>

          {showDetails && (
            <div className="mt-2 space-y-1.5 text-slate-400 bg-slate-950/40 p-2 rounded border border-slate-800/60">
              {task.location && (
                <div className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Ort: {task.location}</span>
                </div>
              )}
              {task.notes && <p className="italic leading-relaxed">{task.notes}</p>}
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="pt-1.5 border-t border-slate-800/60 space-y-1">
                  <div className="font-semibold text-slate-300 flex items-center gap-1">
                    <ListChecks className="w-3 h-3 text-cyan-400" />
                    <span>Schritte:</span>
                  </div>
                  {task.subtasks.map(st => (
                    <label
                      key={st.id}
                      className="flex items-center gap-1.5 cursor-pointer hover:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => toggleSubtask(task.id, st.id)}
                        className="rounded border-slate-700 bg-slate-900 text-emerald-500 w-3 h-3"
                      />
                      <span className={st.completed ? 'line-through text-slate-500' : ''}>
                        {st.title}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
