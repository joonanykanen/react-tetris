// Settings atoms for Tetris game with localStorage persistence via atomWithStorage

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// DAS Delay - Initial delay before auto-repeat starts (ms)
// Range: 0-500ms, Default: 150ms (classic Tetris feel)
export const dasDelayAtom = atomWithStorage('tetris-das-delay', 150);

// ARR (Auto-Repeat Rate) - Interval between movements during repeat (ms)
// Range: 0-200ms, Default: 50ms
export const arrAtom = atomWithStorage('tetris-arr', 50);

// Soft Drop Interval - Repeat interval for soft drop key (ms)
// Range: 0-200ms, Default: 50ms
export const softDropIntervalAtom = atomWithStorage('tetris-soft-drop-interval', 50);

// Volume - Sound effects volume (percentage)
// Range: 0-100, Default: 100
export const volumeAtom = atomWithStorage('tetris-volume', 100);

// Reset settings to defaults atom - action to reset all settings
export const resetSettingsAtom = atom(null, (_, set) => {
  set(dasDelayAtom, 150);
  set(arrAtom, 50);
  set(softDropIntervalAtom, 50);
  set(volumeAtom, 100);
});

// Get all settings as an object
export const getAllSettingsAtom = atom((get) => ({
  dasDelay: get(dasDelayAtom),
  arr: get(arrAtom),
  softDropInterval: get(softDropIntervalAtom),
  volume: get(volumeAtom),
}));