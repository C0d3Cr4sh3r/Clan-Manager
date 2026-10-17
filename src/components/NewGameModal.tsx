import React, { useState } from 'react';
import { useClan } from '../context/ClanContext';
import { X } from 'lucide-react';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GAME_ICONS = ['🎮', '🏕️', '⚔️', '🌲', '🚀', '🏰', '🦖', '🐉', '⛏️', '🎯', '🏭', '💀'];

export const NewGameModal: React.FC<NewGameModalProps> = ({ isOpen, onClose }) => {
  const { addCustomGame } = useClan();
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('Survival & Crafting');
  const [icon, setIcon] = useState('🎮');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCustomGame({
      name: name.trim(),
      genre: genre.trim() || 'Survival',
      icon,
      description: description.trim() || 'Benutzerdefiniertes Clan-Spiel',
      defaultCategories: ['resource', 'building', 'crafting', 'raid'],
    });

    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>{icon}</span>
            <span>Neues Spiel für Clan anlegen</span>
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
          
          {/* Game Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Spiel-Titel *
            </label>
            <input
              type="text"
              required
              placeholder="z. B. Conan Exiles, Sons of the Forest, Satisfactory..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">
              Spiel-Icon
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {GAME_ICONS.map(ic => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center bg-slate-950 border transition-all ${
                    icon === ic
                      ? 'border-emerald-400 bg-emerald-500/10 scale-105'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Genre / Kategorie
            </label>
            <input
              type="text"
              placeholder="z. B. Survival, MMORPG, Base-Builder..."
              value={genre}
              onChange={e => setGenre(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Kurzbeschreibung
            </label>
            <textarea
              rows={2}
              placeholder="Worum geht es in diesem Spiel für den Clan?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
            />
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
              Spiel anlegen & aktivieren
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
