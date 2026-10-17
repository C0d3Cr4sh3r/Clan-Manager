import React, { useState, useRef, useEffect } from 'react';
import { useClan } from '../context/ClanContext';
import {
  ChevronDown,
  Plus,
  Compass,
  CheckSquare,
  Users,
  Layers,
  Share2,
  BookOpen,
  Bell,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNewTask: () => void;
  onOpenTemplatePicker: () => void;
  onOpenNewGame: () => void;
  onOpenMessages: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNewTask,
  onOpenTemplatePicker,
  onOpenNewGame,
  onOpenMessages,
}) => {
  const {
    games,
    activeGameId,
    setActiveGameId,
    members,
    currentMemberId,
    setCurrentMemberId,
    getUnreadCount,
  } = useClan();

  const [gameDropdownOpen, setGameDropdownOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const activeGame = games.find(g => g.id === activeGameId) || games[0];
  const currentMember = members.find(m => m.id === currentMemberId) || members[0];
  const unreadCount = getUnreadCount(currentMemberId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setGameDropdownOpen(false);
      }
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) {
        setQuickActionOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'tasks', label: 'Ressourcen & Quoten', icon: CheckSquare },
    { id: 'wiki', label: 'Wiki & Rezepte', icon: BookOpen },
    { id: 'members', label: 'Clan-Mitglieder', icon: Users },
    { id: 'projects', label: 'Projekte & Raids', icon: Layers },
    { id: 'sync', label: 'Export & Sync', icon: Share2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark & Game Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-lg shadow-sm">
              🛡️
            </span>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              ClanOps
            </span>
          </div>

          <span className="text-slate-600 hidden sm:inline" aria-hidden="true">/</span>

          {/* Game Switcher dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setGameDropdownOpen(!gameDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-colors whitespace-nowrap"
              title="Aktives Spiel wechseln"
            >
              <span className="text-sm">{activeGame?.icon}</span>
              <span className="max-w-[120px] truncate">{activeGame?.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {gameDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  Spiele-Auswahl
                </div>
                {games.map(game => (
                  <button
                    key={game.id}
                    onClick={() => {
                      setActiveGameId(game.id);
                      setGameDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                      game.id === activeGameId
                        ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>{game.icon}</span>
                      <span className="truncate">{game.name}</span>
                    </div>
                    {game.isCustom && (
                      <span className="text-[10px] text-slate-500">Eigenes</span>
                    )}
                  </button>
                ))}
                <div className="border-t border-slate-800 my-1 pt-1">
                  <button
                    onClick={() => {
                      setGameDropdownOpen(false);
                      onOpenNewGame();
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-emerald-400 hover:bg-slate-800 flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Neues Spiel anlegen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single Line) */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-400">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 relative ${
                  isActive
                    ? 'text-emerald-400 font-semibold'
                    : 'hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Player Switcher, Message Bell & Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Active Player Profile Switcher */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/90 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
              title="Aktives Profil wechseln (z. B. als Max oder Susi testen)"
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: currentMember?.avatarColor || '#10b981' }}
              />
              <span className="font-semibold text-white max-w-[80px] sm:max-w-none truncate">
                {currentMember?.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase border-b border-slate-800">
                  Du spielst aktuell als:
                </div>
                {members.map(member => (
                  <button
                    key={member.id}
                    onClick={() => {
                      setCurrentMemberId(member.id);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                      member.id === currentMemberId
                        ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: member.avatarColor }}
                      />
                      <span className="truncate">{member.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {member.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message Bell with Unread Badge Indicator */}
          <button
            onClick={onOpenMessages}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Clan-Funk & Nachrichten anzeigen"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold font-mono flex items-center justify-center animate-pulse shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Primary CTA & Quick Dropdown */}
          <div className="relative" ref={actionRef}>
            <button
              onClick={() => setQuickActionOpen(!quickActionOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm hover:shadow-emerald-500/20 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Aufgabe anlegen</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {quickActionOpen && (
              <div className="absolute right-0 top-12 w-52 rounded-lg bg-slate-900 border border-slate-700 shadow-xl py-1.5 z-50 text-xs">
                <button
                  onClick={() => {
                    setQuickActionOpen(false);
                    onOpenNewTask();
                  }}
                  className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                >
                  <span>📝</span>
                  <span>Benutzerdefinierte Aufgabe</span>
                </button>
                <button
                  onClick={() => {
                    setQuickActionOpen(false);
                    onOpenTemplatePicker();
                  }}
                  className="w-full px-3 py-2 text-left text-emerald-400 hover:bg-slate-800 flex items-center gap-2 transition-colors font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Schnell-Ressource aus Vorlage</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden flex items-center justify-around px-2 py-2 border-t border-slate-800/80 bg-slate-900/90 text-xs overflow-x-auto">
        {navLinks.map(link => {
          const Icon = link.icon;
          const isActive = currentTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setCurrentTab(link.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded transition-colors whitespace-nowrap shrink-0 ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
