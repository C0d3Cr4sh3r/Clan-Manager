import { Game, Member, Project, Task, ItemTemplate, ClanMessage } from '../types';

export const INITIAL_GAMES: Game[] = [
  {
    id: 'grounded',
    name: 'Grounded',
    genre: 'Survival & Crafting',
    icon: '🐜',
    description: 'Im Garten geschrumpft: Basenbau, Insektenjagd und Ressourcen sammeln.',
    defaultCategories: ['resource', 'building', 'crafting', 'raid'],
  },
  {
    id: 'palworld',
    name: 'Palworld',
    genre: 'Monster-Catching & Survival',
    icon: '🐾',
    description: 'Pals fangen, automatisierte Fabriken bauen und legendäre Bosse besiegen.',
    defaultCategories: ['resource', 'building', 'crafting', 'raid'],
  },
  {
    id: 'valheim',
    name: 'Valheim',
    genre: 'Viking Survival',
    icon: '⚔️',
    description: 'Wikinger-Erkundung, Met-Brauen, Erzminen in den Sümpfen und Wächter-Kämpfe.',
    defaultCategories: ['resource', 'building', 'crafting', 'raid'],
  },
  {
    id: 'rust',
    name: 'Rust',
    genre: 'PvP Survival & Base Defense',
    icon: '☢️',
    description: 'Hochsicherheits-Basen bauen, HQM farmen und C4/Raid-Vorbereitungen planen.',
    defaultCategories: ['resource', 'building', 'crafting', 'raid'],
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    genre: 'Sandbox Survival',
    icon: '⛏️',
    description: 'Mega-Bauprojekte, Netherit-Farming, XP-Farmen und Enderdrachen-Raid.',
    defaultCategories: ['resource', 'building', 'crafting', 'raid'],
  },
  {
    id: 'enshrouded',
    name: 'Enshrouded',
    genre: 'Action-RPG Survival',
    icon: '🔥',
    description: 'Das Miasma bezwingen, Flammenstufen aufwerten und Festungen errichten.',
    defaultCategories: ['resource', 'building', 'crafting', 'raid'],
  },
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem_1',
    name: 'Max',
    role: 'gatherer',
    status: 'ingame',
    avatarColor: '#10b981', // Emerald
    discordTag: 'Maximus#4120',
    notes: 'Haupt-Sammler für Holz, Steine & Gras',
    joinedDate: '2026-01-10',
  },
  {
    id: 'mem_2',
    name: 'Susi',
    role: 'warrior',
    status: 'online',
    avatarColor: '#ec4899', // Pink
    discordTag: 'SusiSpider#9812',
    notes: 'Spezialisiert auf Spinnen-Jagd & Seidenproduktion',
    joinedDate: '2026-01-12',
  },
  {
    id: 'mem_3',
    name: 'Alex',
    role: 'builder',
    status: 'ingame',
    avatarColor: '#3b82f6', // Blue
    discordTag: 'AlexArchitect#2231',
    notes: 'Chef-Architekt unserer Eichen-Hauptbasis',
    joinedDate: '2026-01-08',
  },
  {
    id: 'mem_4',
    name: 'Sarah',
    role: 'leader',
    status: 'online',
    avatarColor: '#f59e0b', // Amber
    discordTag: 'SarahQueen#0001',
    notes: 'Clan-Leiterin & Koordinatorin aller Raids',
    joinedDate: '2026-01-01',
  },
  {
    id: 'mem_5',
    name: 'Lukas',
    role: 'crafter',
    status: 'offline',
    avatarColor: '#8b5cf6', // Violet
    discordTag: 'LukasForge#7734',
    notes: 'Schmiedet Rüstungen & braut Smoothies/Tränke',
    joinedDate: '2026-01-20',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_grounded_base',
    gameId: 'grounded',
    title: 'Große Eichen-Baumbasis (Phase 2)',
    description: 'Massiver Ausbau der Plattform-Basis am großen Eichenbaum mit Aussichtsturm und Lagerhalle.',
    icon: '🌳',
    targetDate: '2026-10-25',
    status: 'active',
    priority: 'high',
    createdAt: '2026-10-10',
  },
  {
    id: 'proj_grounded_raid',
    gameId: 'grounded',
    title: 'Hecken-Brutmutter Boss-Raid',
    description: 'Vollständige Vorbereitung für den ersten Brutmutter-Kampf im Hecken-Labyrinth.',
    icon: '🕷️',
    targetDate: '2026-10-20',
    status: 'active',
    priority: 'urgent',
    createdAt: '2026-10-14',
  },
  {
    id: 'proj_palworld_factory',
    gameId: 'palworld',
    title: 'Erz- & Sphären-Produktionsstätte',
    description: 'Automatisierte Produktionslinien für Pal-Metall und Hyper-Sphären.',
    icon: '⚡',
    targetDate: '2026-10-30',
    status: 'active',
    priority: 'medium',
    createdAt: '2026-10-12',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_1',
    gameId: 'grounded',
    projectId: 'proj_grounded_base',
    title: 'Grasplatten beschaffen',
    category: 'resource',
    assignedMemberId: 'mem_1', // Max
    currentAmount: 32,
    targetAmount: 50,
    unit: 'Platten',
    priority: 'high',
    status: 'in_progress',
    notes: 'Rund um den großen Baum fällen und mit Tragegestell transportieren',
    location: 'Großer Eichenbaum',
    createdAt: '2026-10-15T09:00:00Z',
    updatedAt: '2026-10-16T11:30:00Z',
  },
  {
    id: 'task_2',
    gameId: 'grounded',
    projectId: 'proj_grounded_raid',
    title: 'Spinnenfäden sammeln',
    category: 'resource',
    assignedMemberId: 'mem_2', // Susi
    currentAmount: 65,
    targetAmount: 100,
    unit: 'Fäden',
    priority: 'urgent',
    status: 'in_progress',
    notes: 'Spinnenweben im Heckenbereich und Blumenbeet mit Dolch zerschneiden',
    location: 'Hecken-Gebiet & Blumenbeet',
    createdAt: '2026-10-15T10:15:00Z',
    updatedAt: '2026-10-16T12:00:00Z',
  },
  {
    id: 'task_3',
    gameId: 'grounded',
    projectId: 'proj_grounded_base',
    title: 'Unkraut-Stängel für Pfeiler',
    category: 'resource',
    assignedMemberId: 'mem_3', // Alex
    currentAmount: 18,
    targetAmount: 30,
    unit: 'Stängel',
    priority: 'medium',
    status: 'in_progress',
    notes: 'Löwenzahn mit Axt Stufe 1 fällen',
    location: 'Südwiese',
    createdAt: '2026-10-15T14:00:00Z',
    updatedAt: '2026-10-16T10:00:00Z',
  },
  {
    id: 'task_4',
    gameId: 'grounded',
    projectId: 'proj_grounded_raid',
    title: 'Marienkäfer-Brocken für Rüstungsset',
    category: 'crafting',
    assignedMemberId: 'mem_3', // Alex
    currentAmount: 12,
    targetAmount: 20,
    unit: 'Brocken',
    priority: 'high',
    status: 'in_progress',
    notes: 'Marienkäfer bei den Holzplanken jagen',
    location: 'Gartenpfad Nord',
    createdAt: '2026-10-14T16:00:00Z',
    updatedAt: '2026-10-16T08:45:00Z',
  },
  {
    id: 'task_5',
    gameId: 'grounded',
    projectId: 'proj_grounded_base',
    title: 'Eichelschalen für Geländer & Dach',
    category: 'resource',
    assignedMemberId: 'mem_1', // Max
    currentAmount: 40,
    targetAmount: 40,
    unit: 'Schalen',
    priority: 'medium',
    status: 'completed',
    notes: 'Bereits vollständig im Kistenlager 1 verstaut!',
    location: 'Baumwurzeln',
    createdAt: '2026-10-13T11:00:00Z',
    updatedAt: '2026-10-16T09:15:00Z',
    completedAt: '2026-10-16T09:15:00Z',
  },
  {
    id: 'task_6',
    gameId: 'grounded',
    projectId: 'proj_grounded_raid',
    title: 'Brutmutter-Köder im Ofen brauen',
    category: 'raid',
    assignedMemberId: 'mem_4', // Sarah
    currentAmount: 1,
    targetAmount: 2,
    unit: 'Köder',
    priority: 'urgent',
    status: 'in_progress',
    notes: 'Rezept: 1x Insektenbrut-Köder benötigt Marienkäfer-Teil + Spinnen-Reißzahn',
    location: 'Alchemie-Tisch Basis',
    subtasks: [
      { id: 'sub_1', title: '1x Brutmutter BLT Rezept im Hecken-Labor finden', completed: true },
      { id: 'sub_2', title: 'Giftresistenz-Mutation "Mithridatismus" aktivieren', completed: true },
      { id: 'sub_3', title: '20x Heilende Faserbandagen herstellen', completed: false },
      { id: 'sub_4', title: 'Minz-Streitkolben schärfen (Stufe 5)', completed: false },
    ],
    createdAt: '2026-10-15T18:00:00Z',
    updatedAt: '2026-10-16T12:05:00Z',
  },
  {
    id: 'task_7',
    gameId: 'grounded',
    projectId: 'proj_grounded_base',
    title: 'Hauptplattform-Boden verlegen',
    category: 'building',
    assignedMemberId: 'mem_3', // Alex
    currentAmount: 15,
    targetAmount: 25,
    unit: 'Abschnitte',
    priority: 'medium',
    status: 'in_progress',
    notes: 'Warten auf die restlichen Grasplatten von Max',
    location: 'Eichenbaum Ast 2',
    createdAt: '2026-10-15T15:30:00Z',
    updatedAt: '2026-10-16T11:00:00Z',
  },
  // Palworld example tasks
  {
    id: 'task_8',
    gameId: 'palworld',
    projectId: 'proj_palworld_factory',
    title: 'Pal-Metallbarren schmelzen',
    category: 'crafting',
    assignedMemberId: 'mem_5', // Lukas
    currentAmount: 45,
    targetAmount: 100,
    unit: 'Barren',
    priority: 'high',
    status: 'in_progress',
    notes: 'Elektrischer Schmelzofen mit Jormuntide Ignis',
    location: 'Basis Alpha',
    createdAt: '2026-10-14T10:00:00Z',
    updatedAt: '2026-10-16T07:20:00Z',
  },
  {
    id: 'task_9',
    gameId: 'palworld',
    projectId: 'proj_palworld_factory',
    title: 'Schwefel aus Vulkanminen abbauen',
    category: 'resource',
    assignedMemberId: 'mem_1', // Max
    currentAmount: 120,
    targetAmount: 200,
    unit: 'Stück',
    priority: 'medium',
    status: 'in_progress',
    notes: 'Mit Tragepal im Vulkan-Biom farmen',
    location: 'Mount Obsidian',
    createdAt: '2026-10-15T08:00:00Z',
    updatedAt: '2026-10-16T09:30:00Z',
  },
];

