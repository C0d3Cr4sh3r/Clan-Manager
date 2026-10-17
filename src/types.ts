export type MemberRole = 'leader' | 'officer' | 'builder' | 'gatherer' | 'warrior' | 'crafter';

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  status: 'online' | 'ingame' | 'offline' | 'busy';
  avatarColor: string;
  discordTag?: string;
  notes?: string;
  joinedDate: string;
}

export type TaskCategory = 'resource' | 'building' | 'crafting' | 'raid';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface TaskSubstep {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  gameId: string;
  projectId?: string;
  title: string;
  category: TaskCategory;
  assignedMemberId: string; // member id or '' for unassigned
  currentAmount: number;
  targetAmount: number;
  unit: string;
  priority: TaskPriority;
  status: TaskStatus;
  notes?: string;
  location?: string;
  subtasks?: TaskSubstep[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  gameId: string;
  title: string;
  description: string;
  icon?: string;
  targetDate?: string;
  status: 'active' | 'completed' | 'paused';
  priority: TaskPriority;
  createdAt: string;
}

export interface Game {
  id: string;
  name: string;
  genre: string;
  icon: string;
  description: string;
  defaultCategories: string[];
  isCustom?: boolean;
}

export interface ItemTemplate {
  name: string;
  category: TaskCategory;
  defaultUnit: string;
  defaultTarget: number;
  locationHint?: string;
  icon?: string;
}

export type WikiItemCategory = 'armor' | 'weapon' | 'tool' | 'building' | 'consumable' | 'material' | 'raid_boss';

export interface RecipeIngredient {
  itemName: string;
  amount: number;
  unit?: string;
}

export interface WikiItem {
  id: string;
  gameId: string;
  name: string;
  category: WikiItemCategory;
  icon: string;
  tier?: number;
  description: string;
  craftingStation?: string;
  ingredients: RecipeIngredient[];
  locationHint?: string;
  wikiUrl?: string;
  isCustom?: boolean;
}

export type MessageType = 'direct' | 'announcement' | 'handover' | 'raid_call';

export interface ClanMessage {
  id: string;
  senderId: string;
  recipientId: string; // 'all' or memberId
  gameId?: string;
  relatedTaskId?: string;
  type: MessageType;
  title: string;
  content: string;
  timestamp: string;
  readBy: string[]; // memberIds who read the message
  isPinned?: boolean;
}
