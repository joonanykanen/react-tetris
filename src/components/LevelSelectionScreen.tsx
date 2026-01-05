// Level selection screen component for NES Tetris

import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useCallback } from 'react';
import { gameStatusAtom } from '../atoms/gameStatusAtom';
import { startLevelAtom } from '../atoms/startLevelAtom';
import { playSound } from '../utils/sound';

export default function LevelSelectionScreen() {
  const gameStatus = useAtomValue(gameStatusAtom);
  const startLevel = useAtomValue(startLevelAtom);
  const setStartLevel = useSetAtom(startLevelAtom);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (gameStatus !== 'idle') return;

    if (event.key === 'ArrowLeft') {
      setStartLevel(prev => Math.max(0, prev - 1));
      playSound('move');
    } else if (event.key === 'ArrowRight') {
      setStartLevel(prev => Math.min(9, prev + 1));
      playSound('move');
    } else if (event.key === ' ' || event.key === 'Enter') {
      playSound('start');
    }
  }, [gameStatus, setStartLevel]);

  useEffect(() => {
    if (gameStatus !== 'idle') return;
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStatus, handleKeyDown]);

  // Only show when game is idle
  if (gameStatus !== 'idle') {
    return null;
  }

  const handleLevelSelect = (level: number) => {
    setStartLevel(level);
    playSound('move'); // Play selection sound
  };

  const handleStartGame = () => {
    playSound('start'); // Play start sound
    // The actual game start is handled by the keyboard input handler in App.tsx
    // which listens for space key when gameStatus is 'idle'
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl border-2 border-purple-500 shadow-2xl p-8 max-w-md w-full">
          {/* Title */}
          <h2 className="text-3xl font-bold text-purple-400 text-center mb-2">
            SELECT LEVEL
          </h2>

          {/* Subtitle */}
          <p className="text-gray-500 text-sm text-center mb-6">
            Use ← → to select, SPACE to start
          </p>

          {/* Level display */}
          <div className="flex items-center justify-center mb-8">
            <button
              onClick={() => handleLevelSelect(Math.max(0, startLevel - 1))}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-l-lg transition-colors"
            >
              ←
            </button>
            <div className="px-8 py-4 bg-gray-800 border-x-2 border-gray-700">
              <span className="text-6xl font-bold text-yellow-400 font-mono">
                {startLevel}
              </span>
            </div>
            <button
              onClick={() => handleLevelSelect(Math.min(9, startLevel + 1))}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-r-lg transition-colors"
            >
              →
            </button>
          </div>

          {/* Level info */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Starting Speed</p>
              <p className="text-white font-medium">
                {startLevel === 0 ? '48 frames/cell' :
                 startLevel === 1 ? '43 frames/cell' :
                 startLevel === 2 ? '38 frames/cell' :
                 startLevel === 3 ? '33 frames/cell' :
                 startLevel === 4 ? '28 frames/cell' :
                 startLevel === 5 ? '23 frames/cell' :
                 startLevel === 6 ? '18 frames/cell' :
                 startLevel === 7 ? '13 frames/cell' :
                 startLevel === 8 ? '8 frames/cell' :
                 '6 frames/cell'}
              </p>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={handleStartGame}
            className="w-full mb-4 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:scale-105"
          >
            PRESS SPACE TO START
          </button>

          {/* Hint */}
          <p className="text-gray-500 text-sm text-center">
            Level advances every 10 lines
          </p>
        </div>
      </div>
    </>
  );
}