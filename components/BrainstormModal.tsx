import React from 'react';
import { AppIdea } from '../types';
import { LoaderIcon } from './icons';

interface BrainstormModalProps {
  idea: AppIdea | null;
  result: string | null;
  isLoading: boolean;
  onClose: () => void;
}

const BrainstormModal: React.FC<BrainstormModalProps> = ({ idea, result, isLoading, onClose }) => {
  if (!idea) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl m-auto p-6 md:p-8 animate-slide-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">AI Brainstorm Session 💡</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Deep dive into the potential of your idea.</p>
        
        <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg mb-6">
            <p className="font-semibold text-gray-700 dark:text-gray-200"><strong>Problem:</strong> {idea.problem}</p>
            <p className="mt-2 font-semibold text-brand-cyan dark:text-brand-green"><strong>Solution:</strong> {idea.solution}</p>
        </div>

        <div className="max-h-[50vh] overflow-y-auto pr-2">
            {isLoading && (
                <div className="flex flex-col items-center justify-center text-center p-8">
                    <LoaderIcon size={40} className="text-cyan-500" />
                    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">AI Analyst is on the case...</p>
                    <p className="text-gray-500 dark:text-gray-400">Performing SWOT analysis and checking market trends.</p>
                </div>
            )}
            {result && !isLoading && (
                <div 
                    className="prose prose-sm md:prose-base dark:prose-invert max-w-none whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br />') }} // Using pre-wrap is safer, but this ensures markdown-like breaks
                />
            )}
        </div>

        <div className="flex justify-end pt-6 mt-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrainstormModal;
