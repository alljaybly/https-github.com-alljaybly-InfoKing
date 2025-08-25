
import React from 'react';
import { ShowcaseApp } from '../types';

interface UploadAppModalProps {
  onClose: () => void;
  onSubmit: (appData: Omit<ShowcaseApp, 'id'>) => void;
}

const UploadAppModal: React.FC<UploadAppModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = React.useState('');
  const [appUrl, setAppUrl] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<ShowcaseApp['category']>('Other');
  const [imageUrl, setImageUrl] = React.useState('');
  const [error, setError] = React.useState('');
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !imageUrl) {
      setError('Please fill in all fields and upload an image.');
      return;
    }
    setError('');
    onSubmit({ name, appUrl, description, category, imageUrl });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg m-auto p-6 md:p-8 animate-slide-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Upload Your App</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="App Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-500" required />
          <input type="url" placeholder="App URL (e.g., https://myapp.com)" value={appUrl} onChange={(e) => setAppUrl(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-500" />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 h-24" required />
          <select value={category} onChange={(e) => setCategory(e.target.value as ShowcaseApp['category'])} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white">
            <option>Productivity</option>
            <option>Health</option>
            <option>Finance</option>
            <option>Social</option>
            <option>Other</option>
          </select>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">App Icon or Screenshot</label>
            <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 dark:file:bg-cyan-900/50 file:text-cyan-700 dark:file:text-cyan-300 hover:file:bg-cyan-100" required />
          </div>
          {imageUrl && <img src={imageUrl} alt="Preview" className="mt-4 rounded-lg max-h-40 w-auto mx-auto" />}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-full text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadAppModal;