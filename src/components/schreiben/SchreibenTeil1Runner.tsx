import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, FileText, RotateCcw, Trophy } from 'lucide-react';
import { schreibenTeil1Tasks } from '@/data/schreibenTeil1';
import { useSchreibenProgress } from '@/hooks/useSchreibenProgress';
import { cn } from '@/lib/utils';

export function SchreibenTeil1Runner({ onBack }: { onBack: () => void }) {
  const { progress, record } = useSchreibenProgress(1, 30);
  const task = schreibenTeil1Tasks[progress.nextIndex % schreibenTeil1Tasks.length];
  const active = useMemo(() => task.fields.filter((f) => f.answer), [task]);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [result, setResult] = useState<number | null>(null);

  const normalize = (s: string) => s.toLowerCase().replace(/[.,!?;:]/g,' ').replace(/\s+/g,' ').trim();
  const finish = () => {
    const correct = active.filter((f) => normalize(answers[f.id] || '') === normalize(f.answer)).length;
    const score = Math.round(correct / 5 * 100);
    setResult(score);
    record(score);
  };
  const reset = () => { setAnswers({}); setResult(null); };

  if (result !== null) return <div className="animate-scale-in flex flex-col items-center py-12 text-center"><div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50"><Trophy className="h-10 w-10 text-amber-700" /></div><h2 className="text-2xl font-bold text-slate-900">Ergebnis</h2><div className="my-5 text-5xl font-bold text-amber-600">{result}</div><p className="mb-7 text-slate-500">Punktzahl von 100 · {result === 100 ? 'Alle fünf Antworten richtig.' : 'Vergleichen Sie Ihre Antworten mit den Anforderungen.'}</p><div className="flex gap-3"><button onClick={reset} className="flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200"><RotateCcw className="h-4 w-4" />Nochmal</button><button onClick={onBack} className="rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white hover:bg-amber-700">Zurück</button></div></div>;

  return <div className="animate-fade-in"><div className="mb-6 flex items-center gap-3"><button onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"><ArrowLeft className="h-5 w-5 text-slate-600" /></button><div><p className="text-sm text-slate-500">SCHREIBEN · TEIL 1</p><h2 className="text-xl font-bold text-slate-900">Formular {progress.nextIndex + 1} / 30</h2></div></div>
    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-5"><h3 className="mb-2 font-bold text-amber-800">{task.title}</h3><p className="leading-7 text-slate-700">{task.situation}</p></div>
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-4"><FileText className="h-5 w-5 text-amber-600" /><div><h3 className="font-bold text-slate-900">{task.formTitle}</h3><p className="text-xs text-slate-500">{task.formSubtitle}</p></div></div><div className="space-y-2">{task.fields.map((field) => { const editable=!!field.answer; return <div key={field.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-3 border border-slate-200 bg-slate-50/60"><div className="px-3 py-3 text-sm font-medium text-slate-600">{field.label}</div><div className="bg-white p-2">{editable ? field.type === 'radio' ? <div className="flex flex-wrap gap-2">{(field.options || []).map(o=><button key={o} onClick={()=>setAnswers(a=>({...a,[field.id]:o}))} className={cn('rounded-lg border px-3 py-2 text-sm transition',answers[field.id]===o?'border-amber-500 bg-amber-50 text-amber-800':'border-slate-200 bg-white text-slate-700 hover:border-amber-300')}>{o}</button>)}</div> : <input value={answers[field.id] || ''} onChange={e=>setAnswers(a=>({...a,[field.id]:e.target.value}))} className="w-full rounded-lg border border-amber-300 bg-amber-50/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-100" placeholder="Ihre Antwort" /> : <span className="px-2 text-sm text-slate-700">{field.value || '________________'}</span>}</div></div>})}</div><button onClick={finish} disabled={active.some(f=>!answers[f.id])} className={cn('mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition',active.every(f=>answers[f.id])?'bg-amber-600 text-white hover:bg-amber-700':'cursor-not-allowed bg-slate-100 text-slate-400')}><CheckCircle2 className="h-4 w-4" /> ABSCHLIESSEN</button></div>
  </div>;
}
