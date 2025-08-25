
import React from 'react';

interface DonationModalProps {
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-2xl w-full max-w-md m-auto p-6 md:p-8 animate-slide-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">Support InfoKing's Mission</h2>
        <p className="text-gray-700 dark:text-gray-200 text-center mb-6">
          InfoKing empowers entrepreneurs by scraping billion-dollar app ideas from X, Reddit, YouTube, and TikTok using AI. Your $3+ donation covers Gemini API costs, hosting, and new features, keeping InfoKing free for all. Support our mission to spark the next big app!
        </p>
        <div className="flex flex-col items-center gap-4">
          <a
            href="https://www.paypal.com/donate?business=allanjblythe@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center px-6 py-3 rounded-full text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Donate with PayPal
          </a>
          <button 
            onClick={onClose} 
            className="w-full text-center px-6 py-3 rounded-full text-white font-semibold bg-gray-500 hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
