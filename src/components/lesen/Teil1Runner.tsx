import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Languages } from 'lucide-react';
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
  const [correctAnswers, setCorrectAnswers] =
    useState<Record<string, boolean>>({});

  const [showInstructionTranslation, setShowInstructionTranslation] =
    useState(false);

  const [showQuestionTranslations, setShowQuestionTranslations] =
    useState<Record<string, boolean>>({});

  const task = tasks[currentTaskIndex];

  if (!task) {
    return null;
  }

  const taskComplete = task.questions.every(
    (question) => answered[question.id]
  );

  const taskSuccessful = task.questions.every(
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

  const toggleQuestionTranslation = (questionId: string) => {
    setShowQuestionTranslations((previous) => ({
      ...previous,
      [questionId]: !previous[questionId],
    }));
  };

  const handleNext = () => {
    if (!taskComplete) {
      return;
    }

    record(currentTaskIndex, taskSuccessful);

    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex((previous) => previous + 1);
      setAnswered({});
      setCorrectAnswers({});
      setShowInstructionTranslation(false);
      setShowQuestionTranslations({});
      return;
    }

    onComplete(
      progress.dailySuccessful + (taskSuccessful ? 1 : 0),
      progress.dailyCompleted + 1
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Верхняя панель */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white transition-colors hover:bg-slate-50"
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

          <div className="min-w-0 flex-1">
            <h3 className="text-[18px] font-semibold leading-7 text-teal-900 sm:text-[19px]">
              {task.title}
            </h3>

            <p className="mt-1 text-[18px] leading-8 text-slate-700">
              {task.instruction}
            </p>

            {task.instructionRu && showInstructionTranslation && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-4">
                <div className="mb-1 text-sm font-semibold text-slate-500">
                  Перевод
                </div>

                <p className="text-[17px] leading-7 text-slate-700">
                  {task.instructionRu}
                </p>
              </div>
            )}

            {task.instructionRu && (
              <button
                type="button"
                onClick={() =>
                  setShowInstructionTranslation(
                    (previous) => !previous
                  )
                }
                className="mt-4 inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2 text-[16px] font-semibold text-teal-700 transition-colors hover:bg-teal-50"
              >
                <Languages className="h-4 w-4" />

                {showInstructionTranslation
                  ? 'Скрыть перевод'
                  : 'Перевод задания'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Визуальный источник */}
      <div className="mb-7">
        <ReadingVisual task={task} />
      </div>

      {/* Вопросы */}
      <div className="space-y-5">
        {task.questions.map((question, index) => (
          <div key={question.id}>
            <QuestionCard
              question={question}
              index={index}
              onAnswer={(correct) =>
                handleAnswer(question.id, correct)
              }
              showResult={true}
            />

            {question.promptRu && (
              <div className="mt-2 px-1">
                <button
                  type="button"
                  onClick={() =>
                    toggleQuestionTranslation(question.id)
                  }
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-lg px-2 py-1 text-[15px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-teal-700"
                >
                  <Languages className="h-4 w-4" />

                  {showQuestionTranslations[question.id]
                    ? 'Скрыть перевод'
                    : 'Перевод вопроса'}
                </button>

                {showQuestionTranslations[question.id] && (
                  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="mb-1 text-sm font-semibold text-slate-500">
                      Перевод
                    </div>

                    <p className="text-[17px] leading-7 text-slate-700">
                      {question.promptRu}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Следующее задание */}
      <div className="mt-7 flex justify-end">
        <button
          onClick={handleNext}
          disabled={!taskComplete}
          className={cn(
            'flex min-h-[54px] items-center gap-2 rounded-xl px-6 py-3 text-[17px] font-semibold transition-all',
            taskComplete
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'cursor-not-allowed bg-slate-100 text-slate-400'
          )}
        >
          {currentTaskIndex < tasks.length - 1 ? (
            <>
              Следующее задание
              <ArrowRight className="h-5 w-5" />
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Завершить
            </>
          )}
        </button>
      </div>
    </div>
  );
}