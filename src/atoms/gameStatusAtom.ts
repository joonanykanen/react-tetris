// Game status atom for Tetris game

import { atom } from 'jotai';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

// Game status atom - stores the current game state
export const gameStatusAtom = atom<GameStatus>('idle');

// Settings modal open atom - stores whether the settings modal is open
export const isSettingsModalOpenAtom = atom<boolean>(false);

// Set settings modal open atom - action to open/close settings modal
export const setSettingsModalOpenAtom = atom(null, (_, set, open: boolean) => {
  set(isSettingsModalOpenAtom, open);
});

// Toggle settings modal atom - action to toggle settings modal
export const toggleSettingsModalAtom = atom(null, (_, set) => {
  set(isSettingsModalOpenAtom, (prev) => !prev);
});

// Set game status atom - action to set the game status
export const setGameStatusAtom = atom(null, (_, set, status: GameStatus) => {
  set(gameStatusAtom, status);
});

// Reset game status atom - action to reset to idle
export const resetGameStatusAtom = atom(null, (_, set) => {
  set(gameStatusAtom, 'idle');
});