import React from 'react';
import { useClan } from '../context/ClanContext';
import { Task } from '../types';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  Layers,
  ChevronRight,
  Mail,
  MessageSquare,
  Pin,
  Send,
  Package,
} from 'lucide-react';
import { ROLE_LABELS } from '../data/initialData';

interface DashboardViewProps {
  onNavigateToTasks: (memberId?: string) => void;
  onNavigateToProjects: () => void;
  onOpenNewTask: () => void;
  onOpenTemplatePicker: () => void;
  onEditTask: (task: Task) => void;
  onOpenMessages: (tab?: 'inbox' | 'board' | 'compose', replyMemberId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToTasks,
  onNavigateToProjects,
  onOpenNewTask,
  onOpenTemplatePicker,
  onEditTask,
  onOpenMessages,
}) => {
  const {
    games,
    activeGameId,
    tasks,
    members,
    projects,
    adjustTaskAmount,
    messages,
    currentMemberId,
    getUnreadCount,
  } = useClan();

  const activeGame = games.find(g => g.id === activeGameId) || games[0];
  const currentMember = members.find(m => m.id === currentMemberId) || members[0];
  const gameTasks = tasks.filter(t => t.gameId === activeGameId);
  const openTasks = gameTasks.filter(t => t.currentAmount < t.targetAmount && t.status !== 'completed');
  const completedTasks = gameTasks.filter(t => t.currentAmount >= t.targetAmount || t.status === 'completed');
  const gameProjects = projects.filter(p => p.gameId === activeGameId);

  // Unread messages for this member
  const unreadCount = getUnreadCount(currentMemberId);
  const latestDirectMessage = messages.find(
    m => m.recipientId === currentMemberId && !m.readBy.includes(currentMemberId)
  );
  const latestDirectSender = latestDirectMessage
    ? members.find(m => m.id === latestDirectMessage.senderId)
    : null;

  // Pinned or recent clan board announcements
  const boardAnnouncements = messages
    .filter(m => m.recipientId === 'all')
    .slice(0, 2);

  // Calculate missing total units
  let totalMissing = 0;
  openTasks.forEach(t => {
    totalMissing += Math.max(0, t.targetAmount - t.currentAmount);
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* 1. VISUAL NOTIFICATION CALLOUT: If user has an unread direct message */}
      {unreadCount > 0 && latestDirectMessage && (
        <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
              <Mail className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">
                  Neue Nachricht für {currentMember.name}!
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  von {latestDirectSender?.name || 'Mitspieler'}
                </span>
              </div>
              <p className="text-sm font-semibold text-white truncate max-w-lg mt-0.5">
                „{latestDirectMessage.title}“
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => onOpenMessages('inbox')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <span>Nachricht lesen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Calm, Focused Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/80 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <span>{activeGame?.icon}</span>
            <span>{activeGame?.name} · Clan-Kommandozentrale</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Einsatz- & Aufgabenübersicht
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Hier siehst du auf einen Blick, wer gerade an welchen Quoten arbeitet und wie weit eure aktuellen Clan-Ziele sind.
          </p>
        </div>

        {/* 3 Quick, Airy Key Numbers (No clutter) */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-medium">Offene Aufgaben</div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {openTasks.length}
            </div>
            <div className="text-[11px] text-emerald-400">
              {completedTasks.length} schon erledigt
            </div>
          </div>

          <div className="h-10 w-px bg-slate-800" />

          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-medium">Fehlende Einheiten</div>
            <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {totalMissing}
            </div>
            <div className="text-[11px] text-slate-400">
              gesamt im Clan
            </div>
          </div>

          <div className="h-10 w-px bg-slate-800" />

          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-medium">Clan-Funk</div>
            <div className="text-2xl font-bold font-mono text-indigo-400 tabular-nums">
              {messages.length}
            </div>
            <button
              onClick={() => onOpenMessages('inbox')}
              className="text-[11px] text-indigo-400 hover:underline block"
            >
              Postfach öffnen
            </button>
          </div>
        </div>
      </div>

      {/* 3. "Wer sammelt gerade was?" (Focus on Players and Quotas) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>🎯</span>
              <span>Aktuelle Quoten nach Spielern</span>
            </h2>
            <p className="text-xs text-slate-400">
              Direkte Übersicht: Wer besorgt was und wie viel fehlt noch?
            </p>
          </div>
          <button
            onClick={() => onNavigateToTasks()}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>Alle Ressourcen ansehen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Player Roster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(member => {
            const memberTasks = gameTasks.filter(t => t.assignedMemberId === member.id);
            const memberOpenTasks = memberTasks.filter(
              t => t.currentAmount < t.targetAmount && t.status !== 'completed'
            );
            const roleInfo = ROLE_LABELS[member.role] || ROLE_LABELS.gatherer;

            return (
              <div
                key={member.id}
                className="bg-slate-900 border border-slate-800/90 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  {/* Member Mini Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner"
                        style={{ backgroundColor: member.avatarColor }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{member.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {roleInfo.label}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Send message to this member */}
                      {member.id !== currentMemberId && (
                        <button
                          onClick={() => onOpenMessages('compose', member.id)}
                          className="p-1 text-slate-400 hover:text-emerald-400 rounded hover:bg-slate-800 transition-colors"
                          title={`Nachricht an ${member.name} senden`}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onNavigateToTasks(member.id)}
                        className="text-[11px] text-slate-400 hover:text-emerald-400 font-medium px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                        title={`Alle Aufgaben von ${member.name} filtern`}
                      >
                        {memberOpenTasks.length} offen
                      </button>
                    </div>
                  </div>

                  {/* Tasks for this member */}
                  {memberTasks.length === 0 ? (
                    <div className="py-4 text-center text-xs text-slate-500 italic">
                      Keine Aufgaben zugewiesen
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {memberTasks.map(task => {
                        const remaining = Math.max(0, task.targetAmount - task.currentAmount);
                        const isDone = task.currentAmount >= task.targetAmount || task.status === 'completed';
                        const percent = Math.min(100, Math.round((task.currentAmount / task.targetAmount) * 100));

                        return (
                          <div
                            key={task.id}
                            className={`p-2.5 rounded-lg border text-xs ${
                              isDone
                                ? 'bg-slate-950/40 border-emerald-500/20 text-slate-400'
                                : 'bg-slate-950/70 border-slate-800 text-slate-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <span className={`font-semibold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                                {task.title}
                              </span>
                              {isDone ? (
                                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 shrink-0">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Erfüllt
                                </span>
                              ) : (
                                <span className="text-[11px] font-mono font-bold text-amber-400 shrink-0">
                                  Fehlt: {remaining} {task.unit}
                                </span>
                              )}
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
                              <div
                                className={`h-full rounded-full ${
                                  isDone ? 'bg-emerald-400' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>

                            {/* Quick Counter Row */}
                            <div className="flex items-center justify-between text-[11px] pt-1">
                              <span className="font-mono tabular-nums text-slate-400">
                                <strong className="text-white">{task.currentAmount}</strong> / {task.targetAmount} {task.unit}
                              </span>

                              {/* Simple Stepper */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => adjustTaskAmount(task.id, -1)}
                                  disabled={task.currentAmount <= 0}
                                  className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 flex items-center justify-center font-bold"
                                  title="1 abziehen"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => adjustTaskAmount(task.id, 1)}
                                  className="px-1.5 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 font-bold"
                                  title="1 hinzufügen"
                                >
                                  +1
                                </button>
                                <button
                                  onClick={() => adjustTaskAmount(task.id, 5)}
                                  className="px-1.5 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 font-bold"
                                  title="5 hinzufügen"
                                >
                                  +5
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Quick Action footer */}
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => onNavigateToTasks(member.id)}
                    className="text-slate-400 hover:text-white py-1 transition-colors"
                  >
                    Aufgaben ansehen →
                  </button>
                  {member.id !== currentMemberId && (
                    <button
                      onClick={() => onOpenMessages('compose', member.id)}
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Notiz senden</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Clan-Pinnwand & Letzte Ankündigungen */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Pin className="w-4 h-4 text-amber-400" />
              <span>Clan-Funk & Pinnwand</span>
            </h2>
            <p className="text-xs text-slate-400">
              Absprachen, Kisten-Übergaben und Treffpunkte für alle Mitglieder
            </p>
          </div>
          <button
            onClick={() => onOpenMessages('board')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>Pinnwand öffnen ({boardAnnouncements.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {boardAnnouncements.map(msg => {
            const sender = members.find(m => m.id === msg.senderId);
            return (
              <div
                key={msg.id}
                onClick={() => onOpenMessages('board')}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 transition-colors cursor-pointer shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: sender?.avatarColor || '#64748b' }}
                    />
                    <span className="font-semibold text-slate-200">{sender?.name}</span>
                    {msg.isPinned && (
                      <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                        <Pin className="w-2.5 h-2.5" /> Angeheftet
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono">
                    {new Date(msg.timestamp).toLocaleDateString('de-DE')}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white mb-1">{msg.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {msg.content}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Aktuelle Großprojekte & Boss-Raids */}
      {gameProjects.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Laufende Clan-Projekte & Raids</span>
              </h2>
              <p className="text-xs text-slate-400">
                Fortschritt bei gemeinsamen Bau- und Raid-Zielen
              </p>
            </div>
            <button
              onClick={onNavigateToProjects}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
            >
              <span>Alle Projekte verwalten</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameProjects.map(project => {
              const projTasks = gameTasks.filter(t => t.projectId === project.id);
              const doneTasks = projTasks.filter(t => t.status === 'completed' || t.currentAmount >= t.targetAmount);
              
              let current = 0;
              let target = 0;
              projTasks.forEach(t => {
                current += t.currentAmount;
                target += t.targetAmount;
              });

              const percent = target > 0 ? Math.round((current / target) * 100) : 0;

              return (
                <div
                  key={project.id}
                  onClick={onNavigateToProjects}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 cursor-pointer transition-all hover:bg-slate-900/90 shadow-sm group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                        {project.icon || '🏛️'}
                      </span>
                      <div>
                        <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                          {project.title}
                        </h3>
                        <div className="text-[11px] text-slate-400">
                          {doneTasks.length} von {projTasks.length} Aufgaben abgeschlossen
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-base font-bold text-white tabular-nums">
                      {percent}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1 mb-3">
                    {project.description}
                  </p>

                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/80">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Action Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Möchtest du einem Mitspieler Materialien übergeben oder eine Notiz hinterlassen?</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenMessages('compose')}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nachricht schreiben</span>
          </button>
        </div>
      </div>

    </div>
  );
};
