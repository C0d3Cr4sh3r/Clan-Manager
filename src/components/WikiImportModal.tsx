import React, { useState } from 'react';
import { useClan } from '../context/ClanContext';
import { X, Upload, Download, Sparkles, Plus, Check } from 'lucide-react';
import { WikiItem, WikiItemCategory } from '../types';

interface WikiImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Pre-made Community Expansion Packs that can be loaded with 1-click
const COMMUNITY_PACKS: Record<string, { title: string; count: number; items: Omit<WikiItem, 'id'>[] }> = {
  grounded_extra: {
    title: 'Grounded: Meister-Ausrüstung & T3 Rüstungen',
    count: 4,
    items: [
      {
        gameId: 'grounded',
        name: 'Roly-Poly-Brustplatte (Tier 3)',
        category: 'armor',
        icon: '🛡️',
        tier: 3,
        description: 'Schwerste Rüstung im Spiel mit unübertroffener Verteidigung und Block-Stärke.',
        craftingStation: 'Werkbank Stufe 2',
        ingredients: [
          { itemName: 'Kugelkäfer-Teil', amount: 5, unit: 'Teile' },
          { itemName: 'Kugelkäfer-Panzer', amount: 3, unit: 'Panzer' },
          { itemName: 'Pflasterfaser', amount: 4, unit: 'Fasern' },
        ],
        locationHint: 'Im oberen Garten bei den Kugelkäfern',
        wikiUrl: 'https://grounded.fandom.com/wiki/Roly_Poly_Breastplate',
      },
      {
        gameId: 'grounded',
        name: 'Mücken-Nadel (Fecht-Degen)',
        category: 'weapon',
        icon: '🗡️',
        tier: 2,
        description: 'Schnelle Einhand-Waffe, die dem Träger bei Treffern Leben stiehlt (Lebensraub).',
        craftingStation: 'Werkbank Stufe 1',
        ingredients: [
          { itemName: 'Mücken-Rüssel', amount: 1, unit: 'Rüssel' },
          { itemName: 'Mücken-Blutsack', amount: 2, unit: 'Säcke' },
          { itemName: 'Seidenseil', amount: 2, unit: 'Seile' },
        ],
        locationHint: 'Mücken am Vogelbad und im Sumpfgebiet',
        wikiUrl: 'https://grounded.fandom.com/wiki/Mosquito_Needle',
      },
      {
        gameId: 'grounded',
        name: 'Zipline-Wandanker (Seilbahn)',
        category: 'building',
        icon: '🚡',
        tier: 2,
        description: 'Ermöglicht schnelles Reisen zwischen Baumbasis und Farmspots über weite Distanzen.',
        craftingStation: 'Basenbau',
        ingredients: [
          { itemName: 'Tonstein', amount: 1, unit: 'Ton' },
          { itemName: 'Seidenseil', amount: 4, unit: 'Seile' },
        ],
        locationHint: 'Ton am Flussufer graben',
        wikiUrl: 'https://grounded.fandom.com/wiki/Zipline_Anchor',
      },
      {
        gameId: 'grounded',
        name: 'Wespenkönigin-Snack (Boss-Köder)',
        category: 'raid_boss',
        icon: '🐝',
        tier: 3,
        description: 'Beschwört die Wespenkönigin im Bawkz-Baumhaus im oberen Garten.',
        craftingStation: 'Ofen',
        ingredients: [
          { itemName: 'Wespen-Stachel', amount: 3, unit: 'Stacheln' },
          { itemName: 'Wespenteil', amount: 5, unit: 'Teile' },
          { itemName: 'Pollen', amount: 2, unit: 'Portionen' },
        ],
        locationHint: 'Wespenstöcke im oberen Garten zerschlagen',
        wikiUrl: 'https://grounded.fandom.com/wiki/Wasp_Queen',
      },
    ],
  },
  palworld_extra: {
    title: 'Palworld: Endgame-Bosse & Legendäre Waffen',
    count: 2,
    items: [
      {
        gameId: 'palworld',
        name: 'Raketenwerfer (Legendär)',
        category: 'weapon',
        icon: '🚀',
        tier: 5,
        description: 'Zerstörerische Distanzwaffe gegen Weltbosse und Türme.',
        craftingStation: 'Waffenfließband II',
        ingredients: [
          { itemName: 'Pal-Metallbarren', amount: 100, unit: 'Barren' },
          { itemName: 'Polymer', amount: 35, unit: 'Stück' },
          { itemName: 'Kohlenstofffaser', amount: 30, unit: 'Fasern' },
        ],
        locationHint: 'Blaupause von Jetragon Weltboss',
        wikiUrl: 'https://palworld.fandom.com/wiki/Rocket_Launcher',
      },
      {
        gameId: 'palworld',
        name: 'Ultra-Sphäre',
        category: 'tool',
        icon: '🔮',
        tier: 4,
        description: 'Höchste Fangstufe für legendäre Pals wie Frostallion und Necromus.',
        craftingStation: 'Sphären-Fließband II',
        ingredients: [
          { itemName: 'Pal-Metallbarren', amount: 5, unit: 'Barren' },
          { itemName: 'Pal-Sphäre', amount: 5, unit: 'Sphären' },
          { itemName: 'Zement', amount: 2, unit: 'Säcke' },
          { itemName: 'Paldium-Bruchstück', amount: 5, unit: 'Splitter' },
        ],
        locationHint: 'Produktions-Fabrik in Alpha-Basis',
      },
    ],
  },
};

