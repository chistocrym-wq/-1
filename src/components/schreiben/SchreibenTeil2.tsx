import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Eye, FileUp, PenLine, RotateCcw, Send, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SchreibenTeil2Task } from '@/types';
import { useSchreibenProgress } from '@/hooks/useSchreibenProgress';

interface Props { tasks: SchreibenTeil2Task[]; onBack: () => void; }

export function SchreibenTeil2({ tasks, onBack }: Props) {
  const { progress, record } = useSchreibenProgress(2, tasks.length);
  const [index, setIndex] = useState(progress.nextIndex < tasks.length ? progress.nextIndex : 0);
  const [text, setText] = useState('');
  const [checked, setChecked] = useState(false);
  const [showRu, setShowRu] = useState(false);
  const [fileName, setFileName] = useState('');

  const task = tasks[index];
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const validLength = words >= task.minWords && words <= task.maxWords;

  const finish = () => {
    if (!validLength && !fileName) return;
    record(null);
    setChecked(true);
  };

  const next = () => {
    setIndex((index + 1) % tasks.length);
    setText(''); setFileName(''); setChecked(false); setShowRu(false);
  };

  if (checked) return (
    <div className="animate-scale-in py-10 text-center">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
        <Trophy className="h-10 w-10 text-amber-700" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Antwort gespeichert</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Die AI-Prüfung für Briefe wird als nächster Schritt angeschlossen. Dein Fortschritt wurde bereits gespeichert.
      </p>
      <div className="mt-7 flex justify-center gap-3">
        <button onClick={next} className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white transition hover:bg-amber-700">
          Nächste Aufgabe <Send className="h-4 w-4" />
        </button>
        <button onClick={onBack} className="rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200">Zurück</button>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">SCHREIBEN · TEIL 2</p>
          <h1 className="text-xl font-bold text-slate-900">Briefe</h1>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{index + 1} / {tasks.length}</span>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${((index + 1) / tasks.length) * 100}%` }} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Aufgabe {index + 1}</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">{task.title}</h2>
          </div>
          <button onClick={() => setShowRu(v => !v)} title="Russische Übersetzung" className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition', showRu ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}>
            <Eye className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-700">{task.situation}</p>
          {showRu && <p className="mt-3 border-t border-slate-200 pt-3 text-sm leading-6 text-slate-500">Русский перевод будет автоматически формироваться AI после подключения переводчика.</p>}
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800"><PenLine className="h-4 w-4 text-amber-700" /> Schreiben Sie zu jedem Punkt.</div>
          <div className="space-y-2">
            {task.points.map((point, i) => <div key={i} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-700">{i + 1}</span><span>{point}</span></div>)}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          <span>Schreiben Sie circa 30 Wörter.</span>
          <span className={cn('rounded-full px-2.5 py-1 font-bold', validLength ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-600')}>{words} / {task.minWords}-{task.maxWords}</span>
        </div>

        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Schreiben Sie hier Ihre Nachricht..." className="mt-4 min-h-[230px] w-full resize-y rounded-xl border border-slate-200 p-4 text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />

        <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-amber-400 hover:bg-amber-50">
          <FileUp className="h-5 w-5 text-slate-500" />
          <span className="min-w-0 flex-1 text-sm text-slate-600">Oder Foto / Datei des handgeschriebenen Briefes hochladen</span>
          <input type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name || '')} />
        </label>
        {fileName && <p className="mt-2 text-xs text-slate-500">Datei: {fileName}</p>}

        <button onClick={finish} disabled={!validLength && !fileName} className={cn('mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition', validLength || fileName ? 'bg-amber-600 text-white hover:bg-amber-700' : 'cursor-not-allowed bg-slate-100 text-slate-400')}>
          <CheckCircle2 className="h-4 w-4" /> Prüfen
        </button>
      </section>

      <button onClick={() => { setIndex(progress.nextIndex); setText(''); setFileName(''); }} className="mx-auto mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-700"><RotateCcw className="h-3.5 w-3.5" /> Mit gespeicherter Position fortsetzen</button>
    </div>
  );
}
