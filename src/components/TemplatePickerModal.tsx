import React, { useState } from 'react';
import { useClan } from '../context/ClanContext';
import { GAME_ITEM_TEMPLATES } from '../data/initialData';
import { ItemTemplate } from '../types';
import { X, Plus, Sparkles, MapPin, Check } from 'lucide-react';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { games, activeGameId, members, projects, addFromTemplate } = useClan();
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeGame = games.find(g => g.id === activeGameId) || games[0];
  const templates: ItemTemplate[] = GAME_ITEM_TEMPLATES[activeGameId] || [
    { name: 'Basis-Baumaterial', category: 'resource', defaultUnit: 'Stück', defaultTarget: 100, icon: '🪵' },
    { name: 'Erze & Metalle', category: 'resource', defaultUnit: 'Barren', defaultTarget: 50, icon: '⛏️' },
    { name: 'Boss-Beschwörung', category: 'raid', defaultUnit: 'Teile', defaultTarget: 5, icon: '💀' },
  ];

  const gameProjects = projects.filter(p => p.gameId === activeGameId);

  const handleSelectTemplate = (template: ItemTemplate) => {
    addFromTemplate(template, selectedMemberId || undefined, selectedProjectId || undefined);
    setAddedItemName(template.name);
    setTimeout(() => {
      setAddedItemName(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Schnell-Vorlagen: {activeGame?.name}
              </h2>
              <p className="text-xs text-slate-400">
                Wähle typische Spielgegenstände für eine 1-Klick-Zuweisung
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assignment Presets (Member & Project) */}
        <div className="px-6 py-3.5 bg-slate-950/40 border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Direkt zuweisen an:
            </label>
            <select
              value={selectedMemberId}
              onChange={e => setSelectedMemberId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">Offener Clan-Pool (Niemand)</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Zu Projekt zuordnen (optional):
            </label>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">Kein spezifisches Projekt</option>
              {gameProjects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Template Items Grid */}
        <div className="p-6 overflow-y-auto space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Verfügbare Vorlagen für {activeGame?.name}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.map(tpl => {
              const wasJustAdded = addedItemName === tpl.name;
              return (
                <button
                  key={tpl.name}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`p-3.5 rounded-xl border text-left flex items-start justify-between gap-3 transition-all ${
                    wasJustAdded
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 scale-[1.01]'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-2xl shrink-0 p-1 bg-slate-900 rounded-lg border border-slate-800">
                      {tpl.icon || '📦'}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-slate-100 truncate">
                        {tpl.name}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        Zielquote: {tpl.defaultTarget} {tpl.defaultUnit}
                      </div>
                      {tpl.locationHint && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 truncate">
                          <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                          <span>{tpl.locationHint}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 self-center">
                    {wasJustAdded ? (
                      <span className="p-1.5 rounded-lg bg-emerald-500 text-slate-950 flex items-center gap-1 text-[11px] font-bold">
                        <Check className="w-3.5 h-3.5" />
                        Hinzugefügt
                      </span>
                    ) : (
                      <span className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 transition-colors inline-block">
                        <Plus className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Klicke auf eine Vorlage, um sie sofort zum Ablauf-Plan hinzuzufügen.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Fertig
          </button>
        </div>

      </div>
    </div>
  );
};
