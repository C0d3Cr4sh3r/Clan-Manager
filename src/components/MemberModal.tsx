import React, { useState, useEffect } from 'react';
import { useClan } from '../context/ClanContext';
import { Member, MemberRole } from '../types';
import { X } from 'lucide-react';
import { ROLE_LABELS } from '../data/initialData';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: Member | null;
}

const AVATAR_COLORS = [
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#ef4444', // Red
  '#14b8a6', // Teal
];

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  memberToEdit,
}) => {
  const { addMember, updateMember } = useClan();

  const [name, setName] = useState('');
  const [role, setRole] = useState<MemberRole>('gatherer');
  const [status, setStatus] = useState<'online' | 'ingame' | 'offline' | 'busy'>('ingame');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [discordTag, setDiscordTag] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name);
      setRole(memberToEdit.role);
      setStatus(memberToEdit.status);
      setAvatarColor(memberToEdit.avatarColor);
      setDiscordTag(memberToEdit.discordTag || '');
      setNotes(memberToEdit.notes || '');
    } else {
      setName('');
      setRole('gatherer');
      setStatus('online');
      setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
      setDiscordTag('');
      setNotes('');
    }
  }, [memberToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (memberToEdit) {
      updateMember(memberToEdit.id, {
        name: name.trim(),
        role,
        status,
        avatarColor,
        discordTag: discordTag.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      addMember({
        name: name.trim(),
        role,
        status,
        avatarColor,
        discordTag: discordTag.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>👤</span>
            <span>{memberToEdit ? 'Clan-Mitglied bearbeiten' : 'Neues Clan-Mitglied hinzufügen'}</span>
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
          
          {/* Name & Avatar Color */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Spielername / Gamertag *
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shadow shrink-0"
                style={{ backgroundColor: avatarColor }}
              >
                {name ? name.charAt(0).toUpperCase() : '?'}
              </div>
              <input
                type="text"
                required
                placeholder="z. B. Max, Susi, Alex..."
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Color Picker Palette */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">
              Profilfarbe
            </label>
            <div className="flex items-center gap-2">
              {AVATAR_COLORS.map(color => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setAvatarColor(color)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    avatarColor === color ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Clan-Rolle
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as MemberRole)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {Object.entries(ROLE_LABELS).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.icon} {info.label} ({info.desc})
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Aktivitätsstatus
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ingame">🎮 Im Spiel (Aktiv am Farmen)</option>
              <option value="online">🟢 Online (Bereit für Zuweisung)</option>
              <option value="busy">🟡 Beschäftigt (Eigener Task)</option>
              <option value="offline">⚪ Offline</option>
            </select>
          </div>

          {/* Discord Tag */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Discord Tag (optional)
            </label>
            <input
              type="text"
              placeholder="z. B. Gamer#1234 oder @max"
              value={discordTag}
              onChange={e => setDiscordTag(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Spezialität / Notizen
            </label>
            <input
              type="text"
              placeholder="z. B. Hauptsammler für Holz, Tier-3 Axt vorhanden..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
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
              {memberToEdit ? 'Speichern' : 'Hinzufügen'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
