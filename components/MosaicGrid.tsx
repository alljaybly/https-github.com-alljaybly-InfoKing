import React from 'react';

interface MosaicGridProps {
  images: { url: string; alt: string }[];
}

const MosaicGrid: React.FC<MosaicGridProps> = ({ images }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white/90">Inspiration from Global Winners</h2>
            <p className="text-green-100/80">Apps that solved a problem for millions.</p>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3 opacity-60 dark:opacity-40">
            {images.map((image, index) => (
                <div key={index} className="aspect-square bg-white/10 rounded-lg overflow-hidden group">
                    <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                        loading="lazy"
                    />
                </div>
            ))}
        </div>
    </div>
  );
};

export default MosaicGrid;
