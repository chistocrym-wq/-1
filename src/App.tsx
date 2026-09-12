import { useCallback, useEffect, useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { Instructions } from '@/components/Instructions';
import { ExamGuide } from '@/components/ExamGuide';
import { MockExam } from '@/components/MockExam';
import { ReadingModule } from '@/components/modules/ReadingModule';
import { ListeningModule } from '@/components/modules/ListeningModule';
import { SpeakingModule } from '@/components/modules/SpeakingModule';
import { useProgress } from '@/hooks/useProgress';
import { LesenHome } from '@/components/lesen/LesenHome';
import { SchreibenHomeV2 } from '@/components/schreiben/SchreibenHomeV2';
import { SchreibenTeil1Runner } from '@/components/schreiben/SchreibenTeil1Runner';
import { SchreibenTeil2 } from '@/components/schreiben/SchreibenTeil2';
import { schreibenTeil2Tasks } from '@/data/schreiben/teil2';
import type { ModuleId } from '@/types';
import { Teil2Runner } from '@/components/lesen/Teil2Runner';
import { lesenTeil2Tasks } from '@/data/lesen/teil2';

type View = ModuleId | 'instructions' | 'exam-guide' | 'mock-exam' | null;
type SchreibenScreen = 'home' | 'teil1' | 'teil2';

export default function App() {
  const [view, setView] = useState<View>(null);
  const [lesenScreen, setLesenScreen] = useState<'home' | 'teil1' | 'teil2'>('home');
  const [schreibenScreen, setSchreibenScreen] = useState<SchreibenScreen>('home');
  const [showSplash, setShowSplash] = useState(true);
  const [showOtto, setShowOtto] = useState(false);
  const [dissolveSplash, setDissolveSplash] = useState(false);
  const { progress, recordScore, markCompleted } = useProgress();

  useEffect(() => {
    const reveal = window.setTimeout(() => setShowOtto(true), 1800);
    const dissolve = window.setTimeout(() => setDissolveSplash(true), 6500);
    const finish = window.setTimeout(() => setShowSplash(false), 7800);
    return () => { window.clearTimeout(reveal); window.clearTimeout(dissolve); window.clearTimeout(finish); };
  }, []);

  const handleBack = useCallback(() => { setLesenScreen('home'); setSchreibenScreen('home'); setView(null); }, []);
  useEffect(() => { const telegram = window.Telegram?.WebApp; if (!telegram) return; telegram.ready(); telegram.expand(); }, []);
  useEffect(() => { const backButton = window.Telegram?.WebApp.BackButton; if (!backButton) return; if (view === null) { backButton.hide(); return; } backButton.show(); backButton.onClick(handleBack); return () => backButton.offClick(handleBack); }, [handleBack, view]);
  const handleComplete = (mod: ModuleId) => (score: number, total: number) => { if (mod === 'sprechen') markCompleted(mod, total); else recordScore(mod, score, total); };

  const shellClass = `telegram-app min-h-screen ${view !== null ? 'trainer-blue' : ''} ${view === 'schreiben' ? 'schreiben-shell' : ''}`;
  return <>
    {showSplash && <div className={`otto-splash ${dissolveSplash ? 'otto-splash--dissolve' : ''}`} aria-hidden="true">
      <div className="otto-splash__glow" />
      <img className={`otto-splash__character ${showOtto ? 'otto-splash__character--visible' : ''}`} src="/otto.png" alt="" />
      <div className="otto-splash__particles">{Array.from({ length: 32 }, (_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</div>
    </div>}
    <div className={shellClass}><div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      {view === null && <Dashboard onSelectModule={(mod) => { setView(mod); if (mod === 'schreiben') setSchreibenScreen('home'); }} onOpenInstructions={() => setView('instructions')} onOpenExamGuide={() => setView('exam-guide')} onOpenMockExam={() => setView('mock-exam')} progress={progress} />}
      {view === 'instructions' && <Instructions onBack={handleBack} />}
      {view === 'exam-guide' && <ExamGuide onBack={handleBack} />}
      {view === 'mock-exam' && <MockExam onBack={handleBack} />}
      {view === 'lesen' && lesenScreen === 'home' && <LesenHome onStartTeil1={() => setLesenScreen('teil1')} onStartTeil2={() => setLesenScreen('teil2')} />}
      {view === 'lesen' && lesenScreen === 'teil1' && <ReadingModule onBack={() => setLesenScreen('home')} onComplete={handleComplete('lesen')} />}
      {view === 'lesen' && lesenScreen === 'teil2' && <Teil2Runner tasks={lesenTeil2Tasks} onBack={() => setLesenScreen('home')} onComplete={handleComplete('lesen')} />}
      {view === 'schreiben' && schreibenScreen === 'home' && <SchreibenHomeV2 onStartTeil1={() => setSchreibenScreen('teil1')} onStartTeil2={() => setSchreibenScreen('teil2')} />}
      {view === 'schreiben' && schreibenScreen === 'teil1' && <SchreibenTeil1Runner onBack={() => setSchreibenScreen('home')} />}
      {view === 'schreiben' && schreibenScreen === 'teil2' && <SchreibenTeil2 tasks={schreibenTeil2Tasks} onBack={() => setSchreibenScreen('home')} />}
      {view === 'horen' && <ListeningModule onBack={handleBack} onComplete={handleComplete('horen')} />}
      {view === 'sprechen' && <SpeakingModule onBack={handleBack} onComplete={handleComplete('sprechen')} />}
    </div></div>
  </>;
}
