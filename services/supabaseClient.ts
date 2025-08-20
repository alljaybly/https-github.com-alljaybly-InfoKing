
import { AppIdea, ShowcaseApp } from '../types';

// --- HACKATHON NOTE: MOCK SUPABASE CLIENT ---
// This is a mock client that uses browser localStorage to simulate
// a database and provide offline capabilities. For a real deployment,
// you would replace this with the actual Supabase client.

const IDEAS_STORAGE_KEY = 'infoKingIdeas';
const SHOWCASE_APPS_STORAGE_KEY = 'infoKingShowcaseApps';

/**
 * --- HOW TO INTEGRATE REAL SUPABASE ---
 * 1. Sign up for a free account at supabase.com and create a new project.
 * 2. Go to Project Settings > API and find your Project URL and anon key.
 * 3. Install the Supabase client: `npm install @supabase/supabase-js`
 * 4. Uncomment the code below and replace the placeholders.
 * 5. Update the functions to use the real client.
 */

/*
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

// A real Supabase client would look like this:
const supabase = createClient(supabaseUrl, supabaseKey);

// You would also define your table structure in the Supabase dashboard.
// For example, tables 'ideas' and 'showcase_apps'.
*/


// Mock implementation for App Ideas
export const getIdeas = async (): Promise<AppIdea[]> => {
  console.log("Mock Supabase: Fetching ideas from localStorage.");
  try {
    const storedIdeas = localStorage.getItem(IDEAS_STORAGE_KEY);
    return storedIdeas ? JSON.parse(storedIdeas) : [];
  } catch (error) {
    console.error("Failed to parse ideas from localStorage", error);
    return [];
  }
};

export const addIdeas = async (newIdeas: AppIdea[]): Promise<AppIdea[]> => {
  console.log("Mock Supabase: Saving new ideas to localStorage.");
  const existingIdeas = await getIdeas();
  // Filter out any potential duplicates by problem statement
  const uniqueNewIdeas = newIdeas.filter(
    (newIdea) => !existingIdeas.some((existing) => existing.problem === newIdea.problem)
  );

  const allIdeas = [...uniqueNewIdeas, ...existingIdeas];
  localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(allIdeas));
  return allIdeas;
};

// Mock implementation for Showcase Apps
export const getShowcaseApps = async (): Promise<ShowcaseApp[]> => {
  console.log("Mock Supabase: Fetching showcase apps from localStorage.");
  try {
    const storedApps = localStorage.getItem(SHOWCASE_APPS_STORAGE_KEY);
    // Add some default apps if storage is empty for demonstration
    if (!storedApps) {
        const defaultApps: ShowcaseApp[] = [
            { id: 'app-1', name: 'Zenith Focus', description: 'An AI-powered productivity app that minimizes distractions and suggests optimal break times.', imageUrl: 'https://placehold.co/600x400/22d3ee/FFFFFF/png?text=Zenith+Focus', category: 'Productivity' },
            { id: 'app-2', name: 'NutriMind', description: 'A health app that tracks mood and food intake, providing AI-driven nutritional advice.', imageUrl: 'https://placehold.co/600x400/f472b6/FFFFFF/png?text=NutriMind', category: 'Health' },
            { id: 'app-3', name: 'CoinWise', description: 'A gamified finance tracker for young adults that makes budgeting and saving engaging.', imageUrl: 'https://placehold.co/600x400/34d399/FFFFFF/png?text=CoinWise', category: 'Finance' },
        ];
        localStorage.setItem(SHOWCASE_APPS_STORAGE_KEY, JSON.stringify(defaultApps));
        return defaultApps;
    }
    return JSON.parse(storedApps);
  } catch (error) {
    console.error("Failed to parse showcase apps from localStorage", error);
    return [];
  }
};

export const addShowcaseApp = async (newApp: ShowcaseApp): Promise<ShowcaseApp[]> => {
    console.log("Mock Supabase: Saving new showcase app to localStorage.");
    const existingApps = await getShowcaseApps();
    const allApps = [newApp, ...existingApps];
    localStorage.setItem(SHOWCASE_APPS_STORAGE_KEY, JSON.stringify(allApps));
    return allApps;
};