import React from 'react';

interface AboutModalProps {
  onClose: () => void;
}

const Feature: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <section className="mt-4">
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{title}</h3>
    <div className="text-sm space-y-2">{children}</div>
  </section>
);


const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl m-auto p-6 md:p-8 animate-slide-in flex flex-col" style={{maxHeight: '90vh'}} onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">Welcome to InfoKing 👑</h2>
            <p className="text-center text-gray-600 dark:text-gray-300">Your AI-powered partner for discovering and validating billion-user app ideas.</p>
        </div>
        <div className="text-gray-600 dark:text-gray-300 space-y-4 mt-4 flex-grow overflow-y-auto pr-2">
          
          <Feature title="🚀 AI Idea Generation">
            <p>Click 'Find New Ideas' to let our AI scan real-time data from platforms like Reddit, X, and YouTube for genuine user problems. It then brainstorms innovative app solutions, complete with a market size score.</p>
            <p>You can also search for ideas on a custom topic or use the microphone for **Voice Commands**!</p>
          </Feature>
          
          <Feature title="🤖 AI Analyst (Brainstorm Bot)">
            <p>Don't just get an idea—validate it! Click 'Brainstorm' on any card for a deep-dive SWOT analysis, MVP feature suggestions, and a final verdict on its "Global Winner" potential.</p>
          </Feature>
          
          <Feature title="🎨 AI Mockup & Pitch Deck Tools">
             <p><strong>Mockup Generator:</strong> Instantly visualize your app's UI with an AI-generated wireframe.</p>
             <p><strong>Pitch Deck Creator:</strong> Create a professional 5-slide pitch deck, complete with AI-generated visuals and content. You can even download it as a PDF to share with investors.</p>
          </Feature>

          <Feature title="💻 AI App Builder">
             <p>Bridge the gap between idea and execution. The 'Build App' feature generates React starter code or detailed prompts for tools like Google AI Studio, helping you kickstart development immediately.</p>
          </Feature>

          <Feature title="🌐 Community & Showcase">
            <p><strong>App Showcase:</strong> See what other entrepreneurs have built using InfoKing ideas. When you're ready, upload your own app to the showcase!</p>
            <p><strong>Community Forum:</strong> Share your ideas, ask for feedback, and collaborate with a community of fellow builders and dreamers.</p>
          </Feature>

           <p className="pt-4 font-semibold text-center text-brand-cyan dark:text-brand-green">Happy building, and may you find your billion-user idea!</p>
        </div>
        <div className="flex justify-end pt-6 mt-4 flex-shrink-0">
          <button onClick={onClose} className="px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition">
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
