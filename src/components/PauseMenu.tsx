// Pause menu modal component for Tetris game

import { useAtomValue, useSetAtom } from 'jotai';
import { gameStatusAtom } from '../atoms/gameStatusAtom';
import { pauseGameAtom, restartGameAtom } from '../atoms/gameActionsAtom';

export default function PauseMenu() {
  const gameStatus = useAtomValue(gameStatusAtom);
  const pauseGame = useSetAtom(pauseGameAtom);
  const restartGame = useSetAtom(restartGameAtom);

  if (gameStatus !== 'paused') {
    return null;
  }

  const handleResume = () => {
    pauseGame();
  };

  const handleRestart = () => {
    restartGame();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl border-2 border-purple-500 shadow-2xl p-8">
          {/* Title */}
          <h2 className="text-3xl font-bold text-purple-400 text-center mb-6">
            PAUSED
          </h2>

          {/* Resume button */}
          <button
            onClick={handleResume}
            className="w-full mb-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:scale-105"
          >
            RESUME
          </button>

          {/* Restart button */}
          <button
            onClick={handleRestart}
            className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:scale-105"
          >
            RESTART
          </button>

          {/* Hint */}
          <p className="text-gray-500 text-sm text-center mt-6">
            Press ESC to resume
          </p>
        </div>
      </div>
    </>
  );
}