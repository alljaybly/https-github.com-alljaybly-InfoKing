import React, { useState, useEffect } from 'react';
import { User, ForumPost } from '../types';
import { getForumPosts, addForumPost, supabase } from '../services/supabaseClient';
import { LoaderIcon } from './icons';

interface ForumTabProps {
    user: User | null;
    onSignIn: () => void;
}

const ForumTab: React.FC<ForumTabProps> = ({ user, onSignIn }) => {
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const initialPosts = await getForumPosts();
                setPosts(initialPosts);
            } catch (err) {
                setError("Could not load forum posts.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();

        const channel = supabase.channel('forum_posts_realtime');
        channel
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'forum_posts' }, (payload) => {
                setPosts(currentPosts => [payload.new as ForumPost, ...currentPosts]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newPostContent.trim()) return;

        setIsPosting(true);
        setError(null);
        try {
            await addForumPost({
                content: newPostContent,
                user_email: user.email!,
            });
            setNewPostContent('');
        } catch (err: any) {
            setError(err.message || "Failed to submit post.");
        } finally {
            setIsPosting(false);
        }
    };
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoaderIcon size={48} className="text-white" />
            </div>
        )
    }

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Community Forum</h2>
            
            {user ? (
                <form onSubmit={handlePostSubmit} className="mb-8 bg-white/10 p-4 rounded-xl">
                    <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Share an idea or discuss a project..."
                        className="w-full p-3 bg-white/10 dark:bg-gray-800/50 rounded-lg text-white placeholder-gray-300 h-28 resize-none focus:ring-2 focus:ring-cyan-400 outline-none"
                        required
                    />
                    <div className="flex justify-end mt-3">
                        <button 
                            type="submit" 
                            disabled={isPosting || !newPostContent.trim()}
                            className="px-6 py-2 rounded-full text-white font-semibold bg-purple-500 hover:bg-purple-600 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {isPosting && <LoaderIcon size={20} />}
                            Post
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mb-8 bg-white/10 p-6 rounded-xl text-center">
                    <p className="text-white font-semibold text-lg">Want to join the discussion?</p>
                    <p className="text-gray-300 mb-4">Sign in to post your ideas and connect with other creators.</p>
                    <button onClick={onSignIn} className="px-6 py-2 rounded-full text-white font-semibold bg-blue-500 hover:bg-blue-600 transition">
                        Sign In
                    </button>
                </div>
            )}

            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg mb-4">{error}</p>}
            
            <div className="space-y-4">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post.id} className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                            <p className="text-white whitespace-pre-wrap">{post.content}</p>
                            <div className="text-right text-xs text-gray-400 mt-3">
                                <span>Posted by <strong>{post.user_email}</strong></span>
                                <span className="mx-2">•</span>
                                <span>{new Date(post.created_at).toLocaleString()}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 text-gray-300">
                        <h3 className="text-xl font-semibold text-white">No posts yet.</h3>
                        <p>Be the first to share an idea!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumTab;
