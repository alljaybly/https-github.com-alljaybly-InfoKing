
import React, { useState, useEffect, useCallback } from 'react';
import { AppIdea, ForumPost, User } from '../types';
import { getForumPosts, addForumPost } from '../services/supabaseClient';
import { ArrowLeftIcon, LoaderIcon, UsersIcon } from './icons';
import ForumPostCard from './ForumPostCard';
import PostModal from './PostModal';

interface ForumViewProps {
  userIdeas: AppIdea[];
  currentUser: User | null;
  onGoBack: () => void;
  onAuthRequest: () => void;
}

const buildThreads = (posts: ForumPost[]): ForumPost[] => {
    const postMap = new Map<string, ForumPost>();
    const rootPosts: ForumPost[] = [];

    posts.forEach(post => {
        postMap.set(post.id, { ...post, replies: [] });
    });

    postMap.forEach(post => {
        if (post.parentId) {
            const parent = postMap.get(post.parentId);
            parent?.replies?.push(post);
        } else {
            rootPosts.push(post);
        }
    });
    
    // Sort threads by most recent post, and replies by oldest first
    rootPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    rootPosts.forEach(p => p.replies?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));

    return rootPosts;
};


const ForumView: React.FC<ForumViewProps> = ({ userIdeas, currentUser, onGoBack, onAuthRequest }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<ForumPost | null>(null);
  
  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    const fetchedPosts = await getForumPosts();
    const threadedPosts = buildThreads(fetchedPosts);
    setPosts(threadedPosts);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handlePostSubmit = async (content: string, ideaId?: string) => {
    if (!currentUser) {
      onAuthRequest();
      return;
    }
    const attachedIdea = userIdeas.find(idea => idea.id === ideaId);
    const newPostData = {
      author: currentUser.email, // Use current user's email
      content,
      idea: attachedIdea,
      parentId: replyTo ? replyTo.id : null,
    };
    const updatedRawPosts = await addForumPost(newPostData);
    const updatedThreadedPosts = buildThreads(updatedRawPosts);
    setPosts(updatedThreadedPosts);
    setIsModalOpen(false);
    setReplyTo(null);
  };

  const openReplyModal = (post: ForumPost) => {
    if (!currentUser) {
      onAuthRequest();
      return;
    }
    setReplyTo(post);
    setIsModalOpen(true);
  };
  
  const openNewPostModal = () => {
    if (!currentUser) {
      onAuthRequest();
      return;
    }
    setReplyTo(null);
    setIsModalOpen(true);
  }

  return (
    <>
      {isModalOpen && (
        <PostModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handlePostSubmit}
          userIdeas={userIdeas}
          replyingTo={replyTo}
        />
      )}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3"><UsersIcon size={30} /> Community Forum</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={openNewPostModal}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors text-white font-semibold transform hover:scale-105"
          >
            <span>Post New Idea</span>
          </button>
          <button
            onClick={onGoBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold"
          >
            <ArrowLeftIcon size={20} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
      
      <div className="bg-gray-900/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 md:p-6 min-h-[60vh]">
        {isLoading ? (
            <div className="flex justify-center items-center h-full min-h-[200px]">
                <LoaderIcon size={40} className="text-white"/>
            </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map(post => (
              <ForumPostCard 
                key={post.id} 
                post={post} 
                onReply={openReplyModal} 
                isThreadRoot 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-white mb-2">The Forum is Quiet...</h3>
            <p className="text-green-100">Be the first to post an idea and start a conversation!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ForumView;
