import { BookOpen, Headphones, PenTool, Mic, GraduationCap, Info, Award, FileCheck } from 'lucide-react';
import type { ModuleId, Progress } from '@/types';
import { ProgressBar } from '@/components/ProgressBar';
import { cn } from '@/lib/utils';

interface DashboardProps {
  onSelectModule: (module: ModuleId) => void;
  onOpenInstructions: () => void;
  onOpenExamGuide: () => void;
  onOpenMockExam: () => void;
  progress: Progress;
}

interface ModuleCard {
  id: ModuleId;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof BookOpen;
  color: string;
  bgColor: string;
  borderColor: string;
}

const modules: ModuleCard[] = [
  {
    id: 'lesen',
    title: 'Lesen',
    subtitle: 'Чтение',
    description: 'Тексты, письма, объявления — понимание прочитанного',
    icon: BookOpen,
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },
  {
    id: 'horen',
    title: 'Hören',
    subtitle: 'Аудирование',
    description: 'Короткие диалоги и разговоры — понимание на слух',
    icon: Headphones,
    color: 'text-sky-700',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
  },
  {
    id: 'schreiben',
    title: 'Schreiben',
    subtitle: 'Письмо',
    description: 'Электронные письма, сообщения, заполнение форм',
    icon: PenTool,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    id: 'sprechen',
    title: 'Sprechen',
    subtitle: 'Говорение',
    description: 'Представление, темы, просьбы — устная речь',
    icon: Mic,
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
];

export function Dashboard({ onSelectModule, onOpenInstructions, onOpenExamGuide, onOpenMockExam, progress }: DashboardProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 px-6 py-12 sm:px-12 sm:py-16 mb-8 shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-white/90 font-medium text-lg">Goethe-Zertifikat A1</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              Тренажёр Отто
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mb-6">
              Четыре модуля для комплексной подготовки: чтение, аудирование, письмо и говорение.
              Тренируйтесь в своём темпе, сразу исправляйте ошибки и отслеживайте прогресс.
            </p>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <img
              src="/photo_5228950309122547432_c.jpg"
              alt="Отто — помощник для изучения немецкого"
              className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl object-cover object-top shadow-xl ring-4 ring-white/30"
            />
            <p className="text-white/90 text-sm font-semibold mt-2.5 text-center">Ваш помощник</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <button
          onClick={onOpenInstructions}
          className="group flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-5 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-slide-up"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 shrink-0 transition-transform group-hover:scale-110">
            <Info className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Инструкция</h3>
            <p className="text-sm text-slate-500">Как заниматься с тренажёром</p>
          </div>
        </button>

        <button
          onClick={onOpenExamGuide}
          className="group flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-5 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-slide-up"
          style={{ animationDelay: '60ms' }}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 shrink-0 transition-transform group-hover:scale-110">
            <Award className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Гайды и помощники</h3>
            <p className="text-sm text-slate-500">Материалы для успешной сдачи экзамена</p>
          </div>
        </button>

        <button
          onClick={onOpenMockExam}
          className="group flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-5 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-slide-up"
          style={{ animationDelay: '120ms' }}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 shrink-0 transition-transform group-hover:scale-110">
            <FileCheck className="w-6 h-6 text-sky-700" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Тестовый экзамен</h3>
            <p className="text-sm text-slate-500">Проверьте готовность</p>
          </div>
        </button>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {modules.map((mod, idx) => {
          const p = progress[mod.id];
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className={cn(
                'group relative overflow-hidden rounded-2xl border-2 bg-white p-6 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up',
                mod.borderColor
              )}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={cn('flex items-center justify-center w-14 h-14 rounded-xl shrink-0 transition-transform group-hover:scale-110', mod.bgColor)}>
                  <Icon className={cn('w-7 h-7', mod.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-slate-900">{mod.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">{mod.subtitle}</p>
                </div>
                {p?.completed ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    Пройдено
                  </span>
                ) : null}
              </div>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{mod.description}</p>
              {p && (
                <div className="flex justify-end mb-2">
                  <span className="text-xs font-medium text-slate-400">
                    лучший: {p.bestScore}% · попыток: {p.attempts}
                  </span>
                </div>
              )}
              <ProgressBar value={p?.completed ?? 0} max={1} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
