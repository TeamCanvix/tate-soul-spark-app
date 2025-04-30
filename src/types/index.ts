
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  premium: boolean;
  role?: string;
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export interface DailyContent {
  id: string;
  date: string;
  title: string;
  content: string;
  type: 'motivation' | 'torah';
}

export interface Prayer {
  id: string;
  name: string;
  hebrewName: string;
  content: string;
}

export interface AIChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}
