import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AppIdea, SortOption, ShowcaseApp, User } from './types';
import { fetchNewIdeas, brainstormIdea, generateMockup, generatePitchDeckSlides } from './services/geminiService';
import { getIdeas, addIdeas, getShowcaseApps, addShowcaseApp, signOut, supabase } from './services/supabaseClient';
import IdeaCard from './components/IdeaCard';
import ShowcaseCard from './components/ShowcaseCard';
import UploadAppModal from './components/UploadAppModal';
import AboutModal from './components/AboutModal';
import AuthModal from './components/AuthModal';
import ForumTab from './components/ForumTab';
import BrainstormModal from './components/BrainstormModal';
import MockupModal from './components/MockupModal';
import PitchDeckModal from './components/PitchDeckModal';
import AppBuilderModal from './components/AppBuilderModal';
import MosaicGrid from './components/MosaicGrid';
import { SunIcon, MoonIcon, SparklesIcon, LoaderIcon, ClockIcon, ArrowLeftIcon, ChevronDownIcon, AppWindowIcon, UploadCloudIcon, InfoIcon, GlobeIcon, MicrophoneIcon, DownloadIcon, UserIcon, LogoutIcon, MessageSquareIcon } from './components/icons';
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

const DownloadMenu: React.FC<{ onSelect: (format: 'json' | 'csv') => void; closeMenu: () => void; }> = ({ onSelect, closeMenu }) => {
  return (
    <div className="absolute top-full mt-2 w-48 rounded-lg shadow-lg bg-white/50 dark:bg-gray-800/80 backdrop-blur-md ring-1 ring-black ring-opacity-5 z-50 animate-fade-in">
      <div className="py-1" role="menu" aria-orientation="vertical">
        <button
          onClick={() => { onSelect('json'); closeMenu(); }}
          className="w-full text-left flex items-center gap-2 block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-cyan-500/30"
          role="menuitem"
        >
          <span>As JSON</span>
        </button>
        <button
          onClick={() => { onSelect('csv'); closeMenu(); }}
          className="w-full text-left flex items-center gap-2 block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-cyan-500/30"
          role="menuitem"
        >
          <span>As CSV</span>
        </button>
      </div>
    </div>
  );
};

