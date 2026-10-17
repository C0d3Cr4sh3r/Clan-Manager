import React, { createContext, useContext, useState, useEffect } from 'react';
import { Game, Member, Project, Task, ItemTemplate, WikiItem, ClanMessage } from '../types';
import {
  INITIAL_GAMES,
  INITIAL_MEMBERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MESSAGES,
} from '../data/initialData';
import { INITIAL_WIKI_ITEMS } from '../data/wikiData';

interface ClanStorageState {
  games: Game[];
  activeGameId: string;
  members: Member[];
  tasks: Task[];
  projects: Project[];
  wikiItems: WikiItem[];
  messages: ClanMessage[];
  currentMemberId: string;
}

interface ClanContextType extends ClanStorageState {
  setActiveGameId: (id: string) => void;
  setCurrentMemberId: (id: string) => void;
  // Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  adjustTaskAmount: (id: string, delta: number) => void;
  setTaskAmount: (id: string, amount: number) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  // Members
  addMember: (member: Omit<Member, 'id' | 'joinedDate'>) => string;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  // Projects
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  // Games
  addCustomGame: (game: Omit<Game, 'id' | 'isCustom'>) => string;
  deleteCustomGame: (id: string) => void;
  // Fast template addition
  addFromTemplate: (template: ItemTemplate, memberId?: string, projectId?: string) => string;
  // Wiki & Recipes
  addWikiItem: (item: Omit<WikiItem, 'id'>) => string;
  deleteWikiItem: (id: string) => void;
  importWikiItemsFromJson: (jsonStr: string) => { success: boolean; count: number; error?: string };
  adoptRecipeToClanTasks: (
    recipe: WikiItem,
    memberId?: string,
    projectId?: string,
    quantity?: number
  ) => { createdCount: number; taskTitles: string[] };
  // Messages / Clan-Funk
  sendMessage: (msg: Omit<ClanMessage, 'id' | 'timestamp' | 'readBy'>) => string;
  markMessageAsRead: (messageId: string, memberId?: string) => void;
  deleteMessage: (messageId: string) => void;
  getUnreadCount: (memberId?: string) => number;
  // Import/Export & Reset
  exportDataJson: () => string;
  importDataJson: (json: string) => { success: boolean; error?: string };
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'clanops_storage_state_v1';

const ClanContext = createContext<ClanContextType | undefined>(undefined);

export const ClanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_games`);
      return saved ? JSON.parse(saved) : INITIAL_GAMES;
    } catch {
      return INITIAL_GAMES;
    }
  });

  const [activeGameId, setActiveGameId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activeGame`);
      return saved || 'grounded';
    } catch {
      return 'grounded';
    }
  });

  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_members`);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [wikiItems, setWikiItems] = useState<WikiItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_wikiItems`);
      return saved ? JSON.parse(saved) : INITIAL_WIKI_ITEMS;
    } catch {
      return INITIAL_WIKI_ITEMS;
    }
  });

  const [messages, setMessages] = useState<ClanMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  // Current active user for testing and messaging (default 'mem_1' - Max)
  const [currentMemberId, setCurrentMemberId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_currentMember`);
      return saved || 'mem_1';
    } catch {
      return 'mem_1';
    }
  });

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_games`, JSON.stringify(games));
    } catch (e) {
      console.error('Failed to save games', e);
    }
  }, [games]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_activeGame`, activeGameId);
    } catch (e) {
      console.error('Failed to save activeGame', e);
    }
  }, [activeGameId]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_members`, JSON.stringify(members));
    } catch (e) {
      console.error('Failed to save members', e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_wikiItems`, JSON.stringify(wikiItems));
    } catch (e) {
      console.error('Failed to save wikiItems', e);
    }
  }, [wikiItems]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save messages', e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_currentMember`, currentMemberId);
    } catch (e) {
      console.error('Failed to save currentMember', e);
    }
  }, [currentMemberId]);

  // Task Handlers
  const addTask = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const now = new Date().toISOString();
    const newTask: Task = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      status: data.currentAmount >= data.targetAmount ? 'completed' : data.status,
      completedAt: data.currentAmount >= data.targetAmount ? now : undefined,
    };
    setTasks(prev => [newTask, ...prev]);
    return id;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== id) return task;
        const updated = { ...task, ...updates, updatedAt: new Date().toISOString() };
        if (updated.currentAmount >= updated.targetAmount && updated.status !== 'completed') {
          updated.status = 'completed';
          updated.completedAt = new Date().toISOString();
        } else if (updated.currentAmount < updated.targetAmount && updated.status === 'completed') {
          updated.status = 'in_progress';
          updated.completedAt = undefined;
        }
        return updated;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const adjustTaskAmount = (id: string, delta: number) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== id) return task;
        const newAmount = Math.max(0, task.currentAmount + delta);
        const isDone = newAmount >= task.targetAmount;
        return {
          ...task,
          currentAmount: newAmount,
          status: isDone ? 'completed' : 'in_progress',
          completedAt: isDone ? (task.completedAt || new Date().toISOString()) : undefined,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const setTaskAmount = (id: string, amount: number) => {
    const safeAmount = Math.max(0, amount);
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== id) return task;
        const isDone = safeAmount >= task.targetAmount;
        return {
          ...task,
          currentAmount: safeAmount,
          status: isDone ? 'completed' : 'in_progress',
          completedAt: isDone ? (task.completedAt || new Date().toISOString()) : undefined,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== taskId || !task.subtasks) return task;
        const updatedSubtasks = task.subtasks.map(st =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const allCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every(st => st.completed);
        return {
          ...task,
          subtasks: updatedSubtasks,
          status: allCompleted ? 'completed' : 'in_progress',
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Member Handlers
  const addMember = (data: Omit<Member, 'id' | 'joinedDate'>) => {
    const id = `mem_${Date.now()}`;
    const newMember: Member = {
      ...data,
      id,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setMembers(prev => [...prev, newMember]);
    return id;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMember = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.assignedMemberId === id ? { ...t, assignedMemberId: '' } : t))
    );
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  // Project Handlers
  const addProject = (data: Omit<Project, 'id' | 'createdAt'>) => {
    const id = `proj_${Date.now()}`;
    const newProj: Project = {
      ...data,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects(prev => [...prev, newProj]);
    return id;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProject = (id: string) => {
    setTasks(prev => prev.map(t => (t.projectId === id ? { ...t, projectId: undefined } : t)));
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Game Handlers
  const addCustomGame = (data: Omit<Game, 'id' | 'isCustom'>) => {
    const id = `game_custom_${Date.now()}`;
    const newGame: Game = {
      ...data,
      id,
      isCustom: true,
    };
    setGames(prev => [...prev, newGame]);
    setActiveGameId(id);
    return id;
  };

  const deleteCustomGame = (id: string) => {
    setTasks(prev => prev.filter(t => t.gameId !== id));
    setProjects(prev => prev.filter(p => p.gameId !== id));
    setWikiItems(prev => prev.filter(w => w.gameId !== id));
    setMessages(prev => prev.filter(m => m.gameId !== id));
    setGames(prev => prev.filter(g => g.id !== id));
    if (activeGameId === id) {
      setActiveGameId('grounded');
    }
  };

  // Template Fast Add
  const addFromTemplate = (template: ItemTemplate, memberId?: string, projectId?: string) => {
    return addTask({
      gameId: activeGameId,
      projectId: projectId || undefined,
      title: `${template.icon ? template.icon + ' ' : ''}${template.name}`,
      category: template.category,
      assignedMemberId: memberId || '',
      currentAmount: 0,
      targetAmount: template.defaultTarget,
      unit: template.defaultUnit,
      priority: 'medium',
      status: 'in_progress',
      location: template.locationHint,
      notes: `Vorgefertigte Clan-Aufgabe für ${template.name}`,
    });
  };

  // Wiki Handlers
  const addWikiItem = (item: Omit<WikiItem, 'id'>) => {
    const id = `wiki_custom_${Date.now()}`;
    const newItem: WikiItem = {
      ...item,
      id,
      isCustom: true,
    };
    setWikiItems(prev => [newItem, ...prev]);
    return id;
  };

  const deleteWikiItem = (id: string) => {
    setWikiItems(prev => prev.filter(w => w.id !== id));
  };

  const importWikiItemsFromJson = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      const itemsToImport = Array.isArray(parsed) ? parsed : parsed.wikiItems || parsed.items;
      if (!Array.isArray(itemsToImport) || itemsToImport.length === 0) {
        return { success: false, count: 0, error: 'Keine gültige Liste von Wiki-Items im JSON gefunden.' };
      }

      const validItems: WikiItem[] = [];
      itemsToImport.forEach((raw: any, index: number) => {
        if (raw.name) {
          validItems.push({
            id: raw.id || `wiki_imp_${Date.now()}_${index}`,
            gameId: raw.gameId || activeGameId,
            name: raw.name,
            category: raw.category || 'material',
            icon: raw.icon || '📦',
            tier: raw.tier || 1,
            description: raw.description || '',
            craftingStation: raw.craftingStation || 'Werkbank',
            ingredients: Array.isArray(raw.ingredients) ? raw.ingredients : [],
            locationHint: raw.locationHint || '',
            wikiUrl: raw.wikiUrl || '',
            isCustom: true,
          });
        }
      });

      if (validItems.length === 0) {
        return { success: false, count: 0, error: 'Keine Gegenstände mit Namen gefunden.' };
      }

      setWikiItems(prev => [...validItems, ...prev]);
      return { success: true, count: validItems.length };
    } catch {
      return { success: false, count: 0, error: 'JSON Syntax-Fehler beim Lesen der Wiki-Daten.' };
    }
  };

  const adoptRecipeToClanTasks = (
    recipe: WikiItem,
    memberId?: string,
    projectId?: string,
    quantity: number = 1
  ) => {
    const qty = Math.max(1, quantity);
    const createdTitles: string[] = [];

    if (recipe.ingredients && recipe.ingredients.length > 0) {
      recipe.ingredients.forEach(ing => {
        const target = ing.amount * qty;
        const taskTitle = `${ing.itemName} (für ${recipe.name}${qty > 1 ? ` x${qty}` : ''})`;
        createdTitles.push(taskTitle);

        addTask({
          gameId: recipe.gameId,
          projectId: projectId || undefined,
          title: taskTitle,
          category: 'resource',
          assignedMemberId: memberId || '',
          currentAmount: 0,
          targetAmount: target,
          unit: ing.unit || 'Stück',
          priority: recipe.category === 'raid_boss' ? 'urgent' : 'high',
          status: 'in_progress',
          location: recipe.locationHint,
          notes: `Rezept: ${recipe.name} an ${recipe.craftingStation || 'Werkbank'}. Benötigt ${target}x ${ing.itemName}.`,
        });
      });
    } else {
      const taskTitle = `${recipe.name}${qty > 1 ? ` x${qty}` : ''}`;
      createdTitles.push(taskTitle);

      addTask({
        gameId: recipe.gameId,
        projectId: projectId || undefined,
        title: taskTitle,
        category: recipe.category === 'building' ? 'building' : 'crafting',
        assignedMemberId: memberId || '',
        currentAmount: 0,
        targetAmount: qty,
        unit: 'Stück',
        priority: 'medium',
        status: 'in_progress',
        location: recipe.locationHint,
        notes: recipe.description,
      });
    }

    return { createdCount: createdTitles.length, taskTitles: createdTitles };
  };

  // Messaging Handlers
  const sendMessage = (msgData: Omit<ClanMessage, 'id' | 'timestamp' | 'readBy'>) => {
    const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newMsg: ClanMessage = {
      ...msgData,
      id,
      timestamp: new Date().toISOString(),
      readBy: [msgData.senderId], // sender has read their own message
    };
    setMessages(prev => [newMsg, ...prev]);
    return id;
  };

  const markMessageAsRead = (messageId: string, memberId?: string) => {
    const targetMember = memberId || currentMemberId;
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id !== messageId) return msg;
        if (msg.readBy.includes(targetMember)) return msg;
        return {
          ...msg,
          readBy: [...msg.readBy, targetMember],
        };
      })
    );
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  const getUnreadCount = (memberId?: string) => {
    const targetMember = memberId || currentMemberId;
    return messages.filter(msg => {
      // either sent directly to this member or to 'all'
      const isRecipient = msg.recipientId === targetMember || msg.recipientId === 'all';
      const isSender = msg.senderId === targetMember;
      if (isSender) return false;
      const isUnread = !msg.readBy.includes(targetMember);
      return isRecipient && isUnread;
    }).length;
  };

  // Import / Export
  const exportDataJson = () => {
    const payload: ClanStorageState = {
      games,
      activeGameId,
      members,
      tasks,
      projects,
      wikiItems,
      messages,
      currentMemberId,
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJson = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr) as Partial<ClanStorageState>;
      if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
        return { success: false, error: 'Ungültiges Format: Keine Aufgabenliste gefunden.' };
      }
      if (parsed.games && Array.isArray(parsed.games)) setGames(parsed.games);
      if (parsed.members && Array.isArray(parsed.members)) setMembers(parsed.members);
      if (parsed.tasks && Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
      if (parsed.projects && Array.isArray(parsed.projects)) setProjects(parsed.projects);
      if (parsed.wikiItems && Array.isArray(parsed.wikiItems)) setWikiItems(parsed.wikiItems);
      if (parsed.messages && Array.isArray(parsed.messages)) setMessages(parsed.messages);
      if (parsed.activeGameId) setActiveGameId(parsed.activeGameId);
      if (parsed.currentMemberId) setCurrentMemberId(parsed.currentMemberId);
      return { success: true };
    } catch {
      return { success: false, error: 'JSON Syntax-Fehler. Bitte überprüfe den Code.' };
    }
  };

  const resetToDefaults = () => {
    setGames(INITIAL_GAMES);
    setActiveGameId('grounded');
    setMembers(INITIAL_MEMBERS);
    setTasks(INITIAL_TASKS);
    setProjects(INITIAL_PROJECTS);
    setWikiItems(INITIAL_WIKI_ITEMS);
    setMessages(INITIAL_MESSAGES);
    setCurrentMemberId('mem_1');
    localStorage.removeItem(`${STORAGE_KEY}_games`);
    localStorage.removeItem(`${STORAGE_KEY}_activeGame`);
    localStorage.removeItem(`${STORAGE_KEY}_members`);
    localStorage.removeItem(`${STORAGE_KEY}_tasks`);
    localStorage.removeItem(`${STORAGE_KEY}_projects`);
    localStorage.removeItem(`${STORAGE_KEY}_wikiItems`);
    localStorage.removeItem(`${STORAGE_KEY}_messages`);
    localStorage.removeItem(`${STORAGE_KEY}_currentMember`);
  };

  return (
    <ClanContext.Provider
      value={{
        games,
        activeGameId,
        members,
        tasks,
        projects,
        wikiItems,
        messages,
        currentMemberId,
        setActiveGameId,
        setCurrentMemberId,
        addTask,
        updateTask,
        deleteTask,
        adjustTaskAmount,
        setTaskAmount,
        toggleSubtask,
        addMember,
        updateMember,
        deleteMember,
        addProject,
        updateProject,
        deleteProject,
        addCustomGame,
        deleteCustomGame,
        addFromTemplate,
        addWikiItem,
        deleteWikiItem,
        importWikiItemsFromJson,
        adoptRecipeToClanTasks,
        sendMessage,
        markMessageAsRead,
        deleteMessage,
        getUnreadCount,
        exportDataJson,
        importDataJson,
        resetToDefaults,
      }}
    >
      {children}
    </ClanContext.Provider>
  );
};

export const useClan = () => {
  const context = useContext(ClanContext);
  if (!context) {
    throw new Error('useClan must be used within a ClanProvider');
  }
  return context;
};
