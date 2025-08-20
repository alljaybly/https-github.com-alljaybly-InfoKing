
import React, { useState, useEffect } from 'react';

const CONFETTI_COUNT = 100;
const COLORS = ['#22d3ee', '#34d399', '#fde047', '#f472b6', '#a78bfa'];

const Confetti: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [pieces, setPieces] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: CONFETTI_COUNT }).map((_, index) => {
      const style: React.CSSProperties = {
        left: `${Math.random() * 100}%`,
        backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        animation: `fall ${2 + Math.random() * 3}s ${Math.random() * 2}s linear forwards`,
        transform: `rotate(${Math.random() * 360}deg)`,
      };
      return <div key={index} className="confetti-piece" style={style}></div>;
    });
    setPieces(newPieces);
    
    // Set a timeout to call the onComplete callback after the longest animation
    const timeoutId = setTimeout(onComplete, 5000); // 3s + 2s max delay

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: 9999;
        }
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 20px;
          top: -20px;
          opacity: 0;
        }
        @keyframes fall {
          0% {
            top: -20px;
            opacity: 1;
          }
          100% {
            top: 110vh;
            opacity: 1;
          }
        }
      `}</style>
      <div className="confetti-container">{pieces}</div>
    </>
  );
};

export default Confetti;
