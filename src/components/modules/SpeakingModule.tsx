import { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Trophy, RotateCcw, Mic, Square, Eye, Clock } from 'lucide-react';
import { speakingTasks } from '@/data/speaking';
import { cn } from '@/lib/utils';

interface SpeakingModuleProps {
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

export function SpeakingModule({ onBack, onComplete }: SpeakingModuleProps) {
  const [currentTask, setCurrentTask] = useState(0);
  const [showSample, setShowSample] = useState(false);
  const [finished, setFinished] = useState(false);
  const [practiced, setPracticed] = useState<boolean[]>(() => speakingTasks.map(() => false));

  const task = speakingTasks[currentTask];

  const handleNext = () => {
    if (currentTask < speakingTasks.length - 1) {
      setCurrentTask((t) => t + 1);
      setShowSample(false);
    } else {
      onComplete(practiced.filter(Boolean).length, speakingTasks.length);
      setFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentTask(0);
    setShowSample(false);
    setFinished(false);
    setPracticed(speakingTasks.map(() => false));
  };

  if (finished) {
    return (
      <div className="animate-scale-in flex flex-col items-center justify-center py-12">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-rose-50 mb-6">
          <Trophy className="w-10 h-10 text-rose-700" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Модуль завершён!</h2>
        <p className="text-slate-500 mb-8 text-center max-w-md">
          Вы прошли все задания по устной речи. Регулярная практика — ключ к успеху на экзамене.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Пройти заново
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            К модулям
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-slate-900">Sprechen</h2>
          <p className="text-sm text-slate-500">Говорение</p>
        </div>
      </div>

      {/* Task indicator */}
      <div className="flex items-center gap-2 mb-6">
        {speakingTasks.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-2 flex-1 rounded-full transition-all duration-300',
              i <= currentTask ? 'bg-rose-600' : 'bg-slate-200'
            )}
          />
        ))}
      </div>

      {/* Task info */}
      <div className="rounded-xl p-4 mb-6 bg-rose-50 border border-rose-200">
        <h3 className="font-semibold text-rose-700 mb-1">{task.title}</h3>
        <p className="text-sm text-slate-600">{task.instruction}</p>
      </div>

      {/* Prompts */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-4">
        <h4 className="font-semibold text-slate-900 mb-3">Вопросы / Темы</h4>
        <div className="space-y-2">
          {task.prompts.map((prompt, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-slate-700 pt-0.5">{prompt}</p>
            </div>
          ))}
        </div>
        {task.keywords && (
          <div className="mt-4 flex flex-wrap gap-2">
            {task.keywords.map((kw, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-medium">
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Recorder */}
      <PracticeTimer
        key={task.id}
        onPracticed={() => setPracticed((previous) => {
          const next = [...previous];
          next[currentTask] = true;
          return next;
        })}
      />

      {/* Sample answer */}
      {task.sampleAnswer && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-6">
          <button
            onClick={() => setShowSample((s) => !s)}
            className="flex items-center gap-2 text-sm font-medium text-rose-700 hover:text-rose-800 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showSample ? 'Скрыть пример ответа' : 'Показать пример ответа'}
          </button>
          {showSample && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 animate-fade-in">
              <p className="text-xs font-medium text-rose-700 mb-2">Пример:</p>
              <p className="text-slate-700 leading-relaxed">{task.sampleAnswer}</p>
            </div>
          )}
        </div>
      )}

      {/* Next button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!practiced[currentTask]}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
            practiced[currentTask]
              ? 'bg-rose-600 text-white hover:opacity-90'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          )}
        >
          {currentTask < speakingTasks.length - 1 ? (
            <>Следующее задание <ArrowLeft className="w-4 h-4 rotate-180" /></>
          ) : (
            <><CheckCircle2 className="w-4 h-4" /> Завершить модуль</>
          )}
        </button>
      </div>
    </div>
  );
}

function PracticeTimer({ onPracticed }: { onPracticed: () => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setHasRecording(true);
    onPracticed();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [onPracticed]);

  const resetRecording = useCallback(() => {
    setElapsed(0);
    setHasRecording(false);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-4">
      <h4 className="font-semibold text-slate-900 mb-1">Таймер практики</h4>
      <p className="text-sm text-slate-500 mb-4">
        При желании включите диктофон телефона отдельно, затем ответьте вслух. Эта кнопка измеряет только время.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={cn(
            'flex items-center justify-center w-16 h-16 rounded-full transition-all hover:scale-105',
            isRecording
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-rose-50 text-rose-600 border-2 border-rose-200'
          )}
        >
          {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-7 h-7" />}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-2xl font-bold text-slate-900 tabular-nums">{formatTime(elapsed)}</span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {isRecording ? 'Идёт практика...' : hasRecording ? 'Практика завершена' : 'Нажмите для старта'}
          </p>
        </div>
        {hasRecording && !isRecording && (
          <button
            onClick={resetRecording}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Сбросить
          </button>
        )}
      </div>
      {hasRecording && !isRecording && elapsed > 0 && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-sm text-emerald-700">
            Отлично! Вы говорили {formatTime(elapsed)}. Рекомендуется 1–3 минуты на каждый ответ.
          </span>
        </div>
      )}
    </div>
  );
}
