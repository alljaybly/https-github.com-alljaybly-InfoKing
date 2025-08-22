
import React from 'react';

type GuidanceStep = 'scrape' | 'mockup' | 'build' | 'pitch' | 'done';

interface GuidancePanelProps {
  step: GuidanceStep;
  onDismiss: () => void;
}

const guidanceText: Record<GuidanceStep, { title: string, description: string }> = {
  scrape: {
    title: "Step 1: Discover Ideas",
    description: "Click 'Find New Ideas' to let the AI search for fresh app concepts. Or try 'Explore Teen Ideas' for a specific focus!"
  },
  mockup: {
    title: "Step 2: Visualize Your Idea",
    description: "Great start! Now, click the 'Mockup' button on an idea card to generate an AI wireframe and see your concept come to life."
  },
  build: {
    title: "Step 3: Start Building",
    description: "You have a visual! Click 'Build App' to generate starter code or a detailed prompt for AI development platforms."
  },
  pitch: {
    title: "Step 4: Create a Pitch",
    description: "Ready to impress? Click 'Pitch Deck' to generate a full 5-slide presentation with AI visuals for your idea."
  },
  done: {
    title: "You're All Set!",
    description: "You've explored the core workflow. Continue discovering and building your next billion-user app."
  }
};

const GuidancePanel: React.FC<GuidancePanelProps> = ({ step, onDismiss }) => {
  const { title, description } = guidanceText[step];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl w-full max-w-lg animate-slide-in z-50 p-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center text-white font-bold text-2xl">
          {step === 'done' ? '🎉' : Object.keys(guidanceText).indexOf(step) + 1}
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-gray-800 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
        </div>
        <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
  );
};

export default GuidancePanel;
