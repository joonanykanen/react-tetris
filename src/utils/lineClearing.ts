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

// Calculate new level based on lines cleared
export function calculateLevel(totalLines: number): number {
  return Math.floor(totalLines / 10) + 1;
}

// Calculate drop interval based on level (speed increases with level)
export function calculateDropInterval(level: number): number {
  // Base interval of 1000ms, decreasing by 50ms per level, minimum 100ms
  const baseInterval = 1000;
  const decreasePerLevel = 50;
  const minimumInterval = 100;
  
  const interval = baseInterval - (level - 1) * decreasePerLevel;
  return Math.max(interval, minimumInterval);
}