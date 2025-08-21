import React from 'react';
import { LoaderIcon } from './icons';

interface MockupModalProps {
  imageUrl: string | null;
  isLoading: boolean;
  onClose: () => void;
}

const MockupModal: React.FC<MockupModalProps> = ({ imageUrl, isLoading, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-md m-auto p-6 animate-slide-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">AI-Generated Mockup</h2>
        
        <div className="aspect-[9/16] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border border-white/10">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <LoaderIcon size={40} className="text-cyan-500" />
              <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">Generating wireframe...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">This can take a moment.</p>
            </div>
          )}
          {imageUrl && !isLoading && (
            <img 
              src={`data:image/png;base64,${imageUrl}`} 
              alt="AI-generated app mockup" 
              className="w-full h-full object-contain"
            />
          )}
        </div>

        <div className="flex justify-end pt-6 mt-4">
          <button onClick={onClose} className="px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockupModal;