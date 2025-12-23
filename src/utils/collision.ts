// Collision detection utilities for Tetris game

// Board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Check if a position is within board bounds
export function isValidPosition(x: number, y: number): boolean {
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT;
}

// Check if a piece collides with the board boundaries or existing blocks
export function checkCollision(
  shape: number[][],
  position: { x: number; y: number },
  board: (string | null)[][]
): boolean {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      // Skip empty cells in the shape
      if (shape[row][col] === 0) continue;
      
      const boardX = position.x + col;
      const boardY = position.y + row;
      
      // Check if position is out of bounds
      if (!isValidPosition(boardX, boardY)) {
        return true;
      }
      
      // Check if position is already occupied on the board
      if (board[boardY][boardX] !== null) {
        return true;
      }
    }
  }
  
  return false;
}

// Check if a piece can spawn at the top of the board
export function checkSpawnCollision(shape: number[][], board: (string | null)[][]): boolean {
  // Spawn position: centered horizontally at the top
  const spawnX = Math.floor((BOARD_WIDTH - shape[0].length) / 2);
  const spawnY = 0;
  
  return checkCollision(shape, { x: spawnX, y: spawnY }, board);
}

// Get the landing position for a piece (hard drop)
export function getLandingPosition(
  shape: number[][],
  position: { x: number; y: number },
  board: (string | null)[][]
): { x: number; y: number } {
  let landingY = position.y;
  
  while (!checkCollision(shape, { x: position.x, y: landingY + 1 }, board)) {
    landingY++;
  }
  
  return { x: position.x, y: landingY };
}