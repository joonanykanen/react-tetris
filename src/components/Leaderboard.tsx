// Leaderboard component for Tetris game - Modal version

import { useState, useMemo, useEffect } from 'react';
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
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 rounded-lg transition-colors"
      >
        <span className="text-xl">🏆</span>
        <span className="text-white font-bold">Leaderboard</span>
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
              <div className="text-green-400 text-sm font-bold mb-2">SAVE YOUR SCORE</div>
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