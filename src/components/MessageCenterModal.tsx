import React, { useState } from 'react';
import { useClan } from '../context/ClanContext';
import { ClanMessage, MessageType } from '../types';
import {
  X,
  Mail,
  Send,
  Pin,
  Trash2,
  Check,
  CheckCheck,
  Clock,
  Sparkles,
  MessageSquare,
  AlertCircle,
  Package,
  Swords,
  Reply,
} from 'lucide-react';

interface MessageCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  replyToMemberId?: string;
  defaultTab?: 'inbox' | 'board' | 'compose';
}

export const MessageCenterModal: React.FC<MessageCenterModalProps> = ({
  isOpen,
  onClose,
  replyToMemberId,
  defaultTab = 'inbox',
}) => {
  const {
    messages,
    members,
    currentMemberId,
    setCurrentMemberId,
    sendMessage,
    markMessageAsRead,
    deleteMessage,
    tasks,
    activeGameId,
  } = useClan();

  const [activeTab, setActiveTab] = useState<'inbox' | 'board' | 'sent' | 'compose'>(defaultTab);

  // Compose form state
  const [recipientId, setRecipientId] = useState<string>(replyToMemberId || 'mem_1');
  const [msgType, setMsgType] = useState<MessageType>('direct');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [relatedTaskId, setRelatedTaskId] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [sentFeedback, setSentFeedback] = useState(false);

  if (!isOpen) return null;

  const currentMember = members.find(m => m.id === currentMemberId) || members[0];
  const gameTasks = tasks.filter(t => t.gameId === activeGameId);

  // Messages sent directly to current member
  const inboxMessages = messages.filter(
    m => m.recipientId === currentMemberId
  );

  // Clan board / announcements (to 'all')
  const boardMessages = messages.filter(
    m => m.recipientId === 'all'
  ).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  // Sent messages
  const sentMessages = messages.filter(
    m => m.senderId === currentMemberId
  );

  const unreadInboxCount = inboxMessages.filter(
    m => !m.readBy.includes(currentMemberId)
  ).length;

  const unreadBoardCount = boardMessages.filter(
    m => !m.readBy.includes(currentMemberId)
  ).length;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    sendMessage({
      senderId: currentMemberId,
      recipientId,
      gameId: activeGameId,
      relatedTaskId: relatedTaskId || undefined,
      type: msgType,
      title: title.trim(),
      content: content.trim(),
      isPinned: recipientId === 'all' && isPinned,
    });

    setSentFeedback(true);
    setTitle('');
    setContent('');
    setRelatedTaskId('');
    setIsPinned(false);

    setTimeout(() => {
      setSentFeedback(false);
      setActiveTab(recipientId === 'all' ? 'board' : 'sent');
    }, 1000);
  };

  const handleReply = (senderId: string, replySubject: string) => {
    setRecipientId(senderId);
    setTitle(`Re: ${replySubject}`);
    setActiveTab('compose');
  };

  const TYPE_ICONS: Record<MessageType, { icon: any; color: string; label: string }> = {
    direct: { icon: MessageSquare, color: 'text-indigo-400', label: 'Direktnachricht' },
    handover: { icon: Package, color: 'text-emerald-400', label: 'Material-Übergabe' },
    raid_call: { icon: Swords, color: 'text-rose-400', label: 'Raid-Aufruf' },
    announcement: { icon: AlertCircle, color: 'text-amber-400', label: 'Ankündigung' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header with Active User Switcher */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-lg">
              💬
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Clan-Funk & Postfach</span>
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <span>Angemeldet als:</span>
                {/* Quick switcher so testing sending between Max and Susi is effortless */}
                <select
                  value={currentMemberId}
                  onChange={e => setCurrentMemberId(e.target.value)}
                  className="bg-slate-800 text-emerald-400 font-bold border border-slate-700 rounded px-1.5 py-0.5 text-xs focus:outline-none"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>
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
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'inbox'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Posteingang</span>
            {unreadInboxCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center font-mono">
                {unreadInboxCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('board')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'board'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
            <span>Clan-Pinnwand</span>
            {unreadBoardCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center font-mono">
                {unreadBoardCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'sent'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gesendet ({sentMessages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('compose')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ml-auto ${
              activeTab === 'compose'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <span>+ Neue Nachricht</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {sentFeedback && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-lg flex items-center gap-2 font-bold animate-fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Nachricht erfolgreich übermittelt!</span>
            </div>
          )}

          {/* TAB 1: INBOX */}
          {activeTab === 'inbox' && (
            <div className="space-y-3">
              {inboxMessages.length === 0 ? (
                <div className="py-12 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
                  <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-semibold text-slate-300">Keine Direktnachrichten für {currentMember.name}</p>
                  <p className="text-[11px] mt-1">Hier erscheinen Mitteilungen, wenn dir ein Mitspieler eine Kisten-Übergabe oder Nachricht hinterlässt.</p>
                </div>
              ) : (
                inboxMessages.map(msg => {
                  const sender = members.find(m => m.id === msg.senderId);
                  const isUnread = !msg.readBy.includes(currentMemberId);
                  const typeInfo = TYPE_ICONS[msg.type] || TYPE_ICONS.direct;
                  const TypeIcon = typeInfo.icon;
                  const relatedTask = tasks.find(t => t.id === msg.relatedTaskId);

                  return (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isUnread
                          ? 'bg-slate-950/90 border-emerald-500/40 shadow-md ring-1 ring-emerald-500/20'
                          : 'bg-slate-950/50 border-slate-800'
                      }`}
                    >
                      {/* Top Message Line */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow"
                            style={{ backgroundColor: sender?.avatarColor || '#64748b' }}
                          >
                            {sender?.name.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{sender?.name || 'Unbekannt'}</span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium flex items-center gap-1 ${typeInfo.color}`}>
                                <TypeIcon className="w-3 h-3" />
                                {typeInfo.label}
                              </span>
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Ungelesen" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {new Date(msg.timestamp).toLocaleString('de-DE', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isUnread && (
                            <button
                              onClick={() => markMessageAsRead(msg.id)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1 transition-colors"
                              title="Als gelesen markieren"
                            >
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Gelesen</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleReply(msg.senderId, msg.title)}
                            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                            title="Antworten"
                          >
                            <Reply className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                            title="Löschen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Subject & Content */}
                      <h4 className="font-bold text-sm text-slate-100 mb-1">
                        {msg.title}
                      </h4>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                        {msg.content}
                      </p>

                      {/* Optional Task Tag */}
                      {relatedTask && (
                        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                          <Package className="w-3 h-3 text-emerald-400" />
                          <span>Bezug: <strong className="text-slate-300">{relatedTask.title}</strong> ({relatedTask.currentAmount}/{relatedTask.targetAmount})</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: CLAN-PINNWAND (ALL) */}
          {activeTab === 'board' && (
            <div className="space-y-3">
              {boardMessages.length === 0 ? (
                <div className="py-12 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
                  <Pin className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-semibold text-slate-300">Keine Ankündigungen auf der Clan-Pinnwand</p>
                  <p className="text-[11px] mt-1">Hier können alle Clan-Mitglieder wichtige Treffpunkte oder Absprachen für alle hinterlassen.</p>
                </div>
              ) : (
                boardMessages.map(msg => {
                  const sender = members.find(m => m.id === msg.senderId);
                  const isUnread = !msg.readBy.includes(currentMemberId);
                  const typeInfo = TYPE_ICONS[msg.type] || TYPE_ICONS.announcement;
                  const TypeIcon = typeInfo.icon;

                  return (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-xl border transition-all ${
                        msg.isPinned
                          ? 'bg-slate-950/90 border-amber-500/40 shadow-md ring-1 ring-amber-500/20'
                          : isUnread
                          ? 'bg-slate-950/80 border-slate-700'
                          : 'bg-slate-950/50 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow"
                            style={{ backgroundColor: sender?.avatarColor || '#64748b' }}
                          >
                            {sender?.name.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{sender?.name || 'Unbekannt'}</span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium flex items-center gap-1 ${typeInfo.color}`}>
                                <TypeIcon className="w-3 h-3" />
                                {typeInfo.label}
                              </span>
                              {msg.isPinned && (
                                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                                  <Pin className="w-3 h-3" /> Angeheftet
                                </span>
                              )}
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Ungelesen" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              An alle Clan-Mitglieder · {new Date(msg.timestamp).toLocaleString('de-DE', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isUnread && (
                            <button
                              onClick={() => markMessageAsRead(msg.id)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1"
                            >
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Gelesen</span>
                            </button>
                          )}
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                            title="Löschen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-white mb-1">
                        {msg.title}
                      </h4>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                        {msg.content}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: SENT */}
          {activeTab === 'sent' && (
            <div className="space-y-3">
              {sentMessages.length === 0 ? (
                <div className="py-12 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
                  <Send className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-semibold text-slate-300">Noch keine gesendeten Nachrichten von {currentMember.name}</p>
                </div>
              ) : (
                sentMessages.map(msg => {
                  const recipient = members.find(m => m.id === msg.recipientId);
                  const recipientName = msg.recipientId === 'all' ? 'Alle (Clan-Pinnwand)' : recipient?.name || 'Unbekannt';

                  return (
                    <div
                      key={msg.id}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-950/60"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-slate-300">
                          An: <strong className="text-white">{recipientName}</strong>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(msg.timestamp).toLocaleString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-200 mb-1">{msg.title}</h4>
                      <p className="text-slate-400 text-xs bg-slate-900/50 p-2 rounded border border-slate-800/60">
                        {msg.content}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 4: COMPOSE */}
          {activeTab === 'compose' && (
            <form onSubmit={handleSend} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Empfänger *
                  </label>
                  <select
                    value={recipientId}
                    onChange={e => setRecipientId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="all">📢 An Alle (Clan-Pinnwand)</option>
                    <optgroup label="Direkt an Mitspieler">
                      {members.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.role})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Nachrichtentyp
                  </label>
                  <select
                    value={msgType}
                    onChange={e => setMsgType(e.target.value as MessageType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="direct">💬 Direktnachricht</option>
                    <option value="handover">📦 Material-Übergabe / Kiste</option>
                    <option value="raid_call">⚔️ Raid-Aufruf / Treffpunkt</option>
                    <option value="announcement">📢 Allgemeine Ankündigung</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Betreff / Titel *
                </label>
                <input
                  type="text"
                  required
                  placeholder="z. B. 20 Grasplatten in Kiste 2 gelegt..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nachrichtentext *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Schreibe deinem Mitspieler oder Clan die Details..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 resize-none text-xs leading-relaxed"
                />
              </div>

              {/* Related task reference */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Bezug zu einer Clan-Aufgabe (optional)
                </label>
                <select
                  value={relatedTaskId}
                  onChange={e => setRelatedTaskId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Kein Aufgaben-Bezug</option>
                  {gameTasks.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.currentAmount}/{t.targetAmount})
                    </option>
                  ))}
                </select>
              </div>

              {recipientId === 'all' && (
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={e => setIsPinned(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-emerald-500 w-3.5 h-3.5"
                  />
                  <span>Oben auf der Clan-Pinnwand anheften (Wichtig)</span>
                </label>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
              >
                <Send className="w-4 h-4" />
                <span>Nachricht absenden</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
