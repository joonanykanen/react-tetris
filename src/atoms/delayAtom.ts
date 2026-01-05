// Delay management atoms for NES Tetris timing

import { atom } from 'jotai';

// Game state enum for delay management
export type GameDelayState = 'normal' | 'are' | 'lineClear' | 'gameOver';

// Delay state atom - tracks the current delay state
export const delayStateAtom = atom<GameDelayState>('normal');

// Delay timer atom - tracks frames remaining in current delay
export const delayTimerAtom = atom<number>(0);

// Global frame counter for animation timing
export const globalFrameCounterAtom = atom<number>(0);

// Reset delay state atom - resets all delay-related state
export const resetDelayStateAtom = atom(null, (_, set) => {
  set(delayStateAtom, 'normal');
  set(delayTimerAtom, 0);
  set(globalFrameCounterAtom, 0);
});

// Set delay state atom - sets the delay state and timer
export const setDelayStateAtom = atom(null, (_, set, state: { state: GameDelayState; frames: number }) => {
  set(delayStateAtom, state.state);
  set(delayTimerAtom, state.frames);
});

// Decrement delay timer atom - called each frame
export const decrementDelayTimerAtom = atom(null, (_, set) => {
  set(delayTimerAtom, (prev) => Math.max(0, prev - 1));
});

// Increment frame counter atom - called each frame
export const incrementFrameCounterAtom = atom(null, (_, set) => {
  set(globalFrameCounterAtom, (prev) => (prev + 1) % 256);
});

// Check if game is in delay state
export const isInDelayAtom = atom((get) => {
  const state = get(delayStateAtom);
  return state !== 'normal';
});

// Get remaining delay time in milliseconds
export const getRemainingDelayMsAtom = atom((get) => {
  const timer = get(delayTimerAtom);
  const msPerFrame = 1000 / 60; // ~16.67ms per frame at 60 FPS
  return timer * msPerFrame;
});