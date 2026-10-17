import React, { useState, useMemo } from 'react';
import { useClan } from '../context/ClanContext';
import { WikiItem, WikiItemCategory } from '../types';
import {
  Search,
  BookOpen,
  Plus,
  Sparkles,
  ExternalLink,
  Check,
  MapPin,
  Trash2,
  ChevronRight,
  Hammer,
} from 'lucide-react';
import { WikiImportModal } from './WikiImportModal';

interface WikiViewProps {
  onNavigateToTasks: () => void;
}

export const WikiView: React.FC<WikiViewProps> = ({ onNavigateToTasks }) => {
  const { games, activeGameId, wikiItems, members, projects, adoptRecipeToClanTasks, deleteWikiItem } = useClan();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Adopt Recipe Modal state
  const [adoptingItem, setAdoptingItem] = useState<WikiItem | null>(null);
  const [adoptQuantity, setAdoptQuantity] = useState<number>(1);
  const [adoptMemberId, setAdoptMemberId] = useState<string>('');
  const [adoptProjectId, setAdoptProjectId] = useState<string>('');
  const [adoptSuccessMsg, setAdoptSuccessMsg] = useState<string | null>(null);

  const activeGame = games.find(g => g.id === activeGameId) || games[0];
  const gameItems = wikiItems.filter(item => item.gameId === activeGameId);
  const gameProjects = projects.filter(p => p.gameId === activeGameId);

  // Filter items
  const filteredItems = useMemo(() => {
    return gameItems.filter(item => {
      // Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Tier
      if (selectedTier !== 'all' && item.tier !== Number(selectedTier)) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesLoc = item.locationHint?.toLowerCase().includes(q) || false;
        const matchesIngredient = item.ingredients.some(ing =>
          ing.itemName.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesDesc && !matchesLoc && !matchesIngredient) {
          return false;
        }
      }

      return true;
    });
  }, [gameItems, selectedCategory, selectedTier, searchQuery]);

  const handleConfirmAdopt = () => {
    if (!adoptingItem) return;
    const res = adoptRecipeToClanTasks(
      adoptingItem,
      adoptMemberId || undefined,
      adoptProjectId || undefined,
      adoptQuantity
    );

    const memName = members.find(m => m.id === adoptMemberId)?.name || 'dem Clan-Pool';
    setAdoptSuccessMsg(
      `${res.createdCount} Sammelaufgabe(n) für "${adoptingItem.name}" (${adoptQuantity}x) wurden ${memName} zugewiesen!`
    );

    setAdoptingItem(null);
    setTimeout(() => {
      setAdoptSuccessMsg(null);
    }, 4000);
  };

  const CATEGORY_NAMES: Record<WikiItemCategory, { label: string; icon: string }> = {
    weapon: { label: 'Waffen', icon: '🗡️' },
    armor: { label: 'Rüstungen', icon: '🛡️' },
    tool: { label: 'Werkzeuge', icon: '🔨' },
    building: { label: 'Basenbau', icon: '🏛️' },
    raid_boss: { label: 'Boss-Köder', icon: '💀' },
    material: { label: 'Materialien', icon: '📦' },
    consumable: { label: 'Heilung & Nahrung', icon: '🧪' },
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <span>{activeGame?.icon}</span>
            <span>{activeGame?.name} · Spiele-Wiki & Handwerks-Rezepte</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Item-Katalog & Rezept-Datenbank
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Finde Rezepte, Zutaten und Fundorte. Übernehme benötigte Materialien mit einem Klick direkt als Sammelaufgabe für dein Team.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setImportModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Rezepte importieren / Neues Rezept</span>
          </button>
        </div>
      </div>

      {/* Success Notification Bar */}
      {adoptSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center justify-between gap-3 shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{adoptSuccessMsg}</span>
          </div>
          <button
            onClick={onNavigateToTasks}
            className="px-3 py-1 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors shrink-0"
          >
            Zur Aufgabenliste →
          </button>
        </div>
      )}

      {/* Search & Filter Strip */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative min-w-[220px] max-w-sm flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Gegenstand, Zutat oder Fundort suchen..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Alle ({gameItems.length})
          </button>
          {Object.entries(CATEGORY_NAMES).map(([key, info]) => {
            const count = gameItems.filter(i => i.category === key).length;
            if (count === 0) return null;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === key
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{info.icon}</span>
                <span>{info.label}</span>
                <span className="text-[10px] opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Tier Filter */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-end md:self-auto shrink-0">
          {['all', '1', '2', '3', '4'].map(t => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors ${
                selectedTier === t ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'all' ? 'Alle Tiers' : `T${t}`}
            </button>
          ))}
        </div>

      </div>

      {/* Items & Recipes Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center shadow-inner">
          <div className="text-3xl mb-2">📖</div>
          <h3 className="text-base font-bold text-white mb-1">
            Keine Rezepte für die Suche gefunden
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Importiere zusätzliche Community-Packs oder lege ein eigenes Clan-Rezept an.
          </p>
          <button
            onClick={() => setImportModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-emerald-400 text-slate-950 font-bold text-xs hover:bg-emerald-300 transition-colors"
          >
            Rezepte importieren
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map(item => {
            const catInfo = CATEGORY_NAMES[item.category] || { label: item.category, icon: '📦' };

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-sm flex flex-col justify-between transition-colors group"
              >
                <div>
                  {/* Top Meta Line */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span>{catInfo.icon}</span>
                      <span>{catInfo.label}</span>
                      {item.tier && (
                        <>
                          <span className="text-slate-600">·</span>
                          <span className="font-mono text-emerald-400 font-bold">Tier {item.tier}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {item.wikiUrl && (
                        <a
                          href={item.wikiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 transition-colors"
                          title="Offizielle Wiki-Seite öffnen"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {item.isCustom && (
                        <button
                          onClick={() => deleteWikiItem(item.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                          title="Löschen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & Station */}
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl p-1.5 bg-slate-950 rounded-lg border border-slate-800 shrink-0 shadow-inner">
                      {item.icon}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {item.name}
                      </h3>
                      {item.craftingStation && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Hammer className="w-3 h-3 text-slate-500" />
                          <span>{item.craftingStation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                    {item.description}
                  </p>

                  {/* Location Hint */}
                  {item.locationHint && (
                    <div className="flex items-start gap-1.5 text-[11px] text-slate-400 mb-3 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{item.locationHint}</span>
                    </div>
                  )}

                  {/* Ingredients (Rezepte) */}
                  <div className="border-t border-slate-800/80 pt-2.5 mb-4">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Zutaten & Materialien:
                    </div>
                    {item.ingredients.length === 0 ? (
                      <div className="text-xs text-slate-500 italic">
                        Keine Zusammensetzung (Rohstoff)
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {item.ingredients.map((ing, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-950/50 border border-slate-800/50"
                          >
                            <span className="text-slate-200">{ing.itemName}</span>
                            <span className="font-mono text-emerald-400 font-bold tabular-nums">
                              {ing.amount} {ing.unit || 'x'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 1-Click Adopt Button */}
                <button
                  onClick={() => {
                    setAdoptingItem(item);
                    setAdoptQuantity(1);
                    setAdoptMemberId('');
                    setAdoptProjectId('');
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Als Sammelaufgabe übernehmen</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Adoption Modal */}
      {adoptingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-xs space-y-4">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{adoptingItem.icon}</span>
                <div>
                  <h3 className="font-bold text-sm text-white">{adoptingItem.name}</h3>
                  <p className="text-slate-400 text-[11px]">
                    Zutaten als Clan-Aufgabe anlegen
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAdoptingItem(null)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Quantity multiplier */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Wie oft herstellen?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 4, 10].map(qty => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setAdoptQuantity(qty)}
                    className={`flex-1 py-1.5 rounded-lg border font-mono font-bold transition-colors ${
                      adoptQuantity === qty
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {qty}x
                  </button>
                ))}
              </div>
            </div>

            {/* Member Assignment */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Zuständiger Spieler:
              </label>
              <select
                value={adoptMemberId}
                onChange={e => setAdoptMemberId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Offener Clan-Pool (Jeder)</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Project Assignment */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Zugehöriges Projekt (optional):
              </label>
              <select
                value={adoptProjectId}
                onChange={e => setAdoptProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Kein spezifisches Projekt</option>
                {gameProjects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview of ingredients that will be added */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="font-semibold text-slate-300 text-[11px] mb-1.5">
                Folgende Aufgaben werden in der Clan-Liste erzeugt:
              </div>
              <div className="space-y-1">
                {adoptingItem.ingredients.map((ing, i) => (
                  <div key={i} className="flex justify-between text-slate-300 font-mono">
                    <span>{ing.itemName}</span>
                    <span className="text-emerald-400 font-bold">
                      {ing.amount * adoptQuantity} {ing.unit || 'Stück'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAdoptingItem(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-medium hover:bg-slate-700"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleConfirmAdopt}
                className="px-5 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold shadow"
              >
                Zur Clan-Sammelliste hinzufügen
              </button>
            </div>

          </div>
        </div>
      )}

      <WikiImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
      />
    </div>
  );
};