const Header: React.FC<{
  user: User | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentView: string;
  setCurrentView: (view: 'home' | 'history' | 'apps' | 'forum') => void;
  onShowAbout: () => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  onSignIn: () => void;
}> = ({ user, isDarkMode, toggleDarkMode, currentView, setCurrentView, onShowAbout, sortOption, setSortOption, onSignIn }) => {
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

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

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="text-center py-6 px-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-1 flex justify-start items-center gap-1 md:gap-2">
          <div className="relative" ref={sortMenuRef}>
            <button onClick={() => setIsSortMenuOpen(!isSortMenuOpen)} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold">
              Menu <ChevronDownIcon className={`transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isSortMenuOpen && <SortMenu sortOption={sortOption} setSortOption={setSortOption} closeMenu={() => setIsSortMenuOpen(false)} />}
          </div>
          <button onClick={() => setCurrentView('history')} className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-full transition-colors text-white font-semibold ${currentView === 'history' ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}>
            History <ClockIcon size={20} />
          </button>
           <button onClick={() => setCurrentView('apps')} className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-full transition-colors text-white font-semibold ${currentView === 'apps' ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}>
            Apps <AppWindowIcon />
          </button>
          <button onClick={() => setCurrentView('forum')} className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-full transition-colors text-white font-semibold ${currentView === 'forum' ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}>
            Forum <MessageSquareIcon />
          </button>
          <button onClick={onShowAbout} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold">
            About <InfoIcon />
          </button>
        </div>

        <div className="flex-1 flex justify-center cursor-pointer" onClick={() => setCurrentView('home')}>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white">
                Info<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-green-300">King</span> 👑
            </h1>
        </div>

        <div className="flex-1 flex justify-end items-center gap-4">
            {user ? (
                <div className="hidden md:flex items-center gap-2 text-white bg-white/20 p-2 rounded-full">
                    <UserIcon />
                    <span className="text-sm font-semibold truncate max-w-28">{user.email}</span>
                    <button onClick={handleSignOut} className="p-1 rounded-full hover:bg-white/20" title="Sign Out"><LogoutIcon /></button>
                </div>
            ) : (
                <button onClick={onSignIn} className="hidden md:block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors">
                    Sign In
                </button>
            )}
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
    <p>A production of Allen.J.Blythe(NXlevel)2025. Built with ❤️, Gemini, and React.</p>
    <p className="mt-1">Powered by Google AI & Supabase. Designed for dreamers.</p>
  </footer>
);

const ALL_PLATFORMS = ['Reddit', 'X', 'Instagram', 'LinkedIn', 'Tech Forums'];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [ideas, setIdeas] = useState<AppIdea[]>([]);
  const [showcaseApps, setShowcaseApps] = useState<ShowcaseApp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
  const [currentView, setCurrentView] = useState<'home' | 'history' | 'apps' | 'forum'>('home');
  
  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBrainstormModalOpen, setIsBrainstormModalOpen] = useState(false);
  const [isMockupModalOpen, setIsMockupModalOpen] = useState(false);
  const [isPitchDeckModalOpen, setIsPitchDeckModalOpen] = useState(false);
  const [isAppBuilderModalOpen, setIsAppBuilderModalOpen] = useState(false);
  
  // Feature States
  const [currentBrainstormIdea, setCurrentBrainstormIdea] = useState<AppIdea | null>(null);
  const [brainstormResult, setBrainstormResult] = useState<string | null>(null);
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  const [mockupImageUrl, setMockupImageUrl] = useState<string | null>(null);
  const [isGeneratingMockup, setIsGeneratingMockup] = useState(false);
  const [pitchDeckSlides, setPitchDeckSlides] = useState<string[]>([]);
  const [isGeneratingPitchDeck, setIsGeneratingPitchDeck] = useState(false);
  const [currentAppBuilderIdea, setCurrentAppBuilderIdea] = useState<AppIdea | null>(null);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Reddit', 'X']);
  
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const [guidanceStep, setGuidanceStep] = useState(0);

  // Authentication
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user && currentView !== 'forum') {
            loadInitialData(session.user.id);
        } else if (!session?.user) {
            setIdeas([]); // Clear ideas on logout
        }
    });

    setIsLoading(false);
    return () => subscription?.unsubscribe();
  }, [currentView]);

  const loadInitialData = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
        const [initialIdeas, initialApps] = await Promise.all([
            getIdeas(userId),
            getShowcaseApps()
        ]);
        setIdeas(initialIdeas);
        setShowcaseApps(initialApps);
        if (initialIdeas.length > 0) {
            setGuidanceStep(1);
        }
    } catch(e) {
        setError("Could not load saved data.");
    } finally {
        setIsLoading(false);
    }
  }, []);

  const withAuth = (action: Function) => {
      if (!user) {
          setIsAuthModalOpen(true);
          return;
      }
      action();
  };
  
  const handleFetchIdeas = async (customQuery?: string) => withAuth(async () => {
    if (!isOnline) {
        setError("You are offline. Please connect to the internet to find new ideas.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newIdeas = await fetchNewIdeas(customQuery, selectedPlatforms);
      await addIdeas(newIdeas, user!.id);
      const allIdeas = await getIdeas(user!.id);
      setIdeas(allIdeas);
      setShowConfetti(true);
      setGuidanceStep(1);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  });

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
        prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  // Other handlers (unchanged logic but wrapped in withAuth where needed)
  const handleAppSubmit = async (appData: Omit<ShowcaseApp, 'id'>) => {
    const newApp: ShowcaseApp = { ...appData, id: self.crypto.randomUUID() };
    const updatedApps = await addShowcaseApp(newApp);
    setShowcaseApps(updatedApps);
    setIsUploadModalOpen(false);
  };
  const handleBrainstorm = (idea: AppIdea) => withAuth(async () => {
    if (!isOnline) { setError("You must be online to use the Brainstorm Bot."); return; }
    if (guidanceStep === 1) setGuidanceStep(2);
    setCurrentBrainstormIdea(idea); setIsBrainstormModalOpen(true); setIsBrainstorming(true); setError(null); setBrainstormResult(null);
    try {
        const result = await brainstormIdea(idea); setBrainstormResult(result);
    } catch (e: any) {
        setError(e.message); setIsBrainstormModalOpen(false);
    } finally { setIsBrainstorming(false); }
  });
  const handleGenerateMockup = (idea: AppIdea) => withAuth(async () => {
    if (!isOnline) { setError("You must be online to generate mockups."); return; }
    if (guidanceStep === 1) setGuidanceStep(2);
    setIsMockupModalOpen(true); setIsGeneratingMockup(true); setMockupImageUrl(null); setError(null);
    try {
        const base64Image = await generateMockup(idea); setMockupImageUrl(base64Image);
    } catch (e: any) {
        setError(e.message); setIsMockupModalOpen(false);
    } finally { setIsGeneratingMockup(false); }
  });
  const handleGeneratePitchDeck = (idea: AppIdea) => withAuth(async () => {
    if (!isOnline) { setError("You must be online to generate a pitch deck."); return; }
    if (guidanceStep === 1) setGuidanceStep(2);
    setIsPitchDeckModalOpen(true); setIsGeneratingPitchDeck(true); setPitchDeckSlides([]); setError(null);
    try {
        const slides = await generatePitchDeckSlides(idea); setPitchDeckSlides(slides);
    } catch (e: any) {
        setError(e.message); setIsPitchDeckModalOpen(false);
    } finally { setIsGeneratingPitchDeck(false); }
  });
  const handleBuildApp = (idea: AppIdea) => withAuth(() => {
    if (!isOnline) { setError("You must be online to use the App Builder."); return; }
    if (guidanceStep === 1) setGuidanceStep(2);
    setCurrentAppBuilderIdea(idea); setIsAppBuilderModalOpen(true);
  });
  const handleDownload = (format: 'json' | 'csv') => {
    if (ideas.length === 0) { setError("No ideas to download."); return; }
    const downloadFile = (content: string, fileName: string, contentType: string) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([content], { type: contentType }));
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(a.href);
    };
    if (format === 'json') {
      downloadFile(JSON.stringify(ideas, null, 2), 'infoking_ideas.json', 'application/json');
    } else if (format === 'csv') {
      const headers = Object.keys(ideas[0]);
      const csv = [headers.join(','), ...ideas.map(row => headers.map(h => JSON.stringify((row as any)[h])).join(','))].join('\r\n');
      downloadFile(csv, 'infoking_ideas.csv', 'text/csv;charset=utf-8;');
    }
  };

  const sortedIdeas = useMemo(() => {
    const sorted = [...ideas];
    switch (sortOption) {
      case SortOption.MARKET_SIZE_ASC: return sorted.sort((a, b) => a.marketSizeScore - b.marketSizeScore);
      case SortOption.MARKET_SIZE_DESC: return sorted.sort((a, b) => b.marketSizeScore - a.marketSizeScore);
      default: return sorted;
    }
  }, [ideas, sortOption]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Network status listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline); window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-500 to-green-500 dark:from-cyan-900 dark:to-green-900 transition-colors duration-500">
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      {isUploadModalOpen && <UploadAppModal onClose={() => setIsUploadModalOpen(false)} onSubmit={handleAppSubmit} />}
      {isAboutModalOpen && <AboutModal onClose={() => setIsAboutModalOpen(false)} />}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
      {isBrainstormModalOpen && <BrainstormModal idea={currentBrainstormIdea} result={brainstormResult} isLoading={isBrainstorming} onClose={() => setIsBrainstormModalOpen(false)} />}
      {isMockupModalOpen && <MockupModal isLoading={isGeneratingMockup} imageUrl={mockupImageUrl} onClose={() => setIsMockupModalOpen(false)} />}
      {isPitchDeckModalOpen && <PitchDeckModal isLoading={isGeneratingPitchDeck} slides={pitchDeckSlides} onClose={() => setIsPitchDeckModalOpen(false)} />}
      {isAppBuilderModalOpen && currentAppBuilderIdea && <AppBuilderModal idea={currentAppBuilderIdea} onClose={() => setIsAppBuilderModalOpen(false)} />}
      
      <Header user={user} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} currentView={currentView} setCurrentView={setCurrentView} onShowAbout={() => setIsAboutModalOpen(true)} sortOption={sortOption} setSortOption={setSortOption} onSignIn={() => setIsAuthModalOpen(true)} />
      
      <main className="container mx-auto px-4 pb-12 flex-grow">
        {currentView === 'forum' && <ForumTab user={user} onSignIn={() => setIsAuthModalOpen(true)} />}

        {currentView === 'apps' && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold text-white">App Showcase</h2>
              <div className="flex items-center gap-4">
                 <button onClick={() => setIsUploadModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-400 hover:bg-green-500 transition-colors text-white font-semibold"><UploadCloudIcon size={20} /><span>Upload Your App</span></button>
                 <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold"><ArrowLeftIcon size={20} /><span>Go Back</span></button>
              </div>
            </div>
            {showcaseApps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {showcaseApps.map((app, index) => (<ShowcaseCard key={app.id} app={app} index={index} />))}
                </div>
            ) : (
                <div className="text-center py-16"><h2 className="text-3xl font-bold text-white mb-2">No Apps Yet!</h2><p className="text-green-100">Be the first to upload an app built from an idea.</p></div>
            )}
          </div>
        )}
        
        {currentView === 'history' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-white">Idea History</h2>
                  <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold"><ArrowLeftIcon size={20} /><span>Go Back</span></button>
              </div>
            </div>
        )}

        {currentView === 'home' && (
          <>
            <div className="mb-4">
              <div className="flex flex-wrap justify-center items-center gap-4">
                <button onClick={() => handleFetchIdeas()} disabled={isLoading || !isOnline} className={`w-full sm:w-auto flex items-center justify-center gap-3 text-white font-bold text-lg px-8 py-4 rounded-full bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${ideas.length === 0 && guidanceStep === 0 && !isLoading ? 'animate-pulse-bright' : ''}`}>
                    {isLoading ? (<><LoaderIcon size={24} /><span>AI is thinking...</span></>) : (<><SparklesIcon size={24} /><span>Find New Ideas</span></>)}
                </button>
                <button onClick={() => handleFetchIdeas("Generate app ideas addressing problems for teens or children in education, mental health, or social connection.")} disabled={isLoading || !isOnline} className="w-full sm:w-auto flex items-center justify-center gap-3 text-white font-bold text-lg px-8 py-4 rounded-full bg-purple-500 hover:bg-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
                    <SparklesIcon size={24} /> <span>Explore Teen Ideas</span>
                </button>
                <div className="relative" ref={downloadMenuRef}>
                    <button onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)} disabled={isLoading || ideas.length === 0} className="flex items-center justify-center gap-2 text-white font-bold px-5 py-3 rounded-full bg-green-500 hover:bg-green-600 transform hover:scale-105 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100" title="Download ideas">
                        <DownloadIcon size={20} /><span className="hidden sm:inline">Download</span><ChevronDownIcon size={20} className={`transition-transform ${isDownloadMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDownloadMenuOpen && <DownloadMenu onSelect={handleDownload} closeMenu={() => setIsDownloadMenuOpen(false)} />}
                </div>
              </div>
            </div>
            <div className="mb-8 p-4 bg-black/10 rounded-xl">
                <p className="text-center text-white font-semibold mb-3">Select sources to scrape:</p>
                <div className="flex flex-wrap justify-center items-center gap-2">
                    {ALL_PLATFORMS.map(platform => (
                        <button key={platform} onClick={() => togglePlatform(platform)} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${selectedPlatforms.includes(platform) ? 'bg-green-500 text-white' : 'bg-white/20 text-white/80 hover:bg-white/30'}`}>
                            {platform}
                        </button>
                    ))}
                </div>
            </div>
          </>
        )}
        
        {(currentView === 'home' || currentView === 'history') && (
          sortedIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {sortedIdeas.map((idea, index) => (<IdeaCard key={idea.id} idea={idea} index={index} onBrainstorm={handleBrainstorm} onGenerateMockup={handleGenerateMockup} onGeneratePitchDeck={handleGeneratePitchDeck} onBuildApp={handleBuildApp} isNextStep={guidanceStep === 1 && index === 0} />))}
            </div>
          ) : (
            !isLoading && user && (<div className="text-center pt-16 animate-fade-in"><h2 className="text-3xl font-bold text-white mb-2">{currentView === 'history' ? 'Your History is Empty' : 'No Ideas Yet!'}</h2><p className="text-green-100 max-w-md mx-auto">{currentView === 'history' ? 'Go back and find some new ideas.' : 'Click a button above to discover your first app idea, or get inspired by some of the greats.'}</p>{currentView === 'home' && <MosaicGrid />}</div>)
          )
        )}

        {!user && !isLoading && currentView !== 'apps' && (
             <div className="text-center pt-16 animate-fade-in">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome to InfoKing!</h2>
                <p className="text-green-100 max-w-md mx-auto mb-6">Sign in to find, save, and discuss billion-user app ideas.</p>
                <button onClick={() => setIsAuthModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors text-lg">
                    Sign In to Get Started
                </button>
                <MosaicGrid />
             </div>
        )}

         {error && (
            <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-sm animate-fade-in z-50" role="alert">
                <strong className="font-bold">An Error Occurred! </strong><span className="block sm:inline">{error}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}><svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg></span>
            </div>
        )}
        {!isOnline && (<div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-lg max-w-sm animate-fade-in z-50" role="alert"><p className="font-bold">Offline Mode</p><p>You are currently offline. Find new ideas and brainstorming are disabled.</p></div>)}
      </main>
      <Footer />
       <a href="https://www.buymeacoffee.com" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 left-6 w-16 h-16 rounded-full flex items-center justify-center text-black bg-yellow-400 hover:bg-yellow-500 shadow-lg transform hover:scale-110 transition-all duration-300 z-50 font-bold" aria-label="Donate to support the project">
        <span>☕</span>
      </a>
    </div>
  );
};

export default App;