export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Insane';
export type RoomCategory = 'All' | 'Web Exploitation' | 'Privilege Escalation' | 'Network Security' | 'Cryptography' | 'Forensics & SOC' | 'Active Directory';

export interface Question {
  id: string;
  prompt: string;
  answerHint?: string;
  expectedAnswers: string[]; // Valid flags or answers (case-tolerant)
  points: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  theory?: string;
  questions: Question[];
}

export interface TargetMachine {
  ip: string;
  hostname: string;
  os: 'Linux Ubuntu 22.04 LTS' | 'Debian 11' | 'Windows Server 2022' | 'Alpine Linux';
  status: 'offline' | 'starting' | 'online';
  uptimeSeconds: number;
  openPorts: {
    port: number;
    protocol: string;
    service: string;
    version: string;
    state: 'open' | 'filtered' | 'closed';
  }[];
  webApp?: {
    title: string;
    type: 'sqli' | 'lfi' | 'command_injection' | 'recon_portal' | 'tutorial_portal';
    path: string;
  };
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  locale: string;
  signedInAt: string;
}

export interface Room {
  id: string;
  title: string;
  slug: string;
  category: RoomCategory;
  difficulty: Difficulty;
  estimatedMinutes: number;
  totalXp: number;
  description: string;
  image: string;
  tags: string[];
  isVipOnlyInOriginalTHM: boolean; // Highlights that this is completely free here!
  targetMachine: TargetMachine;
  tasks: Task[];
}

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  estimatedHours: number;
  careerRole: string;
  modulesCount: number;
  roomIds: string[];
  bannerColor: string;
}

export interface UserStats {
  username: string;
  email: string;
  xp: number;
  rankTitle: string;
  level: number;
  streakDays: number;
  completedQuestions: Record<string, boolean>; // questionId -> boolean
  completedRooms: string[];
  activeMachineRoomId: string | null;
  savedCustomRooms: Room[];
}

export interface CommandOutput {
  id: string;
  type: 'input' | 'stdout' | 'stderr' | 'system' | 'success';
  text: string;
}
