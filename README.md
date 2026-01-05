# React Tetris

A fully-featured Tetris game built with React, TypeScript, Jotai for state management, and Tailwind CSS for styling.

![React Tetris](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-yellow)
![Jotai](https://img.shields.io/badge/Jotai-2.16.0-purple)

---

![React Tetris Game](screenshots/Screenshot%202025-12-29%20at%202.37.51.png)

## 🎮 Features

- **Classic Tetris Gameplay**: Complete implementation of the classic Tetris game mechanics
- **NES Tetris Mode**: Authentic NES-style gameplay with:
  - **NES Randomizer**: Re-roll logic prevents consecutive same pieces (~25% re-roll chance)
  - **NES Gravity**: Frames-per-gridcell table matching NES ROM ($898E)
  - **NES Scoring**: Level-based multipliers (40/100/300/1200 × (level + 1))
  - **NES Level Progression**: A-TYPE style advancement
  - **Delay System**: ARE and line clear delays
  - **Level Selection**: Start at any level 0-9
- **7 Tetromino Shapes**: All standard pieces (I, O, T, S, Z, J, L) with distinct colors
- **Smooth Game Loop**: RequestAnimationFrame-based game loop for smooth animations
- **DAS (Delayed Auto-Shift)**: Classic Tetris horizontal movement with configurable timing
- **Scoring System**: Standard Tetris scoring with level progression
- **Local Leaderboard**: Persistent top 10 scores with player names, auto-saves on game over
- **Pause/Resume**: Pause the game at any time
- **Settings Modal**: Customize DAS delay, ARR, soft drop interval, and volume
- **Modern UI**: Beautiful gradient styling with Tailwind CSS
- **Keyboard Controls**: Full keyboard support for all game actions
- **Sound Effects**: Synthesized sound effects using Web Audio API (no external dependencies)

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

### Level Selection

When the game starts, a level selection screen appears allowing you to choose your starting level (0-9):

| Key | Action |
|-----|--------|
| ← → | Select starting level |
| Space | Start game at selected level |

### Keyboard Controls

| Key | Action |
|-----|--------|
| ← → | Move piece left/right |
| ↓ | Soft drop (accelerated fall) |
| ↑ | Rotate piece clockwise |
| Z | Rotate piece counter-clockwise |
| Space | Hard drop (instant to bottom) / Start or Restart game |
| ESC / P | Pause/Resume game |

### DAS (Delayed Auto-Shift)

The game implements classic Tetris DAS for smooth horizontal movement. All timing settings can be customized in the Settings modal:

| Setting | Default | Range | Description |
|---------|---------|-------|-------------|
| DAS Delay | 150ms | 0-500ms | Delay before auto-repeat starts |
| ARR | 50ms | 0-200ms | Auto-repeat interval |
| Soft Drop Interval | 50ms | 0-200ms | Down key repeat interval |
| Volume | 100% | 0-100% | Sound effects volume |

### Game Rules

- **Objective**: Clear as many lines as possible by completing horizontal rows
- **Scoring** (NES-style):
  - 1 line: 40 × (level + 1)
  - 2 lines: 100 × (level + 1)
  - 3 lines: 300 × (level + 1)
  - 4 lines (Tetris): 1200 × (level + 1)
  - Soft drop: 1 point per grid space
- **Level Up**: First advance at max(100, startLevel × 10 - 50) lines, then every 10 lines
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
│   │   ├── gameActionsAtom.ts   # Game action handlers
│   │   ├── soundAtom.ts         # Sound settings
│   │   ├── leaderboardAtom.ts   # Leaderboard state with localStorage
│   │   ├── startLevelAtom.ts    # Starting level (0-9)
│   │   └── delayAtom.ts         # Delay state management
│   ├── components/         # React components
│   │   ├── GameBoard.tsx   # Main game board display
│   │   ├── NextPiece.tsx   # Next piece preview
│   │   ├── ScoreDisplay.tsx    # Score, level, lines display
│   │   ├── Controls.tsx    # Game control buttons
│   │   ├── SoundToggle.tsx # Sound on/off toggle
│   │   ├── SettingsButton.tsx  # Settings modal toggle
│   │   ├── SettingsModal.tsx   # Settings modal with sliders
│   │   ├── Leaderboard.tsx # Leaderboard modal
│   │   ├── PauseMenu.tsx   # Pause menu modal
│   │   └── LevelSelectionScreen.tsx  # Level selection (0-9)
│   ├── types/              # TypeScript types
│   │   └── leaderboard.ts  # Leaderboard type definitions
│   ├── config/             # Game configuration
│   │   └── inputConfig.ts  # DAS timing configuration
│   ├── hooks/              # React hooks
│   │   └── useKeyboardInput.ts  # Keyboard input with DAS
│   ├── utils/              # Game logic utilities
│   │   ├── tetrominos.ts   # Tetromino shapes and colors
│   │   ├── collision.ts    # Collision detection
│   │   ├── movement.ts     # Piece movement logic
│   │   ├── lineClearing.ts # Line clearing logic, NES gravity/scoring
│   │   └── sound.ts        # Sound effects using Web Audio API
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
- **gameStatusAtom**: Game state ('idle' | 'playing' | 'paused' | 'gameover') and settings modal state
- **scoreAtom**: Current score, level, and lines cleared
- **gameLoopAtom**: Timing for automatic piece drops
- **soundAtom**: Sound enabled/disabled state
- **leaderboardAtom**: Persistent leaderboard with top 10 scores
- **settingsAtom**: Persistent settings (DAS delay, ARR, soft drop interval, volume) using atomWithStorage
- **startLevelAtom**: Selected starting level (0-9)
- **delayAtom**: Delay state management (ARE, line clear)

### Leaderboard System

The game features a local leaderboard that persists across sessions using localStorage:

| Feature | Description |
|---------|-------------|
| Top 10 Scores | Automatically keeps the highest 10 scores |
| Player Names | Saves scores with player names (pre-filled from previous games) |
| High Score Detection | Shows "NEW HIGH SCORE!" indicator when beating previous best |
| Auto-Open | Modal automatically opens on game over |
| Manual Toggle | Click the "🏆" button to view anytime |
| Clear Option | Clear all scores with confirmation |

The leaderboard uses jotai's `atomWithStorage` for seamless localStorage persistence:

```typescript
export const leaderboardAtom = atomWithStorage<LeaderboardEntry[]>(
  'tetris-leaderboard',
  []
);
```

### Sound System

The game features a synthesized sound system using the native Web Audio API (no external audio files or dependencies):

| Sound Event | Trigger |
|-------------|---------|
| Move | Left/Right arrow keys |
| Rotate | Up arrow key |
| Soft Drop | Down arrow key |
| Hard Drop | Space bar |
| Lock | Piece lands on board |
| Line Clear | Lines are cleared |
| Level Up | Level increases |
| Game Over | No space to spawn piece |
| Start | Game starts |
| Pause | Pause/Resume toggle |

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
| I | Orange | 4×1 line |
| O | Red | 2×2 square |
| T | Yellow | T-shape |
| S | Cyan | S-shape |
| Z | Green | Z-shape |
| J | Pink | J-shape |
| L | Blue | L-shape |

## 🚀 Build & Deploy

### Live Demo
🎮 **Play the game online**: [https://joonanykanen.github.io/react-tetris/](https://joonanykanen.github.io/react-tetris/)

### Local Build

```bash
# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Run linter
pnpm lint
```

## 📝 Development Notes

This project was fully vibe coded **locally** using:

- **Hardware**: 2 × RTX 3090 GPUs
- **RAM**: 128GB
- **Model**: [GLM-4.7](https://huggingface.co/zai-org/GLM-4.7) (Q2_K_XL quantization) for core functionality & [MiniMax-M2.1](https://huggingface.co/MiniMaxAI/MiniMax-M2.1) (Q4_K_XL) for further PRs

The entire codebase, architecture, and implementation were generated using the [Kilo Code](https://kilocode.ai) agent after Vite project [initialization](https://vite.dev/guide/).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

**Enjoy playing Tetris! 🎮**
