# Keyboard Input Fix Plan

## Problem Analysis

The current implementation in [`src/App.tsx`](src/App.tsx:66-111) uses the browser's native `keydown` event with OS key repeat. This causes issues:

1. **OS key repeat delay**: ~500ms before movement starts repeating
2. **Inconsistent repeat rates**: Varies by OS/browser settings
3. **Multi-key disruption**: When holding arrow key + space, or when piece locks, the repeat behavior breaks
4. **No proper key state tracking**: Can't detect which keys are currently held

## DAS (Delayed Auto-Shift) Implementation

Classic Tetris uses DAS for smooth horizontal movement:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DAS Timing Diagram                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Key Press ───────┐                                             │
│                    │                                            │
│                   ─┴── Initial Delay (DAS_DELAY)                │
│                    │                                            │
│                    ├── Repeat (ARR)                             │
│                    │    ┌── ┌── ┌── ┌── ┌──                     │
│                    │    │  │  │  │  │  │                        │
│                    └────┴──┴──┴──┴──┴──┴── ...                  │
│                                                                 │
│  DAS_DELAY = 150ms  (time before auto-repeat starts)            │
│  ARR = 50ms         (auto-repeat interval)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### DAS Configuration (Classic Tetris Values)

| Setting | Classic Value | Our Value | Description |
|---------|---------------|-----------|-------------|
| DAS Delay | 160ms | 150ms | Delay before auto-repeat starts |
| ARR | 40ms | 50ms | Auto-repeat interval |
| Soft Drop | - | 50ms | Down key repeat interval |

## Solution Architecture

### 1. Create Keyboard Input Hook (`src/hooks/useKeyboardInput.ts`)

```typescript
interface DASConfig {
  delay: number;      // Initial delay before repeat (ms)
  interval: number;   // Repeat interval (ms)
}

const DEFAULT_DAS_CONFIG: Record<string, DASConfig> = {
  ArrowLeft:  { delay: 150, interval: 50 },
  ArrowRight: { delay: 150, interval: 50 },
  ArrowDown:  { delay: 0, interval: 50 },   // No delay for soft drop
};

// Track pressed keys and their repeat state
const keyStates = useRef<Map<string, {
  pressed: boolean;
  lastPressTime: number;
  lastRepeatTime: number;
}>>(new Map());
```

### 2. Input Processing in Game Loop

```typescript
// In gameLoop function
const now = timestamp;

for (const key of ['ArrowLeft', 'ArrowRight', 'ArrowDown']) {
  const state = keyStates.current.get(key);
  if (state?.pressed) {
    const config = DEFAULT_DAS_CONFIG[key];
    const timeSincePress = now - state.lastPressTime;
    const timeSinceRepeat = now - state.lastRepeatTime;
    
    if (timeSincePress >= config.delay && timeSinceRepeat >= config.interval) {
      // Trigger movement
      if (key === 'ArrowLeft') moveLeft();
      else if (key === 'ArrowRight') moveRight();
      else if (key === 'ArrowDown') moveDown();
      
      state.lastRepeatTime = now;
    }
  }
}
```

## Implementation Steps

### Step 1: Create Keyboard Input Hook
- Track key states with `useRef` (avoids re-renders)
- Add `keydown`/`keyup` listeners
- Store press time for DAS calculation
- Export `useKeyboardInput` hook

### Step 2: Create Input Configuration
- Define DAS timing constants
- Allow per-key configuration
- Document classic Tetris values

### Step 3: Modify App.tsx
- Replace simple keydown handler with new input system
- Integrate input processing into game loop
- Ensure proper cleanup on unmount
- Keep one-shot actions (rotate, hard drop) as keydown events

## Key Benefits

1. **Classic Tetris feel**: DAS provides authentic horizontal movement
2. **Smooth movement**: Consistent repeat rate regardless of OS settings
3. **Multi-key support**: Can hold multiple keys simultaneously
4. **Piece lock handling**: Movement continues after piece locks
5. **Configurable timing**: Easy to tune delay/interval values

## Files to Modify/Create

- **Create**: `src/hooks/useKeyboardInput.ts` - New keyboard input hook with DAS
- **Create**: `src/config/inputConfig.ts` - DAS timing configuration
- **Modify**: `src/App.tsx` - Integrate new input system
- **Modify**: `src/atoms/gameActionsAtom.ts` - May need adjustments for smoother movement