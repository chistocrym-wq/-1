import { useEffect, useState } from 'react';

const STORAGE_KEY = 'otto-lesen-teil1-progress-v1';

interface LesenTeil1Progress {
  lastCompleted: number;
  dailyDate: string;
  dailyCompleted: number;
  dailySuccessful: number;
}

const getToday = () => {
  return new Date().toISOString().slice(0, 10);
};

const getInitialProgress = (): LesenTeil1Progress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return {
        lastCompleted: 0,
        dailyDate: getToday(),
        dailyCompleted: 0,
        dailySuccessful: 0,
      };
    }

    const parsed = JSON.parse(saved) as LesenTeil1Progress;
    const today = getToday();

    /*
     * Если наступил новый день,
     * общий прогресс сохраняем,
     * а сегодняшние счётчики обнуляем.
     */
    if (parsed.dailyDate !== today) {
      return {
        lastCompleted: parsed.lastCompleted || 0,
        dailyDate: today,
        dailyCompleted: 0,
        dailySuccessful: 0,
      };
    }

    return parsed;
  } catch {
    return {
      lastCompleted: 0,
      dailyDate: getToday(),
      dailyCompleted: 0,
      dailySuccessful: 0,
    };
  }
};

export function useLesenTeil1Progress() {
  const [progress, setProgress] = useState<LesenTeil1Progress>(
    getInitialProgress
  );

  /*
   * Сохраняем прогресс в браузере.
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(progress)
      );
    } catch {
      // Если браузер не позволяет использовать localStorage,
      // приложение всё равно продолжит работать.
    }
  }, [progress]);

  /*
   * Записываем завершённое задание.
   */
  const record = (
    taskIndex: number,
    successful: boolean
  ) => {
    setProgress((previous) => {
      const today = getToday();

      /*
       * Защита на случай, если дата изменилась прямо во время работы.
       */
      const newDay =
        previous.dailyDate !== today;

      return {
        lastCompleted: Math.max(
          previous.lastCompleted,
          taskIndex + 1
        ),

        dailyDate: today,

        dailyCompleted:
          (newDay ? 0 : previous.dailyCompleted) + 1,

        dailySuccessful:
          (newDay ? 0 : previous.dailySuccessful) +
          (successful ? 1 : 0),
      };
    });
  };

  return {
    progress,
    record,
  };
}