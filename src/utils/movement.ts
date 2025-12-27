// Movement utilities for Tetris game

import { checkCollision, BOARD_WIDTH } from './collision';
import { rotateShape } from './tetrominos';

// Move piece left
export function moveLeft(
  shape: number[][],
  position: { x: number; y: number },
  board: (string | null)[][]
): { x: number; y: number } | null {
  const newPosition = { x: position.x - 1, y: position.y };
  
  if (!checkCollision(shape, newPosition, board)) {
    return newPosition;
  }
  
  return null;
}

// Move piece right
export function moveRight(
  shape: number[][],
  position: { x: number; y: number },
  board: (string | null)[][]
): { x: number; y: number } | null {
  const newPosition = { x: position.x + 1, y: position.y };
  
  if (!checkCollision(shape, newPosition, board)) {
    return newPosition;
  }
  
  return null;
}

// Move piece down
export function moveDown(
  shape: number[][],
  position: { x: number; y: number },
  board: (string | null)[][]
): { x: number; y: number } | null {
  const newPosition = { x: position.x, y: position.y + 1 };
  
  if (!checkCollision(shape, newPosition, board)) {
    return newPosition;
  }
  
  return null;
}

// Rotate piece with wall kick support (clockwise)
export function rotatePiece(
  shape: number[][],
  position: { x: number; y: number },
  board: (string | null)[][]
): { shape: number[][]; position: { x: number; y: number } } | null {
  const rotatedShape = rotateShape(shape);
  
  // Try rotation at current position
  if (!checkCollision(rotatedShape, position, board)) {
    return { shape: rotatedShape, position };
  }
  
  // Try wall kicks (move left/right to fit)
  const kickOffsets = [-1, 1, -2, 2];
  
  for (const offset of kickOffsets) {
    const kickPosition = { x: position.x + offset, y: position.y };
    if (!checkCollision(rotatedShape, kickPosition, board)) {
      return { shape: rotatedShape, position: kickPosition };
    }
  }
  
  return null;
}

// Rotate piece counter-clockwise with wall kick support
export function rotatePieceCounterClockwise(
  shape: number[][],
  position: { x: number; y: number },
  board: (string | null)[][]
): { shape: number[][]; position: { x: number; y: number } } | null {
  // Counter-clockwise = rotate 3 times (or rotate once then transpose)
  // Equivalent to rotating clockwise 3 times
  let rotatedShape = shape;
  for (let i = 0; i < 3; i++) {
    rotatedShape = rotateShape(rotatedShape);
  }
  
  // Try rotation at current position
  if (!checkCollision(rotatedShape, position, board)) {
    return { shape: rotatedShape, position };
  }
  
  // Try wall kicks (move left/right to fit)
  const kickOffsets = [-1, 1, -2, 2];
  
  for (const offset of kickOffsets) {
    const kickPosition = { x: position.x + offset, y: position.y };
    if (!checkCollision(rotatedShape, kickPosition, board)) {
      return { shape: rotatedShape, position: kickPosition };
    }
  }
  
  return null;
}

// Lock piece to board
export function lockPiece(
  shape: number[][],
  position: { x: number; y: number },
  color: string,
  board: (string | null)[][]
): (string | null)[][] {
  const newBoard = board.map(row => [...row]);
  
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] === 1) {
        const boardX = position.x + col;
        const boardY = position.y + row;
        newBoard[boardY][boardX] = color;
      }
    }
  }
  
  return newBoard;
}

// Get spawn position for a piece
export function getSpawnPosition(shape: number[][]): { x: number; y: number } {
  const x = Math.floor((BOARD_WIDTH - shape[0].length) / 2);
  const y = 0;
  return { x, y };
}