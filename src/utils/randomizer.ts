/**
 * NES-style Tetris Randomizer
 * 
 * This implements the classic NES Tetris randomizer algorithm which provides
 * slight protection against direct piece repetition.
 * 
 * Algorithm:
 * 1. First roll generates a value 0-7
 * 2. If the value is 7 (dummy) or equals the previous piece, reject and roll again
 * 3. Second roll generates a value 0-6 (no protection)
 * 4. Accept the piece and update history
 * 
 * Piece values:
 * 0: I, 1: O, 2: T, 3: S, 4: Z, 5: J, 6: L, 7: dummy (no piece)
 */

import type { TetrominoType } from './tetrominos';

// Mapping of piece values to tetromino types
const PIECE_VALUES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// Dummy value representing "no piece" (used to reject first roll)
const DUMMY_VALUE = 7;

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * NES-style random piece generator with protection against direct repetition.
 * 
 * @param previousPiece - The value of the previously dealt piece (0-6), or -1 for none
 * @returns The value of the new piece (0-6)
 */
export function getNESPiece(previousPiece: number = -1): number {
  // First roll: 0-7
  const firstRoll = randomInt(0, 7);
  
  // Check if first roll is valid (not dummy and not same as previous)
  if (firstRoll !== DUMMY_VALUE && firstRoll !== previousPiece) {
    return firstRoll;
  }
  
  // First roll failed, do second roll: 0-6 (no protection)
  return randomInt(0, 6);
}

/**
 * Get the tetromino type from a piece value
 */
export function getTetrominoFromValue(value: number): TetrominoType {
  return PIECE_VALUES[value];
}

/**
 * Generate a random tetromino using NES-style algorithm
 * 
 * @param previousPiece - The previously dealt piece type, or null for first piece
 */
export function getRandomTetromino(previousPiece: TetrominoType | null = null): TetrominoType {
  // Convert previous piece to its value, or -1 if none
  const previousValue = previousPiece !== null 
    ? PIECE_VALUES.indexOf(previousPiece) 
    : -1;
  
  const newValue = getNESPiece(previousValue);
  return PIECE_VALUES[newValue];
}