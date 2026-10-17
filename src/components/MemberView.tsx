import React, { useState } from 'react';
import { useClan } from '../context/ClanContext';
import { Member } from '../types';
import { ROLE_LABELS } from '../data/initialData';
import { Plus, Edit2, Trash2, CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { MemberModal } from './MemberModal';

interface MemberViewProps {
  onSelectMemberForDashboard: (memberId: string) => void;
}

export const MemberView: React.FC<MemberViewProps> = ({ onSelectMemberForDashboard }) => {
  const { members, tasks, activeGameId, games, deleteMember } = useClan();
  const [modalOpen, setModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);

  const activeGame = games.find(g => g.id === activeGameId) || games[0];
  const gameTasks = tasks.filter(t => t.gameId === activeGameId);

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🛡️</span>
            <span>Clan-Mitglieder & Zuweisungen</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Übersicht über alle Mitspieler, ihre Rollen und ihren Quoten-Fortschritt in <strong className="text-slate-200">{activeGame?.name}</strong>.
          </p>
        </div>

        <button
          onClick={() => {
            setMemberToEdit(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Mitglied hinzufügen</span>
        </button>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.map(member => {
          const assignedTasks = gameTasks.filter(t => t.assignedMemberId === member.id);
          const completedTasks = assignedTasks.filter(t => t.status === 'completed' || t.currentAmount >= t.targetAmount);
          
          let totalGathered = 0;
          let totalGoal = 0;
          assignedTasks.forEach(t => {
            totalGathered += t.currentAmount;
            totalGoal += t.targetAmount;
          });

          const quotaPercentage = totalGoal > 0 ? Math.round((totalGathered / totalGoal) * 100) : 0;
          const roleInfo = ROLE_LABELS[member.role] || ROLE_LABELS.gatherer;

          return (
            <div
              key={member.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-md transition-all relative group"
            >
              <div>
                {/* Member Top Bar */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow shrink-0"
                      style={{ backgroundColor: member.avatarColor }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">
                        {member.name}
                      </h3>
                      {member.discordTag && (
                        <div className="text-[11px] text-slate-400 font-mono">
                          {member.discordTag}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setMemberToEdit(member);
                        setModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      title="Bearbeiten"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Möchtest du ${member.name} wirklich aus dem Clan entfernen?`)) {
                          deleteMember(member.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                      title="Entfernen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Role and Status (Unboxed metadata with typographic separators) */}
                <div className="flex items-center gap-2 text-xs text-slate-300 mb-3 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="font-medium text-slate-200">
                    {roleInfo.icon} {roleInfo.label}
                  </span>
                  <span className="text-slate-600" aria-hidden="true">·</span>
                  <span className="text-[11px] text-slate-400">
                    {member.status === 'ingame'
                      ? '🎮 Im Spiel'
                      : member.status === 'online'
                      ? '🟢 Online'
                      : member.status === 'busy'
                      ? '🟡 Beschäftigt'
                      : '⚪ Offline'}
                  </span>
                </div>

                {member.notes && (
                  <p className="text-xs text-slate-400 mb-4 italic line-clamp-2">
                    „{member.notes}“
                  </p>
                )}

                {/* Quota & Task Stats */}
                <div className="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Aufgaben-Erfüllung:
                    </span>
                    <span className="font-bold text-white font-mono tabular-nums">
                      {completedTasks.length} / {assignedTasks.length} erledigt
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-amber-400" />
                      Ressourcen gesammelt:
                    </span>
                    <span className="font-bold text-white font-mono tabular-nums">
                      {totalGathered} / {totalGoal}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, quotaPercentage)}%` }}
                    />
                  </div>
                </div>

                {/* Preview of assigned tasks */}
                {assignedTasks.length > 0 ? (
                  <div className="mt-3 space-y-1">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Aktuelle Aufgaben:
                    </div>
                    {assignedTasks.slice(0, 3).map(task => {
                      const rem = Math.max(0, task.targetAmount - task.currentAmount);
                      return (
                        <div
                          key={task.id}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-950/40 border border-slate-800/40"
                        >
                          <span className="truncate max-w-[140px] text-slate-200">
                            {task.title}
                          </span>
                          <span className="font-mono tabular-nums text-[11px] text-slate-400 shrink-0">
                            {task.currentAmount >= task.targetAmount ? (
                              <span className="text-emerald-400 font-semibold">Erfüllt ✓</span>
                            ) : (
                              <span className="text-amber-400 font-medium">noch {rem} {task.unit}</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                    {assignedTasks.length > 3 && (
                      <div className="text-[11px] text-slate-500 text-center pt-0.5">
                        +{assignedTasks.length - 3} weitere Aufgaben
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 py-2 text-center text-xs text-slate-500 italic">
                    Aktuell keine Aufgaben zugewiesen
                  </div>
                )}
              </div>

              {/* Action Button: Filter Dashboard to this member */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectMemberForDashboard(member.id)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Aufgaben von {member.name} filtern</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      <MemberModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        memberToEdit={memberToEdit}
      />
    </div>
  );
};