export const GAME_ITEM_TEMPLATES: Record<string, ItemTemplate[]> = {
  grounded: [
    { name: 'Grasplatten', category: 'resource', defaultUnit: 'Platten', defaultTarget: 50, locationHint: 'Wiese / Eichenbaum', icon: '🌿' },
    { name: 'Spinnenfäden', category: 'resource', defaultUnit: 'Fäden', defaultTarget: 100, locationHint: 'Hecke / Blumenbeet', icon: '🕸️' },
    { name: 'Unkraut-Stängel', category: 'resource', defaultUnit: 'Stängel', defaultTarget: 30, locationHint: 'Löwenzahnfelder', icon: '🎋' },
    { name: 'Marienkäfer-Brocken', category: 'crafting', defaultUnit: 'Brocken', defaultTarget: 20, locationHint: 'Gartenpfade', icon: '🐞' },
    { name: 'Eichelschalen', category: 'resource', defaultUnit: 'Schalen', defaultTarget: 40, locationHint: 'Eichenbaum Wurzeln', icon: '🌰' },
    { name: 'Seidenseil', category: 'crafting', defaultUnit: 'Seile', defaultTarget: 25, locationHint: 'Spinnrad in der Basis', icon: '🧶' },
    { name: 'Stinkkäfer-Teile', category: 'crafting', defaultUnit: 'Teile', defaultTarget: 15, locationHint: 'Trockengras-Gebiet', icon: '🪲' },
    { name: 'Pilzziegel', category: 'building', defaultUnit: 'Ziegel', defaultTarget: 100, locationHint: 'Mahlwerk & Ofen', icon: '🧱' },
    { name: 'Hecken-Brutmutter Vorbereitung', category: 'raid', defaultUnit: 'Phasen', defaultTarget: 4, locationHint: 'Hecken-Labyrinth', icon: '🕷️' },
  ],
  palworld: [
    { name: 'Pal-Metallbarren', category: 'crafting', defaultUnit: 'Barren', defaultTarget: 100, locationHint: 'Elektrischer Schmelzofen', icon: '🪙' },
    { name: 'Hyper-Sphären', category: 'crafting', defaultUnit: 'Sphären', defaultTarget: 50, locationHint: 'Sphären-Fließband', icon: '🔮' },
    { name: 'Schwefelerz', category: 'resource', defaultUnit: 'Stück', defaultTarget: 200, locationHint: 'Vulkan / Dungeons', icon: '🌋' },
    { name: 'Kuchen für Zucht', category: 'crafting', defaultUnit: 'Kuchen', defaultTarget: 10, locationHint: 'Kochtopf in Farm', icon: '🎂' },
    { name: 'Reine Quarzbrocken', category: 'resource', defaultUnit: 'Stück', defaultTarget: 80, locationHint: 'Astralberg Schnee-Biom', icon: '💎' },
  ],
  valheim: [
    { name: 'Eisenschrott', category: 'resource', defaultUnit: 'Stück', defaultTarget: 60, locationHint: 'Versunkene Krypten (Sumpf)', icon: '⛓️' },
    { name: 'Kernholz', category: 'resource', defaultUnit: 'Stämme', defaultTarget: 50, locationHint: 'Kiefern im Dunkelwald', icon: '🌲' },
    { name: 'Silbererz', category: 'resource', defaultUnit: 'Barren', defaultTarget: 40, locationHint: 'Gebirge mit Wünschelrute', icon: '❄️' },
    { name: 'Wolfsfelle', category: 'crafting', defaultUnit: 'Felle', defaultTarget: 20, locationHint: 'Gebirgs-Wölfe', icon: '🐺' },
  ],
  rust: [
    { name: 'Hochwertiges Metall (HQM)', category: 'resource', defaultUnit: 'HQM', defaultTarget: 150, locationHint: 'Großer Ofen / Monumente', icon: '🛡️' },
    { name: 'Schwefel & Schwarzpulver', category: 'crafting', defaultUnit: 'Stück', defaultTarget: 1000, locationHint: 'Wüsten-Schwefelfelsen', icon: '🧨' },
    { name: 'Schrott (Scrap)', category: 'resource', defaultUnit: 'Scrap', defaultTarget: 750, locationHint: 'Straßenfässer & Launch Site', icon: '⚙️' },
    { name: 'C4 Sprengladungen', category: 'crafting', defaultUnit: 'Ladungen', defaultTarget: 8, locationHint: 'Werkbank Stufe 3', icon: '💣' },
  ],
  minecraft: [
    { name: 'Diamanten', category: 'resource', defaultUnit: 'Diamanten', defaultTarget: 64, locationHint: 'Y-Koordinate -58', icon: '💎' },
    { name: 'Netherit-Schrott', category: 'resource', defaultUnit: 'Barren', defaultTarget: 16, locationHint: 'Antiker Schrott im Nether', icon: '⬛' },
    { name: 'Schleimbälle', category: 'resource', defaultUnit: 'Bälle', defaultTarget: 64, locationHint: 'Sumpf bei Vollmond', icon: '🟢' },
  ],
  enshrouded: [
    { name: 'Miasma-Seelenkerne', category: 'crafting', defaultUnit: 'Kerne', defaultTarget: 10, locationHint: 'Miasma-Wurzeln fällen', icon: '🔮' },
    { name: 'Kupferbarren', category: 'resource', defaultUnit: 'Barren', defaultTarget: 50, locationHint: 'Schmiedeofen', icon: '🪨' },
  ],
};

