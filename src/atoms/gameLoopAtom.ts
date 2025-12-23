// Game loop atom for Tetris game

import { atom } from 'jotai';
import { calculateDropInterval } from '../utils/lineClearing';
import { levelAtom } from './scoreAtom';

// Last drop time atom - stores the timestamp of the last piece drop
export const lastDropTimeAtom = atom<number>(0);

// Drop interval atom - calculates the drop interval based on current level
export const dropIntervalAtom = atom<number>(get => {
  const level = get(levelAtom);
  return calculateDropInterval(level);
});

// Update last drop time atom - action to update the last drop time
export const updateLastDropTimeAtom = atom(null, (_, set, time: number) => {
  set(lastDropTimeAtom, time);
});

// Reset last drop time atom - action to reset the last drop time
export const resetLastDropTimeAtom = atom(null, (_, set) => {
  set(lastDropTimeAtom, 0);
});