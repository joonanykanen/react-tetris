// DAS (Delayed Auto-Shift) Configuration for Tetris
// Classic Tetris timing values for authentic feel

export interface DASConfig {
  /** Initial delay before auto-repeat starts (ms) */
  delay: number;
  /** Auto-repeat interval (ms) */
  interval: number;
}

export const DEFAULT_DAS_CONFIG: Record<string, DASConfig> = {
  ArrowLeft: {
    delay: 150,    // Classic DAS: ~160ms
    interval: 50,  // Classic ARR: ~40-50ms
  },
  ArrowRight: {
    delay: 150,
    interval: 50,
  },
  ArrowDown: {
    delay: 0,      // No delay for soft drop - immediate response
    interval: 50,
  },
};

export const DAS_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowDown'] as const;
export type DASKey = typeof DAS_KEYS[number];

// One-shot keys that don't use DAS (trigger once per press)
export const ONESHOT_KEYS = ['ArrowUp', ' '] as const;
export type OneShotKey = typeof ONESHOT_KEYS[number];

// Special game keys (pause, restart) - one-shot, no DAS
export const SPECIAL_KEYS = ['p', 'P', 'r', 'R'] as const;
export type SpecialKey = typeof SPECIAL_KEYS[number];

// All controllable keys
export const CONTROLLABLE_KEYS = [...DAS_KEYS, ...ONESHOT_KEYS, ...SPECIAL_KEYS] as const;