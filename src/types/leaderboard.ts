// Leaderboard types for Tetris game

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  level: number;
  lines: number;
  date: string; // ISO date string
}

export type Leaderboard = LeaderboardEntry[];