import { BarChart3, ChevronRight, FileText, PenLine } from 'lucide-react';
import { useSchreibenProgress } from '@/hooks/useSchreibenProgress';
import { cn } from '@/lib/utils';

interface SchreibenHomeProps {
  onStartTeil1: () => void;
  onStartTeil2: () => void;
}

const teil1Total = 30;
const teil2Total = 80;

export function SchreibenHome({ onStartTeil1, onStartTeil2 }: SchreibenHomeProps) {
  const teil1 = useSchreibenProgress(1, teil1Total);
  const teil2 = useSchreibenProgress(2, teil2Total);

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
          <PenLine className="h-5 w-5 text-amber-700" />
        </div>
        <div>
          <p className="text-sm text-slate-500">Goethe-Zertifikat A1</p>
          <h1 className="text-2xl font-bold text-slate-900">SCHREIBEN</h1>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-bold text-slate-900">Informationen zur Prüfung</h2>
        <p className="text-[16px] leading-7 text-slate-700">
          Trainieren Sie zwei Formate: Formulare ausfüllen und kurze persönliche oder offizielle Briefe schreiben.
          Jede Aufgabe wird einzeln bewertet und Ihr Fortschritt bleibt gespeichert.
        </p>
      </div>

      <SchreibenCard
        number="1"
        title="Formulare"
        description="Lesen Sie eine ausführliche Situation und ergänzen Sie fünf fehlende Informationen im Prüfungsformular."
        total={teil1Total}
        progress={Math.min(teil1.progress.totalCompleted, teil1Total)}
        dailyCompleted={teil1.progress.dailyCompleted}
        averageToday={teil1.averageToday}
        active
        onStart={onStartTeil1}
        icon={FileText}
        badge="30 Aufgaben"
      />

      <SchreibenCard
        number="2"
        title="Briefe"
        description="Bearbeiten Sie eine kurze A1-Schreibaufgabe mit drei Punkten und formulieren Sie eine passende Nachricht."
        total={teil2Total}
        progress={Math.min(teil2.progress.totalCompleted, teil2Total)}
        dailyCompleted={teil2.progress.dailyCompleted}
        averageToday={teil2.averageToday}
        active
        onStart={onStartTeil2}
        icon={PenLine}
        badge="80 Aufgaben"
      />

      <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <BarChart3 className="h-4 w-4 text-amber-700" />
          Deine Statistik wird automatisch gespeichert.
        </div>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Der Gesamtfortschritt bleibt über Tage erhalten. Tageswerte werden beim neuen Tag zurückgesetzt.
        </p>
      </div>
    </div>
  );
}

function SchreibenCard({
  number, title, description, total, progress, dailyCompleted, averageToday, active, onStart, icon: Icon, badge,
}: {
  number: string;
  title: string;
  description: string;
  total: number;
  progress: number;
  dailyCompleted: number;
  averageToday: number | null;
  active: boolean;
  onStart: () => void;
  icon: typeof FileText;
  badge: string;
}) {
  const percent = Math.min((progress / total) * 100, 100);
  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold', active ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-400')}>
          {number}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">TEIL {number}</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">{title}</h3>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{badge}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-xs text-slate-400">Heute</div>
              <div className="mt-1 text-base font-bold text-slate-900">{dailyCompleted}</div>
              <div className="text-xs text-slate-500">gemacht</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-xs text-slate-400">Ø heute</div>
              <div className="mt-1 text-base font-bold text-amber-700">{averageToday === null ? '—' : `${averageToday}%`}</div>
              <div className="text-xs text-slate-500">Punktzahl</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
              <span>Fortschritt</span><span>{progress} / {total}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${percent}%` }} />
            </div>
          </div>

          <button
            type="button"
            onClick={onStart}
            disabled={!active}
            className={cn(
              'mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold transition-all',
              active ? 'bg-amber-600 text-white hover:bg-amber-700' : 'cursor-not-allowed bg-slate-100 text-slate-400'
            )}
          >
            <Icon className="h-4 w-4" />
            {active ? 'TRAINING STARTEN' : 'DATEN FOLGEN'}
            {active && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
