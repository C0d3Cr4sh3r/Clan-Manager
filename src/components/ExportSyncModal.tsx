import React, { useState } from 'react';
import { useClan } from '../context/ClanContext';
import { X, Download, Upload, Copy, Check, RefreshCw, MessageSquare } from 'lucide-react';

interface ExportSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportSyncModal: React.FC<ExportSyncModalProps> = ({ isOpen, onClose }) => {
  const { exportDataJson, importDataJson, resetToDefaults, games, activeGameId, tasks, members } = useClan();
  
  const [importText, setImportText] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isOpen) return null;

  const activeGame = games.find(g => g.id === activeGameId) || games[0];
  const gameTasks = tasks.filter(t => t.gameId === activeGameId);

  // Generate Discord Markdown message
  const generateDiscordSummary = () => {
    let msg = `📋 **ClanOps Einsatzplan: ${activeGame?.name}**\n\n`;
    
    const openTasks = gameTasks.filter(t => t.currentAmount < t.targetAmount && t.status !== 'completed');
    if (openTasks.length === 0) {
      msg += `🎉 Alle Quoten & Aufgaben sind aktuell erfüllt!\n`;
    } else {
      msg += `**Offene Aufgaben & Quoten:**\n`;
      openTasks.forEach(t => {
        const mem = members.find(m => m.id === t.assignedMemberId);
        const memName = mem ? mem.name : 'Niemand';
        const remaining = Math.max(0, t.targetAmount - t.currentAmount);
        msg += `• **${memName}**: ${t.title} — ${t.currentAmount}/${t.targetAmount} ${t.unit} (*Noch ${remaining} benötigt*)\n`;
      });
    }

    const completed = gameTasks.filter(t => t.currentAmount >= t.targetAmount || t.status === 'completed');
    if (completed.length > 0) {
      msg += `\n**Erledigt (${completed.length}):**\n`;
      completed.forEach(t => {
        const mem = members.find(m => m.id === t.assignedMemberId);
        msg += `✓ ${t.title} (${mem ? mem.name : 'Clan'})\n`;
      });
    }

    return msg;
  };

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText(generateDiscordSummary());
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(exportDataJson());
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadFile = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clanops_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const res = importDataJson(importText.trim());
    if (res.success) {
      setStatusMessage({ text: 'Clan-Plan erfolgreich importiert!' });
      setImportText('');
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 1200);
    } else {
      setStatusMessage({ text: res.error || 'Fehler beim Importieren', error: true });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const res = importDataJson(content);
        if (res.success) {
          setStatusMessage({ text: 'Datei erfolgreich importiert!' });
          setTimeout(() => {
            setStatusMessage(null);
            onClose();
          }, 1200);
        } else {
          setStatusMessage({ text: res.error || 'Fehler beim Lesen der Datei', error: true });
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>🔄</span>
            <span>Clan-Daten teilen, exportieren & importieren</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Status Message */}
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

          {/* Section 1: Discord Share Snippet */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5 text-sm">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Discord & Team-Zusammenfassung</span>
              </div>
              <button
                onClick={handleCopyDiscord}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1 transition-colors"
              >
                {copiedDiscord ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDiscord ? 'Kopiert!' : 'Discord-Text kopieren'}</span>
              </button>
            </div>
            <p className="text-slate-400 text-[11px] mb-2">
              Formatiert alle aktuellen Aufgaben von Max, Susi und Mitspielern als saubere Liste für deinen Discord-Channel.
            </p>
            <pre className="p-2.5 bg-slate-900 rounded border border-slate-800 text-[11px] font-mono text-slate-300 max-h-24 overflow-y-auto whitespace-pre-wrap">
              {generateDiscordSummary()}
            </pre>
          </div>

          {/* Section 2: JSON Backup Export */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="font-semibold text-slate-200 text-sm mb-1 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Vollständiges Backup exportieren</span>
            </div>
            <p className="text-slate-400 text-[11px] mb-3">
              Enthält alle Spiele, Aufgaben, Mitglieder, Quoten und Projekte.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadFile}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Als .JSON Datei speichern</span>
              </button>
              <button
                onClick={handleCopyJson}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1.5 transition-colors"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Code kopiert!' : 'JSON in Zwischenablage'}</span>
              </button>
            </div>
          </div>

          {/* Section 3: Import Backup / Teammate Plan */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="font-semibold text-slate-200 text-sm mb-1 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-blue-400" />
              <span>Clan-Plan importieren</span>
            </div>
            <p className="text-slate-400 text-[11px] mb-2">
              Lade einen geteilten Plan hoch oder füge den JSON-Code ein:
            </p>
            
            <div className="mb-3">
              <label className="inline-block px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer transition-colors">
                <span>📁 JSON Datei auswählen</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              rows={3}
              placeholder="Oder JSON-Code direkt hier einfügen..."
              value={importText}
              onChange={e => setImportText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-emerald-500 mb-2 resize-none"
            />

            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-medium transition-colors"
            >
              Plan importieren & laden
            </button>
          </div>

          {/* Section 4: Demo Data Reset */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Möchtest du auf die Standard-Daten (Grounded, Max & Susi) zurücksetzen?
            </span>
            <button
              onClick={() => {
                if (confirm('Wirklich auf die Standard-Vorlagen für Grounded zurücksetzen? Alle Änderungen gehen verloren.')) {
                  resetToDefaults();
                  setStatusMessage({ text: 'Auf Standard-Daten zurückgesetzt!' });
                  setTimeout(() => {
                    setStatusMessage(null);
                    onClose();
                  }, 1200);
                }
              }}
              className="px-3 py-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 flex items-center gap-1 transition-colors text-[11px]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Auf Demo-Stand zurücksetzen</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
