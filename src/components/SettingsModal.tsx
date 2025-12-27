// Settings modal component for Tetris game

import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useCallback } from 'react';
import { isSettingsModalOpenAtom, setSettingsModalOpenAtom } from '../atoms/gameStatusAtom';
import { dasDelayAtom, arrAtom, softDropIntervalAtom, volumeAtom, resetSettingsAtom } from '../atoms/settingsAtom';
import { updateVolume } from '../utils/sound';

export default function SettingsModal() {
  const isOpen = useAtomValue(isSettingsModalOpenAtom);
  const setIsOpen = useSetAtom(setSettingsModalOpenAtom);
  
  const dasDelay = useAtomValue(dasDelayAtom);
  const arr = useAtomValue(arrAtom);
  const softDropInterval = useAtomValue(softDropIntervalAtom);
  const volume = useAtomValue(volumeAtom);
  
  const setDasDelay = useSetAtom(dasDelayAtom);
  const setArr = useSetAtom(arrAtom);
  const setSoftDropInterval = useSetAtom(softDropIntervalAtom);
  const setVolume = useSetAtom(volumeAtom);
  const resetSettings = useSetAtom(resetSettingsAtom);

  // Close modal on escape key
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const handleReset = () => {
    resetSettings();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl border-2 border-blue-500 shadow-2xl p-8 max-w-md w-full">
          {/* Title */}
          <h2 className="text-3xl font-bold text-blue-400 text-center mb-6">
            SETTINGS
          </h2>

          {/* DAS Delay */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-gray-300 font-medium">DAS Delay</label>
              <span className="text-blue-400 font-mono">{dasDelay}ms</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={dasDelay}
              onChange={(e) => setDasDelay(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-gray-500 text-xs mt-1">Initial delay before auto-repeat starts</p>
          </div>

          {/* ARR */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-gray-300 font-medium">ARR (Auto-Repeat)</label>
              <span className="text-blue-400 font-mono">{arr}ms</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={arr}
              onChange={(e) => setArr(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-gray-500 text-xs mt-1">Interval between movements during repeat</p>
          </div>

          {/* Soft Drop Interval */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-gray-300 font-medium">Soft Drop Interval</label>
              <span className="text-blue-400 font-mono">{softDropInterval}ms</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={softDropInterval}
              onChange={(e) => setSoftDropInterval(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-gray-500 text-xs mt-1">Repeat interval for soft drop key</p>
          </div>

          {/* Volume */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-gray-300 font-medium">Volume</label>
              <span className="text-blue-400 font-mono">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={volume}
              onChange={(e) => {
                const newVolume = Number(e.target.value);
                setVolume(newVolume);
                updateVolume(newVolume);
              }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="w-full mb-4 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:scale-105"
          >
            RESET TO DEFAULTS
          </button>

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:scale-105"
          >
            CLOSE
          </button>

          {/* Hint */}
          <p className="text-gray-500 text-sm text-center mt-6">
            Press ESC to close
          </p>
        </div>
      </div>
    </>
  );
}