import React from 'react';
import { useClan } from '../context/ClanContext';
import { CheckCircle2, PackageCheck, Users } from 'lucide-react';

interface StatsBannerProps {
  selectedMemberId: string;
  setSelectedMemberId: (id: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  selectedMemberId,
  setSelectedMemberId,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { games, activeGameId, tasks, members } = useClan();

  const activeGame = games.find(g => g.id === activeGameId) || games[0];
  const gameTasks = tasks.filter(t => t.gameId === activeGameId);

  const totalTasks = gameTasks.length;
  const completedTasks = gameTasks.filter(t => t.status === 'completed' || t.currentAmount >= t.targetAmount).length;
  
  // Calculate total resource units
  let totalCurrentUnits = 0;
  let totalTargetUnits = 0;
  gameTasks.forEach(t => {
    totalCurrentUnits += t.currentAmount;
    totalTargetUnits += t.targetAmount;
  });

  const totalRemainingUnits = Math.max(0, totalTargetUnits - totalCurrentUnits);
  const overallPercentage = totalTargetUnits > 0 ? Math.round((totalCurrentUnits / totalTargetUnits) * 100) : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 shadow-lg relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Strip: Game & Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5 pb-5 border-b border-slate-800/80">
        
        {/* Game Focus */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-2xl shadow-inner shrink-0">
            {activeGame?.icon}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-emerald-400">Aktives Spiel</div>
            <div className="text-lg font-bold text-white truncate">{activeGame?.name}</div>
            <div className="text-xs text-slate-400 truncate">{activeGame?.genre}</div>
          </div>
        </div>

        {/* Quota Completion */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/70">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Aufgaben-Quote
            </span>
            <span className="font-mono tabular-nums text-emerald-400 font-bold">
              {overallPercentage}%
            </span>
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white">
            {completedTasks} <span className="text-xs font-normal text-slate-400">von {totalTasks} erledigt</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Total Resources In Demand */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/70">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
              Ressourcen-Menge
            </span>
            <span className="text-xs text-amber-400 font-semibold font-mono tabular-nums">
              {totalRemainingUnits} verbleibend
            </span>
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white">
            {totalCurrentUnits} <span className="text-xs font-normal text-slate-400">/ {totalTargetUnits} gesammelt</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            Noch <span className="text-amber-300 font-mono font-medium">{totalRemainingUnits}</span> Einheiten bis zum Etappenziel
          </div>
        </div>

        {/* Clan Members Active */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/70 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-medium">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              Clan-Truppe
            </div>
            <div className="text-lg font-bold text-white font-mono tabular-nums">
              {members.length} <span className="text-xs font-normal text-slate-400">Mitglieder</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {members.filter(m => m.status === 'ingame' || m.status === 'online').length} gerade im Spiel / online
            </div>
          </div>
          <div className="flex -space-x-1.5 overflow-hidden">
            {members.slice(0, 4).map(m => (
              <div
                key={m.id}
                title={`${m.name} (${m.role})`}
                className="w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                style={{ backgroundColor: m.avatarColor }}
              >
                {m.name.charAt(0)}
              </div>
            ))}
            {members.length > 4 && (
              <div className="w-7 h-7 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] text-slate-300 font-semibold">
                +{members.length - 4}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Quick Player Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        
        {/* Member Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-400 font-medium whitespace-nowrap mr-1">
            Filter nach Spieler:
          </span>
          <button
            onClick={() => setSelectedMemberId('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              selectedMemberId === 'all'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Alle Spieler ({gameTasks.length})
          </button>

          {members.map(member => {
            const memberTaskCount = gameTasks.filter(t => t.assignedMemberId === member.id).length;
            const isSelected = selectedMemberId === member.id;
            return (
              <button
                key={member.id}
                onClick={() => setSelectedMemberId(member.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: member.avatarColor }}
                />
                <span>{member.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">({memberTaskCount})</span>
              </button>
            );
          })}
        </div>

        {/* Category Segmented Control */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto overflow-x-auto">
          {[
            { id: 'all', label: 'Alle Typen' },
            { id: 'resource', label: 'Ressourcen' },
            { id: 'building', label: 'Bauen' },
            { id: 'crafting', label: 'Crafting' },
            { id: 'raid', label: 'Raids' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
