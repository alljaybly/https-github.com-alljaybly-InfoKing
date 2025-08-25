import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AppIdea, SortOption, ShowcaseApp, PitchDeckSlide, User } from './types';
import { fetchNewIdeas, brainstormIdea, generateAppMockup, generatePitchDeckContent, generateSlideImage } from './services/geminiService';
import { getIdeas, addIdeas, getShowcaseApps, addShowcaseApp, getCurrentUser, signOut } from './services/supabaseClient';
import IdeaCard from './components/IdeaCard';
import ShowcaseCard from './components/ShowcaseCard';
import UploadAppModal from './components/UploadAppModal';
import AboutModal from './components/AboutModal';
import BrainstormModal from './components/BrainstormModal';
import MockupModal from './components/MockupModal';
import PitchDeckModal from './components/PitchDeckModal';
import AppBuilderModal from './components/AppBuilderModal';
import AuthModal from './components/AuthModal';
import MosaicGrid from './components/MosaicGrid';
import GuidancePanel from './components/GuidancePanel';
import ForumView from './components/ForumView';
import DonationModal from './components/DonationModal';
import { SunIcon, MoonIcon, SparklesIcon, LoaderIcon, ClockIcon, ArrowLeftIcon, ChevronDownIcon, AppWindowIcon, UploadCloudIcon, InfoIcon, GlobeIcon, LightbulbIcon, MicrophoneIcon, ImageIcon, DownloadIcon, PresentationIcon, CodeIcon, RefreshCwIcon, UsersIcon, HeartIcon, RedditIcon, XIcon, YouTubeIcon, TikTokIcon, InstagramIcon, LinkedInIcon, LogOutIcon } from './components/icons';
import Confetti from './components/Confetti';

// Extend the Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type GuidanceStep = 'scrape' | 'mockup' | 'build' | 'pitch' | 'done';

const VIRAL_APP_IMAGES = [
  { url: 'https://placehold.co/400x400/000000/FFFFFF/png?text=TikTok', alt: 'TikTok Logo' },
  { url: 'https://placehold.co/400x400/E1306C/FFFFFF/png?text=Instagram', alt: 'Instagram Logo' },
  { url: 'https://placehold.co/400x400/000000/FFFFFF/png?text=Uber', alt: 'Uber Logo' },
  { url: 'https://placehold.co/400x400/1DB954/FFFFFF/png?text=Spotify', alt: 'Spotify Logo' },
  { url: 'https://placehold.co/400x400/FF5A5F/FFFFFF/png?text=Airbnb', alt: 'Airbnb Logo' },
  { url: 'https://placehold.co/400x400/25D366/FFFFFF/png?text=WhatsApp', alt: 'WhatsApp Logo' },
  { url: 'https://placehold.co/400x400/FFFC00/000000/png?text=Snapchat', alt: 'Snapchat Logo' },
  { url: 'https://placehold.co/400x400/E50914/FFFFFF/png?text=Netflix', alt: 'Netflix Logo' },
  { url: 'https://placehold.co/400x400/FF0000/FFFFFF/png?text=YouTube', alt: 'YouTube Logo' },
  { url: 'https://placehold.co/400x400/4285F4/FFFFFF/png?text=Google+Maps', alt: 'Google Maps Logo' },
  { url: 'https://placehold.co/400x400/FF9900/000000/png?text=Amazon', alt: 'Amazon Logo' },
  { url: 'https://placehold.co/400x400/1877F2/FFFFFF/png?text=Facebook', alt: 'Facebook Logo' },
  { url: 'https://placehold.co/400x400/E60023/FFFFFF/png?text=Pinterest', alt: 'Pinterest Logo' },
  { url: 'https://placehold.co/400x400/0A66C2/FFFFFF/png?text=LinkedIn', alt: 'LinkedIn Logo' },
  { url: 'https://placehold.co/400x400/000000/FFFFFF/png?text=X', alt: 'X (Twitter) Logo' },
  { url: 'https://placehold.co/400x400/4A154B/FFFFFF/png?text=Slack', alt: 'Slack Logo' },
];

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
    { name: 'Instagram', url: 'https://www.instagram.com' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com' },
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
  onShowForum: () => void;
  onShowAbout: () => void;
  onGoHome: () => void;
  onRefresh: () => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  currentUser: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
}> = ({ isDarkMode, toggleDarkMode, onShowHistory, onShowApps, onShowForum, onShowAbout, onGoHome, onRefresh, sortOption, setSortOption, currentUser, onSignIn, onSignOut }) => {
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
          <button onClick={onShowForum} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold">
            Forum <UsersIcon />
          </button>
          <button onClick={onShowAbout} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold">
            About <InfoIcon />
          </button>
        </div>

        <div className="flex-1 flex justify-center">
            <h1 onClick={onGoHome} className="cursor-pointer text-4xl md:text-6xl font-extrabold text-white">
                Info<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-green-300">King</span> 👑
            </h1>
        </div>

        <div className="flex-1 flex justify-end items-center gap-2">
            <button
                onClick={onRefresh}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                aria-label="Clear ideas and return home"
                title="Clear ideas and return home"
            >
                <RefreshCwIcon />
            </button>
            <button onClick={toggleDarkMode} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white" aria-label="Toggle dark mode">
                {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            {currentUser ? (
              <div className="relative group ml-2">
                  <button className="w-10 h-10 rounded-full bg-green-300 text-green-800 flex items-center justify-center font-bold text-lg uppercase">
                      {currentUser.email.charAt(0)}
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white/80 dark:bg-gray-800/90 rounded-lg shadow-lg backdrop-blur-sm p-2 hidden group-hover:block animate-fade-in z-50">
                      <p className="px-2 py-1 text-sm text-gray-600 dark:text-gray-300 truncate" title={currentUser.email}>{currentUser.email}</p>
                      <button onClick={onSignOut} className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-cyan-500/30 rounded-md transition-colors">
                          <LogOutIcon size={16} />
                          Sign Out
                      </button>
                  </div>
              </div>
            ) : (
                <button
                    onClick={onSignIn}
                    className="ml-2 px-5 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold transform hover:scale-105"
                >
                    Sign In
                </button>
            )}
        </div>
      </div>
      <p className="text-lg md:text-xl text-green-100 mt-2">Find your next billion-user app idea.</p>
    </header>
  );
};

