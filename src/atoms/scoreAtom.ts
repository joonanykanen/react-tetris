// Score, level, and lines atoms for Tetris game

import { atom } from 'jotai';
import { calculateLevel } from '../utils/lineClearing';
import { soundEnabledAtom } from './soundAtom';
import { playSound } from '../utils/sound';
import { startLevelAtom } from './startLevelAtom';

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

// Add lines atom - action to add lines cleared using NES-style progression
export const addLinesAtom = atom(null, (get, set, lines: number) => {
  const currentLines = get(linesAtom);
  const newLines = currentLines + lines;
  const startLevel = get(startLevelAtom);
  const soundEnabled = get(soundEnabledAtom);
  
  set(linesAtom, newLines);
  
  // Update level based on lines cleared using NES A-TYPE progression
  const currentLevel = get(levelAtom);
  const newLevel = calculateLevel(newLines, startLevel);
  
  if (newLevel > currentLevel && soundEnabled) {
    playSound('levelUp');
  }
  
  set(levelAtom, newLevel);
});

// Initialize level from start level atom
export const initLevelFromStartAtom = atom(null, (get, set) => {
  const startLevel = get(startLevelAtom);
  set(levelAtom, startLevel);
});