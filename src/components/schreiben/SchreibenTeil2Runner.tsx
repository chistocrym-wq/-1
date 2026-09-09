import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Eye, FileUp, Mail, RotateCcw, X } from 'lucide-react';
import { useSchreibenProgress } from '@/hooks/useSchreibenProgress';
import type { SchreibenTeil2Task } from '@/types';
import { cn } from '@/lib/utils';

const tasks: SchreibenTeil2Task[] = [
  ['Geburtstag','Ihre Freundin hat am Samstag Geburtstag. Sie können erst am Abend kommen. Schreiben Sie an Ihre Freundin.',['gratulieren','Ankunftszeit nennen','Geschenk nennen'],['Herzlichen Glückwunsch sagen','Ankunftszeit nennen','Geschenk nennen']],
  ['Arzttermin','Sie haben morgen einen Termin beim Arzt, können aber wegen der Arbeit nicht kommen. Schreiben Sie an die Arztpraxis.',['Termin absagen','Grund nennen','neuen Termin vorschlagen'],['Termin absagen','Grund nennen','neuen Termin vorschlagen']],
  ['Deutschkurs','Sie möchten einen Deutschkurs besuchen. Sie können nur abends lernen. Schreiben Sie an die Sprachschule.',['Kurswunsch nennen','Zeit nennen','nach dem Preis fragen'],['Kurswunsch nennen','Zeit nennen','nach dem Preis fragen']],
  ['Wohnung','Sie haben eine Wohnungsanzeige im Internet gesehen und interessieren sich für die Wohnung. Schreiben Sie dem Vermieter.',['Interesse nennen','Besichtigung vorschlagen','Telefonnummer angeben'],['Interesse nennen','Besichtigung vorschlagen','Telefonnummer angeben']],
  ['Urlaub','Sie möchten im August eine Woche Urlaub machen und Ihren Freund einladen. Schreiben Sie ihm.',['Termin nennen','Ort vorschlagen','fragen, ob er Zeit hat'],['Termin nennen','Ort vorschlagen','fragen, ob er Zeit hat']],
  ['Arbeit','Sie sind krank und können morgen nicht zur Arbeit kommen. Schreiben Sie Ihrer Kollegin.',['Krankheit nennen','Fehlen ankündigen','um Information an den Chef bitten'],['Krankheit nennen','Fehlen ankündigen','um Information an den Chef bitten']],
  ['Restaurant','Sie möchten am Freitag mit zwei Freunden essen gehen. Schreiben Sie an das Restaurant.',['Tisch reservieren','Personenzahl nennen','Uhrzeit nennen'],['Tisch reservieren','Personenzahl nennen','Uhrzeit nennen']],
  ['Nachbar','Sie machen am Samstag eine kleine Feier. Schreiben Sie Ihrem Nachbarn.',['Feier ankündigen','um Verständnis bitten','Ende nennen'],['Feier ankündigen','um Verständnis bitten','Ende nennen']],
  ['Paket','Sie erwarten ein Paket und sind am Liefertag nicht zu Hause. Schreiben Sie dem Paketdienst.',['Abwesenheit nennen','Ablageort vorschlagen','Abholung vorschlagen'],['Abwesenheit nennen','Ablageort vorschlagen','Abholung vorschlagen']],
  ['Sportverein','Sie möchten in einem Sportverein trainieren. Schreiben Sie an den Verein.',['Sportart nennen','nach Training fragen','nach Beitrag fragen'],['Sportart nennen','nach Training fragen','nach Beitrag fragen']],
];

const allTasks: SchreibenTeil2Task[] = Array.from({ length: 80 }, (_, i) => {
  const [title, situation, points, pointsRu] = tasks[i % tasks.length];
  return { id: `t2-${String(i + 1).padStart(2, '0')}`, title: `${title} · Aufgabe ${i + 1}`, situation, situationRu: undefined, points, pointsRu, minWords: 24, maxWords: 40 };
});

function basicCheck(text: string, task: SchreibenTeil2Task) {
  const lower = text.toLowerCase();
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const personal = /(^|\n)\s*(liebe|lieber)\s+/i.test(text);
  const formal = /sehr geehrte(r)?\s+(damen und herren|frau|herr)/i.test(text);
  const closing = /(viele grüße|liebe grüße|mit freundlichen grüßen|bis bald)/i.test(text);
  const points = task.points.map((p) => {
    const wordsToFind = p.toLowerCase().split(/[^a-zäöüß]+/).filter((w) => w.length > 3).slice(0, 2);
    return wordsToFind.some((w) => lower.includes(w));
  });
  const criteria = [personal || formal, ...points, closing, words >= task.minWords && words <= task.maxWords];
  return { words, criteria, score: Math.round(criteria.filter(Boolean).length / criteria.length * 100) };
}

