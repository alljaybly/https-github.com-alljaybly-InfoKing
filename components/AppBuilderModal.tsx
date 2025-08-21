
import React, { useState } from 'react';
import { AppIdea } from '../types';
import { generateAIStudioPrompt } from '../services/geminiService';
import { LoaderIcon, CodeBracketIcon } from './icons';

interface AppBuilderModalProps {
  idea: AppIdea;
  onClose: () => void;
}

const AppBuilderModal: React.FC<AppBuilderModalProps> = ({ idea, onClose }) => {
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleGeneratePrompt = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedPrompt(null);
    try {
      const prompt = await generateAIStudioPrompt(idea);
      setGeneratedPrompt(prompt);
    } catch (e: any)
    {
      setError(e.message || "Failed to generate prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-3xl m-auto p-6 md:p-8 animate-slide-in flex flex-col" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">AI App Builder</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Generate a prompt to build a full app with Google AI Studio.</p>
        
        <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg mb-6">
            <p className="font-semibold text-gray-700 dark:text-gray-200"><strong>Idea:</strong> {idea.solution}</p>
        </div>

        <div className="flex-grow min-h-0">
            {isGenerating && (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                    <LoaderIcon size={40} className="text-purple-500" />
                    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">AI is crafting your prompt...</p>
                    <p className="text-gray-500 dark:text-gray-400">This will give you a head start in AI Studio.</p>
                </div>
            )}
            {error && !isGenerating && (
                 <div className="flex flex-col items-center justify-center text-center p-8 h-full bg-red-500/10 rounded-lg">
                    <p className="text-lg font-semibold text-red-700 dark:text-red-300">Generation Failed</p>
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
                 </div>
            )}
            {generatedPrompt && !isGenerating && (
                <div className="relative h-full">
                    <div className="mb-4 text-sm text-gray-700 dark:text-gray-200 bg-cyan-500/20 p-3 rounded-lg">
                        <strong>Next Step:</strong> Copy this prompt and paste it into <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-cyan-600">Google AI Studio</a> to generate the full application code.
                    </div>
                    <textarea 
                        readOnly 
                        className="w-full h-full bg-gray-900 text-white p-4 rounded-lg text-xs max-h-[40vh] h-full language-jsx resize-none"
                        value={generatedPrompt}
                    />
                    <button onClick={handleCopyPrompt} className="absolute top-[70px] right-2 px-3 py-1 text-sm rounded-md bg-gray-700 text-white hover:bg-gray-600 transition">
                        {isCopied ? 'Copied!' : 'Copy Prompt'}
                    </button>
                </div>
            )}
            {!generatedPrompt && !isGenerating && !error && (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full bg-gray-100 dark:bg-gray-900/50 rounded-lg">
                    <CodeBracketIcon size={40} className="text-gray-500 mb-4"/>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Ready to build?</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Generate a prompt for Google AI Studio to create a full-stack app.</p>
                    <button onClick={handleGeneratePrompt} className="px-6 py-3 rounded-full text-white font-semibold bg-purple-500 hover:bg-purple-600 transition flex items-center gap-2">
                        <CodeBracketIcon size={20} />
                        Generate AI Studio Prompt
                    </button>
                </div>
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

export default AppBuilderModal;