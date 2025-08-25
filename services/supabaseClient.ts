import { AppIdea, ShowcaseApp, ForumPost, User } from '../types';

// --- HACKATHON NOTE: MOCK SUPABASE CLIENT ---
// This is a mock client that uses browser localStorage to simulate
// a database and provide offline capabilities. For a real deployment,
// you would replace this with the actual Supabase client.

const IDEAS_STORAGE_KEY_PREFIX = 'infoKingIdeas_';
const SHOWCASE_APPS_STORAGE_KEY = 'infoKingShowcaseApps';
const FORUM_POSTS_STORAGE_KEY = 'infoKingForumPosts';
const AUTH_STORAGE_KEY = 'infoKingUser';

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

// --- MOCK AUTHENTICATION ---

export const getCurrentUser = (): User | null => {
  try {
    const userJson = localStorage.getItem(AUTH_STORAGE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    return null;
  }
};

export const signUp = async (email: string, password?: string): Promise<{ user: User | null; error: Error | null; }> => {
  console.log("Mock Supabase: Signing up user", email, password);
  // In a real scenario, you'd have validation and error handling here.
  const newUser: User = { id: self.crypto.randomUUID(), email };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
  return { user: newUser, error: null };
};

export const signIn = async (email: string, password?: string): Promise<{ user: User | null; error: Error | null; }> => {
  console.log("Mock Supabase: Signing in user", email, password);
  // This mock simply creates a new user or "logs in" an existing one.
  return signUp(email, password);
};

export const signInWithGoogle = async (): Promise<{ user: User | null; error: Error | null; }> => {
  console.log("Mock Supabase: Signing in with Google");
  // This mock creates a fake google user.
  return signUp('user@google.com');
};

export const signOut = async () => {
  console.log("Mock Supabase: Signing out user.");
  localStorage.removeItem(AUTH_STORAGE_KEY);
};


// --- MOCK DATA STORE ---

// Mock implementation for App Ideas (User-specific)
export const getIdeas = async (userId: string): Promise<AppIdea[]> => {
  if (!userId) return [];
  try {
    const storedIdeas = localStorage.getItem(`${IDEAS_STORAGE_KEY_PREFIX}${userId}`);
    return storedIdeas ? JSON.parse(storedIdeas) : [];
  } catch (error) {
    console.error("Failed to parse ideas from localStorage", error);
    return [];
  }
};

export const addIdeas = async (userId: string, newIdeas: AppIdea[]): Promise<AppIdea[]> => {
  if (!userId) throw new Error("User must be logged in to save ideas.");
  console.log(`Mock Supabase: Saving new ideas for user ${userId} to localStorage.`);
  
  if (newIdeas.length === 0) { // Handle clearing ideas
     localStorage.setItem(`${IDEAS_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify([]));
     return [];
  }

  const existingIdeas = await getIdeas(userId);
  // Filter out any potential duplicates by problem statement
  const uniqueNewIdeas = newIdeas.filter(
    (newIdea) => !existingIdeas.some((existing) => existing.problem === newIdea.problem)
  );

  const allIdeas = [...uniqueNewIdeas, ...existingIdeas];
  localStorage.setItem(`${IDEAS_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(allIdeas));
  return allIdeas;
};

// Mock implementation for Showcase Apps (Public)
export const getShowcaseApps = async (): Promise<ShowcaseApp[]> => {
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

// Mock implementation for Forum Posts (Public)
export const getForumPosts = async (): Promise<ForumPost[]> => {
  try {
    const storedPosts = localStorage.getItem(FORUM_POSTS_STORAGE_KEY);
    if (!storedPosts) {
      // Add default posts if storage is empty
      const defaultPosts: ForumPost[] = [
        {
          id: 'post-1',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          author: 'Founder123',
          content: 'Just had an idea for an app that uses AI to create personalized bedtime stories for kids. What do you all think?',
          parentId: null,
        },
        {
          id: 'post-2',
          createdAt: new Date(Date.now() - 86000000).toISOString(),
          author: 'CreativeCoder',
          content: 'That sounds amazing! You could even let parents add names and favorite things to customize it further.',
          parentId: 'post-1',
        },
        {
          id: 'post-3',
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          author: 'ProductivityPro',
          content: 'I used the AI to generate this idea for a time-blocking app that syncs with your energy levels. Check it out!',
          idea: {
            id: 'idea-mock-1',
            problem: 'Users struggle to plan their day according to their natural energy cycles.',
            solution: 'An AI-powered calendar that suggests tasks based on your peak productivity times.',
            category: 'Productivity',
            marketSizeScore: 85,
          },
          parentId: null,
        },
      ];
      localStorage.setItem(FORUM_POSTS_STORAGE_KEY, JSON.stringify(defaultPosts));
      return defaultPosts;
    }
    return JSON.parse(storedPosts);
  } catch (error) {
    console.error("Failed to parse forum posts from localStorage", error);
    return [];
  }
};

export const addForumPost = async (newPost: Omit<ForumPost, 'id' | 'createdAt'>): Promise<ForumPost[]> => {
    console.log("Mock Supabase: Saving new forum post to localStorage.");
    const existingPosts = await getForumPosts();
    const postWithId: ForumPost = {
        ...newPost,
        id: self.crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };
    const allPosts = [postWithId, ...existingPosts];
    localStorage.setItem(FORUM_POSTS_STORAGE_KEY, JSON.stringify(allPosts));
    return allPosts;
};
