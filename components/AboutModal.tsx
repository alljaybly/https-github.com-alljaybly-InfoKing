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
              <li><strong>Find Ideas:</strong> Click the big "Find New Ideas" button on the home screen. The AI will search the web in real-time and present you with fresh, unique app concepts.</li>
              <li><strong>Brainstorm & Validate:</strong> On any idea card, click "Brainstorm with AI". Our AI analyst will perform a deep-dive SWOT analysis to help you validate the idea's potential.</li>
              <li><strong>Review & Sort:</strong> Your discovered ideas are saved automatically. You can view them on the home screen or in the "History" section. Use the "Menu" to sort ideas by market size potential.</li>
              <li><strong>Explore Apps:</strong> Visit the "Apps" section to see what others have built. Once you've created your own app from an idea, use the "Upload Your App" button to showcase it!</li>
               <li><strong>Explore Platforms:</strong> Use the "Platforms" dropdown in the header to jump directly to popular social media sites and see what people are talking about right now.</li>
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
