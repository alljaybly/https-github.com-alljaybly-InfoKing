
import React from 'react';
import { AppIdea } from '../types';
import { LoaderIcon } from './icons';

interface MockupModalProps {
  idea: AppIdea | null;
  mockupImage: string | null;
  isLoading: boolean;
  onClose: () => void;
}

const MockupModal: React.FC<MockupModalProps> = ({ idea, mockupImage, isLoading, onClose }) => {
  if (!idea) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div 
        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-lg m-auto p-6 md:p-8 animate-slide-in flex flex-col" 
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">AI-Generated Mockup</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">A visual starting point for your app idea.</p>
          
          <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg mb-6">
              <p className="font-semibold text-gray-700 dark:text-gray-200"><strong>Idea:</strong> {idea.solution}</p>
          </div>
        </div>

        {/* Image Container (Scrollable) */}
        <div className="flex-grow w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-y-auto border border-white/10 min-h-0">
            {isLoading && (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                    <LoaderIcon size={40} className="text-cyan-500" />
                    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">Generating wireframe...</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">The AI designer is sketching.</p>
                </div>
            )}
            {mockupImage && !isLoading && (
                <img src={mockupImage} alt="AI-generated app mockup" className="w-full h-auto object-contain" />
            )}
            {!mockupImage && !isLoading && (
                 <div className="flex items-center justify-center h-full text-center p-4">
                    <p className="text-gray-600 dark:text-gray-300">Could not generate mockup.</p>
                </div>
            )}
        </div>

        {/* Footer Section */}
        <div className="flex-shrink-0 flex justify-end pt-6 mt-4">
          <button onClick={onClose} className="px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockupModal;
