import { FileText, Mail, PenTool, Play, ChevronRight, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSchreibenProgress } from '@/hooks/useSchreibenProgress';

interface SchreibenHomeProps { onStartTeil1: () => void; onStartTeil2: () => void; }

export function SchreibenHome({ onStartTeil1, onStartTeil2 }: SchreibenHomeProps) {
  const teil1 = useSchreibenProgress(1, 30);
  const teil2 = useSchreibenProgress(2, 80);
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50"><PenTool className="h-5 w-5 text-amber-700" /></div>
        <div><p className="text-sm text-slate-500">Goethe-Zertifikat A1</p><h1 className="text-2xl font-bold text-slate-900">SCHREIBEN</h1></div>
      </div>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="mb-2 text-base font-bold text-slate-900">Informationen zur Prüfung</h2><p className="text-[16px] leading-7 text-slate-700">Das Training besteht aus zwei Teilen: Formulare ausfüllen und kurze Briefe oder Nachrichten schreiben.</p></div>
          <button type="button" title="Übersetzung" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"><Eye className="h-4 w-4" /></button>
        </div>
      </div>
      <TeilCard number="1" title="Formulare" description="Lesen Sie eine ausführliche Situation und ergänzen Sie genau fünf fehlende Informationen im Prüfungsformular." total={30} progress={Math.min(teil1.progress.totalCompleted,30)} daily={teil1.progress.dailyCompleted} average={teil1.averageToday} onStart={onStartTeil1} icon={FileText} />
      <TeilCard number="2" title="Briefe und Nachrichten" description="Schreiben Sie zu einer realistischen A1-Situation. Die spätere KI-Prüfung bewertet Aufgabe, Sprache und Form." total={80} progress={Math.min(teil2.progress.totalCompleted,80)} daily={teil2.progress.dailyCompleted} average={teil2.averageToday} onStart={onStartTeil2} icon={Mail} />
    </div>
  );
}

function TeilCard({ number, title, description, total, progress, daily, average, onStart, icon: Icon }: any) {
  return <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-lg font-bold text-amber-700">{number}</div>
      <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><Icon className="h-4 w-4 text-amber-600" /><h3 className="text-lg font-bold text-slate-900">TEIL {number}</h3></div><p className="mt-1 font-medium text-slate-700">{title}</p><p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        <div className="mt-4 grid grid-cols-3 gap-2"><Stat label="Heute" value={daily} sub="gemacht" /><Stat label="Ø heute" value={average===null?'—':`${average}%`} sub="Punktzahl" /><Stat label="Gesamt" value={`${progress}/${total}`} sub="Aufgaben" /></div>
        <div className="mt-4"><div className="mb-1 flex justify-between text-xs text-slate-500"><span>Fortschritt</span><span>{progress} / {total}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-500 transition-all" style={{width:`${Math.min(progress/total*100,100)}%`}} /></div></div>
        <button onClick={onStart} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-amber-700"><Play className="h-4 w-4 fill-current" /> TRAINING STARTEN <ChevronRight className="h-4 w-4" /></button>
      </div></div>
  </div>;
}
function Stat({label,value,sub}:{label:string;value:any;sub:string}) { return <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-400">{label}</div><div className="mt-1 text-base font-bold text-slate-900">{value}</div><div className="text-xs text-slate-500">{sub}</div></div>; }
