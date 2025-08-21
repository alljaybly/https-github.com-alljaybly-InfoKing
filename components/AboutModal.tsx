import React from 'react';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl m-auto p-6 md:p-8 animate-slide-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">About InfoKing 👑</h2>
        <div className="text-gray-600 dark:text-gray-300 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <section>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">What is InfoKing?</h3>
            <p>InfoKing is an AI-powered brainstorming partner designed for dreamers, builders, and entrepreneurs. It uses Google's Gemini AI to scan public conversations on social media and forums to find genuine user problems. For each problem, it generates a potential billion-user app idea, complete with a solution and a market size analysis.</p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">How to Use It</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Sign In:</strong> Create an account or sign in to save all your generated ideas and participate in the community.</li>
              <li><strong>Select Sources:</strong> Choose which platforms (like Reddit, Instagram, or LinkedIn) you want the AI to search for problems.</li>
              <li><strong>Find Ideas:</strong> Click "Find New Ideas" for general concepts, or "Explore Teen Ideas" for concepts focused on youth challenges. The app will guide you to the next step!</li>
              <li><strong>Brainstorm & Validate:</strong> Use the "Brainstorm" button on any idea card. Our AI analyst will perform a deep-dive SWOT analysis to help you validate its potential.</li>
              <li><strong>Visualize with Mockups:</strong> Click "Mockup" to get an instant AI-generated wireframe of the app, helping you visualize the UI.</li>
              <li><strong>Create a Pitch Deck:</strong> Click "Pitch Deck" to have the AI generate a 5-slide visual presentation for your idea.</li>
              <li><strong>Build Your App:</strong> Click "Build App" to generate a detailed prompt. Copy this prompt into an AI tool like Google AI Studio to generate full-stack code for your application.</li>
              <li><strong>Discuss in the Forum:</strong> Head to the "Forum" tab to discuss your ideas with other creators, share your progress, and get feedback.</li>
              <li><strong>Review Your History:</strong> Your saved ideas are always available in the "History" tab. Use the "Menu" to sort them by market size.</li>
              <li><strong>Showcase Your Work:</strong> Visit the "Apps" section to see what others have built and upload your own completed projects.</li>
              <li><strong>Support Us:</strong> If you find InfoKing valuable, consider using the "Donate" button to support its development!</li>
            </ol>
          </section>
           <p className="pt-4 font-semibold text-center text-brand-cyan dark:text-brand-green">Happy building, and may you find your billion-user idea!</p>
        </div>
        <div className="flex justify-end pt-6">
          <button onClick={onClose} className="px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition">
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
