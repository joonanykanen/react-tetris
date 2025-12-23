// Game actions atom for Tetris game

import { atom, type Getter, type Setter } from 'jotai';
import type { Piece } from './currentPieceAtom';
import type { TetrominoType } from '../utils/tetrominos';
import { TETROMINOS, getRandomTetromino } from '../utils/tetrominos';
import { checkSpawnCollision, getLandingPosition } from '../utils/collision';
import { moveLeft, moveRight, moveDown, rotatePiece, lockPiece, getSpawnPosition } from '../utils/movement';
import { clearLines, getCompletedRows } from '../utils/lineClearing';
import { boardAtom } from './boardAtom';
import { currentPieceAtom } from './currentPieceAtom';
import { nextPieceAtom } from './nextPieceAtom';
import { gameStatusAtom, setGameStatusAtom } from './gameStatusAtom';
import { scoreAtom, levelAtom, linesAtom, addScoreAtom, addLinesAtom } from './scoreAtom';
import { lastDropTimeAtom, updateLastDropTimeAtom } from './gameLoopAtom';

// Spawn a new piece
export const spawnPieceAtom = atom(null, (get, set) => {
  const board = get(boardAtom);
  const nextPieceType = get(nextPieceAtom) || getRandomTetromino();
  const tetromino = TETROMINOS[nextPieceType];
  
  // Check if spawn position is valid
  if (checkSpawnCollision(tetromino.shape, board)) {
    // Game over - can't spawn new piece
    set(setGameStatusAtom, 'gameover');
    return;
  }
  
  const spawnPosition = getSpawnPosition(tetromino.shape);
  
  const newPiece: Piece = {
    type: nextPieceType,
    shape: tetromino.shape,
    color: tetromino.color,
    position: spawnPosition,
  };
  
  set(currentPieceAtom, newPiece);
  set(nextPieceAtom, getRandomTetromino());
});

// Move piece left
export const moveLeftAtom = atom(null, (get, set) => {
  const currentPiece = get(currentPieceAtom);
  const board = get(boardAtom);
  
  if (!currentPiece) return;
  
  const newPosition = moveLeft(currentPiece.shape, currentPiece.position, board);
  
  if (newPosition) {
    set(currentPieceAtom, { ...currentPiece, position: newPosition });
  }
});

// Move piece right
export const moveRightAtom = atom(null, (get, set) => {
  const currentPiece = get(currentPieceAtom);
  const board = get(boardAtom);
  
  if (!currentPiece) return;
  
  const newPosition = moveRight(currentPiece.shape, currentPiece.position, board);
  
  if (newPosition) {
    set(currentPieceAtom, { ...currentPiece, position: newPosition });
  }
});

// Move piece down (soft drop)
export const moveDownAtom = atom(null, (get, set) => {
  const currentPiece = get(currentPieceAtom);
  const board = get(boardAtom);
  
  if (!currentPiece) return;
  
  const newPosition = moveDown(currentPiece.shape, currentPiece.position, board);
  
  if (newPosition) {
    set(currentPieceAtom, { ...currentPiece, position: newPosition });
  } else {
    // Can't move down, lock the piece
    lockPieceAtom(get, set);
  }
});

// Rotate piece
export const rotatePieceAtom = atom(null, (get, set) => {
  const currentPiece = get(currentPieceAtom);
  const board = get(boardAtom);
  
  if (!currentPiece) return;
  
  const result = rotatePiece(currentPiece.shape, currentPiece.position, board);
  
  if (result) {
    set(currentPieceAtom, {
      ...currentPiece,
      shape: result.shape,
      position: result.position,
    });
  }
});

// Hard drop - move piece to landing position
export const hardDropAtom = atom(null, (get, set) => {
  const currentPiece = get(currentPieceAtom);
  const board = get(boardAtom);
  
  if (!currentPiece) return;
  
  const landingPosition = getLandingPosition(currentPiece.shape, currentPiece.position, board);
  set(currentPieceAtom, { ...currentPiece, position: landingPosition });
  
  // Lock the piece immediately
  lockPieceAtom(get, set);
});

// Lock piece to board and spawn new piece
function lockPieceAtom(get: Getter, set: Setter) {
  const currentPiece = get(currentPieceAtom);
  const board = get(boardAtom);
  
  if (!currentPiece) return;
  
  // Lock the piece to the board
  const newBoard = lockPiece(currentPiece.shape, currentPiece.position, currentPiece.color, board);
  set(boardAtom, newBoard);
  
  // Clear completed lines
  const completedRows = getCompletedRows(newBoard);
  
  if (completedRows.length > 0) {
    const clearedBoard = clearLines(newBoard);
    set(boardAtom, clearedBoard);
    
    // Update score and lines
    const level = get(levelAtom);
    const points = completedRows.length * 100 * level;
    set(addScoreAtom, points);
    set(addLinesAtom, completedRows.length);
  }
  
  // Spawn new piece
  const nextPieceType = get(nextPieceAtom);
  if (!nextPieceType) {
    set(setGameStatusAtom, 'gameover');
    return;
  }
  
  const tetromino = TETROMINOS[nextPieceType as TetrominoType];
  
  // Check if spawn position is valid
  if (checkSpawnCollision(tetromino.shape, newBoard)) {
    // Game over - can't spawn new piece
    set(setGameStatusAtom, 'gameover');
    return;
  }
  
  const spawnPosition = getSpawnPosition(tetromino.shape);
  
  const newPiece: Piece = {
    type: nextPieceType,
    shape: tetromino.shape,
    color: tetromino.color,
    position: spawnPosition,
  };
  
  set(currentPieceAtom, newPiece);
  set(nextPieceAtom, getRandomTetromino());
}

// Start game
export const startGameAtom = atom(null, (get, set) => {
  // Reset all game state
  set(boardAtom, Array(20).fill(null).map(() => Array(10).fill(null)));
  set(currentPieceAtom, null);
  set(nextPieceAtom, getRandomTetromino());
  set(scoreAtom, 0);
  set(levelAtom, 1);
  set(linesAtom, 0);
  set(lastDropTimeAtom, 0);
  
  // Set game status to playing
  set(setGameStatusAtom, 'playing');
  
  // Spawn first piece
  const nextPieceType = get(nextPieceAtom);
  if (!nextPieceType) {
    set(setGameStatusAtom, 'gameover');
    return;
  }
  
  const tetromino = TETROMINOS[nextPieceType as TetrominoType];
  
  const spawnPosition = getSpawnPosition(tetromino.shape);
  
  const newPiece: Piece = {
    type: nextPieceType,
    shape: tetromino.shape,
    color: tetromino.color,
    position: spawnPosition,
  };
  
  set(currentPieceAtom, newPiece);
  set(nextPieceAtom, getRandomTetromino());
});

// Pause game
export const pauseGameAtom = atom(null, (get, set) => {
  const status = get(gameStatusAtom);
  if (status === 'playing') {
    set(setGameStatusAtom, 'paused');
  } else if (status === 'paused') {
    set(setGameStatusAtom, 'playing');
    set(updateLastDropTimeAtom, 0);
  }
});

// Restart game
export const restartGameAtom = atom(null, (get, set) => {
  // Reset all game state
  set(boardAtom, Array(20).fill(null).map(() => Array(10).fill(null)));
  set(currentPieceAtom, null);
  set(nextPieceAtom, getRandomTetromino());
  set(scoreAtom, 0);
  set(levelAtom, 1);
  set(linesAtom, 0);
  set(lastDropTimeAtom, 0);
  
  // Set game status to playing
  set(setGameStatusAtom, 'playing');
  
  // Spawn first piece
  const nextPieceType = get(nextPieceAtom);
  if (!nextPieceType) {
    set(setGameStatusAtom, 'gameover');
    return;
  }
  
  const tetromino = TETROMINOS[nextPieceType as TetrominoType];
  
  const spawnPosition = getSpawnPosition(tetromino.shape);
  
  const newPiece: Piece = {
    type: nextPieceType,
    shape: tetromino.shape,
    color: tetromino.color,
    position: spawnPosition,
  };
  
  set(currentPieceAtom, newPiece);
  set(nextPieceAtom, getRandomTetromino());
});

// Game tick - called by the game loop
export const gameTickAtom = atom(null, (get, set) => {
  const status = get(gameStatusAtom);
  if (status !== 'playing') return;
  
  const currentPiece = get(currentPieceAtom);
  if (!currentPiece) return;
  
  // Try to move piece down
  const board = get(boardAtom);
  const newPosition = moveDown(currentPiece.shape, currentPiece.position, board);
  
  if (newPosition) {
    set(currentPieceAtom, { ...currentPiece, position: newPosition });
  } else {
    // Can't move down, lock the piece
    lockPieceAtom(get, set);
  }
});