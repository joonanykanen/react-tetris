// Sound settings atom for Tetris game

import { atom } from 'jotai';

// Sound enabled atom - stores whether sound is on or off
export const soundEnabledAtom = atom<boolean>(true);

// Toggle sound atom - action to toggle sound on/off
export const toggleSoundAtom = atom(null, (_, set) => {
  set(soundEnabledAtom, (prev) => !prev);
});

// Set sound atom - action to set sound state
export const setSoundAtom = atom(null, (_, set, enabled: boolean) => {
  set(soundEnabledAtom, enabled);
});