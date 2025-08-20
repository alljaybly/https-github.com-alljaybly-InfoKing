import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AppIdea, SortOption, ShowcaseApp } from './types';
import { fetchNewIdeas, brainstormIdea } from './services/geminiService';
import { getIdeas, addIdeas, getShowcaseApps, addShowcaseApp } from './services/supabaseClient';
import IdeaCard from './components/IdeaCard';
import ShowcaseCard from './components/ShowcaseCard';
import UploadAppModal from './components/UploadAppModal';
import AboutModal from './components/AboutModal';
import BrainstormModal from './components/BrainstormModal';
import { SunIcon, MoonIcon, SparklesIcon, LoaderIcon, ClockIcon, ArrowLeftIcon, ChevronDownIcon, AppWindowIcon, UploadCloudIcon, InfoIcon, GlobeIcon, LightbulbIcon } from './components/icons';
import Confetti from './components/Confetti';

const SortMenu: React.FC<{ sortOption: SortOption; setSortOption: (option: SortOption) => void; closeMenu: () => void; }> = ({ sortOption, setSortOption, closeMenu }) => {
  const options = [
    { value: SortOption.DEFAULT, label: 'Sort by: Default' },
    { value: SortOption.MARKET_SIZE_DESC, label: 'Sort by: Market Size ▼' },
    { value: SortOption.MARKET_SIZE_ASC, label: 'Sort by: Market Size ▲' },
  ];
  return (
    <div className="absolute top-full mt-2 w-56 rounded-lg shadow-lg bg-white/50 dark:bg-gray-800/80 backdrop-blur-md ring-1 ring-black ring-opacity-5 z-50 animate-fade-in">
      <div className="py-1" role="menu" aria-orientation="vertical">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => { setSortOption(option.value); closeMenu(); }}
            className={`w-full text-left block px-4 py-2 text-sm ${sortOption === option.value ? 'bg-cyan-500/50 text-white' : 'text-gray-700 dark:text-gray-200'} hover:bg-cyan-500/30`}
            role="menuitem"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const PlatformMenu: React.FC<{ closeMenu: () => void; }> = ({ closeMenu }) => {
  const platforms = [
    { name: 'YouTube', url: 'https://www.youtube.com' },
    { name: 'X (Twitter)', url: 'https://www.x.com' },
    { name: 'Reddit', url: 'https://www.reddit.com' },
    { name: 'TikTok', url: 'https://www.tiktok.com' },
    { name: 'Facebook', url: 'https://www.facebook.com' },
  ];
  return (
    <div className="absolute top-full mt-2 w-56 rounded-lg shadow-lg bg-white/50 dark:bg-gray-800/80 backdrop-blur-md ring-1 ring-black ring-opacity-5 z-50 animate-fade-in">
      <div className="py-1" role="menu" aria-orientation="vertical">
        {platforms.map(platform => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-cyan-500/30"
            role="menuitem"
          >
            Explore on {platform.name}
          </a>
        ))}
      </div>
    </div>
  );
};

