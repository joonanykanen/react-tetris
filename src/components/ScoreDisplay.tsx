// Score Display component for Tetris game

import { useAtomValue } from 'jotai';
import { scoreAtom, levelAtom, linesAtom } from '../atoms/scoreAtom';

export default function ScoreDisplay() {
  const score = useAtomValue(scoreAtom);
  const level = useAtomValue(levelAtom);
  const lines = useAtomValue(linesAtom);

  return (
    <div className="flex flex-col gap-4 bg-gray-900 p-4 rounded-lg border-2 border-gray-700 shadow-lg">
      <ScoreItem label="SCORE" value={score.toLocaleString()} />
      <ScoreItem label="LEVEL" value={level.toString()} />
      <ScoreItem label="LINES" value={lines.toString()} />
    </div>
  );
}

function ScoreItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-bold text-gray-400">{label}</span>
      <span className="text-2xl font-bold text-white">{value}</span>
    </div>
  );
}