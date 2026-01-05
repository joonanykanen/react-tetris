// Start level atom for NES Tetris level selection

import { atom } from 'jotai';

// Start level atom - stores the selected starting level (0-9)
export const startLevelAtom = atom<number>(0);

// Reset start level atom - action to reset to default
export const resetStartLevelAtom = atom(null, (_, set) => {
  set(startLevelAtom, 0);
});