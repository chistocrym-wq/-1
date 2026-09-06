import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, X, Eye, EyeOff, Trophy } from 'lucide-react';
import { listeningTasks } from '@/data/listening';
import { cn } from '@/lib/utils';

interface ListeningModuleProps {
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

type AnswerState = 'unanswered' | 'correct' | 'wrong';

const PROGRESS_KEY = 'otto-hoeren-progress';

interface SavedProgress {
  currentIndex: number;
  correct: number;
  answered: number;
}

export function ListeningModule({ onBack, onComplete }: ListeningModuleProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (!saved) return 0;

      const parsed: SavedProgress = JSON.parse(saved);

      if (
        typeof parsed.currentIndex === 'number' &&
        parsed.currentIndex >= 0 &&
        parsed.currentIndex < listeningTasks.length
      ) {
        return parsed.currentIndex;
      }
    } catch {
      // ignore broken saved progress
    }

    return 0;
  });

  const [correctCount, setCorrectCount] = useState(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (!saved) return 0;

      const parsed: SavedProgress = JSON.parse(saved);
      return typeof parsed.correct === 'number' ? parsed.correct : 0;
    } catch {
      return 0;
    }
  });

  const [answeredCount, setAnsweredCount] = useState(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (!saved) return 0;

      const parsed: SavedProgress = JSON.parse(saved);
      return typeof parsed.answered === 'number' ? parsed.answered : 0;
    } catch {
      return 0;
    }
  });

  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [selectedAnswer, setSelectedAnswer] = useState<number | boolean | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [finished, setFinished] = useState(false);

  const task = listeningTasks[currentIndex];

  const audioSrc = useMemo(
    () => `/audio/${String(task.number).padStart(3, '0')}.mp3`,
    [task.number]
  );

  const imageSrc = useMemo(
    () => `/images/${String(task.number).padStart(3, '0')}.png`,
    [task.number]
  );

  const saveProgress = (
    nextIndex: number,
    nextCorrect: number,
    nextAnswered: number
  ) => {
    const progress: SavedProgress = {
      currentIndex: nextIndex,
      correct: nextCorrect,
      answered: nextAnswered,
    };

    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  };

  useEffect(() => {
    setAnswerState('unanswered');
    setSelectedAnswer(null);
    setShowTranscript(false);

    const audio = document.getElementById(
      'otto-hoeren-audio'
    ) as HTMLAudioElement | null;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [currentIndex]);

  const handleAnswer = (value: number | boolean) => {
    if (answerState !== 'unanswered') return;

    let correct = false;

    if (task.type === 'multiple-choice') {
      correct = value === task.correctIndex;
    } else {
      correct = value === task.correctAnswer;
    }

    setSelectedAnswer(value);
    setAnswerState(correct ? 'correct' : 'wrong');

    const nextAnswered = answeredCount + 1;
    const nextCorrect = correct ? correctCount + 1 : correctCount;

    setAnsweredCount(nextAnswered);
    setCorrectCount(nextCorrect);

    saveProgress(currentIndex, nextCorrect, nextAnswered);
  };

  const getExplanation = () => {
    if (task.type === 'multiple-choice') {
      const correctOption = task.options[task.correctIndex];

      return `Правильный ответ: ${String.fromCharCode(65 + task.correctIndex)}) ${correctOption}.`;
    }

    return `Правильный ответ: ${task.correctAnswer ? 'Richtig' : 'Falsch'}.`;
  };

  const handleNext = () => {
    if (answerState === 'unanswered') return;

    if (currentIndex < listeningTasks.length - 1) {
      const nextIndex = currentIndex + 1;

      setCurrentIndex(nextIndex);

      saveProgress(nextIndex, correctCount, answeredCount);
      return;
    }

    const total = answeredCount;
    onComplete(correctCount, total);
    setFinished(true);
  };

  const handleRestart = () => {
    localStorage.removeItem(PROGRESS_KEY);

    setCurrentIndex(0);
    setCorrectCount(0);
    setAnsweredCount(0);
    setAnswerState('unanswered');
    setSelectedAnswer(null);
    setShowTranscript(false);
    setFinished(false);
  };

  if (finished) {
    const percent =
      answeredCount > 0
        ? Math.round((correctCount / answeredCount) * 100)
        : 0;

    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center px-4 py-10 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sky-50">
          <Trophy className="h-10 w-10 text-sky-600" />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-slate-900">
          Hören abgeschlossen!
        </h2>

        <p className="mb-2 text-slate-500">
          Правильных ответов: {correctCount} из {answeredCount}
        </p>

        <div className="mb-8 text-5xl font-bold text-sky-600">
          {percent}%
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={handleRestart}
            className="rounded-xl bg-slate-100 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Пройти заново
          </button>

          <button
            onClick={onBack}
            className="rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
          >
            К модулям
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / listeningTasks.length) * 100;

  const isChoiceCorrect = (index: number) =>
    answerState !== 'unanswered' && task.type === 'multiple-choice'
      ? index === task.correctIndex
      : false;

  const isChoiceWrong = (index: number) =>
    answerState === 'wrong' &&
    task.type === 'multiple-choice' &&
    selectedAnswer === index &&
    index !== task.correctIndex;

  const isTrueFalseCorrect = (value: boolean) =>
    answerState !== 'unanswered' &&
    task.type === 'true-false' &&
    value === task.correctAnswer;

  const isTrueFalseWrong = (value: boolean) =>
    answerState === 'wrong' &&
    task.type === 'true-false' &&
    selectedAnswer === value &&
    value !== task.correctAnswer;

  return (
    <div className="animate-fade-in">
      {/* Верхняя панель */}
      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-slate-900">Hören</h2>
          <p className="text-sm text-slate-500">
            Задание {currentIndex + 1} из {listeningTasks.length}
          </p>
        </div>

        <div className="text-sm font-semibold text-sky-600">
          {Math.round(progressPercent)}%
        </div>
      </div>

      {/* Прогресс */}
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-sky-600 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Заголовок задания */}
      <div className="mb-5 rounded-2xl border border-sky-200 bg-sky-50 p-4">
        <div className="mb-1 text-sm font-semibold text-sky-700">
          Aufgabe {task.number} · {task.title}
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          {task.instruction}
        </p>
      </div>

      {/* Аудио */}
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <audio
          id="otto-hoeren-audio"
          key={audioSrc}
          controls
          preload="metadata"
          src={audioSrc}
          className="w-full"
        />

        <button
          onClick={() => setShowTranscript((value) => !value)}
          className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-sky-600"
        >
          {showTranscript ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}

          {showTranscript
            ? 'Скрыть текст аудио'
            : 'Показать текст аудио'}
        </button>

        {showTranscript && (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            {task.audioText}
          </div>
        )}
      </div>

      {/* Картинка задания */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <img
          src={imageSrc}
          alt={`Aufgabe ${task.number}`}
          className="block h-auto w-full"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Ответы */}
      {task.type === 'multiple-choice' ? (
        <div className="space-y-3">
          {task.options.map((option, index) => {
            const correct = isChoiceCorrect(index);
            const wrong = isChoiceWrong(index);

            return (
              <button
                key={option}
                disabled={answerState !== 'unanswered'}
                onClick={() => handleAnswer(index)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border-2 px-4 py-4 text-left font-medium !text-slate-800 transition-all',

                  answerState === 'unanswered' &&
                    'border-slate-200 bg-white !text-slate-800 hover:border-sky-400 hover:bg-sky-50',

                  correct &&
                    'border-emerald-400 bg-emerald-50 text-emerald-800',

                  wrong &&
                    'border-rose-400 bg-rose-50 text-rose-800',

                  answerState !== 'unanswered' &&
                    !correct &&
                    !wrong &&
                    'border-slate-200 bg-white opacity-60'
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold',

                    answerState === 'unanswered' &&
                      'border-slate-300 text-slate-500',

                    correct &&
                      'border-emerald-500 bg-emerald-500 text-white',

                    wrong &&
                      'border-rose-500 bg-rose-500 text-white'
                  )}
                >
                  {correct ? (
                    <Check className="h-4 w-4" />
                  ) : wrong ? (
                    <X className="h-4 w-4" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>

                <span className="!text-slate-800">{option}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            disabled={answerState !== 'unanswered'}
            onClick={() => handleAnswer(true)}
            className={cn(
              'rounded-xl border-2 px-4 py-4 font-semibold !text-slate-800 transition-all',

              answerState === 'unanswered' &&
                'border-slate-200 bg-white !text-slate-800 hover:border-sky-400 hover:bg-sky-50',

              isTrueFalseCorrect(true) &&
                'border-emerald-400 bg-emerald-50 text-emerald-800',

              isTrueFalseWrong(true) &&
                'border-rose-400 bg-rose-50 text-rose-800',

              answerState !== 'unanswered' &&
                !isTrueFalseCorrect(true) &&
                !isTrueFalseWrong(true) &&
                'border-slate-200 bg-white opacity-60'
            )}
          >
            {isTrueFalseCorrect(true) && (
              <Check className="mr-2 inline h-4 w-4" />
            )}

            {isTrueFalseWrong(true) && (
              <X className="mr-2 inline h-4 w-4" />
            )}

            Richtig
          </button>

          <button
            disabled={answerState !== 'unanswered'}
            onClick={() => handleAnswer(false)}
            className={cn(
              'rounded-xl border-2 px-4 py-4 font-semibold !text-slate-800 transition-all',

              answerState === 'unanswered' &&
                'border-slate-200 bg-white !text-slate-800 hover:border-sky-400 hover:bg-sky-50',

              isTrueFalseCorrect(false) &&
                'border-emerald-400 bg-emerald-50 text-emerald-800',

              isTrueFalseWrong(false) &&
                'border-rose-400 bg-rose-50 text-rose-800',

              answerState !== 'unanswered' &&
                !isTrueFalseCorrect(false) &&
                !isTrueFalseWrong(false) &&
                'border-slate-200 bg-white opacity-60'
            )}
          >
            {isTrueFalseCorrect(false) && (
              <Check className="mr-2 inline h-4 w-4" />
            )}

            {isTrueFalseWrong(false) && (
              <X className="mr-2 inline h-4 w-4" />
            )}

            Falsch
          </button>
        </div>
      )}

      {/* Результат */}
      {answerState !== 'unanswered' && (
        <div
          className={cn(
            'mt-5 rounded-2xl border p-4',

            answerState === 'correct' &&
              'border-emerald-200 bg-emerald-50',

            answerState === 'wrong' &&
              'border-rose-200 bg-rose-50'
          )}
        >
          <div className="mb-2 flex items-center gap-2 font-semibold">
            {answerState === 'correct' ? (
              <>
                <Check className="h-5 w-5 text-emerald-600" />
                <span className="text-emerald-700">Правильно!</span>
              </>
            ) : (
              <>
                <X className="h-5 w-5 text-rose-600" />
                <span className="text-rose-700">Неправильно</span>
              </>
            )}
          </div>

          <p className="text-sm leading-relaxed text-slate-700">
            {getExplanation()}
          </p>

          {answerState === 'wrong' && (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              <strong>Почему:</strong>{' '}
              {task.type === 'multiple-choice'
                ? `В аудио есть информация, по которой правильный ответ — «${
                    task.options[task.correctIndex]
                  }».`
                : task.correctAnswer
                ? 'В аудио подтверждается это утверждение.'
                : 'В аудио говорится обратное, поэтому утверждение неверно.'}
            </p>
          )}
        </div>
      )}

      {/* Следующее */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNext}
          disabled={answerState === 'unanswered'}
          className={cn(
            'rounded-xl px-6 py-3 font-medium transition-all',

            answerState !== 'unanswered'
              ? 'bg-sky-600 text-white hover:bg-sky-700'
              : 'cursor-not-allowed bg-slate-100 text-slate-400'
          )}
        >
          {currentIndex < listeningTasks.length - 1
            ? 'Следующее задание →'
            : 'Завершить Hören'}
        </button>
      </div>
    </div>
  );
}