import React, { useState, useEffect } from 'react';
import JSConfetti from 'js-confetti';
import { supabase } from './supabaseConfig';
import './index.css';

const InfoKing: React.FC = () => {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const confettiRef = React.useRef<JSConfetti | null>(null);

  useEffect(() => {
    confettiRef.current = new JSConfetti();
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('ideas').select('*').order('createdAt', { ascending: false });
        if (error) throw error;
        setIdeas(data || []);
        localStorage.setItem('ideas', JSON.stringify(data || []));
      } catch (err) {
        console.error('Supabase fetch error:', err);
        const cached = localStorage.getItem('ideas');
        if (cached) setIdeas(JSON.parse(cached));
      }
      setLoading(false);
    };
    fetchIdeas();
    const subscription = supabase
      .channel('ideas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, (payload) => {
        setIdeas((prev) => [payload.new, ...prev.filter((idea) => idea.id !== payload.new.id)]);
      })
      .subscribe();
    return () => supabase.removeChannel(subscription);
  }, []);

  const scrapeProblems = async () => {
    setLoading(true);
    try {
      const prompt = "Perform real-time web search to extract user problems and solutions from public X posts, Reddit threads, YouTube comments, TikTok reviews (health, productivity, finance). Return top 5 in JSON: {problem, solution, frequency, market_size, source}";
      const response = await fetch('https://api.googleaistudio.com/gemini', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: { 'Authorization': `Bearer ${import.meta.env.VITE_GEMINI_KEY}` }
      });
      const data = await response.json();
      setIdeas((prev) => [...data, ...prev]);
      data.forEach(async (idea: any) => {
        const { error } = await supabase
          .from('ideas')
          .insert({ ...idea, user: 'private', createdAt: new Date().toISOString() });
        if (error) console.error('Supabase insert error:', error);
      });
      localStorage.setItem('ideas', JSON.stringify([...data, ...ideas]));
      confettiRef.current?.addConfetti({ emojis: ['💡', '✨'], emojiSize: 80, confettiNumber: 50 });
    } catch (err) {
      console.error('Scraping error:', err);
    }
    setLoading(false);
  };

  const sortedIdeas = ideas.sort((a, b) => b.market_size - a.market_size || b.frequency - a.frequency);

  return (
    <div className="bg-gradient-to-r from-blue-800 to-green-800 text-white p-6 rounded-lg min-h-screen">
      <h1 className="text-2xl font-bold text-blue-300">InfoKing: Your Idea Goldmine</h1>
      <button className="bg-blue-600 p-3 rounded mt-4 animate-pulse" onClick={scrapeProblems}>
        {loading ? 'Mining Ideas...' : 'Find Billion-Dollar Apps'}
      </button>
      <div className="mt-6 grid grid-cols-1 gap-6">
        {sortedIdeas.map((idea, i) => (
          <div key={i} className="p-4 bg-blue-900 rounded mb-3 animate-fade-in border-l-4 border-green-500">
            <p className="text-xl">Problem: {idea.problem}</p>
            <p>Solution: {idea.solution}</p>
            <p>Potential: {idea.market_size} users</p>
            <p>Source: {idea.source}</p>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${Math.min(idea.frequency, 100)}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoKing;