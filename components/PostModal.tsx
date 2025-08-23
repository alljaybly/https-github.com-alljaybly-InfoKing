
import React, { useState } from 'react';
import { AppIdea, ForumPost } from '../types';

interface PostModalProps {
  onClose: () => void;
  onSubmit: (content: string, ideaId?: string) => void;
  userIdeas: AppIdea[];
  replyingTo?: ForumPost | null;
}

const PostModal: React.FC<PostModalProps> = ({ onClose, onSubmit, userIdeas, replyingTo }) => {
  const [content, setContent] = useState('');
  const [attachedIdeaId, setAttachedIdeaId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Your message cannot be empty.');
      return;
    }
    setError('');
    onSubmit(content, attachedIdeaId);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg m-auto p-6 md:p-8 animate-slide-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {replyingTo ? `Replying to ${replyingTo.author}` : 'Create a New Post'}
        </h2>
        {replyingTo && (
            <p className="mb-4 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-gray-600 dark:text-gray-300 italic truncate">
                "{replyingTo.content}"
            </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Share your thoughts or ask a question..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 h-32"
            required
          />
          {!replyingTo && userIdeas.length > 0 && (
            <select
              value={attachedIdeaId}
              onChange={(e) => setAttachedIdeaId(e.target.value)}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white"
            >
              <option value="">Attach an idea (optional)</option>
              {userIdeas.map(idea => (
                <option key={idea.id} value={idea.id}>{idea.solution}</option>
              ))}
            </select>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-full text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition">Post</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
