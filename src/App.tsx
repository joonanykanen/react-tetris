// Main App component for Tetris game

import { useEffect, useRef, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { gameStatusAtom } from './atoms/gameStatusAtom';
import { lastDropTimeAtom, dropIntervalAtom, updateLastDropTimeAtom } from './atoms/gameLoopAtom';
import { moveLeftAtom, moveRightAtom, moveDownAtom, rotatePieceAtom, rotateCounterClockwiseAtom, hardDropAtom, gameTickAtom, pauseGameAtom, startGameAtom } from './atoms/gameActionsAtom';
import { useKeyboardInput } from './hooks/useKeyboardInput';
import { type DASKey } from './config/inputConfig';
import GameBoard from './components/GameBoard';
import NextPiece from './components/NextPiece';
import ScoreDisplay from './components/ScoreDisplay';
import Controls from './components/Controls';
import Leaderboard from './components/Leaderboard';
import PauseMenu from './components/PauseMenu';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const gameStatus = useAtomValue(gameStatusAtom);
  const lastDropTime = useAtomValue(lastDropTimeAtom);
  const dropInterval = useAtomValue(dropIntervalAtom);
  const updateLastDropTime = useSetAtom(updateLastDropTimeAtom);
  
  const moveLeft = useSetAtom(moveLeftAtom);
  const moveRight = useSetAtom(moveRightAtom);
  const moveDown = useSetAtom(moveDownAtom);
  const rotatePiece = useSetAtom(rotatePieceAtom);
  const rotateCounterClockwise = useSetAtom(rotateCounterClockwiseAtom);
  const hardDrop = useSetAtom(hardDropAtom);
  const gameTick = useSetAtom(gameTickAtom);
  const pauseGame = useSetAtom(pauseGameAtom);
  const startGame = useSetAtom(startGameAtom);
  
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);

  // Handle DAS repeat for movement keys
  const handleDASRepeat = useCallback((key: DASKey) => {
    if (gameStatus !== 'playing') return;
    
    switch (key) {
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
      case 'ArrowDown':
        moveDown();
        break;
    }
  }, [gameStatus, moveLeft, moveRight, moveDown]);

  // Handle one-shot keys (rotate, hard drop, pause, restart)
  const handleOneShot = useCallback((key: string) => {
    // Handle start game with Space when idle
    if (gameStatus === 'idle' && (key === ' ')) {
      startGame();
      return;
    }
    
    // Handle pause/unpause with ESC or P
    if ((key === 'Escape' || key === 'p' || key === 'P') && (gameStatus === 'playing' || gameStatus === 'paused')) {
      pauseGame();
      return;
    }
    
    // Only handle other keys when playing
    if (gameStatus !== 'playing') return;
    
    switch (key) {
      case 'ArrowUp':
        rotatePiece();
        break;
      case ' ':
        hardDrop();
        break;
      case 'z':
      case 'Z':
        rotateCounterClockwise();
        break;
    }
  }, [gameStatus, rotatePiece, rotateCounterClockwise, hardDrop, pauseGame, startGame]);

  // Setup keyboard input with DAS
  const { processInput } = useKeyboardInput({
    onDASRepeat: handleDASRepeat,
    onOneShot: handleOneShot,
  });

  // Game loop
  useEffect(() => {
    if (gameStatus !== 'playing') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const gameLoop = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }

      // Process DAS input for smooth movement
      const dasKeys = processInput(timestamp);
      for (const key of dasKeys) {
        handleDASRepeat(key);
      }

      // Check if it's time to drop the piece
      if (timestamp - lastDropTime >= dropInterval) {
        gameTick();
        updateLastDropTime(timestamp);
      }

      lastTimeRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimeRef.current = 0;
    };
  }, [gameStatus, lastDropTime, dropInterval, gameTick, updateLastDropTime, processInput, handleDASRepeat]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
        {/* Left side: Game board */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
            TETRIS
          </h1>
          <GameBoard />
          
          {/* Leaderboard button */}
          <Leaderboard />
        </div>

        {/* Right side: Info panel */}
        <div className="flex flex-col gap-6">
          <NextPiece />
          <ScoreDisplay />
          
          <Controls />
          
          {/* Controls info */}
          <div className="bg-gray-900 p-4 rounded-lg border-2 border-gray-700 shadow-lg">
            <h3 className="text-sm font-bold text-gray-400 mb-2">CONTROLS</h3>
            <div className="text-xs text-gray-300 space-y-1">
              <div>← → : Move left/right</div>
              <div>↓ : Soft drop</div>
              <div>↑ : Rotate clockwise</div>
              <div>Z : Rotate counter-clockwise</div>
              <div>Space : Hard drop / Start game</div>
              <div>ESC / P : Pause</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pause menu modal */}
      <PauseMenu />
      
      {/* Settings modal */}
      <SettingsModal />
    </div>
  );
}
