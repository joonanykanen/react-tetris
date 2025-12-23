// Game status atom for Tetris game

import { atom } from 'jotai';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

// Game status atom - stores the current game state
export const gameStatusAtom = atom<GameStatus>('idle');

// Set game status atom - action to set the game status
export const setGameStatusAtom = atom(null, (_, set, status: GameStatus) => {
  set(gameStatusAtom, status);
});

// Reset game status atom - action to reset to idle
export const resetGameStatusAtom = atom(null, (_, set) => {
  set(gameStatusAtom, 'idle');
});