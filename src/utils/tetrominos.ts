// Tetromino shapes and colors for Tetris game

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface TetrominoShape {
  shape: number[][];
  color: string;
}

// Tetromino shapes represented as 2D arrays (1 = filled, 0 = empty)
export const TETROMINOS: Record<TetrominoType, TetrominoShape> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: 'bg-orange-500',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: 'bg-red-500',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-yellow-400',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: 'bg-cyan-400',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-green-500',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-pink-500',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-blue-500',
  },
};

// Get random tetromino type
export function getRandomTetromino(): TetrominoType {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  return types[Math.floor(Math.random() * types.length)];
}

// Rotate a shape 90 degrees clockwise
export function rotateShape(shape: number[][]): number[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: number[][] = [];
  
  for (let col = 0; col < cols; col++) {
    rotated[col] = [];
    for (let row = rows - 1; row >= 0; row--) {
      rotated[col][rows - 1 - row] = shape[row][col];
    }
  }
  
  return rotated;
}