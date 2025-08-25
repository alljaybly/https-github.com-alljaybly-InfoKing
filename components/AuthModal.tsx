
import React, { useState } from 'react';
import { User } from '../types';
import { signIn, signUp, signInWithGoogle } from '../services/supabaseClient';
import { LoaderIcon, GoogleIcon } from './icons';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

type AuthMode = 'signIn' | 'signUp';

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const action = mode === 'signIn' ? signIn : signUp;
    const { user, error: authError } = await action(email, password);

    setIsLoading(false);
    if (authError) {
      setError(authError.message);
    } else if (user) {
      onAuthSuccess(user);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    const { user, error: authError } = await signInWithGoogle();
     setIsLoading(false);
    if (authError) {
      setError(authError.message);
    } else if (user) {
      onAuthSuccess(user);
    }
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setEmail('');
    setPassword('');
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm m-auto p-6 md:p-8 animate-slide-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center">
          {mode === 'signIn' ? 'Welcome Back!' : 'Create Account'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
          {mode === 'signIn' ? 'Sign in to access your ideas.' : 'Join to start saving your ideas.'}
        </p>

        <button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 p-3 mb-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-white font-semibold disabled:opacity-50"
        >
            <GoogleIcon size={20} />
            <span>Continue with Google</span>
        </button>

        <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-200 dark:border-gray-600" />
            <span className="mx-4 text-sm text-gray-400 dark:text-gray-500">OR</span>
            <hr className="flex-grow border-gray-200 dark:border-gray-600" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500" required minLength={6} />
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full p-3 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center">
            {isLoading ? <LoaderIcon size={24} /> : (mode === 'signIn' ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {mode === 'signIn' ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => switchMode(mode === 'signIn' ? 'signUp' : 'signIn')} className="font-semibold text-cyan-500 hover:underline ml-1">
                {mode === 'signIn' ? 'Sign Up' : 'Sign In'}
            </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
