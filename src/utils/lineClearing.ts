// Line clearing utilities for Tetris game

import { BOARD_WIDTH, BOARD_HEIGHT } from './collision';

// NES Gravity table: frames per gridcell drop
// Based on the original NES Tetris ROM at $898E
const NES_GRAVITY_TABLE: Record<number, number> = {
  0: 48,
  1: 43,
  2: 38,
  3: 33,
  4: 28,
  5: 23,
  6: 18,
  7: 13,
  8: 8,
  9: 6,
  10: 5,
  11: 5,
  12: 5,
  13: 4,
  14: 4,
  15: 4,
  16: 3,
  17: 3,
  18: 3,
  19: 2,
  20: 2,
  21: 2,
  22: 2,
  23: 2,
  24: 2,
  25: 2,
  26: 2,
  27: 2,
  28: 2,
  29: 1,
};

// Get frames per gridcell for a given level (caps at level 29)
export function getFramesForLevel(level: number): number {
  const cappedLevel = Math.min(level, 29);
  return NES_GRAVITY_TABLE[cappedLevel] ?? 1;
}

// Calculate drop interval in milliseconds based on level
// Uses NES gravity: frames × (1000ms / 60fps) = milliseconds per gridcell
export function calculateDropInterval(level: number): number {
  const frames = getFramesForLevel(level);
  return frames * (1000 / 60);
}

// Check which rows are completely filled
export function getCompletedRows(board: (string | null)[][]): number[] {
  const completedRows: number[] = [];
  
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    const isComplete = board[row].every(cell => cell !== null);
    if (isComplete) {
      completedRows.push(row);
    }
  }
  
  return completedRows;
}

// Remove completed rows and move remaining rows down
export function clearLines(board: (string | null)[][]): (string | null)[][] {
  const completedRows = getCompletedRows(board);
  
  if (completedRows.length === 0) {
    return board;
  }
  
  // Create a new board with completed rows removed
  const newBoard: (string | null)[][] = [];
  
  // Add empty rows at the top for each cleared line
  for (let i = 0; i < completedRows.length; i++) {
    newBoard.push(Array(BOARD_WIDTH).fill(null));
  }
  
  // Add rows that weren't cleared
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    if (!completedRows.includes(row)) {
      newBoard.push([...board[row]]);
    }
  }
  
  return newBoard;
}

// Calculate score based on lines cleared
export function calculateScore(linesCleared: number, level: number): number {
  const baseScores = {
    1: 100,
    2: 300,
    3: 500,
    4: 800,
  };
  
  const baseScore = baseScores[linesCleared as keyof typeof baseScores] || 0;
  return baseScore * level;
}

// Calculate the lines needed to advance to the next level (NES A-TYPE rules)
// Initial threshold: startLevel × 10 + 10 OR max(100, startLevel × 10 - 50), whichever comes first
// Subsequent levels: +10 lines each
export function getLinesForNextLevel(currentLevel: number, startLevel: number): number {
  if (currentLevel < startLevel) {
    return 0; // Should not happen, but handle gracefully
  }
  
  const levelDiff = currentLevel - startLevel;
  
  if (levelDiff === 0) {
    // First advancement from start level
    const threshold1 = startLevel * 10 + 10;
    const threshold2 = Math.max(100, startLevel * 10 - 50);
    return Math.min(threshold1, threshold2);
  }
  
  // Subsequent levels: 10 lines each
  return 10;
}

// Calculate the total lines needed to reach a target level from start level
export function getTotalLinesForLevel(targetLevel: number, startLevel: number): number {
  if (targetLevel <= startLevel) {
    return 0;
  }
  
  let totalLines = 0;
  for (let level = startLevel; level < targetLevel; level++) {
    totalLines += getLinesForNextLevel(level, startLevel);
  }
  
  return totalLines;
}

// Calculate new level based on total lines cleared using NES A-TYPE rules
export function calculateLevel(totalLines: number, startLevel: number): number {
  if (totalLines === 0) {
    return startLevel;
  }
  
  let currentLevel = startLevel;
  let linesAccumulated = 0;
  
  while (true) {
    const linesNeeded = getLinesForNextLevel(currentLevel, startLevel);
    if (linesAccumulated + linesNeeded > totalLines) {
      break;
    }
    linesAccumulated += linesNeeded;
    currentLevel++;
  }
  
  return currentLevel;
}