const platformOptions = [
    { name: 'Reddit', icon: RedditIcon, color: 'text-red-500' },
    { name: 'X', icon: XIcon, color: 'dark:text-white text-black' },
    { name: 'YouTube', icon: YouTubeIcon, color: 'text-red-600' },
    { name: 'TikTok', icon: TikTokIcon, color: 'dark:text-white text-black' },
    { name: 'Instagram', icon: InstagramIcon, color: 'text-pink-500' },
    { name: 'LinkedIn', icon: LinkedInIcon, color: 'text-blue-600' },
];

const PlatformSelector: React.FC<{
  selectedPlatforms: string[];
  onPlatformToggle: (platform: string) => void;
}> = ({ selectedPlatforms, onPlatformToggle }) => {
  return (
    <div className="mb-8">
      <p className="text-center text-white font-semibold mb-3">Select platforms to scrape:</p>
      <div className="flex justify-center items-center flex-wrap gap-3">
        {platformOptions.map(platform => {
          const isSelected = selectedPlatforms.includes(platform.name);
          return (
            <button
              key={platform.name}
              onClick={() => onPlatformToggle(platform.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 transform hover:scale-105
                ${isSelected 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : 'bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 hover:bg-white'
                }`
              }
              aria-pressed={isSelected}
            >
              <platform.icon size={16} className={!isSelected ? platform.color : ''} />
              <span>{platform.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};


const Footer: React.FC<{ onOpenDonationModal: () => void; }> = ({ onOpenDonationModal }) => (
  <footer className="text-center py-6 px-4 text-green-100/80 text-sm">
    <div className="mb-4">
      <button
        onClick={onOpenDonationModal}
        className="px-6 py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition-colors transform hover:scale-105"
      >
        Donate
      </button>
    </div>
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
  const [currentView, setCurrentView] = useState<'home' | 'history' | 'apps' | 'forum'>('home');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // State for Brainstorm Bot
  const [isBrainstormModalOpen, setIsBrainstormModalOpen] = useState(false);
  const [currentBrainstormIdea, setCurrentBrainstormIdea] = useState<AppIdea | null>(null);
  const [brainstormResult, setBrainstormResult] = useState<string | null>(null);
  const [isBrainstorming, setIsBrainstorming] = useState(false);

  // State for Mockup Generator
  const [isMockupModalOpen, setIsMockupModalOpen] = useState(false);
  const [currentMockupIdea, setCurrentMockupIdea] = useState<AppIdea | null>(null);
  const [mockupImage, setMockupImage] = useState<string | null>(null);
  const [isGeneratingMockup, setIsGeneratingMockup] = useState(false);

  // State for Pitch Deck Generator
  const [isPitchDeckModalOpen, setIsPitchDeckModalOpen] = useState(false);
  const [currentPitchDeckIdea, setCurrentPitchDeckIdea] = useState<AppIdea | null>(null);
  const [pitchDeckSlides, setPitchDeckSlides] = useState<PitchDeckSlide[]>([]);
  const [isGeneratingPitchDeck, setIsGeneratingPitchDeck] = useState(false);
  const [pitchDeckGenerationProgress, setPitchDeckGenerationProgress] = useState('');

  // State for App Builder
  const [isAppBuilderModalOpen, setIsAppBuilderModalOpen] = useState(false);
  const [currentAppBuilderIdea, setCurrentAppBuilderIdea] = useState<AppIdea | null>(null);

  // State for Voice Mode
  const speechRecognitionRef = useRef<any>(null);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'processing'>('idle');
  const isVoiceModeActiveRef = useRef(isVoiceModeActive);
  useEffect(() => { isVoiceModeActiveRef.current = isVoiceModeActive; }, [isVoiceModeActive]);

  // State for Guidance System
  const [guidanceStep, setGuidanceStep] = useState<GuidanceStep>('scrape');
  const [showGuidance, setShowGuidance] = useState<boolean>(() => {
    return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('guidanceDismissed') !== 'true' : true;
  });
  
  // State for Platform Selection
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Reddit', 'X']);
  
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech Synthesis not supported in this browser.");
    }
  }, []);

  const handleFetchIdeas = useCallback(async (customTopic?: string, platforms: string[] = []) => {
    if (!currentUser) {
        setError("Please sign in to generate and save ideas.");
        setIsAuthModalOpen(true);
        return;
    }
    if (!isOnline) {
      const message = "You are offline. Please connect to the internet to find new ideas.";
      setError(message);
      speak(message);
      return;
    }
    if (platforms.length === 0) {
        const message = "Please select at least one platform to scrape.";
        setError(message);
        speak(message);
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newIdeas = await fetchNewIdeas(customTopic, platforms);
      const allIdeas = await addIdeas(currentUser.id, newIdeas);
      setIdeas(allIdeas);
      setShowConfetti(true);
      if (customTopic) {
        speak(`I found ${newIdeas.length} new ideas about ${customTopic}.`);
      } else {
        speak(`Success! I found ${newIdeas.length} new ideas.`);
      }

      if (newIdeas.length > 0 && showGuidance) {
        setGuidanceStep('mockup');
      }
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      speak("Sorry, I couldn't find any ideas right now.");
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, speak, showGuidance, currentUser]);
  
  const processVoiceCommand = useCallback(async (command: string) => {
    const commandLower = command.toLowerCase();
    const match = commandLower.match(/(?:find|get|search for) (.*) ideas/);

    if (match && match[1]) {
        const topic = match[1].trim();
        await handleFetchIdeas(topic, selectedPlatforms);
    } else if (commandLower.includes('find ideas') || commandLower.includes('get ideas')) {
        await handleFetchIdeas(undefined, selectedPlatforms);
    } else {
        speak("I didn't understand that. Please say something like 'find health app ideas'.");
    }
  }, [handleFetchIdeas, speak, selectedPlatforms]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setVoiceStatus('listening');
      recognition.onend = () => {
        if (isVoiceModeActiveRef.current) {
          setVoiceStatus('idle');
          setIsVoiceModeActive(false);
        }
      };
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setError(`Voice recognition error: ${event.error}`);
        setVoiceStatus('idle');
        setIsVoiceModeActive(false);
      };
      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceStatus('processing');
        await processVoiceCommand(transcript);
        setVoiceStatus('idle');
        setIsVoiceModeActive(false);
      };
      speechRecognitionRef.current = recognition;
    }
  }, [processVoiceCommand]);

  const toggleVoiceMode = () => {
    if (!speechRecognitionRef.current) {
      setError("Voice control is not supported by your browser.");
      return;
    }
    if (isVoiceModeActive) {
      speechRecognitionRef.current.stop();
      setIsVoiceModeActive(false);
      setVoiceStatus('idle');
    } else {
      speechRecognitionRef.current.start();
      setIsVoiceModeActive(true);
    }
  };


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

  const loadInitialData = useCallback(async (userId?: string) => {
    setIsLoading(true);
    try {
        const [initialIdeas, initialApps] = await Promise.all([
            userId ? getIdeas(userId) : Promise.resolve([]),
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
  
  const handleRefresh = () => {
    if (currentUser) {
        addIdeas(currentUser.id, []); // Clears user ideas
    }
    setIdeas([]);
    setCurrentView('home');
    setError(null);
  };

  // Check for existing user session on app load
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
        setCurrentUser(user);
    }
    loadInitialData(user?.id);
  }, [loadInitialData]);

  // Handle user login/logout
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    loadInitialData(user.id);
  };

  const handleSignOut = () => {
    signOut();
    setCurrentUser(null);
    setIdeas([]); // Clear ideas from state
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
     if (!currentUser) {
        setIsAuthModalOpen(true);
        return;
    }
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

  const handleGenerateMockup = async (idea: AppIdea) => {
     if (!currentUser) {
        setIsAuthModalOpen(true);
        return;
    }
    if (!isOnline) {
      setError("You must be online to generate mockups.");
      return;
    }
    setCurrentMockupIdea(idea);
    setIsMockupModalOpen(true);
    setIsGeneratingMockup(true);
    setError(null);
    setMockupImage(null);
    try {
      const imageUrl = await generateAppMockup(idea);
      setMockupImage(imageUrl);
      if (showGuidance) setGuidanceStep('build');
    } catch(e: any) {
      setError(e.message || "An unknown error occurred during mockup generation.");
      setIsMockupModalOpen(false);
    } finally {
      setIsGeneratingMockup(false);
    }
  };

  const closeMockupModal = () => {
    setIsMockupModalOpen(false);
    setCurrentMockupIdea(null);
    setMockupImage(null);
  };
  
  const handleGeneratePitchDeck = async (idea: AppIdea) => {
     if (!currentUser) {
        setIsAuthModalOpen(true);
        return;
    }
    if (!isOnline) {
      setError("You must be online to generate a pitch deck.");
      return;
    }
    setCurrentPitchDeckIdea(idea);
    setIsPitchDeckModalOpen(true);
    setIsGeneratingPitchDeck(true);
    setPitchDeckSlides([]);
    setError(null);
    
    try {
      setPitchDeckGenerationProgress('Generating slide content...');
      const slideContents = await generatePitchDeckContent(idea);

      const generatedSlides: PitchDeckSlide[] = [];
      for (let i = 0; i < slideContents.length; i++) {
        setPitchDeckGenerationProgress(`Generating visual for slide ${i + 1} of ${slideContents.length}...`);
        const imageUrl = await generateSlideImage(slideContents[i].imagePrompt);
        generatedSlides.push({ ...slideContents[i], imageUrl });
      }

      setPitchDeckSlides(generatedSlides);
      if (showGuidance) setGuidanceStep('done');

    } catch (e: any) {
      setError(e.message || 'Failed to generate pitch deck.');
      setIsPitchDeckModalOpen(false);
    } finally {
      setIsGeneratingPitchDeck(false);
      setPitchDeckGenerationProgress('');
    }
  };

  const closePitchDeckModal = () => {
    setIsPitchDeckModalOpen(false);
    setCurrentPitchDeckIdea(null);
    setPitchDeckSlides([]);
  };

  const handleBuildApp = (idea: AppIdea) => {
     if (!currentUser) {
        setIsAuthModalOpen(true);
        return;
    }
    setCurrentAppBuilderIdea(idea);
    setIsAppBuilderModalOpen(true);
    if (showGuidance) setGuidanceStep('pitch');
  };

  const closeAppBuilderModal = () => {
    setIsAppBuilderModalOpen(false);
    setCurrentAppBuilderIdea(null);
  };


  const handleDownloadIdeas = () => {
    if (ideas.length === 0) {
      setError("There are no ideas to download.");
      return;
    }
    try {
      const jsonString = JSON.stringify(ideas, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'infoking_ideas.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError("Failed to prepare ideas for download.");
      console.error("Download error:", e);
    }
  };

  const dismissGuidance = () => {
    setShowGuidance(false);
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('guidanceDismissed', 'true');
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  const sortedIdeas = useMemo(() => {
    if (!currentUser) return [];
    const sorted = [...ideas];
    switch (sortOption) {
      case SortOption.MARKET_SIZE_ASC:
        return sorted.sort((a, b) => a.marketSizeScore - b.marketSizeScore);
      case SortOption.MARKET_SIZE_DESC:
        return sorted.sort((a, b) => b.marketSizeScore - a.marketSizeScore);
      default:
        return sorted;
    }
  }, [ideas, sortOption, currentUser]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-cyan-500 to-green-500 dark:from-cyan-900 dark:to-green-900 transition-colors duration-500 rounded-2xl overflow-hidden shadow-[0_0_35px_-5px_rgba(34,211,238,0.5)] dark:shadow-[0_0_35px_-5px_rgba(52,211,153,0.4)]">
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />}
      {isUploadModalOpen && <UploadAppModal onClose={() => setIsUploadModalOpen(false)} onSubmit={handleAppSubmit} />}
      {isAboutModalOpen && <AboutModal onClose={() => setIsAboutModalOpen(false)} />}
      {isDonationModalOpen && <DonationModal onClose={() => setIsDonationModalOpen(false)} />}
      {isBrainstormModalOpen && (
        <BrainstormModal 
            idea={currentBrainstormIdea}
            result={brainstormResult}
            isLoading={isBrainstorming}
            onClose={closeBrainstormModal}
        />
      )}
      {isMockupModalOpen && (
        <MockupModal
          idea={currentMockupIdea}
          mockupImage={mockupImage}
          isLoading={isGeneratingMockup}
          onClose={closeMockupModal}
        />
      )}
      {isPitchDeckModalOpen && (
        <PitchDeckModal
          idea={currentPitchDeckIdea}
          slides={pitchDeckSlides}
          isLoading={isGeneratingPitchDeck}
          progressText={pitchDeckGenerationProgress}
          onClose={closePitchDeckModal}
        />
      )}
      {isAppBuilderModalOpen && (
        <AppBuilderModal
          idea={currentAppBuilderIdea}
          onClose={closeAppBuilderModal}
        />
      )}
      
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onShowHistory={() => setCurrentView('history')}
        onShowApps={() => setCurrentView('apps')}
        onShowForum={() => setCurrentView('forum')}
        onShowAbout={() => setIsAboutModalOpen(true)}
        onGoHome={() => setCurrentView('home')}
        onRefresh={handleRefresh}
        sortOption={sortOption}
        setSortOption={setSortOption}
        currentUser={currentUser}
        onSignIn={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />
      
      <main className="container mx-auto px-4 pb-12 flex-grow overflow-y-auto">
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

        {currentView === 'forum' && (
          <div className="animate-fade-in">
            <ForumView
              userIdeas={ideas}
              currentUser={currentUser}
              onGoBack={() => setCurrentView('home')}
              onAuthRequest={() => setIsAuthModalOpen(true)}
            />
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
          <>
            <PlatformSelector selectedPlatforms={selectedPlatforms} onPlatformToggle={handlePlatformToggle} />
            <div className="flex justify-center items-center flex-wrap gap-4">
              <button
                  onClick={() => handleFetchIdeas(undefined, selectedPlatforms)}
                  disabled={isLoading || !isOnline}
                  className={`flex items-center justify-center gap-3 text-white font-bold text-lg px-8 py-4 rounded-full bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${showGuidance && guidanceStep === 'scrape' ? 'animate-pulse ring-4 ring-white/50' : ''}`}
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
              <button
                  onClick={() => handleFetchIdeas('teenagers and children', selectedPlatforms)}
                  disabled={isLoading || !isOnline}
                  className={`flex items-center justify-center gap-3 text-white font-bold text-lg px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${showGuidance && guidanceStep === 'scrape' ? 'animate-pulse ring-4 ring-white/50' : ''}`}
              >
                  <SparklesIcon size={24} />
                  <span>Explore Teen Ideas</span>
              </button>
               <button
                  onClick={handleDownloadIdeas}
                  disabled={ideas.length === 0}
                  className="flex items-center justify-center gap-2 text-white font-bold px-6 py-4 rounded-full bg-blue-500 hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                  aria-label="Download ideas as JSON"
                >
                  <DownloadIcon size={22} />
                  <span className="hidden sm:inline">Download Ideas</span>
                </button>
            </div>
          </>
        )}
        
        {(currentView === 'home' || currentView === 'history') && (
          sortedIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in mt-8">
              {sortedIdeas.map((idea, index) => (
                <IdeaCard 
                    key={idea.id} 
                    idea={idea} 
                    index={index} 
                    onBrainstorm={handleBrainstorm} 
                    onGenerateMockup={handleGenerateMockup} 
                    onGeneratePitchDeck={handleGeneratePitchDeck} 
                    onBuildApp={handleBuildApp}
                    showGuidance={showGuidance && index === 0}
                    guidanceStep={guidanceStep}
                />
              ))}
            </div>
          ) : (
            !isLoading && (
              <>
                {currentView === 'home' ? (
                  !currentUser ? (
                    <div className="text-center py-16 animate-fade-in">
                      <h2 className="text-3xl font-bold text-white mb-2">Welcome to InfoKing!</h2>
                      <p className="text-green-100 max-w-md mx-auto">Please sign in to generate, save, and manage your app ideas.</p>
                      <button onClick={() => setIsAuthModalOpen(true)} className="mt-6 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold transform hover:scale-105">
                          Sign In to Get Started
                      </button>
                    </div>
                  ) : (
                     <div className="mt-8">
                        <MosaicGrid images={VIRAL_APP_IMAGES} />
                     </div>
                  )
                ) : (
                  <div className="text-center py-16 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">Your History is Empty</h2>
                    <p className="text-green-100">Go back and find some new ideas.</p>
                  </div>
                )}
              </>
            )
          )
        )}
         {error && (
              <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-sm animate-fade-in z-[60]" role="alert">
                  <strong className="font-bold">An Error Occurred! </strong>
                  <span className="block sm:inline">{error}</span>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                  </span>
              </div>
            )}
            
            {!isOnline && (
              <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-lg max-w-sm animate-fade-in z-[60]" role="alert">
                  <p className="font-bold">Offline Mode</p>
                  <p>You are currently offline. Find new ideas and brainstorming are disabled.</p>
              </div>
            )}
      </main>
      <Footer onOpenDonationModal={() => setIsDonationModalOpen(true)} />
      {showGuidance && guidanceStep !== 'done' && ideas.length === 0 && (
        <GuidancePanel step="scrape" onDismiss={dismissGuidance} />
      )}
      {showGuidance && guidanceStep !== 'done' && ideas.length > 0 && (
         <GuidancePanel step={guidanceStep} onDismiss={dismissGuidance} />
      )}
       <button
          onClick={toggleVoiceMode}
          disabled={!isOnline}
          className={`fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-green-300
          ${isVoiceModeActive ? 'bg-red-500' : 'bg-green-500'}
          ${voiceStatus === 'listening' ? 'animate-pulse' : ''}
          `}
          aria-label="Toggle Voice Mode"
      >
          {voiceStatus === 'processing' ? <LoaderIcon size={28} /> : <MicrophoneIcon size={28} />}
      </button>
    </div>
  );
};

export default App;
