import React, { useState, useMemo } from 'react';
import { ClanProvider, useClan } from './context/ClanContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TaskCard } from './components/TaskCard';
import { TaskTableView } from './components/TaskTableView';
import { KanbanView } from './components/KanbanView';
import { MemberView } from './components/MemberView';
import { ProjectsView } from './components/ProjectsView';
import { TaskModal } from './components/TaskModal';
import { TemplatePickerModal } from './components/TemplatePickerModal';
import { NewGameModal } from './components/NewGameModal';
import { ExportSyncModal } from './components/ExportSyncModal';
import { WikiView } from './components/WikiView';
import { MessageCenterModal } from './components/MessageCenterModal';
import { Task } from './types';
import {
  LayoutGrid,
  Table as TableIcon,
  Columns3,
  Search,
  Plus,
  Sparkles,
} from 'lucide-react';

function ClanOpsApp() {
  const { games, activeGameId, tasks, members, projects } = useClan();

  // Navigation tab: 'dashboard' | 'tasks' | 'members' | 'projects' | 'sync'
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Filters for Resources / Tasks view
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'kanban'>('cards');

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [newGameModalOpen, setNewGameModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [messagesDefaultTab, setMessagesDefaultTab] = useState<'inbox' | 'board' | 'compose'>('inbox');
  const [messagesReplyMemberId, setMessagesReplyMemberId] = useState<string | undefined>(undefined);

  const handleOpenMessages = (tab: 'inbox' | 'board' | 'compose' = 'inbox', replyMemberId?: string) => {
    setMessagesDefaultTab(tab);
    setMessagesReplyMemberId(replyMemberId);
    setMessagesModalOpen(true);
  };

  const activeGame = games.find(g => g.id === activeGameId) || games[0];

  // Filter tasks for active game and filter criteria in the Tasks view
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Game check
      if (task.gameId !== activeGameId) return false;

      // Member check
      if (selectedMemberId !== 'all' && task.assignedMemberId !== selectedMemberId) {
        return false;
      }

      // Category check
      if (selectedCategory !== 'all' && task.category !== selectedCategory) {
        return false;
      }

      // Status check
      if (selectedStatus === 'in_progress') {
        if (task.status === 'completed' || task.currentAmount >= task.targetAmount) return false;
      } else if (selectedStatus === 'completed') {
        if (task.status !== 'completed' && task.currentAmount < task.targetAmount) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesNotes = task.notes?.toLowerCase().includes(q) || false;
        const matchesLocation = task.location?.toLowerCase().includes(q) || false;
        const mem = members.find(m => m.id === task.assignedMemberId);
        const matchesMember = mem?.name.toLowerCase().includes(q) || false;
        if (!matchesTitle && !matchesNotes && !matchesLocation && !matchesMember) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, activeGameId, selectedMemberId, selectedCategory, selectedStatus, searchQuery, members]);

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setTaskModalOpen(true);
  };

  const handleOpenTaskForProject = (_projectId: string) => {
    setTaskToEdit(null);
    setTaskModalOpen(true);
  };

  const handleNavigateToTasksFromDashboard = (memberId?: string) => {
    if (memberId) {
      setSelectedMemberId(memberId);
    } else {
      setSelectedMemberId('all');
    }
    setCurrentTab('tasks');
  };

  const gameTasks = tasks.filter(t => t.gameId === activeGameId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      
      {/* Clean 3-Zone Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={tab => {
          if (tab === 'sync') {
            setExportModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenNewTask={() => {
          setTaskToEdit(null);
          setTaskModalOpen(true);
        }}
        onOpenTemplatePicker={() => setTemplatePickerOpen(true)}
        onOpenNewGame={() => setNewGameModalOpen(true)}
        onOpenMessages={() => handleOpenMessages('inbox')}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: DASHBOARD (Calm, high-level command center) */}
        {currentTab === 'dashboard' && (
          <DashboardView
            onNavigateToTasks={handleNavigateToTasksFromDashboard}
            onNavigateToProjects={() => setCurrentTab('projects')}
            onOpenNewTask={() => {
              setTaskToEdit(null);
              setTaskModalOpen(true);
            }}
            onOpenTemplatePicker={() => setTemplatePickerOpen(true)}
            onEditTask={handleEditTask}
            onOpenMessages={handleOpenMessages}
          />
        )}

        {/* VIEW 2: RESSOURCEN & AUFGABEN (Detailed task and quota manager) */}
        {currentTab === 'tasks' && (
          <div className="space-y-6">
            
            {/* Header & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{activeGame?.icon}</span>
                  <span>Ressourcen- & Quotenverwaltung ({activeGame?.name})</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Verwalte Soll-Mengen, Lagerbestände und fehlende Ressourcen für {activeGame?.name}.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setTemplatePickerOpen(true)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Aus Vorlagen</span>
                </button>
                <button
                  onClick={() => {
                    setTaskToEdit(null);
                    setTaskModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Aufgabe anlegen</span>
                </button>
              </div>
            </div>

            {/* Clean, Streamlined Filter Strip */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              
              {/* Search & Player Quick Select */}
              <div className="flex items-center gap-2.5 flex-1 flex-wrap">
                {/* Search */}
                <div className="relative min-w-[180px] max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Filtern..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Player Filter Pill Buttons */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
                  <button
                    onClick={() => setSelectedMemberId('all')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                      selectedMemberId === 'all'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    Alle Spieler
                  </button>
                  {members.map(member => (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMemberId(member.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                        selectedMemberId === member.id
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: member.avatarColor }}
                      />
                      <span>{member.name}</span>
                    </button>
                  ))}
                </div>

                {/* Status select */}
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">Alle Quoten</option>
                  <option value="in_progress">Offen (in Arbeit)</option>
                  <option value="completed">Bereits erfüllt</option>
                </select>

                {/* Category select */}
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">Alle Kategorien</option>
                  <option value="resource">Ressourcen</option>
                  <option value="building">Bauen</option>
                  <option value="crafting">Crafting</option>
                  <option value="raid">Raids</option>
                </select>
              </div>

              {/* View Switcher (Cards / Table / Board) */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-end md:self-auto shrink-0">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    viewMode === 'cards' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Kartenansicht"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Karten</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    viewMode === 'table' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Tabellenansicht"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Tabelle</span>
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    viewMode === 'kanban' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Boardansicht"
                >
                  <Columns3 className="w-3.5 h-3.5" />
                  <span>Board</span>
                </button>
              </div>

            </div>

            {/* List / Grid of Tasks */}
            {filteredTasks.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center shadow-inner">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="text-base font-bold text-white mb-1">
                  Keine Aufgaben für die aktuellen Filter
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Setze die Filter zurück oder füge neue Sammelaufgaben für Max, Susi und das Team hinzu.
                </p>
                <button
                  onClick={() => {
                    setSelectedMemberId('all');
                    setSelectedCategory('all');
                    setSelectedStatus('all');
                    setSearchQuery('');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                >
                  Filter zurücksetzen
                </button>
              </div>
            ) : viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                  />
                ))}
              </div>
            ) : viewMode === 'table' ? (
              <TaskTableView
                tasks={filteredTasks}
                onEdit={handleEditTask}
              />
            ) : (
              <KanbanView
                tasks={filteredTasks}
                onEdit={handleEditTask}
              />
            )}

          </div>
        )}

        {/* VIEW 3: WIKI & REZEPTE */}
        {currentTab === 'wiki' && (
          <WikiView onNavigateToTasks={() => setCurrentTab('tasks')} />
        )}

        {/* VIEW 4: CLAN-MITGLIEDER */}
        {currentTab === 'members' && (
          <MemberView onSelectMemberForDashboard={handleNavigateToTasksFromDashboard} />
        )}

        {/* VIEW 4: PROJEKTE & RAIDS */}
        {currentTab === 'projects' && (
          <ProjectsView
            onOpenTaskModalWithProject={handleOpenTaskForProject}
            onEditTask={handleEditTask}
          />
        )}

      </main>

      {/* Global Modals */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />

      <TemplatePickerModal
        isOpen={templatePickerOpen}
        onClose={() => setTemplatePickerOpen(false)}
      />

      <NewGameModal
        isOpen={newGameModalOpen}
        onClose={() => setNewGameModalOpen(false)}
      />

      <ExportSyncModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />

      <MessageCenterModal
        isOpen={messagesModalOpen}
        onClose={() => setMessagesModalOpen(false)}
        defaultTab={messagesDefaultTab}
        replyToMemberId={messagesReplyMemberId}
      />

      {/* Minimalistic, Unboxed Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">ClanOps</span>
            <span aria-hidden="true">·</span>
            <span>Planungssystem für Survival & Koop-Games</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Aktives Spiel: {activeGame?.name}</span>
            <span aria-hidden="true">·</span>
            <span>{gameTasks.length} Quoten angelegt</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ClanProvider>
      <ClanOpsApp />
    </ClanProvider>
  );
}
