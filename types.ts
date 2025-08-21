import { User } from '@supabase/supabase-js';

export type { User };

export interface AppIdea {
  id: string;
  user_id?: string;
  problem: string;
  solution: string;
  category: 'Health' | 'Productivity' | 'Finance' | 'Other';
  marketSizeScore: number; // A score from 0 to 100
  source?: {
    url: string;
    platform: string;
  };
}

export interface ShowcaseApp {
  id: string;
  name: string;
  description: string;
  imageUrl: string; // Will be a data URL for user uploads
  appUrl?: string; // Optional URL for the live app
  category: 'Health' | 'Productivity' | 'Finance' | 'Social' | 'Other';
}

export enum SortOption {
  DEFAULT = 'Default',
  MARKET_SIZE_DESC = 'Market Size (High to Low)',
  MARKET_SIZE_ASC = 'Market Size (Low to High)',
}

export interface ForumPost {
  id: number;
  created_at: string;
  content: string;
  user_email: string;
  idea_solution?: string;
  idea_problem?: string;
}