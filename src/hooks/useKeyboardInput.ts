import { useEffect, useRef, useCallback } from 'react';
import { DEFAULT_DAS_CONFIG, DAS_KEYS, SPECIAL_KEYS } from '../config/inputConfig';
import type { DASConfig, DASKey } from '../config/inputConfig';

interface KeyState {
  pressed: boolean;
  lastPressTime: number;
  lastRepeatTime: number;
}

interface UseKeyboardInputOptions {
  /** Custom DAS configuration per key */
  dasConfig?: Partial<Record<DASKey, DASConfig>>;
  /** Callback when a DAS key should repeat */
  onDASRepeat?: (key: DASKey) => void;
  /** Callback when a one-shot key is pressed */
  onOneShot?: (key: string) => void;
}

export function useKeyboardInput(options: UseKeyboardInputOptions = {}) {
  const { dasConfig = {}, onDASRepeat, onOneShot } = options;

  const keyStates = useRef<Map<string, KeyState>>(new Map());
  const configRef = useRef<Record<string, DASConfig>>({ ...DEFAULT_DAS_CONFIG });

  // Update config when custom config is provided
  useEffect(() => {
    for (const key of DAS_KEYS) {
      if (dasConfig[key]) {
        configRef.current[key] = dasConfig[key]!;
      }
    }
  }, [dasConfig]);

  const getConfig = useCallback((key: string): DASConfig => {
    return configRef.current[key] || DEFAULT_DAS_CONFIG[key as DASKey] || { delay: 150, interval: 50 };
  }, []);

  const shouldTriggerRepeat = useCallback((key: string, timestamp: number): boolean => {
    const state = keyStates.current.get(key);
    if (!state || !state.pressed) return false;

    const config = getConfig(key);
    const timeSincePress = timestamp - state.lastPressTime;
    const timeSinceRepeat = timestamp - state.lastRepeatTime;

    // Check if we've passed the initial delay and the repeat interval
    return timeSincePress >= config.delay && timeSinceRepeat >= config.interval;
  }, [getConfig]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event;

    // Prevent default for game keys
    if (CONTROLLABLE_KEYS.includes(key as any)) {
      event.preventDefault();
    }

    // Handle one-shot keys immediately (rotate, hard drop)
    if (ONESHOT_KEYS.includes(key as any)) {
      onOneShot?.(key);
      return;
    }

    // Handle special keys (pause, restart)
    if (SPECIAL_KEYS.includes(key as any)) {
      onOneShot?.(key);
      return;
    }

    // Handle DAS keys
    if (DAS_KEYS.includes(key as DASKey)) {
      const state = keyStates.current.get(key);

      if (!state) {
        // First press
        keyStates.current.set(key, {
          pressed: true,
          lastPressTime: event.timeStamp,
          lastRepeatTime: event.timeStamp,
        });
        // Trigger immediate movement on first press
        onDASRepeat?.(key as DASKey);
      } else if (!state.pressed) {
        // Key was released, now pressed again
        state.pressed = true;
        state.lastPressTime = event.timeStamp;
        state.lastRepeatTime = event.timeStamp;
        onDASRepeat?.(key as DASKey);
      }
      // If already pressed and in repeat mode, ignore (OS repeat)
    }
  }, [onDASRepeat, onOneShot]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const { key } = event;

    // Handle DAS keys
    if (DAS_KEYS.includes(key as DASKey)) {
      const state = keyStates.current.get(key);
      if (state) {
        state.pressed = false;
      }
    }
  }, []);

  // Process DAS keys for the game loop
  const processInput = useCallback((timestamp: number): DASKey[] => {
    const triggeredKeys: DASKey[] = [];

    for (const key of DAS_KEYS) {
      if (shouldTriggerRepeat(key, timestamp)) {
        const state = keyStates.current.get(key);
        if (state) {
          state.lastRepeatTime = timestamp;
          triggeredKeys.push(key);
        }
      }
    }

    return triggeredKeys;
  }, [shouldTriggerRepeat]);

  // Check if a key is currently pressed
  const isPressed = useCallback((key: string): boolean => {
    return keyStates.current.get(key)?.pressed ?? false;
  }, []);

  // Setup event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return {
    processInput,
    isPressed,
  };
}

// Import CONTROLLABLE_KEYS and ONESHOT_KEYS from config
import { CONTROLLABLE_KEYS, ONESHOT_KEYS } from '../config/inputConfig';