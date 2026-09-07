import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { ReadingTask } from '@/types';
import { QuestionCard } from '@/components/QuestionCard';
import { ReadingVisual } from './ReadingVisual';
import { useLesenTeil1Progress } from '@/hooks/useLesenTeil1Progress';

interface Teil1RunnerProps {
  tasks: ReadingTask[];
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

export function Teil1Runner({
  tasks,
  onBack,
  onComplete,
}: Teil1RunnerProps) {
  const { progress, record } = useLesenTeil1Progress();

  const startTask = Math.min(
    progress.lastCompleted,
    Math.max(tasks.length - 1, 0)
  );

  const [currentTaskIndex, setCurrentTaskIndex] = useState(startTask);

  const [answered, setAnswered] = useState<Record<string, boolean>>({});
  const [correctAnswers, setCorrectAnswers] = useState<
    Record<string, boolean>
  >({});

  const [finished, setFinished] = useState(false);

  const task = tasks[currentTaskIndex];

  if (!task) {
    return null;
  }

  /*
   * Проверяем, на все ли вопросы внутри текущего задания
   * пользователь уже ответил.
   */
  const taskComplete = task.questions.every(
    (question) => answered[question.id]
  );

  /*
   * Задание считается успешным только тогда,
   * когда ВСЕ вопросы внутри него отвечены правильно.
   */
  const taskSuccessful = task.questions.every(
    (question) => correctAnswers[question.id] === true
  );

  /*
   * Получаем результат каждого вопроса.
   */
  const handleAnswer = (questionId: string, correct: boolean) => {
    setAnswered((previous) => ({
      ...previous,
      [questionId]: true,
    }));

    setCorrectAnswers((previous) => ({
      ...previous,
      [questionId]: correct,
    }));
  };

  /*
   * Переход к следующему заданию.
   */
  const handleNext = () => {
    if (!taskComplete) {
      return;
    }

    /*
     * Сохраняем завершённое задание.
     */
    record(currentTaskIndex, taskSuccessful);

    /*
     * Если есть ещё задания — открываем следующее.
     */
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex((previous) => previous + 1);
      setAnswered({});
      setCorrectAnswers({});
      return;
    }

    /*
     * Если это было последнее задание.
     */
    onComplete(
      progress.dailySuccessful + (taskSuccessful ? 1 : 0),
      progress.dailyCompleted + 1
    );

    setFinished(true);
  };

  /*
   * Экран после окончания всех заданий.
   */
  if (finished) {
    return (
      <div className="animate-scale-in flex flex-col items-center justify-center py-12">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 mb-6">
          <Trophy className="h-10 w-10 text-teal-700" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Teil 1 завершён!
        </h2>

        <p className="text-slate-500 mb-8 text-center max-w-md">
          Ты прошла все тестовые задания Teil 1.
        </p>

        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться к Lesen
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Верхняя панель */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors shrink-0"
          aria-label="Назад"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-500">
            Lesen · Teil 1
          </p>

          <h2 className="text-xl font-bold text-slate-900">
            Aufgabe {currentTaskIndex + 1} / {tasks.length}
          </h2>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <div className="text-xs text-slate-400">
            Сегодня
          </div>

          <div className="text-lg font-bold text-slate-900">
            {progress.dailyCompleted}
          </div>

          <div className="text-xs text-slate-500">
            выполнено
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <div className="text-xs text-slate-400">
            Сегодня
          </div>

          <div className="text-lg font-bold text-teal-700">
            {progress.dailySuccessful}
          </div>

          <div className="text-xs text-slate-500">
            успешно
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Прогресс</span>

            <span>
              {progress.lastCompleted} / {tasks.length}
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-300"
              style={{
                width: `${Math.min(
                  (progress.lastCompleted / tasks.length) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Инструкция */}
      <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />

          <div>
            <h3 className="font-semibold text-teal-800 mb-1">
              {task.title}
            </h3>

            <p className="text-sm text-slate-600">
              {task.instruction}
            </p>
          </div>
        </div>
      </div>

      {/* Само задание */}
      <div className="space-y-5 mb-6">
        {/* Визуальный источник */}
        <ReadingVisual task={task} />

        {/* Все вопросы этого задания */}
        <div className="space-y-4">
          {task.questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              onAnswer={(correct) =>
                handleAnswer(question.id, correct)
              }
              showResult={true}
            />
          ))}
        </div>
      </div>

      {/* Следующее задание */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!taskComplete}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
            taskComplete
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          )}
        >
          {currentTaskIndex < tasks.length - 1 ? (
            <>
              Следующее задание
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Завершить
            </>
          )}
        </button>
      </div>
    </div>
  );
}