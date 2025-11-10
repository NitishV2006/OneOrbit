
import React, { useEffect, useState } from 'react';

const ConfettiPiece: React.FC<{ id: number }> = ({ id }) => {
  const colors = ['#3B82F6', '#FBBF24', '#10B981', '#EF4444', '#8B5CF6'];
  const style: React.CSSProperties = {
    position: 'absolute',
    width: `${Math.random() * 8 + 6}px`,
    height: `${Math.random() * 8 + 6}px`,
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    top: `${-20}px`,
    left: `${Math.random() * 100}%`,
    opacity: 1,
    transform: `rotate(${Math.random() * 360}deg)`,
    animation: `fall-${id} 4s ease-out forwards`,
  };

  const keyframes = `
    @keyframes fall-${id} {
      to {
        transform: translate(${Math.random() * 200 - 100}px, 100vh) rotate(${Math.random() * 360}deg);
        opacity: 0;
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={style}></div>
    </>
  );
};


export const Confetti: React.FC = () => {
    const [pieces, setPieces] = useState<number[]>([]);

    useEffect(() => {
        setPieces(Array.from({ length: 100 }, (_, i) => i));
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-50">
            {pieces.map((i) => <ConfettiPiece key={i} id={i} />)}
        </div>
    );
};
