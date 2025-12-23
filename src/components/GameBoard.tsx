// Game Board component for Tetris game

import { useAtomValue } from 'jotai';
import { boardAtom } from '../atoms/boardAtom';
import { currentPieceAtom } from '../atoms/currentPieceAtom';
import { gameStatusAtom } from '../atoms/gameStatusAtom';

export default function GameBoard() {
  const board = useAtomValue(boardAtom);
  const currentPiece = useAtomValue(currentPieceAtom);
  const gameStatus = useAtomValue(gameStatusAtom);

  // Create a display board that combines the locked pieces and current piece
  const displayBoard = board.map(row => [...row]);

  // Add current piece to display board
  if (currentPiece && gameStatus === 'playing') {
    const { shape, position, color } = currentPiece;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          const boardX = position.x + col;
          const boardY = position.y + row;
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
            displayBoard[boardY][boardX] = color;
          }
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-10 gap-0.5 bg-gray-900 p-2 rounded-lg border-4 border-gray-700 shadow-2xl">
        {displayBoard.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              color={cell}
            />
          ))
        )}
      </div>
      
      {gameStatus === 'gameover' && (
        <div className="mt-4 text-2xl font-bold text-red-500 animate-pulse">
          GAME OVER
        </div>
      )}
    </div>
  );
}

function Cell({ color }: { color: string | null }) {
  const baseClasses = 'w-8 h-8 rounded-sm';
  const colorClasses = color ? color : 'bg-gray-800';
  
  return (
    <div
      className={`${baseClasses} ${colorClasses} border border-gray-700/50`}
      style={{
        boxShadow: color ? `0 0 10px ${color.replace('bg-', '')}40` : undefined,
      }}
    />
  );
}