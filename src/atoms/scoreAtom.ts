// Score, level, and lines atoms for Tetris game

import { atom } from 'jotai';

// Score atom - stores the current score
export const scoreAtom = atom<number>(0);

// Level atom - stores the current level
export const levelAtom = atom<number>(1);

// Lines atom - stores the total lines cleared
export const linesAtom = atom<number>(0);

// Reset score atom - action to reset score
export const resetScoreAtom = atom(null, (_, set) => {
  set(scoreAtom, 0);
});

// Reset level atom - action to reset level
export const resetLevelAtom = atom(null, (_, set) => {
  set(levelAtom, 1);
});

// Reset lines atom - action to reset lines
export const resetLinesAtom = atom(null, (_, set) => {
  set(linesAtom, 0);
});

// Add score atom - action to add points to score
export const addScoreAtom = atom(null, (get, set, points: number) => {
  set(scoreAtom, get(scoreAtom) + points);
});

// Add lines atom - action to add lines cleared
export const addLinesAtom = atom(null, (get, set, lines: number) => {
  const currentLines = get(linesAtom);
  const newLines = currentLines + lines;
  set(linesAtom, newLines);
  
  // Update level based on lines cleared
  const newLevel = Math.floor(newLines / 10) + 1;
  set(levelAtom, newLevel);
});