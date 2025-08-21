import React from 'react';

// An array of popular app logos using placeholders for demonstration
const appLogos = [
  'https://placehold.co/200x200/000000/FFFFFF/png?text=TikTok',
  'https://placehold.co/200x200/E1306C/FFFFFF/png?text=Instagram',
  'https://placehold.co/200x200/1DB954/FFFFFF/png?text=Spotify',
  'https://placehold.co/200x200/000000/FFFFFF/png?text=Uber',
  'https://placehold.co/200x200/FFFC00/000000/png?text=Snapchat',
  'https://placehold.co/200x200/25D366/FFFFFF/png?text=WhatsApp',
  'https://placehold.co/200x200/FF0000/FFFFFF/png?text=YouTube',
  'https://placehold.co/200x200/1DA1F2/FFFFFF/png?text=X',
  'https://placehold.co/200x200/0088CC/FFFFFF/png?text=Telegram',
  'https://placehold.co/200x200/7289DA/FFFFFF/png?text=Discord',
  'https://placehold.co/200x200/0d1117/FFFFFF/png?text=GitHub',
  'https://placehold.co/200x200/F97316/FFFFFF/png?text=VLC',
  'https://placehold.co/200x200/4285F4/FFFFFF/png?text=Google',
  'https://placehold.co/200x200/0078D4/FFFFFF/png?text=VS+Code',
  'https://placehold.co/200x200/F24E1E/FFFFFF/png?text=Figma',
  'https://placehold.co/200x200/BD081C/FFFFFF/png?text=Pinterest',
];

// Shuffle the array for a dynamic feel on each load
const shuffledLogos = [...appLogos].sort(() => 0.5 - Math.random());

const MosaicGrid: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-16 animate-fade-in">
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4 p-4">
        {shuffledLogos.map((url, index) => (
          <div
            key={index}
            className="aspect-square bg-white/5 rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-110 will-change-transform"
            style={{ animation: `fadeIn 0.5s ease-out ${index * 50}ms forwards`, opacity: 0 }}
          >
            <img
              src={url}
              alt={`Viral app logo ${index + 1}`}
              className="w-full h-full object-contain p-2 opacity-40 hover:opacity-90 transition-opacity duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MosaicGrid;