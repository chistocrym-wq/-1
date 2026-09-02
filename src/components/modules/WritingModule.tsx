import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Trophy, RotateCcw, Eye, PenTool, Check } from 'lucide-react';
import { writingTasks } from '@/data/writing';
import { cn } from '@/lib/utils';

interface WritingModuleProps {
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

export function WritingModule({ onBack, onComplete }: WritingModuleProps) {
  const [currentTask, setCurrentTask] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(writingTasks.length).fill(''));
  const [showSample, setShowSample] = useState(false);
  const [checkedPoints, setCheckedPoints] = useState<boolean[][]>(() =>
    writingTasks.map((item) => item.points.map(() => false))
  );
  const [finished, setFinished] = useState(false);

  const task = writingTasks[currentTask];
  const wordCount = answers[currentTask].trim().split(/\s+/).filter(Boolean).length;
  const allPointsChecked = checkedPoints[currentTask].every(Boolean);
  const validWordCount = wordCount >= task.minWords && wordCount <= task.maxWords;

  const handleNext = () => {
    if (currentTask < writingTasks.length - 1) {
      setCurrentTask((t) => t + 1);
      setShowSample(false);
    } else {
      const score = checkedPoints.flat().filter(Boolean).length;
      const total = writingTasks.reduce((sum, item) => sum + item.points.length, 0);
      onComplete(score, total);
      setFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentTask(0);
    setAnswers(Array(writingTasks.length).fill(''));
    setShowSample(false);
    setCheckedPoints(writingTasks.map((item) => item.points.map(() => false)));
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="animate-scale-in flex flex-col items-center justify-center py-12">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 mb-6">
          <Trophy className="w-10 h-10 text-amber-700" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Модуль завершён!</h2>
        <p className="text-slate-500 mb-8 text-center max-w-md">
          Вы прошли все письменные задания. Сравните свои тексты с примерами и оцените себя.
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
          <h2 className="text-xl font-bold text-slate-900">Schreiben</h2>
          <p className="text-sm text-slate-500">Письмо</p>
        </div>
      </div>

      {/* Task indicator */}
      <div className="flex items-center gap-2 mb-6">
        {writingTasks.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-2 flex-1 rounded-full transition-all duration-300',
              i <= currentTask ? 'bg-amber-600' : 'bg-slate-200'
            )}
          />
        ))}
      </div>

      {/* Task info */}
      <div className="rounded-xl p-4 mb-6 bg-amber-50 border border-amber-200">
        <h3 className="font-semibold text-amber-700 mb-1">{task.title}</h3>
        <p className="text-sm text-slate-600">{task.instruction}</p>
      </div>

      {/* Situation */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-4">
        <div className="flex items-start gap-3 mb-3">
          <PenTool className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Ситуация</h4>
            <p className="text-sm text-slate-600">{task.situation}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-700 mb-2">Ваш текст должен включать:</p>
          <ul className="space-y-2">
            {task.points.map((point, i) => {
              return (
                <li key={i} className="flex items-start gap-2">
                  <button
                    onClick={() => setCheckedPoints((prev) => {
                      const next = [...prev];
                      next[currentTask] = [...next[currentTask]];
                      next[currentTask][i] = !next[currentTask][i];
                      return next;
                    })}
                    className={cn(
                      'flex items-center justify-center w-5 h-5 rounded-md border-2 mt-0.5 shrink-0 transition-all',
                      checkedPoints[currentTask][i]
                        ? 'bg-amber-600 border-amber-600 text-white'
                        : 'border-slate-300 hover:border-amber-400'
                    )}
                  >
                    {checkedPoints[currentTask][i] && <Check className="w-3 h-3" />}
                  </button>
                  <span className={cn('text-sm', checkedPoints[currentTask][i] ? 'text-slate-400 line-through' : 'text-slate-700')}>
                    {point}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Text editor */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-slate-900">Ваш ответ</h4>
          <span className={cn(
            'text-xs font-medium px-2.5 py-1 rounded-full',
            wordCount >= task.minWords && wordCount <= task.maxWords
              ? 'bg-emerald-100 text-emerald-700'
              : wordCount > task.maxWords
              ? 'bg-rose-100 text-rose-700'
              : 'bg-slate-100 text-slate-500'
          )}>
            {wordCount} / {task.minWords}–{task.maxWords} слов
          </span>
        </div>
        <textarea
          value={answers[currentTask]}
          onChange={(e) => setAnswers((prev) => {
            const next = [...prev];
            next[currentTask] = e.target.value;
            return next;
          })}
          placeholder="Schreiben Sie hier Ihren Text..."
          className="w-full min-h-[200px] p-4 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none resize-y text-slate-800 leading-relaxed transition-all"
        />
      </div>

      {/* Sample answer */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-6">
        <button
          onClick={() => setShowSample((s) => !s)}
          className="flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
        >
          <Eye className="w-4 h-4" />
          {showSample ? 'Скрыть пример ответа' : 'Показать пример ответа'}
        </button>
        {showSample && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 animate-fade-in">
            <p className="text-xs font-medium text-amber-700 mb-2">Пример:</p>
            <p className="text-slate-700 whitespace-pre-line leading-relaxed">{task.sampleAnswer}</p>
          </div>
        )}
      </div>

      {/* Next button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!allPointsChecked || !validWordCount}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
            allPointsChecked && validWordCount
              ? 'bg-amber-600 text-white hover:opacity-90'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          )}
        >
          {currentTask < writingTasks.length - 1 ? (
            <>Следующее задание <ArrowLeft className="w-4 h-4 rotate-180" /></>
          ) : (
            <><CheckCircle2 className="w-4 h-4" /> Завершить модуль</>
          )}
        </button>
      </div>
    </div>
  );
}
