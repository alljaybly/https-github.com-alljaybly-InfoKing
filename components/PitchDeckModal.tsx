
import React, { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import { AppIdea, PitchDeckSlide } from '../types';
import { LoaderIcon, ArrowLeftIcon, DownloadIcon } from './icons';

interface PitchDeckModalProps {
  idea: AppIdea | null;
  slides: PitchDeckSlide[];
  isLoading: boolean;
  progressText: string;
  onClose: () => void;
}

const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ idea, slides, isLoading, progressText, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleDownloadPdf = useCallback(async () => {
    if (slides.length === 0 || isDownloading) return;

    setIsDownloading(true);
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1280, 720], // 16:9 aspect ratio
      });

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        if (i > 0) {
          doc.addPage();
        }

        // Add a subtle background gradient
        const gradient = doc.context2d.createLinearGradient(0, 0, 1280, 720);
        gradient.addColorStop(0, '#e0f7fa'); // light cyan
        gradient.addColorStop(1, '#e8f5e9'); // light green
        doc.context2d.fillStyle = gradient;
        doc.context2d.fillRect(0, 0, 1280, 720);

        // Add image
        doc.addImage(slide.imageUrl, 'JPEG', 40, 40, 1200, 400);

        // Add text
        doc.setFontSize(48);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#083344'); // dark cyan
        doc.text(slide.title, 40, 490);

        doc.setFontSize(24);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#374151'); // gray-700
        const splitContent = doc.splitTextToSize(slide.content, 1200);
        doc.text(splitContent, 40, 550);

        // Add footer/branding
        doc.setFontSize(12);
        doc.setTextColor('#9ca3af'); // gray-400
        doc.text(`InfoKing AI Pitch Deck | Slide ${i + 1} of ${slides.length}`, 40, 700);
        doc.text(`👑 ${idea?.solution || 'App Idea'}`, 1240, 700, { align: 'right' });
      }

      doc.save(`${idea?.solution.replace(/\s/g, '_')}_pitch_deck.pdf`);
    } catch (e) {
      console.error("Failed to generate PDF:", e);
      // You might want to show an error to the user here
    } finally {
      setIsDownloading(false);
    }
  }, [slides, idea, isDownloading]);

  if (!idea) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-4xl m-auto p-6 animate-slide-in flex flex-col" style={{ height: '90vh' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI Pitch Deck</h2>
           <button onClick={onClose} className="px-4 py-2 rounded-full text-gray-700 dark:text-gray-200 bg-gray-200/50 dark:bg-gray-600/50 hover:bg-gray-300/70 dark:hover:bg-gray-500/70 transition">Close</button>
        </div>
        
        <div className="flex-grow bg-gray-100 dark:bg-gray-900/50 rounded-lg flex items-center justify-center relative overflow-hidden">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <LoaderIcon size={40} className="text-cyan-500" />
              <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">AI is building your pitch deck...</p>
              <p className="text-gray-500 dark:text-gray-400">{progressText}</p>
            </div>
          )}
          {!isLoading && slides.length > 0 && (
            <>
              <div className="w-full h-full p-4 flex flex-col items-center justify-center">
                <div className="w-full aspect-video bg-black rounded-md overflow-hidden shadow-lg">
                    <img src={slides[currentSlideIndex].imageUrl} alt={`Slide ${currentSlideIndex + 1}: ${slides[currentSlideIndex].title}`} className="w-full h-full object-cover" />
                </div>
                 <div className="w-full p-4 text-center">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{slides[currentSlideIndex].title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{slides[currentSlideIndex].content}</p>
                 </div>
              </div>
              
              <button onClick={handlePrevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 hover:bg-white/80 transition text-gray-800">
                <ArrowLeftIcon size={24} />
              </button>
              <button onClick={handleNextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 hover:bg-white/80 transition text-gray-800">
                <ArrowLeftIcon size={24} className="transform rotate-180" />
              </button>
            </>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
                {slides.length > 0 && `Slide ${currentSlideIndex + 1} of ${slides.length}`}
            </div>
            <button
                onClick={handleDownloadPdf}
                disabled={isLoading || slides.length === 0 || isDownloading}
                className="flex items-center justify-center gap-2 px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isDownloading ? <LoaderIcon size={20} /> : <DownloadIcon size={20} />}
                <span>{isDownloading ? 'Preparing PDF...' : 'Download PDF'}</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default PitchDeckModal;
