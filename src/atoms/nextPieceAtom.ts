// Next piece state atom for Tetris game

import { atom } from 'jotai';
import type { TetrominoType } from '../utils/tetrominos';

// Next piece atom - stores the next piece to spawn
export const nextPieceAtom = atom<TetrominoType | null>(null);

// Reset next piece atom - action to reset the next piece
export const resetNextPieceAtom = atom(null, (_, set) => {
  set(nextPieceAtom, null);
});