export const WikiImportModal: React.FC<WikiImportModalProps> = ({ isOpen, onClose }) => {
  const { activeGameId, importWikiItemsFromJson, addWikiItem } = useClan();
  
  const [activeTab, setActiveTab] = useState<'packs' | 'custom' | 'json'>('packs');
  const [jsonText, setJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; error?: boolean } | null>(null);

  // Custom Item Form
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<WikiItemCategory>('material');
  const [customIcon, setCustomIcon] = useState('📦');
  const [customTier, setCustomTier] = useState<number>(1);
  const [customStation, setCustomStation] = useState('Werkbank');
  const [customDesc, setCustomDesc] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [ingredientsList, setIngredientsList] = useState<{ itemName: string; amount: number; unit: string }[]>([
    { itemName: '', amount: 5, unit: 'Stück' },
  ]);

  if (!isOpen) return null;

  const handleImportPack = (packKey: string) => {
    const pack = COMMUNITY_PACKS[packKey];
    if (!pack) return;

    pack.items.forEach(item => {
      addWikiItem({
        ...item,
        gameId: activeGameId,
      });
    });

    setStatusMessage({ text: `Paket "${pack.title}" mit ${pack.count} Rezepten erfolgreich importiert!` });
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 1200);
  };

  const handleImportJson = () => {
    if (!jsonText.trim()) return;
    const res = importWikiItemsFromJson(jsonText.trim());
    if (res.success) {
      setStatusMessage({ text: `${res.count} Gegenstände & Rezepte erfolgreich importiert!` });
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 1200);
    } else {
      setStatusMessage({ text: res.error || 'Fehler beim Import', error: true });
    }
  };

  const handleCreateCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const validIngredients = ingredientsList
      .filter(ing => ing.itemName.trim().length > 0)
      .map(ing => ({
        itemName: ing.itemName.trim(),
        amount: Math.max(1, Number(ing.amount) || 1),
        unit: ing.unit.trim() || 'Stück',
      }));

    addWikiItem({
      gameId: activeGameId,
      name: customName.trim(),
      category: customCategory,
      icon: customIcon,
      tier: customTier,
      craftingStation: customStation.trim() || 'Werkbank',
      description: customDesc.trim() || 'Benutzerdefiniertes Clan-Rezept',
      locationHint: customLocation.trim() || undefined,
      ingredients: validIngredients,
    });

    setStatusMessage({ text: `Rezept für "${customName}" angelegt!` });
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 1000);
  };

  const addIngredientRow = () => {
    setIngredientsList([...ingredientsList, { itemName: '', amount: 1, unit: 'Stück' }]);
  };

  const updateIngredientRow = (idx: number, field: string, val: any) => {
    setIngredientsList(
      ingredientsList.map((row, i) => (i === idx ? { ...row, [field]: val } : row))
    );
  };

  const removeIngredientRow = (idx: number) => {
    setIngredientsList(ingredientsList.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Rezepte & Wiki-Daten importieren
              </h2>
              <p className="text-xs text-slate-400">
                Erweitere das Wiki mit offiziellen Fandom-Daten, Community-Packs oder eigenen Rezepten.
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

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab('packs')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'packs'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Community-Pakete (1-Klick)
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'custom'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Eigenes Rezept anlegen
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'json'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            JSON / Wiki API Import
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {statusMessage && (
            <div
              className={`p-3 rounded-lg border text-xs font-medium ${
                statusMessage.error
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {/* TAB 1: Packs */}
          {activeTab === 'packs' && (
            <div className="space-y-4">
              <p className="text-slate-400 leading-relaxed">
                Wähle ein vorgefertigtes Paket mit verifizierten Rezepten, Zutaten und Fundort-Hinweisen:
              </p>

              <div className="space-y-3">
                {Object.entries(COMMUNITY_PACKS).map(([key, pack]) => (
                  <div
                    key={key}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span>✨</span>
                        <span>{pack.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Enthält {pack.count} vollständige Rezepte mit Zutaten-Aufteilung
                      </div>
                    </div>
                    <button
                      onClick={() => handleImportPack(key)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors shrink-0"
                    >
                      Jetzt laden
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Custom Item Form */}
          {activeTab === 'custom' && (
            <form onSubmit={handleCreateCustomItem} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Gegenstandsname *</label>
                  <input
                    type="text"
                    required
                    placeholder="z. B. Gift-Pfeile, Minz-Hammer..."
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Kategorie</label>
                  <select
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="weapon">Waffe</option>
                    <option value="armor">Rüstung</option>
                    <option value="tool">Werkzeug</option>
                    <option value="building">Basenbau</option>
                    <option value="raid_boss">Boss-Raid & Köder</option>
                    <option value="material">Material / Veredelung</option>
                    <option value="consumable">Verbrauchsgut / Heilung</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Symbol-Icon</label>
                  <input
                    type="text"
                    value={customIcon}
                    onChange={e => setCustomIcon(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-center text-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Tier / Stufe</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={customTier}
                    onChange={e => setCustomTier(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Werkbank / Station</label>
                  <input
                    type="text"
                    value={customStation}
                    onChange={e => setCustomStation(e.target.value)}
                    placeholder="Werkbank, Ofen..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Recipe Ingredients */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Rezept-Zutaten (Zusammensetzung)</span>
                  <button
                    type="button"
                    onClick={addIngredientRow}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px] font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Zutat hinzufügen</span>
                  </button>
                </div>

                {ingredientsList.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Materialname (z. B. Spinnenfäden)"
                      value={ing.itemName}
                      onChange={e => updateIngredientRow(idx, 'itemName', e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100"
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Menge"
                      value={ing.amount}
                      onChange={e => updateIngredientRow(idx, 'amount', Number(e.target.value))}
                      className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono text-emerald-400 font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Einheit"
                      value={ing.unit}
                      onChange={e => updateIngredientRow(idx, 'unit', e.target.value)}
                      className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs"
                    />
                    {ingredientsList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredientRow(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Fundort / Alchemie-Hinweis</label>
                <input
                  type="text"
                  value={customLocation}
                  onChange={e => setCustomLocation(e.target.value)}
                  placeholder="z. B. Hecken-Labyrinth bei den Spinnen..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Beschreibung</label>
                <textarea
                  rows={2}
                  value={customDesc}
                  onChange={e => setCustomDesc(e.target.value)}
                  placeholder="Eigenschaften, Buffs oder Nutzen für den Clan..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-lg transition-colors mt-2"
              >
                Rezept im Wiki speichern
              </button>
            </form>
          )}

          {/* TAB 3: JSON Import */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <p className="text-slate-400 leading-relaxed">
                Hier kannst du exportierte Gegenstandlisten aus Wikis oder von anderen Clan-Mitgliedern im JSON-Format einfügen:
              </p>

              <textarea
                rows={7}
                placeholder={`[\n  {\n    "name": "Marienkäfer-Brustplatte",\n    "category": "armor",\n    "tier": 2,\n    "ingredients": [\n      { "itemName": "Marienkäfer-Brocken", "amount": 5, "unit": "Brocken" }\n    ]\n  }\n]`}
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
              />

              <button
                onClick={handleImportJson}
                disabled={!jsonText.trim()}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-lg transition-colors"
              >
                JSON-Datensatz importieren
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
