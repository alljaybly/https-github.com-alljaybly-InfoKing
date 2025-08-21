import { createClient } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';
import { AppIdea, ShowcaseApp, ForumPost } from '../types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase environment variables (SUPABASE_URL, SUPABASE_KEY) are not set.");
}

export const supabase = createClient(supabaseUrl!, supabaseKey!);

// --- Auth Functions ---

export const getCurrentUser = async (): Promise<User | null> => {
  const session = supabase.auth.session();
  return session?.user ?? null;
};

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signIn({
    provider: 'google',
  });
  if (error) throw new Error(error.message);
};

export const signUpWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    return data;
};

export const signInWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signIn({ email, password });
    if (error) throw new Error(error.message);
    return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};


// --- App Idea Functions (User-specific) ---

export const getIdeas = async (userId: string): Promise<AppIdea[]> => {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching ideas:", error);
    return [];
  }
  return data as AppIdea[];
};

export const addIdeas = async (newIdeas: Omit<AppIdea, 'id'>[], userId: string): Promise<AppIdea[]> => {
  const ideasWithUser = newIdeas.map(idea => ({ ...idea, user_id: userId }));
  
  const { data, error } = await supabase
    .from('ideas')
    .insert(ideasWithUser)
    .select();

  if (error) {
    console.error("Error adding ideas:", error);
    throw new Error(error.message);
  }
  return data as AppIdea[];
};

// --- Showcase App Functions (Public) ---
// (Assuming showcase apps are public and not user-specific for now)

const SHOWCASE_APPS_STORAGE_KEY = 'infoKingShowcaseApps';

export const getShowcaseApps = async (): Promise<ShowcaseApp[]> => {
  try {
    const storedApps = localStorage.getItem(SHOWCASE_APPS_STORAGE_KEY);
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
    const existingApps = await getShowcaseApps();
    const allApps = [newApp, ...existingApps];
    localStorage.setItem(SHOWCASE_APPS_STORAGE_KEY, JSON.stringify(allApps));
    return allApps;
};


// --- Forum Functions ---

export const getForumPosts = async (): Promise<ForumPost[]> => {
    const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error("Error fetching forum posts:", error);
        return [];
    }
    return data;
};

export const addForumPost = async (post: Partial<ForumPost>): Promise<ForumPost> => {
    const { data, error } = await supabase
        .from('forum_posts')
        .insert(post)
        .select()
        .single();
        
    if (error) {
        console.error("Error adding forum post:", error);
        throw new Error(error.message);
    }
    return data;
};