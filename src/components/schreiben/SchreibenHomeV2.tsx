import { useState } from 'react';
import { BarChart3, ChevronRight, Eye, FileText, Lightbulb, PenLine } from 'lucide-react';
import { useSchreibenProgress } from '@/hooks/useSchreibenProgress';
import { SchreibenSecrets } from '@/components/schreiben/SchreibenSecrets';

interface Props { onStartTeil1: () => void; onStartTeil2: () => void; }

function Card({ number, title, text, total, progress, today, average, onStart, icon: Icon, onSecrets }: { number: string; title: string; text: string; total: number; progress: number; today: number; average: number | null; onStart: () => void; icon: typeof FileText; onSecrets?: () => void }) {
  const percent = Math.min((progress / total) * 100, 100);
  return (
    <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-lg font-bold text-amber-700">{number}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">TEIL {number}</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{title}</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{total} Aufgaben</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-400">Heute</div><div className="mt-1 text-base font-bold text-slate-900">{today}</div><div className="text-xs text-slate-500">gemacht</div></div>
            <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-400">Ø heute</div><div className="mt-1 text-base font-bold text-amber-700">{average === null ? '—' : `${average}%`}</div><div className="text-xs text-slate-500">Punktzahl</div></div>
          </div>
          <div className="mt-4"><div className="mb-1 flex items-center justify-between text-xs text-slate-500"><span>Fortschritt</span><span>{progress} / {total}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${percent}%` }} /></div></div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={onStart} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-base font-semibold text-white transition-all hover:bg-amber-700"><Icon className="h-4 w-4" /> TRAINING STARTEN <ChevronRight className="h-4 w-4" /></button>
            {onSecrets && <button type="button" onClick={onSecrets} className="flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 transition-all hover:border-amber-300 hover:bg-amber-100"><Lightbulb className="h-4 w-4" /> Секреты успеха написания писем</button>}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SchreibenHomeV2({ onStartTeil1, onStartTeil2 }: Props) {
  const [secretsOpen, setSecretsOpen] = useState(false);
  const p1 = useSchreibenProgress(1, 30); const p2 = useSchreibenProgress(2, 80);
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50"><PenLine className="h-5 w-5 text-amber-700" /></div><div><p className="text-sm text-slate-500">Goethe-Zertifikat A1</p><h1 className="text-2xl font-bold text-slate-900">SCHREIBEN</h1></div></div>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-3 text-base font-bold text-slate-900">Informationen zur Prüfung</h2><p className="text-[16px] leading-7 text-slate-700">Das Modul besteht aus zwei Teilen. In Teil 1 füllen Sie Prüfungsformulare aus. In Teil 2 schreiben Sie kurze Briefe und Nachrichten.</p><div className="mt-4 flex items-center gap-2 text-sm font-semibold text-amber-700"><Eye className="h-4 w-4" /> Schreiben Sie kurze, klare Sätze auf A1-Niveau.</div></div>
      <Card number="1" title="Formulare" text="Lesen Sie eine ausführliche Situation und übertragen Sie fünf wichtige Informationen in einen gedruckten Prüfungsbogen." total={30} progress={Math.min(p1.progress.totalCompleted,30)} today={p1.progress.dailyCompleted} average={p1.averageToday} onStart={onStartTeil1} icon={FileText}/>
      <Card number="2" title="Briefe" text="Bearbeiten Sie eine A1-Schreibaufgabe mit drei Punkten und schreiben Sie Ihre Nachricht." total={80} progress={Math.min(p2.progress.totalCompleted,80)} today={p2.progress.dailyCompleted} average={p2.averageToday} onStart={onStartTeil2} icon={PenLine} onSecrets={() => setSecretsOpen(true)}/>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><BarChart3 className="h-4 w-4 text-amber-700"/>Statistik wird automatisch gespeichert.</div><p className="mt-1 text-xs text-slate-500">Gesamtfortschritt bleibt erhalten; Tageswerte beginnen am nächsten Tag neu.</p></div>
      <SchreibenSecrets open={secretsOpen} onClose={() => setSecretsOpen(false)} />
    </div>
  );
}
