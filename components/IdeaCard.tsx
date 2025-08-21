
import React from 'react';
import { AppIdea } from '../types';
import { LightbulbIcon, ImageIcon, PresentationIcon, CodeBracketIcon, LinkIcon } from './icons';

interface IdeaCardProps {
  idea: AppIdea;
  index: number;
  onBrainstorm: (idea: AppIdea) => void;
  onGenerateMockup: (idea: AppIdea) => void;
  onGeneratePitchDeck: (idea: AppIdea) => void;
  onBuildApp: (idea: AppIdea) => void;
  isNextStep: boolean;
}

const ProgressBar: React.FC<{ score: number }> = ({ score }) => {
  const getGradientColor = (s: number) => {
    if (s > 75) return 'from-emerald-400 to-green-500';
    if (s > 50) return 'from-amber-400 to-orange-500';
    return 'from-rose-400 to-red-500';
  };

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div
        className={`bg-gradient-to-r ${getGradientColor(score)} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${score}%` }}
      ></div>
    </div>
  );
};


const IdeaCard: React.FC<IdeaCardProps> = ({ idea, index, onBrainstorm, onGenerateMockup, onGeneratePitchDeck, onBuildApp, isNextStep }) => {
  const categoryColors: { [key: string]: string } = {
    Health: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Productivity: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Finance: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <div 
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-white/20 animate-slide-in flex flex-col"
        style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Problem</h3>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${categoryColors[idea.category] || categoryColors.Other}`}>
            {idea.category}
            </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{idea.problem}</p>
        
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">AI-Generated Solution</h3>
        <p className="text-brand-cyan dark:text-brand-green font-semibold mb-6">{idea.solution}</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Market Size Potential</h4>
                <span className="font-bold text-lg text-gray-800 dark:text-white">{idea.marketSizeScore}/100</span>
            </div>
            <ProgressBar score={idea.marketSizeScore} />
        </div>
        <div className="grid grid-cols-2 gap-2">
            <button 
                onClick={() => onBrainstorm(idea)}
                className={`relative flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/70 dark:hover:bg-gray-600/70 transition-colors text-gray-700 dark:text-gray-200 font-semibold text-sm ${isNextStep ? 'animate-pulse-bright' : ''}`}
                title="Brainstorm with AI"
            >
                <LightbulbIcon size={16} />
                <span>Brainstorm</span>
                {isNextStep && <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-cyan-500 text-white text-xs font-bold rounded-full">Next Step</span>}
            </button>
            <button 
                onClick={() => onGenerateMockup(idea)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/70 dark:hover:bg-gray-600/70 transition-colors text-gray-700 dark:text-gray-200 font-semibold text-sm"
                title="Generate UI Mockup"
            >
                <ImageIcon size={16} />
                <span>Mockup</span>
            </button>
            <button 
                onClick={() => onGeneratePitchDeck(idea)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/20 dark:bg-cyan-500/30 hover:bg-cyan-500/40 dark:hover:bg-cyan-500/50 transition-colors text-cyan-800 dark:text-cyan-200 font-semibold text-sm"
                title="Generate Pitch Deck"
            >
                <PresentationIcon size={16} />
                <span>Pitch Deck</span>
            </button>
             <button 
                onClick={() => onBuildApp(idea)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 dark:bg-purple-500/30 hover:bg-purple-500/40 dark:hover:bg-purple-500/50 transition-colors text-purple-800 dark:text-purple-200 font-semibold text-sm"
                title="Build App with AI"
            >
                <CodeBracketIcon size={16} />
                <span>Build App</span>
            </button>
        </div>
         {idea.source?.url && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                <a 
                    href={idea.source.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                    title={`Source: ${idea.source.url}`}
                >
                <LinkIcon size={14} />
                <span>Source: <strong>{idea.source.platform}</strong></span>
                </a>
            </div>
        )}
      </div>
    </div>
  );
};

export default IdeaCard;