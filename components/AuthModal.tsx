import React, { useState } from 'react';
import { signInWithGoogle, signUpWithPassword, signInWithPassword } from '../services/supabaseClient';
import { GoogleIcon, LoaderIcon } from './icons';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignIn) {
        await signInWithPassword(email, password);
      } else {
        await signUpWithPassword(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
        await signInWithGoogle();
        // The modal will close automatically on successful redirect
    } catch (err: any) {
        setError(err.message);
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm m-auto p-6 md:p-8 animate-slide-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">{isSignIn ? 'Sign In' : 'Create Account'}</h2>
        
        <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold text-gray-800 dark:text-white mb-4 disabled:opacity-50"
        >
            {loading ? <LoaderIcon size={20} /> : <GoogleIcon size={20} />}
            <span>Continue with Google</span>
        </button>

        <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300 dark:border-gray-600"/>
            <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <hr className="flex-grow border-gray-300 dark:border-gray-600"/>
        </div>

        <form onSubmit={handleAuthAction} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-500" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-500" required />
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <LoaderIcon size={20} />}
            <span>{isSignIn ? 'Sign In' : 'Sign Up'}</span>
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsSignIn(!isSignIn)} className="font-semibold text-cyan-500 hover:underline ml-1">
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