const Header: React.FC<{
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onShowHistory: () => void;
  onShowApps: () => void;
  onShowAbout: () => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}> = ({ isDarkMode, toggleDarkMode, onShowHistory, onShowApps, onShowAbout, sortOption, setSortOption }) => {
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const platformMenuRef = useRef<HTMLDivElement>(null);

  const useOutsideClick = (ref: React.RefObject<HTMLDivElement>, callback: () => void) => {
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref, callback]);
  }
  
  useOutsideClick(sortMenuRef, () => setIsSortMenuOpen(false));
  useOutsideClick(platformMenuRef, () => setIsPlatformMenuOpen(false));


  return (
    <header className="text-center py-6 px-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-1 flex justify-start items-center gap-2 md:gap-4">
          <div className="relative" ref={sortMenuRef}>
            <button onClick={() => setIsSortMenuOpen(!isSortMenuOpen)} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold">
              Menu <ChevronDownIcon className={`transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isSortMenuOpen && <SortMenu sortOption={sortOption} setSortOption={setSortOption} closeMenu={() => setIsSortMenuOpen(false)} />}
          </div>
          <div className="relative" ref={platformMenuRef}>
            <button onClick={() => setIsPlatformMenuOpen(!isPlatformMenuOpen)} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold">
              <GlobeIcon size={20} /> <span className="hidden md:inline">Platforms</span> <ChevronDownIcon className={`transition-transform ${isPlatformMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isPlatformMenuOpen && <PlatformMenu closeMenu={() => setIsPlatformMenuOpen(false)} />}
          </div>
          <button onClick={onShowHistory} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold">
            History <ClockIcon size={20} />
          </button>
           <button onClick={onShowApps} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold">
            Apps <AppWindowIcon />
          </button>
          <button onClick={onShowAbout} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold">
            About <InfoIcon />
          </button>
        </div>

        <div className="flex-1 flex justify-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white">
                Info<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-green-300">King</span> 👑
            </h1>
        </div>

        <div className="flex-1 flex justify-end">
            <button onClick={toggleDarkMode} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white" aria-label="Toggle dark mode">
                {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
        </div>
      </div>
      <p className="text-lg md:text-xl text-green-100 mt-2">Find your next billion-user app idea.</p>
    </header>
  );
};


const Footer: React.FC = () => (
  <footer className="text-center py-6 px-4 text-green-100/80 text-sm">
    <p>
      A production of Allen.J.Blythe(NXlevel)2025. Built with ❤️, Gemini, and React.
    </p>
    <p className="mt-1">
      Powered by Google AI & Supabase. Designed for dreamers.
    </p>
  </footer>
);

const App: React.FC = () => {
  const [ideas, setIdeas] = useState<AppIdea[]>([]);
  const [showcaseApps, setShowcaseApps] = useState<ShowcaseApp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') === 'dark' || 
               (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.DEFAULT);
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [currentView, setCurrentView] = useState<'home' | 'history' | 'apps'>('home');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // State for Brainstorm Bot
  const [isBrainstormModalOpen, setIsBrainstormModalOpen] = useState(false);
  const [currentBrainstormIdea, setCurrentBrainstormIdea] = useState<AppIdea | null>(null);
  const [brainstormResult, setBrainstormResult] = useState<string | null>(null);
  const [isBrainstorming, setIsBrainstorming] = useState(false);


  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
        const [initialIdeas, initialApps] = await Promise.all([
            getIdeas(),
            getShowcaseApps()
        ]);
        setIdeas(initialIdeas);
        setShowcaseApps(initialApps);
    } catch(e) {
        setError("Could not load saved data.");
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleFetchIdeas = async () => {
    if (!isOnline) {
        setError("You are offline. Please connect to the internet to find new ideas.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newIdeas = await fetchNewIdeas();
      const allIdeas = await addIdeas(newIdeas);
      setIdeas(allIdeas);
      setShowConfetti(true);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAppSubmit = async (appData: Omit<ShowcaseApp, 'id'>) => {
    const newApp: ShowcaseApp = {
      ...appData,
      id: self.crypto.randomUUID(),
    };
    const updatedApps = await addShowcaseApp(newApp);
    setShowcaseApps(updatedApps);
    setIsUploadModalOpen(false);
  };

  const handleBrainstorm = async (idea: AppIdea) => {
    if (!isOnline) {
      setError("You must be online to use the Brainstorm Bot.");
      return;
    }
    setCurrentBrainstormIdea(idea);
    setIsBrainstormModalOpen(true);
    setIsBrainstorming(true);
    setError(null);
    setBrainstormResult(null);
    try {
        const result = await brainstormIdea(idea);
        setBrainstormResult(result);
    } catch (e: any) {
        setError(e.message || "An unknown error occurred during brainstorming.");
        // Close modal on error to show the main error message
        setIsBrainstormModalOpen(false);
    } finally {
        setIsBrainstorming(false);
    }
  };

  const closeBrainstormModal = () => {
    setIsBrainstormModalOpen(false);
    setCurrentBrainstormIdea(null);
    setBrainstormResult(null);
  };


  const sortedIdeas = useMemo(() => {
    const sorted = [...ideas];
    switch (sortOption) {
      case SortOption.MARKET_SIZE_ASC:
        return sorted.sort((a, b) => a.marketSizeScore - b.marketSizeScore);
      case SortOption.MARKET_SIZE_DESC:
        return sorted.sort((a, b) => b.marketSizeScore - a.marketSizeScore);
      default:
        return sorted;
    }
  }, [ideas, sortOption]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-500 to-green-500 dark:from-cyan-900 dark:to-green-900 transition-colors duration-500">
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      {isUploadModalOpen && <UploadAppModal onClose={() => setIsUploadModalOpen(false)} onSubmit={handleAppSubmit} />}
      {isAboutModalOpen && <AboutModal onClose={() => setIsAboutModalOpen(false)} />}
      {isBrainstormModalOpen && (
        <BrainstormModal 
            idea={currentBrainstormIdea}
            result={brainstormResult}
            isLoading={isBrainstorming}
            onClose={closeBrainstormModal}
        />
      )}
      
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onShowHistory={() => setCurrentView('history')}
        onShowApps={() => setCurrentView('apps')}
        onShowAbout={() => setIsAboutModalOpen(true)}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      
      <main className="container mx-auto px-4 pb-12 flex-grow">
        {currentView === 'apps' && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold text-white">App Showcase</h2>
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-400 hover:bg-green-500 transition-colors text-white font-semibold"
                >
                  <UploadCloudIcon size={20} />
                  <span>Upload Your App</span>
                </button>
                <button 
                  onClick={() => setCurrentView('home')} 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold"
                >
                  <ArrowLeftIcon size={20} />
                  <span>Go Back</span>
                </button>
              </div>
            </div>
            {showcaseApps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {showcaseApps.map((app, index) => (
                        <ShowcaseCard key={app.id} app={app} index={index} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h2 className="text-3xl font-bold text-white mb-2">No Apps Yet!</h2>
                    <p className="text-green-100">Be the first to upload an app built from an idea.</p>
                </div>
            )}
          </div>
        )}
        
        {currentView === 'history' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-white">Idea History</h2>
                  <button 
                      onClick={() => setCurrentView('home')} 
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold"
                  >
                      <ArrowLeftIcon size={20} />
                      <span>Go Back</span>
                  </button>
              </div>
            </div>
        )}

        {currentView === 'home' && (
          <div className="mb-8">
            <div className="flex justify-center">
              <button
                  onClick={handleFetchIdeas}
                  disabled={isLoading || !isOnline}
                  className="w-full md:w-auto flex items-center justify-center gap-3 text-white font-bold text-lg px-8 py-4 rounded-full bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                  {isLoading ? (
                      <>
                          <LoaderIcon size={24} />
                          <span>AI is thinking...</span>
                      </>
                  ) : (
                      <>
                          <SparklesIcon size={24} />
                          <span>Find New Ideas</span>
                      </>
                  )}
              </button>
            </div>
          </div>
        )}
        
        {(currentView === 'home' || currentView === 'history') && (
          sortedIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {sortedIdeas.map((idea, index) => (
                <IdeaCard key={idea.id} idea={idea} index={index} onBrainstorm={handleBrainstorm} />
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="text-center py-16 animate-fade-in">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {currentView === 'history' ? 'Your History is Empty' : 'No Ideas Yet!'}
                </h2>
                <p className="text-green-100">
                  {currentView === 'history' 
                    ? 'Go back and find some new ideas.' 
                    : 'Click the button above to discover your first app idea.'}
                </p>
              </div>
            )
          )
        )}
         {error && (
              <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-sm animate-fade-in" role="alert">
                  <strong className="font-bold">An Error Occurred! </strong>
                  <span className="block sm:inline">{error}</span>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                  </span>
              </div>
            )}
            
            {!isOnline && (
              <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-lg max-w-sm animate-fade-in" role="alert">
                  <p className="font-bold">Offline Mode</p>
                  <p>You are currently offline. Find new ideas and brainstorming are disabled.</p>
              </div>
            )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
