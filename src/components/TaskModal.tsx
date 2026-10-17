import React, { useState, useEffect } from 'react';
import { useClan } from '../context/ClanContext';
import { Task, TaskCategory, TaskPriority, TaskSubstep } from '../types';
import { X, Plus, Trash2, Sparkles } from 'lucide-react';
import { CATEGORY_LABELS } from '../data/initialData';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
}) => {
  const { games, activeGameId, members, projects, addTask, updateTask } = useClan();

  const [title, setTitle] = useState('');
  const [gameId, setGameId] = useState(activeGameId);
  const [projectId, setProjectId] = useState<string>('');
  const [category, setCategory] = useState<TaskCategory>('resource');
  const [assignedMemberId, setAssignedMemberId] = useState('');
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  const [targetAmount, setTargetAmount] = useState<number>(50);
  const [unit, setUnit] = useState('Stück');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [subtasks, setSubtasks] = useState<TaskSubstep[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setGameId(taskToEdit.gameId);
      setProjectId(taskToEdit.projectId || '');
      setCategory(taskToEdit.category);
      setAssignedMemberId(taskToEdit.assignedMemberId || '');
      setCurrentAmount(taskToEdit.currentAmount);
      setTargetAmount(taskToEdit.targetAmount);
      setUnit(taskToEdit.unit || 'Stück');
      setPriority(taskToEdit.priority);
      setLocation(taskToEdit.location || '');
      setNotes(taskToEdit.notes || '');
      setSubtasks(taskToEdit.subtasks || []);
    } else {
      // Defaults for new task
      setTitle('');
      setGameId(activeGameId);
      setProjectId('');
      setCategory('resource');
      setAssignedMemberId('');
      setCurrentAmount(0);
      setTargetAmount(50);
      setUnit('Stück');
      setPriority('medium');
      setLocation('');
      setNotes('');
      setSubtasks([]);
    }
  }, [taskToEdit, activeGameId, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: `sub_${Date.now()}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        gameId,
        projectId: projectId || undefined,
        category,
        assignedMemberId,
        currentAmount: Number(currentAmount) || 0,
        targetAmount: Math.max(1, Number(targetAmount) || 1),
        unit: unit.trim() || 'Stück',
        priority,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
        subtasks,
      });
    } else {
      addTask({
        title: title.trim(),
        gameId,
        projectId: projectId || undefined,
        category,
        assignedMemberId,
        currentAmount: Number(currentAmount) || 0,
        targetAmount: Math.max(1, Number(targetAmount) || 1),
        unit: unit.trim() || 'Stück',
        priority,
        status: Number(currentAmount) >= Number(targetAmount) ? 'completed' : 'in_progress',
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
        subtasks,
      });
    }

    onClose();
  };

  const gameProjects = projects.filter(p => p.gameId === gameId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {taskToEdit ? '✏️' : '📋'}
            </span>
            <h2 className="text-base font-bold text-white">
              {taskToEdit ? 'Aufgabe / Ressource bearbeiten' : 'Neue Aufgabe / Ressource planen'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Bezeichnung / Gegenstand *
            </label>
            <input
              type="text"
              required
              placeholder="z. B. Grasplatten beschaffen, Spinnenfäden sammeln..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Game & Project Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Spiel</label>
              <select
                value={gameId}
                onChange={e => setGameId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {games.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.icon} {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Projekt (optional)</label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Kein Projekt (Freistehend)</option>
                {gameProjects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Assigned Member */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Aufgabentyp</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TaskCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.icon} {info.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Zuständiges Clan-Mitglied</label>
              <select
                value={assignedMemberId}
                onChange={e => setAssignedMemberId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Offen für jeden (Clan-Pool)</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amounts & Unit */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Bereits im Lager (Haben)</label>
              <input
                type="number"
                min="0"
                value={currentAmount}
                onChange={e => setCurrentAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Zielmenge (Quote)</label>
              <input
                type="number"
                min="1"
                required
                value={targetAmount}
                onChange={e => setTargetAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Einheit</label>
              <input
                type="text"
                placeholder="Platten, Fäden..."
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Quick calculation preview */}
            <div className="col-span-3 pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80">
              <span>Fortschritts-Vorschau:</span>
              <span className="font-mono text-amber-300 font-semibold">
                {currentAmount >= targetAmount ? (
                  <span className="text-emerald-400">Vollständig gedeckt! 🎉</span>
                ) : (
                  `Noch ${Math.max(0, targetAmount - currentAmount)} ${unit} benötigt`
                )}
              </span>
            </div>
          </div>

          {/* Priority & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Priorität</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="low">Niedrig (Wenn Zeit ist)</option>
                <option value="medium">Mittel (Reguläres Ziel)</option>
                <option value="high">Hoch (Wichtig für Session)</option>
                <option value="urgent">Dringend (Sofort benötigt)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Fundort / Notiz-Ort</label>
              <input
                type="text"
                placeholder="z. B. Großer Eichenbaum, Hecken-Gebiet..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Zusätzliche Clan-Hinweise</label>
            <textarea
              rows={2}
              placeholder="z. B. Insekten-Axt Stufe 2 erforderlich, Kistenlager 3 verwenden..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Raid / Building Subtasks */}
          <div className="border-t border-slate-800 pt-3">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Voraussetzungen / Phasen (z. B. für Raids & Großbau)
              </label>
              <span className="text-[11px] text-slate-500">{subtasks.length} Schritte</span>
            </div>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Neuen Schritt hinzufügen (z. B. Gift-Mutation aktivieren)..."
                value={newSubtaskTitle}
                onChange={e => setNewSubtaskTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {subtasks.map(s => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-2 p-1.5 bg-slate-950/60 rounded border border-slate-800"
                  >
                    <span className="text-slate-300 truncate">{s.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(s.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition-all shadow-md hover:shadow-emerald-500/20"
            >
              {taskToEdit ? 'Änderungen speichern' : 'Aufgabe erstellen'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
