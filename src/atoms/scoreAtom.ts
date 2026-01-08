// Score, level, and lines atoms for Tetris game

import { atom } from 'jotai';
import { soundEnabledAtom } from './soundAtom';
import { playSound } from '../utils/sound';
import { calculateLevel } from '../utils/lineClearing';
import { startLevelAtom } from './settingsAtom';

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

// Add lines atom - action to add lines cleared using NES A-TYPE rules
export const addLinesAtom = atom(null, (get, set, lines: number) => {
  const currentLines = get(linesAtom);
  const newLines = currentLines + lines;
  const soundEnabled = get(soundEnabledAtom);
  const startLevel = get(startLevelAtom);
  
  set(linesAtom, newLines);
  
  // Update level based on lines cleared using NES A-TYPE rules
  const currentLevel = get(levelAtom);
  const newLevel = calculateLevel(newLines, startLevel);
  
  if (newLevel > currentLevel && soundEnabled) {
    playSound('levelUp');
  }
  
  set(levelAtom, newLevel);
});