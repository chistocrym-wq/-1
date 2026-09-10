import { useState, useRef, useEffect } from 'react';
import { BookOpen, Headphones, PenTool, Mic, GraduationCap, Info, Award, FileCheck, Globe, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickActions = [
    { onClick: onOpenInstructions, icon: Info, title: t.instructions, sub: t.instructionsSub },
    { onClick: onOpenExamGuide, icon: Award, title: t.examGuide, sub: t.examGuideSub },
    { onClick: onOpenMockExam, icon: FileCheck, title: t.mockExam, sub: t.mockExamSub },
  ];

  const modules = [
    { id: 'schreiben' as ModuleId, title: t.schreibenTitle, subtitle: t.schreibenSub, desc: t.schreibenDesc, icon: PenTool },
    { id: 'sprechen' as ModuleId, title: t.sprechenTitle, subtitle: t.sprechenSub, desc: t.sprechenDesc, icon: Mic },
    { id: 'lesen' as ModuleId, title: t.lesenTitle, subtitle: t.lesenSub, desc: t.lesenDesc, icon: BookOpen },
    { id: 'horen' as ModuleId, title: t.horenTitle, subtitle: t.horenSub, desc: t.horenDesc, icon: Headphones },
  ];

  return (
    <main className="otto-home animate-fade-in">
      <header className="otto-topbar">
        <div className="otto-brand">
          <div className="otto-brand-mark"><Sparkles className="h-4 w-4" /></div>
          <div>
            <div className="otto-brand-title">Тренажёр Отто</div>
            <div className="otto-brand-subtitle">{t.subtitle}</div>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Выбрать язык"
            className="otto-language-button"
          >
            <Globe className="h-4 w-4" />
            <span>{currentLang.flag} {currentLang.label}</span>
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')} />
          </button>
          {isOpen && (
            <div className="otto-language-menu animate-scale-in">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Язык интерфейса</div>
              {languages.map((l) => (
                <button
                  key={l.id}
                  onClick={() => { setLang(l.id); setIsOpen(false); }}
                  className={cn('otto-language-option', lang === l.id && 'is-active')}
                >
                  <span className="flex items-center gap-2.5"><span className="text-base">{l.flag}</span><span>{l.label}</span></span>
                  <span className="text-[10px] uppercase text-slate-400">{l.id}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <section className="otto-hero">
        <div className="otto-hero-glow" aria-hidden="true" />
        <div className="otto-hero-copy">
          <div className="otto-eyebrow"><GraduationCap className="h-4 w-4" /> {t.subtitle}</div>
          <h1>{t.title}</h1>
          <p>{t.description}</p>
        </div>
        <div className="otto-character-wrap">
          <div className="otto-character-ring" aria-hidden="true" />
          <img src="/otto.png" alt="Отто — помощник для изучения немецкого" className="otto-character" />
          <div className="otto-character-label">
            <strong>{t.assistant}</strong>
            <span>{t.assistantSub}</span>
          </div>
        </div>
      </section>

      <section className="otto-section">
        <div className="otto-section-heading">
          <div>
            <span className="otto-section-kicker">START</span>
            <h2>Начните с нужного раздела</h2>
          </div>
        </div>
        <div className="otto-quick-grid">
          {quickActions.map(({ onClick, icon: Icon, title, sub }) => (
            <button key={title} onClick={onClick} className="otto-quick-card group">
              <span className="otto-quick-icon"><Icon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1">
                <strong>{title}</strong>
                <small>{sub}</small>
              </span>
              <ArrowRight className="otto-card-arrow" />
            </button>
          ))}
        </div>
      </section>

      <section className="otto-section otto-modules-section">
        <div className="otto-section-heading">
          <div>
            <span className="otto-section-kicker">GOETHE A1</span>
            <h2>Модули экзамена</h2>
          </div>
          <span className="otto-module-count">4 модуля</span>
        </div>

        <div className="otto-module-grid">
          {modules.map(({ id, title, subtitle, desc, icon: Icon }, idx) => {
            const p = progress[id];
            return (
              <button
                key={id}
                onClick={() => onSelectModule(id)}
                className="otto-module-card group animate-slide-up"
                style={{ animationDelay: `${idx * 70}ms` }}
              >
                <div className="otto-module-head">
                  <span className="otto-module-icon"><Icon className="h-6 w-6" /></span>
                  <span className="min-w-0 flex-1 text-left">
                    <strong>{title}</strong>
                    <small>{subtitle}</small>
                  </span>
                  {p?.completed && <span className="otto-completed">{t.completed}</span>}
                </div>
                <p>{desc}</p>
                {p && (
                  <div className="otto-module-meta">
                    <span>{t.best}: {p.bestScore}%</span>
                    <span>{t.attempts}: {p.attempts}</span>
                  </div>
                )}
                <div className="otto-module-bottom">
                  <ProgressBar value={p?.completed ?? 0} max={1} />
                  <ArrowRight className="otto-module-arrow" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
