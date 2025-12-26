// Main App component for Tetris game

import { useEffect, useRef, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { gameStatusAtom } from './atoms/gameStatusAtom';
import { lastDropTimeAtom, dropIntervalAtom, updateLastDropTimeAtom } from './atoms/gameLoopAtom';
import { moveLeftAtom, moveRightAtom, moveDownAtom, rotatePieceAtom, hardDropAtom, gameTickAtom, pauseGameAtom, restartGameAtom } from './atoms/gameActionsAtom';
import { useKeyboardInput } from './hooks/useKeyboardInput';
import { type DASKey } from './config/inputConfig';
import GameBoard from './components/GameBoard';
import NextPiece from './components/NextPiece';
import ScoreDisplay from './components/ScoreDisplay';
import Controls from './components/Controls';

export default function App() {
  const gameStatus = useAtomValue(gameStatusAtom);
  const lastDropTime = useAtomValue(lastDropTimeAtom);
  const dropInterval = useAtomValue(dropIntervalAtom);
  const updateLastDropTime = useSetAtom(updateLastDropTimeAtom);
  
  const moveLeft = useSetAtom(moveLeftAtom);
  const moveRight = useSetAtom(moveRightAtom);
  const moveDown = useSetAtom(moveDownAtom);
  const rotatePiece = useSetAtom(rotatePieceAtom);
  const hardDrop = useSetAtom(hardDropAtom);
  const gameTick = useSetAtom(gameTickAtom);
  const pauseGame = useSetAtom(pauseGameAtom);
  const restartGame = useSetAtom(restartGameAtom);
  
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
    if (gameStatus !== 'playing' && key !== 'p' && key !== 'P' && key !== 'r' && key !== 'R') return;
    
    switch (key) {
      case 'ArrowUp':
        rotatePiece();
        break;
      case ' ':
        hardDrop();
        break;
      case 'p':
      case 'P':
        pauseGame();
        break;
      case 'r':
      case 'R':
        restartGame();
        break;
    }
  }, [gameStatus, rotatePiece, hardDrop, pauseGame, restartGame]);

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
          
          {/* Mobile controls hint */}
          <div className="text-xs text-gray-500 mt-2">
            Use arrow keys to move, Space to hard drop
          </div>
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
              <div>↑ : Rotate</div>
              <div>Space : Hard drop</div>
              <div>P : Pause</div>
              <div>R : Restart</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
