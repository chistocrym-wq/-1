import { useState, useEffect, useCallback } from 'react';
import type { Progress, ModuleProgress } from '@/types';

const STORAGE_KEY = 'goethe-a1-progress';

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  const recordScore = useCallback((key: string, score: number, total: number) => {
    setProgress((prev) => {
      const existing = prev[key];
      const scorePercent = total > 0 ? Math.round((score / total) * 100) : 0;
      const completed = Math.max(existing?.completed ?? 0, score === total ? 1 : 0);
      return {
        ...prev,
        [key]: {
          completed,
          total,
          bestScore: Math.max(existing?.bestScore ?? 0, scorePercent),
          lastScore: scorePercent,
          attempts: (existing?.attempts ?? 0) + 1,
        } as ModuleProgress,
      };
    });
  }, []);

  const markCompleted = useCallback((key: string, total: number) => {
    setProgress((prev) => {
      const existing = prev[key];
      return {
        ...prev,
        [key]: {
          completed: 1,
          total,
          bestScore: existing?.bestScore ?? 100,
          lastScore: existing?.lastScore ?? 100,
          attempts: (existing?.attempts ?? 0) + 1,
        } as ModuleProgress,
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { progress, recordScore, markCompleted, resetProgress };
}
