
import React from 'react';
import { ForumPost } from '../types';
import { ClockIcon, LightbulbIcon } from './icons';

interface ForumPostCardProps {
  post: ForumPost;
  onReply: (post: ForumPost) => void;
  isThreadRoot?: boolean;
}

const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const ForumPostCard: React.FC<ForumPostCardProps> = ({ post, onReply, isThreadRoot = false }) => {
  return (
    <div className={`flex gap-4 ${!isThreadRoot ? 'ml-6 md:ml-10' : ''}`}>
        <div className="flex flex-col items-center">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center text-white font-bold text-lg">
                {post.author.charAt(0)}
            </div>
            {isThreadRoot && post.replies && post.replies.length > 0 && (
                <div className="w-0.5 flex-grow bg-gray-600/50 mt-2"></div>
            )}
        </div>
      <div className="flex-1">
        <div className="bg-gray-500/10 dark:bg-gray-700/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-white">{post.author}</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <ClockIcon size={12} /> {timeAgo(post.createdAt)}
            </span>
          </div>
          <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>

          {post.idea && (
            <div className="mt-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <p className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-1"><LightbulbIcon size={16} /> Attached Idea</p>
              <p className="text-sm text-gray-300 font-semibold">{post.idea.solution}</p>
            </div>
          )}
        </div>
        <div className="mt-2">
            <button onClick={() => onReply(post)} className="text-xs font-semibold text-gray-400 hover:text-white transition">
                Reply
            </button>
        </div>
        {post.replies && post.replies.length > 0 && (
            <div className="mt-4 space-y-4">
                {post.replies.map(reply => (
                    <ForumPostCard key={reply.id} post={reply} onReply={onReply} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ForumPostCard;
