// Current piece state atom for Tetris game

import { atom } from 'jotai';
import type { TetrominoType } from '../utils/tetrominos';

export interface Piece {
  type: TetrominoType;
  shape: number[][];
  color: string;
  position: { x: number; y: number };
}

// Current piece atom - stores the currently falling piece
export const currentPieceAtom = atom<Piece | null>(null);

// Reset current piece atom - action to reset the current piece
export const resetCurrentPieceAtom = atom(null, (_, set) => {
  set(currentPieceAtom, null);
});