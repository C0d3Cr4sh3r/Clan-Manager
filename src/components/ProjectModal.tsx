import React, { useState, useEffect } from 'react';
import { useClan } from '../context/ClanContext';
import { Project, TaskPriority } from '../types';
import { X } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const { games, activeGameId, addProject, updateProject } = useClan();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🏛️');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('high');
  const [status, setStatus] = useState<'active' | 'completed' | 'paused'>('active');

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setDescription(projectToEdit.description);
      setIcon(projectToEdit.icon || '🏛️');
      setTargetDate(projectToEdit.targetDate || '');
      setPriority(projectToEdit.priority);
      setStatus(projectToEdit.status);
    } else {
      setTitle('');
      setDescription('');
      setIcon('🏛️');
      setTargetDate('');
      setPriority('high');
      setStatus('active');
    }
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (projectToEdit) {
      updateProject(projectToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        icon,
        targetDate: targetDate || undefined,
        priority,
        status,
      });
    } else {
      addProject({
        gameId: activeGameId,
        title: title.trim(),
        description: description.trim(),
        icon,
        targetDate: targetDate || undefined,
        priority,
        status,
      });
    }

    onClose();
  };

  const ICONS = ['🏛️', '🌳', '🕷️', '🏰', '⚔️', '⛏️', '⚡', '💣', '🛡️', '📦'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>{icon}</span>
            <span>{projectToEdit ? 'Projekt / Raid bearbeiten' : 'Neues Großprojekt / Raid anlegen'}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Projekt- / Raid-Titel *
            </label>
            <input
              type="text"
              required
              placeholder="z. B. Große Eichen-Baumbasis, Brutmutter-Raid..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Icon selector */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">
              Projekt-Symbol
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {ICONS.map(ic => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center bg-slate-950 border transition-all ${
                    icon === ic ? 'border-emerald-400 bg-emerald-500/10 scale-105' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Ziel & Beschreibung
            </label>
            <textarea
              rows={3}
              placeholder="Was soll in diesem Vorhaben gebaut oder besiegt werden? Wer koordiniert?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Priority & Target Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Priorität</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="low">Niedrig</option>
                <option value="medium">Mittel</option>
                <option value="high">Hoch</option>
                <option value="urgent">Dringend</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Ziel-Datum (optional)</label>
              <input
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="active">Aktiv in Arbeit</option>
              <option value="paused">Pausiert</option>
              <option value="completed">Abgeschlossen / Siegreich</option>
            </select>
          </div>

          {/* Submit */}
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
              className="px-5 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition-all shadow"
            >
              {projectToEdit ? 'Speichern' : 'Projekt erstellen'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
