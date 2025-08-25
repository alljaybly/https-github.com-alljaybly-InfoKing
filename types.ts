
export interface AppIdea {
  id: string;
  problem: string;
  solution: string;
  category: 'Health' | 'Productivity' | 'Finance' | 'Other';
  marketSizeScore: number; // A score from 0 to 100
  source?: {
    platform: string;
    url: string;
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

export interface PitchDeckSlideContent {
  slide: number;
  title: string;
  content: string;
  imagePrompt: string;
}

export interface PitchDeckSlide extends PitchDeckSlideContent {
  imageUrl: string;
}

export enum BuilderOption {
  STARTER_CODE = 'React Starter Code',
  AI_STUDIO = 'Google AI Studio Prompt',
  REPLIT = 'Replit Project Prompt',
}

export interface ForumPost {
  id: string;
  createdAt: string; // ISO string
  author: string;
  content: string; // The user's message
  idea?: AppIdea; // Optional AppIdea attached to the post
  parentId: string | null; // For threading
  replies?: ForumPost[]; // Populated in the client
}

export interface User {
  id: string;
  email: string;
}
