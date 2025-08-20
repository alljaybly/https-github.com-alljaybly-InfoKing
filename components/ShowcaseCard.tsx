
import React from 'react';
import { ShowcaseApp } from '../types';

interface ShowcaseCardProps {
  app: ShowcaseApp;
  index: number;
}

const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ app, index }) => {
    const categoryColors: { [key: string]: string } = {
        Health: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        Productivity: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        Finance: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        Social: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        Other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };

    const cardContent = (
        <div
            className={`bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-white/20 animate-slide-in h-full flex flex-col ${app.appUrl ? 'hover:shadow-cyan-400/30 hover:border-cyan-400 transition-all duration-300' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                <img src={app.imageUrl} alt={`${app.name} screenshot`} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{app.name}</h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full shrink-0 ml-2 ${categoryColors[app.category] || categoryColors.Other}`}>
                        {app.category}
                    </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 flex-grow">{app.description}</p>
            </div>
        </div>
    );
    
    if (app.appUrl) {
        return (
            <a href={app.appUrl} target="_blank" rel="noopener noreferrer" className="block outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-4 focus:ring-offset-transparent rounded-xl">
              {cardContent}
            </a>
        );
    }

    return cardContent;
};

export default ShowcaseCard;