export const ROLE_LABELS: Record<string, { label: string; icon: string; desc: string }> = {
  leader: { label: 'Clan-Leiter', icon: '👑', desc: 'Verwaltung, Planung & Koordination' },
  officer: { label: 'Offizier', icon: '⭐', desc: 'Aufgaben-Zuweisung & Team-Leitung' },
  builder: { label: 'Baumeister', icon: '🏗️', desc: 'Architektur, Basenbau & Planung' },
  gatherer: { label: 'Sammler', icon: '🎒', desc: 'Ressourcen-Beschaffung & Quoten' },
  warrior: { label: 'Krieger / Jäger', icon: '🗡️', desc: 'Boss-Raids, Insektenjagd & Verteidigung' },
  crafter: { label: 'Handwerker / Schmied', icon: '⚒️', desc: 'Ausrüstung, Alchemie & Veredelung' },
};

export const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  resource: { label: 'Ressource', icon: '📦', color: 'emerald' },
  building: { label: 'Bauprojekt', icon: '🏛️', color: 'blue' },
  crafting: { label: 'Crafting & Gear', icon: '🔨', color: 'amber' },
  raid: { label: 'Boss-Raid & Event', icon: '⚔️', color: 'rose' },
};

export const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  low: { label: 'Niedrig', color: 'slate' },
  medium: { label: 'Mittel', color: 'blue' },
  high: { label: 'Hoch', color: 'amber' },
  urgent: { label: 'Dringend', color: 'rose' },
};

export const INITIAL_MESSAGES: ClanMessage[] = [
  {
    id: 'msg_1',
    senderId: 'mem_2', // Susi
    recipientId: 'mem_1', // Max
    gameId: 'grounded',
    relatedTaskId: 'task_1',
    type: 'handover',
    title: 'Grasplatten in Kiste 2 deponiert',
    content: 'Hi Max! Ich habe auf dem Rückweg von der Hecke noch 15 Grasplatten mitgebracht und direkt in Kiste 2 an der Baumbasis gelegt, damit du schneller fertig wirst!',
    timestamp: '2026-10-16T11:45:00Z',
    readBy: [],
  },
  {
    id: 'msg_2',
    senderId: 'mem_4', // Sarah
    recipientId: 'all', // Clan announcement
    gameId: 'grounded',
    relatedTaskId: 'task_6',
    type: 'raid_call',
    title: 'Brutmutter-Raid Vorbereitung & Treffpunkt',
    content: 'Achtung Clan: Für den Brutmutter-Raid fehlen uns noch Faserbandagen und der Minz-Streitkolben. Bitte prüft eure Quoten. Treffpunkt heute Abend am Hecken-Labor!',
    timestamp: '2026-10-16T10:30:00Z',
    readBy: ['mem_4'],
    isPinned: true,
  },
  {
    id: 'msg_3',
    senderId: 'mem_3', // Alex
    recipientId: 'mem_2', // Susi
    gameId: 'grounded',
    relatedTaskId: 'task_2',
    type: 'direct',
    title: 'Spinnenseide für Werkzeuge',
    content: 'Hey Susi, sobald du mit den Spinnenfäden durch bist: Wir brauchen noch Seidenseile für die Insekten-Axt Stufe 2. Danke dir fürs Farmen!',
    timestamp: '2026-10-16T09:15:00Z',
    readBy: [],
  },
];
