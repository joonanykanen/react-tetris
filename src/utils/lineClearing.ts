// Line clearing utilities for Tetris game

import { BOARD_WIDTH, BOARD_HEIGHT } from './collision';

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

// NES Tetris gravity: frames per grid cell at each level
// Based on NES Tetris ROM at $898E
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

// NES Tetris scoring: points per line clear based on level
// Level multiplier is based on the level AFTER the line clear
const NES_SCORING_TABLE: Record<number, { 1: number; 2: number; 3: number; 4: number }> = {
  0: { 1: 40, 2: 100, 3: 300, 4: 1200 },
  1: { 1: 80, 2: 200, 3: 600, 4: 2400 },
  2: { 1: 120, 2: 300, 3: 900, 4: 3600 },
  3: { 1: 160, 2: 400, 3: 1200, 4: 4800 },
  4: { 1: 200, 2: 500, 3: 1500, 4: 6000 },
  5: { 1: 240, 2: 600, 3: 1800, 4: 7200 },
  6: { 1: 280, 2: 700, 3: 2100, 4: 8400 },
  7: { 1: 320, 2: 800, 3: 2400, 4: 9600 },
  8: { 1: 360, 2: 900, 3: 2700, 4: 10800 },
  9: { 1: 400, 2: 1000, 3: 3000, 4: 12000 },
};

// Calculate score based on lines cleared using NES scoring system
// The multiplier is based on the level AFTER the line clear
export function calculateScore(linesCleared: number, levelAfterClear: number): number {
  if (linesCleared < 1 || linesCleared > 4) return 0;
  
  const level = Math.min(levelAfterClear, 9);
  const scoring = NES_SCORING_TABLE[level];
  
  return scoring[linesCleared as keyof typeof scoring];
}

// Calculate soft drop score (1 point per grid space)
export function calculateSoftDropScore(gridSpaces: number): number {
  return gridSpaces;
}

// Calculate drop interval based on level using NES gravity
// Returns milliseconds per grid cell (assuming 60 FPS = 16.67ms per frame)
export function calculateDropInterval(level: number): number {
  const framesPerCell = NES_GRAVITY_TABLE[Math.min(level, 29)] || 1;
  const msPerFrame = 1000 / 60; // ~16.67ms per frame at 60 FPS
  return framesPerCell * msPerFrame;
}

// Get frames per grid cell for a given level
export function getFramesPerCell(level: number): number {
  return NES_GRAVITY_TABLE[Math.min(level, 29)] || 1;
}

// Calculate new level based on lines cleared using NES A-TYPE progression
// First advance at max(100, startLevel * 10 - 50), then every 10 lines
export function calculateLevel(totalLines: number, startLevel: number): number {
  // First level threshold
  const firstThreshold = Math.max(100, startLevel * 10 - 50);
  
  if (totalLines < firstThreshold) {
    return startLevel;
  }
  
  // Lines beyond first threshold
  const linesBeyondFirst = totalLines - firstThreshold;
  const additionalLevels = Math.floor(linesBeyondFirst / 10);
  
  return Math.min(startLevel + 1 + additionalLevels, 29);
}

// Calculate ARE (Auto-Repeat Entry) delay in frames
// Based on the height at which the piece locked
export function calculateAREDelay(lockY: number): number {
  // Bottom 2 rows (18-19 in 0-indexed) = 10 frames
  // Each group of 4 rows above adds 2 frames
  const rowsFromBottom = 19 - lockY; // 0 for bottom row, 19 for top row
  
  if (rowsFromBottom <= 1) {
    return 10; // Bottom 2 rows
  } else if (rowsFromBottom <= 5) {
    return 12; // Rows 16-17
  } else if (rowsFromBottom <= 9) {
    return 14; // Rows 12-15
  } else if (rowsFromBottom <= 13) {
    return 16; // Rows 8-11
  } else if (rowsFromBottom <= 17) {
    return 18; // Rows 4-7
  } else {
    return 20; // Top rows (0-3)
  }
}

// Calculate line clear delay in frames
// Animation has 5 steps that advance when global frame counter modulo 4 equals 0
export function calculateLineClearDelay(lockFrame: number): number {
  // Line clear delay is 17-20 frames depending on lock frame
  // The animation advances every 4 frames
  const baseDelay = 17;
  const additionalFrames = lockFrame % 4;
  return baseDelay + additionalFrames;
}

// Convert frames to milliseconds
export function framesToMs(frames: number): number {
  const msPerFrame = 1000 / 60; // ~16.67ms per frame at 60 FPS
  return frames * msPerFrame;
}