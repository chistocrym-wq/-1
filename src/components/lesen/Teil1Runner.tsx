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

  // Если все задания уже пройдены,
  // не открываем снова последнее задание.
  const initialTaskIndex =
    progress.lastCompleted >= tasks.length
      ? 0
      : progress.lastCompleted;

  const [currentTaskIndex, setCurrentTaskIndex] =
    useState(initialTaskIndex);

  const [answered, setAnswered] = useState<
    Record<string, boolean>
  >({});

  const [correctAnswers, setCorrectAnswers] = useState<
    Record<string, boolean>
  >({});

  const [finished, setFinished] = useState(
    progress.lastCompleted >= tasks.length
  );

  const task = tasks[currentTaskIndex];

  /*
   * Все вопросы текущего задания должны быть отвечены.
   */
  const taskComplete =
    task &&
    task.questions.every(
      (question) => answered[question.id]
    );

  /*
   * Задание успешно только тогда,
   * когда каждый вопрос отвечен правильно.
   */
  const taskSuccessful =
    task &&
    task.questions.every(
      (question) => correctAnswers[question.id] === true
    );

  const handleAnswer = (
    questionId: string,
    correct: boolean
  ) => {
    setAnswered((previous) => ({
      ...previous,
      [questionId]: true,
    }));

    setCorrectAnswers((previous) => ({
      ...previous,
      [questionId]: correct,
    }));
  };

  const handleNext = () => {
    if (!task || !taskComplete) {
      return;
    }

    /*
     * Сохраняем результат текущего задания.
     */
    record(currentTaskIndex, taskSuccessful);

    /*
     * Есть ещё задания.
     */
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(
        (previous) => previous + 1
      );

      setAnswered({});
      setCorrectAnswers({});

      return;
    }

    /*
     * Это было последнее задание.
     * Показываем экран завершения.
     */
    setFinished(true);

    onComplete(
      progress.dailySuccessful +
        (taskSuccessful ? 1 : 0),
      progress.dailyCompleted + 1
    );
  };

  /*
   * Экран завершения Teil 1.
   */
  if (finished) {
    return (
      <div className="animate-scale-in py-10">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
            <Trophy className="h-8 w-8 text-teal-700" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Teil 1 завершён
          </h2>

          <p className="mt-3 text-[17px] leading-7 text-slate-600">
            Все 5 тестовых заданий выполнены.
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">
              Heute
            </div>

            <div className="mt-1 text-xl font-bold text-slate-900">
              {progress.dailyCompleted + 1}
            </div>

            <div className="text-sm text-slate-500">
              выполнено
            </div>

            <div className="mt-4 text-sm text-slate-500">
              Erfolgreich
            </div>

            <div className="mt-1 text-xl font-bold text-teal-700">
              {progress.dailySuccessful}
            </div>

            <div className="text-sm text-slate-500">
              полностью правильно
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="mt-7 inline-flex min-h-[54px] items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-[17px] font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5" />
            Вернуться к Lesen
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      {/* Верхняя панель */}
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50"
          aria-label="Назад"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>

        <div>
          <p className="text-sm text-slate-500">
            Lesen · Teil 1
          </p>

          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Aufgabe {currentTaskIndex + 1} / {tasks.length}
          </h2>
        </div>
      </div>

      {/* Инструкция */}
      <div className="mb-6 rounded-2xl border border-teal-200 bg-teal-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal-700" />

          <div className="min-w-0">
            <h3 className="text-[18px] font-semibold leading-7 text-teal-900 sm:text-[19px]">
              {task.title}
            </h3>

            <p className="mt-1 text-[18px] leading-8 text-slate-700">
              {task.instruction}
            </p>
          </div>
        </div>
      </div>

      {/* Визуальная карточка */}
      <div className="mb-7">
        <ReadingVisual task={task} />
      </div>

      {/* Вопросы */}
      <div className="space-y-5">
        {task.questions.map(
          (question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              onAnswer={(correct) =>
                handleAnswer(
                  question.id,
                  correct
                )
              }
              showResult={true}
            />
          )
        )}
      </div>

      {/* Кнопка */}
      <div className="mt-7 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          disabled={!taskComplete}
          className={cn(
            'flex min-h-[54px] items-center gap-2 rounded-xl px-6 py-3 text-[17px] font-semibold transition-all',
            taskComplete
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'cursor-not-allowed bg-slate-100 text-slate-400'
          )}
        >
          {currentTaskIndex <
          tasks.length - 1 ? (
            <>
              Следующее задание
              <ArrowRight className="h-5 w-5" />
            </>
          ) : (
            <>
              Завершить
              <CheckCircle2 className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}