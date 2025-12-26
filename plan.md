# Sound Implementation Plan for React Tetris

## Overview
Add sound effects to the Tetris game using Web Audio API (no external dependencies) following KISS principles.

## Sound Events

| Event | Sound Type | Frequency | Duration | Trigger |
|-------|------------|-----------|----------|---------|
| Move | Short click | 400Hz | 50ms | Left/Right arrow |
| Rotate | Quick blip | 600Hz | 30ms | Up arrow |
| Soft Drop | Low thud | 200Hz | 40ms | Down arrow |
| Hard Drop | Heavy thud | 150Hz | 60ms | Space bar |
| Lock Piece | Click | 300Hz | 50ms | Piece lands |
| Line Clear | Rising tone | 400-800Hz | 200ms | Lines cleared |
| Level Up | Victory fanfare | 523-1046Hz | 500ms | Level increases |
| Game Over | Descending tone | 400-100Hz | 1000ms | Game ends |
| Start Game | Start chime | 440-880Hz | 300ms | Game starts |
| Pause | Toggle sound | 800Hz | 100ms | Pause toggle |

## Architecture

```
src/
├── utils/
│   └── sound.ts          # Sound utility with Web Audio API
├── atoms/
│   └── soundAtom.ts      # Sound settings atom (on/off)
└── components/
    └── SoundToggle.tsx   # Sound on/off button
```

## Implementation Steps

### 1. Create Sound Utility (`src/utils/sound.ts`)

```typescript
// Simple sound manager using Web Audio API
export const playSound = (type: SoundType): void => {
  // Implementation using AudioContext
};

export type SoundType = 
  | 'move'
  | 'rotate'
  | 'softDrop'
  | 'hardDrop'
  | 'lock'
  | 'lineClear'
  | 'levelUp'
  | 'gameOver'
  | 'start'
  | 'pause';
```

### 2. Create Sound Settings Atom (`src/atoms/soundAtom.ts`)

```typescript
import { atom } from 'jotai';

export const soundEnabledAtom = atom<boolean>(true);
```

### 3. Integrate Sounds into Game Actions (`src/atoms/gameActionsAtom.ts`)

Add sound calls at key events:
- `moveLeftAtom`, `moveRightAtom` → play 'move'
- `rotatePieceAtom` → play 'rotate'
- `moveDownAtom` → play 'softDrop'
- `hardDropAtom` → play 'hardDrop'
- `lockPieceAtom` → play 'lock'
- Line clearing in `lockPieceAtom` → play 'lineClear'
- Level up in `addLinesAtom` → play 'levelUp'
- Game over in `spawnPieceAtom` → play 'gameOver'
- `startGameAtom` → play 'start'
- `pauseGameAtom` → play 'pause'

### 4. Create Sound Toggle Component (`src/components/SoundToggle.tsx`)

```tsx
import { useAtomValue, useSetAtom } from 'jotai';
import { soundEnabledAtom } from '../atoms/soundAtom';

export default function SoundToggle() {
  const soundEnabled = useAtomValue(soundEnabledAtom);
  const setSoundEnabled = useSetAtom(soundEnabledAtom);
  
  return (
    <button onClick={() => setSoundEnabled(!soundEnabled)}>
      {soundEnabled ? '🔊' : '🔇'}
    </button>
  );
}
```

### 5. Update Controls Component (`src/components/Controls.tsx`)

Add SoundToggle to the controls panel.

## KISS Principles Applied

1. **No external dependencies** - Uses native Web Audio API
2. **Simple synthesized sounds** - No audio files needed
3. **Centralized sound utility** - Single source of truth
4. **Minimal integration points** - Only 10 sound events
5. **Optional feature** - Sound can be toggled on/off

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/utils/sound.ts` | Create |
| `src/atoms/soundAtom.ts` | Create |
| `src/atoms/gameActionsAtom.ts` | Modify |
| `src/components/SoundToggle.tsx` | Create |
| `src/components/Controls.tsx` | Modify |
| `README.md` | Update |

## Testing Checklist

- [ ] All sound events trigger correctly
- [ ] Sound toggle works
- [ ] No sounds when disabled
- [ ] Sounds work on first user interaction (browser policy)
- [ ] No audio overlap issues