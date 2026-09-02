import { useState } from 'react';
import { BookOpen, Headphones, PenTool, Mic, GraduationCap, Info, Award, FileCheck, Globe } from 'lucide-react';
import type { ModuleId, Progress } from '@/types';
import { ProgressBar } from '@/components/ProgressBar';
import { cn } from '@/lib/utils';
import { languages, translations, type Language } from '../i18n';

interface DashboardProps {
  onSelectModule: (module: ModuleId) => void;
  onOpenInstructions: () => void;
  onOpenExamGuide: () => void;
  onOpenMockExam: () => void;
  progress: Progress;
}

export function Dashboard({ onSelectModule, onOpenInstructions, onOpenExamGuide, onOpenMockExam, progress }: DashboardProps) {
  const [lang, setLang] = useState<Language>('ru');
  const t = translations[lang];

  return (
    <div className="animate-fade-in">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 px-4 py-6 sm:px-12 sm:py-16 mb-8 shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* Панель выбора 11 языков с прокруткой */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-white/15 backdrop-blur-md p-1.5 rounded-xl border border-white/20 max-w-[240px] sm:max-w-none overflow-x-auto">
          <Globe className="w-4 h-4 text-white ml-1 shrink-0" />
          {languages.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={cn(
                'px-2 py-1 text-xs font-semibold rounded-lg transition-all shrink-0',
                lang === l.id ? 'bg-white text-teal-800 shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'
              )}
            >
              {l.flag} {l.id.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left pt-12 sm:pt-0">
          
          {/* Картинка Отто */}
          <div className="flex flex-col items-center shrink-0 order-1 sm:order-2">
            <img
              src="/otto.png" 
              alt="Отто — помощник для изучения немецкого"
              className="h-44 w-44 sm:h-48 sm:w-48 rounded-2xl object-contain object-center drop-shadow-2xl"
            />
            <div className="mt-2.5 text-center">
              <p className="text-white/90 text-sm font-semibold">{t.assistant}</p>
              <p className="text-white/75 text-xs">{t.assistantSub}</p>
            </div>
          </div>

          {/* Текстовая часть */}
          <div className="flex-1 min-w-0 order-2 sm:order-1">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-white/90 font-medium text-lg">{t.subtitle}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              {t.title}
            </h1>
            <p className="text-white/80 text-sm sm:text-lg max-w-2xl mb-6 leading-relaxed">
              {t.description}
            </p>
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
            <h3 className="font-semibold text-slate-900">{t.instructions}</h3>
            <p className="text-sm text-slate-500">{t.instructionsSub}</p>
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
            <h3 className="font-semibold text-slate-900">{t.examGuide}</h3>
            <p className="text-sm text-slate-500">{t.examGuideSub}</p>
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
            <h3 className="font-semibold text-slate-900">{t.mockExam}</h3>
            <p className="text-sm text-slate-500">{t.mockExamSub}</p>
          </div>
        </button>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[
          { id: 'horen' as ModuleId, title: t.horenTitle, subtitle: t.horenSub, desc: t.horenDesc, icon: Headphones, color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' },
          { id: 'schreiben' as ModuleId, title: t.schreibenTitle, subtitle: t.schreibenSub, desc: t.schreibenDesc, icon: PenTool, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
          { id: 'sprechen' as ModuleId, title: t.sprechenTitle, subtitle: t.sprechenSub, desc: t.sprechenDesc, icon: Mic, color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
          { id: 'lesen' as ModuleId, title: t.lesenTitle, subtitle: t.lesenSub, desc: t.lesenDesc, icon: BookOpen, color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' },
        ].map((mod, idx) => {
          const p = progress[mod.id];
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className={cn(
                'group relative overflow-hidden rounded-2xl border-2 bg-white p-6 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up',
                mod.border
              )}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={cn('flex items-center justify-center w-14 h-14 rounded-xl shrink-0 transition-transform group-hover:scale-110', mod.bg)}>
                  <Icon className={cn('w-7 h-7', mod.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-slate-900">{mod.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">{mod.subtitle}</p>
                </div>
                {p?.completed ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    {t.completed}
                  </span>
                ) : null}
              </div>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{mod.desc}</p>
              {p && (
                <div className="flex justify-end mb-2">
                  <span className="text-xs font-medium text-slate-400">
                    {t.best}: {p.bestScore}% · {t.attempts}: {p.attempts}
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