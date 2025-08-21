import React, { useState } from 'react';
import { LoaderIcon, ArrowLeftIcon, DownloadIcon } from './icons';

interface PitchDeckModalProps {
  slides: string[];
  isLoading: boolean;
  onClose: () => void;
}

const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ slides, isLoading, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const downloadSlide = (base64Image: string, slideNumber: number) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Image}`;
    link.download = `infoking_pitch_slide_${slideNumber + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-4xl m-auto p-6 animate-slide-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">AI-Generated Pitch Deck</h2>
        
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border border-white/10 relative">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <LoaderIcon size={40} className="text-cyan-500" />
              <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">AI is crafting your pitch...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Generating 5 slides. This may take a minute.</p>
            </div>
          )}
          {!isLoading && slides.length > 0 && (
            <>
              <img 
                src={`data:image/png;base64,${slides[currentSlide]}`} 
                alt={`Pitch deck slide ${currentSlide + 1}`} 
                className="w-full h-full object-contain"
              />
              {slides.length > 1 && (
                <>
                  <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition">
                    <ArrowLeftIcon size={24} />
                  </button>
                  <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition">
                    <ArrowLeftIcon size={24} className="rotate-180" />
                  </button>
                </>
              )}
               <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/40 text-white text-sm">
                {currentSlide + 1} / {slides.length}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-6 mt-4 gap-4">
            <button 
                onClick={() => downloadSlide(slides[currentSlide], currentSlide)}
                disabled={isLoading || slides.length === 0}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <DownloadIcon size={20} />
                <span>Download Slide {currentSlide + 1}</span>
            </button>
          <button onClick={onClose} className="px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PitchDeckModal;
