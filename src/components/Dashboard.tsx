import { useState, useRef, useEffect } from 'react';
import { BookOpen, Headphones, PenTool, Mic, GraduationCap, Info, Award, FileCheck, Globe, ChevronDown } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  const currentLang = languages.find((l) => l.id === lang) || languages[0];

  // Закрывать выпадающий список при клике вне его
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 px-4 py-6 sm:px-12 sm:py-16 mb-8 shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* Выпадающий список языков в правом верхнем углу */}
        <div className="absolute top-4 right-4 z-20" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-2 rounded-xl border border-white/30 text-white shadow-sm transition-all text-xs font-semibold"
          >
            <Globe className="w-4 h-4 text-white" />
            <span>{currentLang.flag} {currentLang.label}</span>
            <ChevronDown className={cn('w-3.5 h-3.5 text-white/80 transition-transform duration-200', isOpen && 'rotate-180')} />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-30 animate-fade-in max-h-80 overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Язык интерфейса
              </div>
              {languages.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setLang(l.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left transition-colors',
                    lang === l.id ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{l.flag}</span>
                    <span>{l.label}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">{l.id}</span>
                </button>
              ))}
            </div>
          )}
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