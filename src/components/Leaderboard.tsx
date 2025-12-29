// Leaderboard component for Tetris game - Modal version

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  leaderboardAtom,
  playerNameAtom,
  highScoreAtom,
  isLeaderboardOpenAtom,
  saveScoreAtom,
  clearLeaderboardAtom,
  closeLeaderboardAtom,
  openLeaderboardAtom,
} from '../atoms/leaderboardAtom';
import { scoreAtom, levelAtom, linesAtom } from '../atoms/scoreAtom';
import { gameStatusAtom } from '../atoms/gameStatusAtom';

export default function Leaderboard() {
  const [playerName, setPlayerName] = useState('');
  const [justSaved, setJustSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const leaderboard = useAtomValue(leaderboardAtom);
  const savedPlayerName = useAtomValue(playerNameAtom);
  const highScore = useAtomValue(highScoreAtom);
  const currentScore = useAtomValue(scoreAtom);
  const currentLevel = useAtomValue(levelAtom);
  const currentLines = useAtomValue(linesAtom);
  const gameStatus = useAtomValue(gameStatusAtom);
  const isOpen = useAtomValue(isLeaderboardOpenAtom);

  const saveScore = useSetAtom(saveScoreAtom);
  const clearLeaderboard = useSetAtom(clearLeaderboardAtom);
  const closeModal = useSetAtom(closeLeaderboardAtom);
  const openModal = useSetAtom(openLeaderboardAtom);

  // Check if current score is already saved in the leaderboard
  const isCurrentScoreSaved = useMemo(() => {
    return leaderboard.some(entry => entry.score === currentScore && entry.level === currentLevel);
  }, [leaderboard, currentScore, currentLevel]);

  // Only show save form when game is over, score > 0, and not already saved
  const showSaveForm = isOpen && gameStatus === 'gameover' && currentScore > 0 && !isCurrentScoreSaved && !justSaved;
  const showSavedMessage = isOpen && (isCurrentScoreSaved || justSaved);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setJustSaved(false);
      setShowClearConfirm(false);
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  }, [closeModal]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleSaveScore = () => {
    const nameToSave = playerName.trim() || savedPlayerName;
    if (!nameToSave) return;

    saveScore({
      playerName: nameToSave,
      score: currentScore,
      level: currentLevel,
      lines: currentLines,
    });

    setJustSaved(true);
  };

  const handleClearConfirm = () => {
    clearLeaderboard();
    setShowClearConfirm(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setPlayerName('');
          setJustSaved(false);
          setShowClearConfirm(false);
          openModal();
        }}
        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
        title="Leaderboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6 text-yellow-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
          />
        </svg>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl border-2 border-purple-500 shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
            <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
              <span>🏆</span>
              <span>LEADERBOARD</span>
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-white text-2xl leading-none transition-colors"
            >
              ×
            </button>
          </div>

          {/* New High Score Indicator */}
          {gameStatus === 'gameover' && currentScore > highScore && currentScore > 0 && (
            <div className="bg-yellow-900/50 border-b border-yellow-500 p-4 text-center animate-pulse">
              <span className="text-2xl">🏆</span>
              <span className="ml-2 font-bold text-yellow-400 text-lg">NEW HIGH SCORE!</span>
              <div className="text-yellow-200 text-sm mt-1">
                {currentScore.toLocaleString()} points
              </div>
            </div>
          )}

          {/* Save Score Form */}
          {showSaveForm && (
            <div className="bg-green-900/30 border-b border-green-600 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-green-400 text-sm font-bold">SAVE YOUR SCORE</div>
                <div className="text-purple-400 font-bold">{currentScore.toLocaleString()} pts</div>
              </div>
              <input
                type="text"
                value={playerName || savedPlayerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                maxLength={20}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveScore();
                  }
                }}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveScore}
                  disabled={!playerName.trim() && !savedPlayerName}
                  className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          {/* Score Saved Message */}
          {showSavedMessage && (
            <div className="bg-green-900/30 border-b border-green-600 p-2 text-center text-green-400 text-sm">
              Score saved! 🎉
            </div>
          )}

          {/* Leaderboard Content */}
          <div className="overflow-y-auto max-h-64">
            {leaderboard.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No scores yet. Be the first!
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 p-3 ${
                      index === 0 ? 'bg-yellow-900/20' : ''
                    }`}
                  >
                    <div className="w-8 text-center text-white">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </div>
                    <div className="flex-1 text-white truncate">
                      {entry.playerName}
                    </div>
                    <div className="text-right">
                      <div className="text-purple-400 font-bold">{entry.score.toLocaleString()}</div>
                      <div className="text-gray-500 text-xs">Level {entry.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            {showClearConfirm ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-red-400 text-sm">Clear all scores?</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearConfirm}
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors"
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full py-2 text-gray-500 hover:text-red-400 text-sm transition-colors"
              >
                Clear Leaderboard
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}