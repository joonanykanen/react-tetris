// Leaderboard atoms for Tetris game using jotai's atomWithStorage for localStorage persistence

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { LeaderboardEntry } from '../types/leaderboard';

// Storage key constants
const LEADERBOARD_STORAGE_KEY = 'tetris-leaderboard';
const PLAYER_NAME_STORAGE_KEY = 'tetris-player-name';
const HIGH_SCORE_STORAGE_KEY = 'tetris-high-score';

// Leaderboard atom with localStorage persistence
export const leaderboardAtom = atomWithStorage<LeaderboardEntry[]>(
  LEADERBOARD_STORAGE_KEY,
  []
);

// Player name atom with localStorage persistence (for pre-filling name input)
export const playerNameAtom = atomWithStorage<string>(
  PLAYER_NAME_STORAGE_KEY,
  ''
);

// High score atom to track the best score (for detecting new high scores)
export const highScoreAtom = atomWithStorage<number>(
  HIGH_SCORE_STORAGE_KEY,
  0
);

// Modal visibility atom - controls whether the leaderboard modal is open
export const isLeaderboardOpenAtom = atomWithStorage<boolean>(
  'tetris-leaderboard-open',
  false
);

// Derived atom to check if current score is a new high score
export const isNewHighScoreAtom = atom((get) => {
  const currentScore = get(highScoreAtom);
  return currentScore > 0;
});

// Save score atom - action to save a new score to the leaderboard
export const saveScoreAtom = atom(
  null,
  (_get, set, entry: Omit<LeaderboardEntry, 'id' | 'date'>) => {
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };

    const currentLeaderboard = _get(leaderboardAtom);
    const updatedLeaderboard = [...currentLeaderboard, newEntry]
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 10); // Keep only top 10

    set(leaderboardAtom, updatedLeaderboard);

    // Update high score if this entry is the new best
    if (newEntry.score > _get(highScoreAtom)) {
      set(highScoreAtom, newEntry.score);
    }

    // Save player name for future games
    if (entry.playerName.trim()) {
      set(playerNameAtom, entry.playerName.trim());
    }
  }
);

// Clear leaderboard atom - action to clear all entries
export const clearLeaderboardAtom = atom(null, (_, set) => {
  set(leaderboardAtom, []);
});

// Update high score atom - action to update the high score
export const updateHighScoreAtom = atom(null, (get, set, score: number) => {
  if (score > get(highScoreAtom)) {
    set(highScoreAtom, score);
  }
});

// Open leaderboard modal atom
export const openLeaderboardAtom = atom(null, (_, set) => {
  set(isLeaderboardOpenAtom, true);
});

// Close leaderboard modal atom
export const closeLeaderboardAtom = atom(null, (_, set) => {
  set(isLeaderboardOpenAtom, false);
});