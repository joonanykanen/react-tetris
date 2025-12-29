// Controls component for Tetris game

import { useAtomValue, useSetAtom } from 'jotai';
import { gameStatusAtom } from '../atoms/gameStatusAtom';
import { startGameAtom, pauseGameAtom, restartGameAtom } from '../atoms/gameActionsAtom';
import SoundToggle from './SoundToggle';
import SettingsButton from './SettingsButton';
import Leaderboard from './Leaderboard';

export default function Controls() {
  const gameStatus = useAtomValue(gameStatusAtom);
  const startGame = useSetAtom(startGameAtom);
  const pauseGame = useSetAtom(pauseGameAtom);
  const restartGame = useSetAtom(restartGameAtom);

  const handleStart = () => {
    startGame();
  };

  const handlePause = () => {
    pauseGame();
  };

  const handleRestart = () => {
    restartGame();
  };

  return (
    <div className="flex flex-col gap-3">
      {gameStatus === 'idle' && (
        <Button onClick={handleStart} variant="primary">
          START GAME
        </Button>
      )}
      
      {gameStatus === 'playing' && (
        <Button onClick={handlePause} variant="secondary">
          PAUSE
        </Button>
      )}
      
      {gameStatus === 'paused' && (
        <>
          <Button onClick={handlePause} variant="primary">
            RESUME
          </Button>
          <Button onClick={handleRestart} variant="secondary">
            RESTART
          </Button>
        </>
      )}
      
      {gameStatus === 'gameover' && (
        <Button onClick={handleRestart} variant="primary">
          PLAY AGAIN
        </Button>
      )}
      
      {/* Sound toggle, settings, and leaderboard */}
      <div className="flex justify-center mt-2 gap-2">
        <SoundToggle />
        <SettingsButton />
        <Leaderboard />
      </div>
    </div>
  );
}

function Button({ onClick, variant, children }: { onClick: () => void; variant: 'primary' | 'secondary'; children: React.ReactNode }) {
  const baseClasses = 'px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 shadow-lg';
  const variantClasses = variant === 'primary' 
    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:scale-105' 
    : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 hover:scale-105';
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses}`}
    >
      {children}
    </button>
  );
}