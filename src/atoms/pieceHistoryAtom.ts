// Piece history atom for NES-style randomizer
// Tracks the last piece dealt to prevent direct repetition

import { atom } from 'jotai';
import type { TetrominoType } from '../utils/tetrominos';

// Piece history atom - stores the last piece dealt
// null means no piece has been dealt yet (start of game)
export const pieceHistoryAtom = atom<TetrominoType | null>(null);

// Reset piece history atom - action to reset the history
export const resetPieceHistoryAtom = atom(null, (_, set) => {
  set(pieceHistoryAtom, null);
});

// Update piece history atom - action to record a new piece
export const updatePieceHistoryAtom = atom(null, (_, set, newPiece: TetrominoType) => {
  set(pieceHistoryAtom, newPiece);
});