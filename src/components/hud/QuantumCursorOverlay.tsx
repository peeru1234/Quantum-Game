import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';

export const QuantumCursorOverlay: React.FC = () => {
  const { gameStage, cursorMode } = useGame();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (gameStage !== 'PLAYING' || !cursorMode) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Sci-Fi Holographic Cursor Ring */}
      <div
        className={`relative flex items-center justify-center transition-all ${
          isClicking ? 'scale-75' : 'scale-100'
        }`}
      >
        <div className="w-6 h-6 rounded-full border-2 border-quantum-cyan shadow-[0_0_12px_#00f3ff] animate-pulse" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-quantum-pink shadow-[0_0_8px_#ff007f]" />
        <div className="absolute -top-1 w-[1px] h-2 bg-quantum-cyan" />
        <div className="absolute -bottom-1 w-[1px] h-2 bg-quantum-cyan" />
        <div className="absolute -left-1 h-[1px] w-2 bg-quantum-cyan" />
        <div className="absolute -right-1 h-[1px] w-2 bg-quantum-cyan" />
      </div>
    </div>
  );
};
