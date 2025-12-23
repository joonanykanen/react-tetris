// Board state atom for Tetris game

import { atom } from 'jotai';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../utils/collision';

// Create empty board
function createEmptyBoard(): (string | null)[][] {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
}

// Board atom - stores the game board state
export const boardAtom = atom<(string | null)[][]>(createEmptyBoard());

// Reset board atom - action to reset the board
export const resetBoardAtom = atom(null, (_, set) => {
  set(boardAtom, createEmptyBoard());
});