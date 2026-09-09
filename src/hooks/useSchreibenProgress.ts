import { useCallback, useEffect, useState } from 'react';

export interface SchreibenProgressState {
  nextIndex: number;
  totalCompleted: number;
  dailyCompleted: number;
  dailyScores: number[];
  updatedAt: string;
}

const today = () => new Date().toISOString().slice(0, 10);
const keyFor = (teil: 1 | 2) => `otto-schreiben-teil${teil}-progress-v1`;

const empty = (): SchreibenProgressState => ({ nextIndex: 0, totalCompleted: 0, dailyCompleted: 0, dailyScores: [], updatedAt: today() });

function load(teil: 1 | 2): SchreibenProgressState {
  try {
    const raw = localStorage.getItem(keyFor(teil));
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as SchreibenProgressState;
    return parsed.updatedAt === today()
      ? { ...empty(), ...parsed }
      : { ...parsed, dailyCompleted: 0, dailyScores: [], updatedAt: today() };
  } catch {
    return empty();
  }
}

export function useSchreibenProgress(teil: 1 | 2, total: number) {
  const [progress, setProgress] = useState<SchreibenProgressState>(() => load(teil));

  useEffect(() => {
    try { localStorage.setItem(keyFor(teil), JSON.stringify(progress)); } catch { /* ignore */ }
  }, [progress, teil]);

  const record = useCallback((score: number | null) => {
    setProgress((prev) => {
      const newIndex = prev.nextIndex + 1;
      return {
        nextIndex: newIndex >= total ? 0 : newIndex,
        totalCompleted: prev.totalCompleted + 1,
        dailyCompleted: prev.dailyCompleted + 1,
        dailyScores: score === null ? prev.dailyScores : [...prev.dailyScores, score],
        updatedAt: today(),
      };
    });
  }, [total]);

  const restart = useCallback(() => setProgress((prev) => ({ ...prev, nextIndex: 0 })), []);

  const averageToday = progress.dailyScores.length
    ? Math.round(progress.dailyScores.reduce((a, b) => a + b, 0) / progress.dailyScores.length)
    : null;

  return { progress, record, restart, averageToday, completeRound: progress.totalCompleted > 0 && progress.nextIndex === 0 };
}
