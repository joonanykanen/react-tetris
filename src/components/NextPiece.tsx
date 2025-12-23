// Next Piece component for Tetris game

import { useAtomValue } from 'jotai';
import { nextPieceAtom } from '../atoms/nextPieceAtom';
import { TETROMINOS } from '../utils/tetrominos';

export default function NextPiece() {
  const nextPiece = useAtomValue(nextPieceAtom);

  if (!nextPiece) {
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-bold text-gray-400 mb-2">NEXT</h3>
        <div className="grid grid-cols-4 gap-0.5 bg-gray-900 p-2 rounded-lg border-2 border-gray-700">
          {Array(16).fill(null).map((_, index) => (
            <div key={index} className="w-6 h-6 rounded-sm bg-gray-800 border border-gray-700/50" />
          ))}
        </div>
      </div>
    );
  }

  const tetromino = TETROMINOS[nextPiece];
  const { shape, color } = tetromino;

  // Create a 4x4 preview grid
  const previewGrid = Array(4).fill(null).map(() => Array(4).fill(null));

  // Center the piece in the preview grid
  const offsetX = Math.floor((4 - shape[0].length) / 2);
  const offsetY = Math.floor((4 - shape.length) / 2);

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] === 1) {
        const gridX = offsetX + col;
        const gridY = offsetY + row;
        if (gridY >= 0 && gridY < 4 && gridX >= 0 && gridX < 4) {
          previewGrid[gridY][gridX] = color;
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-bold text-gray-400 mb-2">NEXT</h3>
      <div className="grid grid-cols-4 gap-0.5 bg-gray-900 p-2 rounded-lg border-2 border-gray-700 shadow-lg">
        {previewGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              color={cell}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Cell({ color }: { color: string | null }) {
  const baseClasses = 'w-6 h-6 rounded-sm';
  const colorClasses = color ? color : 'bg-gray-800';
  
  return (
    <div
      className={`${baseClasses} ${colorClasses} border border-gray-700/50`}
      style={{
        boxShadow: color ? `0 0 8px ${color.replace('bg-', '')}40` : undefined,
      }}
    />
  );
}