export function SchreibenTeil2Runner({ onBack }: { onBack: () => void }) {
  const { progress, record } = useSchreibenProgress(2, 80);
  const task = allTasks[progress.nextIndex % 80];
  const [text, setText] = useState('');
  const [file, setFile] = useState('');
  const [showRussian, setShowRussian] = useState(false);
  const [result, setResult] = useState<{score:number; words:number; criteria:boolean[]} | null>(null);
  const words = useMemo(() => text.trim() ? text.trim().split(/\s+/).length : 0, [text]);

  const check = () => {
    const review = basicCheck(text, task);
    setResult({ score: review.score, words: review.words, criteria: review.criteria });
    record(review.score);
  };
  const next = () => { setText(''); setFile(''); setResult(null); setShowRussian(false); };

  if (result) {
    return <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-3"><button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"><ArrowLeft className="h-5 w-5 text-slate-600" /></button><div><p className="text-sm text-slate-500">SCHREIBEN · TEIL 2</p><h2 className="text-xl font-bold text-slate-900">Ergebnis · Brief</h2></div></div>
      <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center"><div className="text-5xl font-bold text-amber-700">{result.score}</div><p className="mt-2 text-sm text-slate-600">Vorläufige Punktzahl · {result.words} Wörter</p></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="mb-4 font-bold text-slate-900">Prüfung des Textes</h3><div className="space-y-2">
        {[['Правильное обращение',result.criteria[0]],['Punkt 1',result.criteria[1]],['Punkt 2',result.criteria[2]],['Punkt 3',result.criteria[3]],['Gruß / прощание',result.criteria[4]],['Около 30 слов',result.criteria[5]]].map(([label,ok]) => <div key={String(label)} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm"><span className={cn('flex h-6 w-6 items-center justify-center rounded-full',ok?'bg-emerald-100 text-emerald-700':'bg-rose-100 text-rose-700')}>{ok?<CheckCircle2 className="h-4 w-4"/>:<X className="h-4 w-4"/>}</span><span className="text-slate-700">{label}</span></div>)}
      </div><p className="mt-4 text-xs leading-5 text-slate-500">Это предварительная автоматическая проверка. Полная AI-проверка грамматики, порядка слов и содержания будет подключена отдельно.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2"><button onClick={next} className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white hover:bg-amber-700"><RotateCcw className="h-4 w-4"/> NÄCHSTE AUFGABE</button><button onClick={onBack} className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200"><ArrowLeft className="h-4 w-4"/> ZU SCHREIBEN</button></div></div>
    </div>;
  }

  return <div className="animate-fade-in">
    <div className="mb-6 flex items-center gap-3"><button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"><ArrowLeft className="h-5 w-5 text-slate-600" /></button><div className="min-w-0 flex-1"><p className="text-sm text-slate-500">SCHREIBEN · TEIL 2</p><h2 className="text-xl font-bold text-slate-900">Brief {progress.nextIndex + 1} / 80</h2></div><button title="Русский перевод" onClick={()=>setShowRussian(v=>!v)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"><Eye className="h-5 w-5"/></button></div>
    <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-500" style={{width:`${((progress.nextIndex+1)/80)*100}%`}}/></div>
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Schreiben · Teil 2</div><h3 className="mb-4 text-lg font-bold text-slate-900">{task.situation}</h3>{showRussian && <div className="mb-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">Перевод задания: {task.title}. Здесь будет полный русский перевод ситуации.</div>}<div className="rounded-xl bg-slate-50 p-4"><div className="mb-2 text-sm font-bold text-slate-800">Schreiben Sie zu jedem Punkt ein bis zwei Sätze.</div><div className="text-xs text-slate-500">circa 30 Wörter · Schreiben Sie auch eine Anrede und einen Gruß.</div><ul className="mt-3 space-y-2">{task.points.map((p,i)=><li key={i} className="flex gap-3 text-sm text-slate-700"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50 font-bold text-amber-700">{i+1}</span><span>{p}</span></li>)}</ul></div></div>
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-3 flex items-center justify-between"><h3 className="font-bold text-slate-900"><Mail className="mr-2 inline h-4 w-4 text-amber-600"/>Ihr Text</h3><span className={cn('rounded-full px-2.5 py-1 text-xs font-medium',words>=24&&words<=40?'bg-emerald-100 text-emerald-700':words>40?'bg-rose-100 text-rose-700':'bg-slate-100 text-slate-500')}>{words} / ca. 30 Wörter</span></div><textarea value={text} onChange={e=>setText(e.target.value)} className="min-h-[240px] w-full resize-y rounded-xl border border-slate-200 p-4 leading-relaxed outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="Liebe Anna,\n\n..."/><label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-4 text-sm font-medium text-slate-500 hover:border-amber-300 hover:bg-amber-50/30"><FileUp className="h-4 w-4"/> Foto oder Datei hochladen<input type="file" accept="image/*,.pdf,.doc,.docx,.txt" className="hidden" onChange={e=>setFile(e.target.files?.[0]?.name||'')}/></label>{file&&<div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">{file}</div>}<button onClick={check} disabled={!text.trim()} className={cn('mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold transition-all',text.trim()?'bg-amber-600 text-white hover:bg-amber-700':'cursor-not-allowed bg-slate-100 text-slate-400')}><CheckCircle2 className="h-4 w-4"/> PRÜFEN</button></div>
  </div>;
}
