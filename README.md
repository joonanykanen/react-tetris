# React Tetris

A fully-featured Tetris game built with React, TypeScript, Jotai for state management, and Tailwind CSS for styling.

![React Tetris](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-yellow)
![Jotai](https://img.shields.io/badge/Jotai-2.16.0-purple)

---

![React Tetris Game](screenshots/Screenshot%202025-12-23%20at%2020.34.59.png)

## 🎮 Features

- **Classic Tetris Gameplay**: Complete implementation of the classic Tetris game mechanics
- **7 Tetromino Shapes**: All standard pieces (I, O, T, S, Z, J, L) with distinct colors
- **Smooth Game Loop**: RequestAnimationFrame-based game loop for smooth animations
- **Scoring System**: Standard Tetris scoring with level progression
- **Pause/Resume**: Pause the game at any time
- **Modern UI**: Beautiful gradient styling with Tailwind CSS
- **Keyboard Controls**: Full keyboard support for all game actions

## 🛠️ Tech Stack

- **[React 19.2.0](https://react.dev)**: Latest React with modern features
- **[TypeScript 5.9.3](https://www.typescriptlang.org)**: Type-safe development
- **[Vite 7.2.4](https://vite.dev)**: Lightning-fast build tool and dev server
- **[Jotai 2.16.0](https://jotai.org)**: Primitive and flexible state management
- **[Tailwind CSS 4.1.18](https://tailwindcss.com)**: Utility-first CSS framework

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/joonanykanen/react-tetris
cd react-tetris

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🎯 Usage

### Keyboard Controls

| Key | Action |
|-----|--------|
| ← → | Move piece left/right |
| ↓ | Soft drop (accelerated fall) |
| ↑ | Rotate piece clockwise |
| Space | Hard drop (instant to bottom) |
| P | Pause/Resume game |
| R | Restart game |

### Game Rules

- **Objective**: Clear as many lines as possible by completing horizontal rows
- **Scoring**:
  - 1 line: 100 × level
  - 2 lines: 300 × level
  - 3 lines: 500 × level
  - 4 lines (Tetris): 800 × level
- **Level Up**: Level increases every 10 lines cleared
- **Game Over**: When a new piece cannot spawn at the top

## 🏗️ Project Structure

```
react-tetris/
├── src/
│   ├── atoms/              # Jotai state atoms
│   │   ├── boardAtom.ts    # Game board state
│   │   ├── currentPieceAtom.ts  # Current falling piece
│   │   ├── nextPieceAtom.ts     # Next piece preview
│   │   ├── gameStatusAtom.ts    # Game status (idle/playing/paused/gameover)
│   │   ├── scoreAtom.ts         # Score, level, lines
│   │   ├── gameLoopAtom.ts      # Game loop timing
│   │   └── gameActionsAtom.ts   # Game action handlers
│   ├── components/         # React components
│   │   ├── GameBoard.tsx   # Main game board display
│   │   ├── NextPiece.tsx   # Next piece preview
│   │   ├── ScoreDisplay.tsx    # Score, level, lines display
│   │   └── Controls.tsx    # Game control buttons
│   ├── utils/              # Game logic utilities
│   │   ├── tetrominos.ts   # Tetromino shapes and colors
│   │   ├── collision.ts    # Collision detection
│   │   ├── movement.ts     # Piece movement logic
│   │   └── lineClearing.ts # Line clearing logic
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

## 🎨 Architecture

### State Management (Jotai)

The game uses Jotai's atomic state management for efficient and predictable state updates:

- **boardAtom**: 10×20 grid representing the game board
- **currentPieceAtom**: Currently falling piece (shape, position, rotation)
- **nextPieceAtom**: Next piece to spawn
- **gameStatusAtom**: Game state ('idle' | 'playing' | 'paused' | 'gameover')
- **scoreAtom**: Current score, level, and lines cleared
- **gameLoopAtom**: Timing for automatic piece drops

### Game Loop

The game loop uses `requestAnimationFrame` for smooth, efficient updates:

```typescript
const gameLoop = (timestamp: number) => {
  if (timestamp - lastDropTime >= dropInterval) {
    gameTick();
    updateLastDropTime(timestamp);
  }
  animationFrameRef.current = requestAnimationFrame(gameLoop);
};
```

### Tetromino Shapes

Standard 7 tetromino shapes with colors:

| Piece | Color | Shape |
|-------|-------|-------|
| I | Cyan | 4×1 line |
| O | Yellow | 2×2 square |
| T | Purple | T-shape |
| S | Green | S-shape |
| Z | Red | Z-shape |
| J | Blue | J-shape |
| L | Orange | L-shape |

## 🚀 Build & Deploy

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint
```

## 📝 Development Notes

This project was fully vibe coded **locally** using:

- **Hardware**: 2 × RTX 3090 GPUs
- **RAM**: 128GB
- **Model**: [GLM-4.7](https://huggingface.co/zai-org/GLM-4.7) (Q2_K_XL quantization)

The entire codebase, architecture, and implementation were generated using the [Kilo Code](https://kilocode.ai) agent after Vite project [initialization](https://vite.dev/guide/).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

**Enjoy playing Tetris! 🎮**
