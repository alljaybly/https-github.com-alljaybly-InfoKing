
export interface AppIdea {
  id: string;
  problem: string;
  solution: string;
  category: 'Health' | 'Productivity' | 'Finance' | 'Other';
  marketSizeScore: number; // A score from 0 to 100
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