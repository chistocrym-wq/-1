import { useState } from 'react';
import { ArrowLeft, CheckCircle2, FileUp, Mail, RotateCcw } from 'lucide-react';
import { useSchreibenProgress } from '@/hooks/useSchreibenProgress';
import type { SchreibenTeil2Task } from '@/types';
import { cn } from '@/lib/utils';

const makeTasks = (): SchreibenTeil2Task[] => {
  const topics = [
    ['Geburtstag','Ihre Freundin hat am Samstag Geburtstag. Sie können erst am Abend kommen. Schreiben Sie eine kurze Nachricht.',['gratulieren','Ankunftszeit nennen','Geschenk nennen']],
    ['Arzttermin','Sie haben morgen einen Termin beim Arzt, können aber wegen der Arbeit nicht kommen. Schreiben Sie an die Praxis.',['Termin absagen','Grund nennen','neuen Termin vorschlagen']],
    ['Deutschkurs','Sie möchten einen Deutschkurs besuchen. Sie können nur abends lernen. Schreiben Sie an die Sprachschule.',['Kurswunsch nennen','Zeit nennen','nach dem Preis fragen']],
    ['Wohnung','Sie haben eine Wohnungsanzeige im Internet gesehen und interessieren sich für die Wohnung. Schreiben Sie dem Vermieter.',['Interesse nennen','Besichtigung vorschlagen','Telefonnummer angeben']],
    ['Urlaub','Sie möchten im August eine Woche Urlaub machen und Ihren Freund einladen. Schreiben Sie ihm.',['Termin nennen','Ort vorschlagen','fragen, ob er Zeit hat']],
    ['Arbeit','Sie sind krank und können morgen nicht zur Arbeit kommen. Schreiben Sie Ihrer Kollegin.',['Krankheit nennen','Fehlen ankündigen','um Information an den Chef bitten']],
    ['Restaurant','Sie möchten am Freitag mit zwei Freunden essen gehen. Schreiben Sie an das Restaurant.',['Tisch reservieren','Personenzahl nennen','Uhrzeit nennen']],
    ['Nachbar','Sie machen am Samstag eine kleine Feier. Schreiben Sie Ihrem Nachbarn.',['Feier ankündigen','um Verständnis bitten','Ende nennen']],
    ['Paket','Sie erwarten ein Paket und sind am Liefertag nicht zu Hause. Schreiben Sie dem Paketdienst.',['Abwesenheit nennen','Ablageort vorschlagen','Abholung vorschlagen']],
    ['Sportverein','Sie möchten in einem Sportverein trainieren. Schreiben Sie an den Verein.',['Sportart nennen','nach Training fragen','nach Beitrag fragen']],
  ];
  return Array.from({length:80},(_,i)=>{ const t=topics[i%topics.length]; return {id:`t2-${String(i+1).padStart(2,'0')}`,title:`${t[0]} · Aufgabe ${i+1}`,situation:t[1] as string,points:t[2] as string[],minWords:30,maxWords:40}; });
};

export function SchreibenTeil2Runner({ onBack }: { onBack: () => void }) {
  const tasks=makeTasks(); const {progress,record}=useSchreibenProgress(2,80); const task=tasks[progress.nextIndex%80];
  const [text,setText]=useState(''); const [file,setFile]=useState(''); const [done,setDone]=useState(false);
  const words=text.trim()?text.trim().split(/\s+/).length:0;
  const finish=()=>{record(null);setDone(true);};
  if(done)return <div className="animate-scale-in py-12 text-center"><div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50"><CheckCircle2 className="h-8 w-8 text-amber-700"/></div><h2 className="text-2xl font-bold text-slate-900">Aufgabe gespeichert</h2><p className="mx-auto my-3 max-w-md text-slate-500">Die KI-Bewertung wird nach der Anbindung der automatischen Prüfung angezeigt.</p><button onClick={()=>{setText('');setFile('');setDone(false)}} className="mr-2 rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200"><RotateCcw className="mr-2 inline h-4 w-4"/>Nächste Aufgabe</button><button onClick={onBack} className="rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white hover:bg-amber-700">Zurück</button></div>;
  return <div className="animate-fade-in"><div className="mb-6 flex items-center gap-3"><button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"><ArrowLeft className="h-5 w-5 text-slate-600"/></button><div><p className="text-sm text-slate-500">SCHREIBEN · TEIL 2</p><h2 className="text-xl font-bold text-slate-900">Brief {progress.nextIndex+1} / 80</h2></div></div>
    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-5"><h3 className="mb-2 font-bold text-amber-800">{task.title}</h3><p className="leading-7 text-slate-700">{task.situation}</p></div>
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="mb-3 font-bold text-slate-900">Ihr Text soll enthalten:</h3><ul className="space-y-2">{task.points.map((p,i)=><li key={i} className="flex gap-2 text-sm text-slate-700"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-50 text-xs font-bold text-amber-700">{i+1}</span>{p}</li>)}</ul></div>
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-3 flex items-center justify-between"><h3 className="font-bold text-slate-900"><Mail className="mr-2 inline h-4 w-4 text-amber-600"/>Ihr Text</h3><span className={cn('rounded-full px-2.5 py-1 text-xs font-medium',words>=30&&words<=40?'bg-emerald-100 text-emerald-700':'bg-slate-100 text-slate-500')}>{words} / 30–40 Wörter</span></div><textarea value={text} onChange={e=>setText(e.target.value)} className="min-h-[220px] w-full resize-y rounded-xl border border-slate-200 p-4 leading-relaxed outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="Schreiben Sie hier Ihren Text..."/><label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-4 text-sm font-medium text-slate-500 hover:border-amber-300 hover:bg-amber-50/30"><FileUp className="h-4 w-4"/> Foto oder Datei hochladen<input type="file" accept="image/*,.pdf,.doc,.docx,.txt" className="hidden" onChange={e=>setFile(e.target.files?.[0]?.name||'')}/></label>{file&&<p className="mt-2 text-xs text-slate-500">{file}</p>}<button onClick={finish} disabled={!text.trim()&&!file} className={cn('mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold',text.trim()||file?'bg-amber-600 text-white hover:bg-amber-700':'cursor-not-allowed bg-slate-100 text-slate-400')}><CheckCircle2 className="h-4 w-4"/> ABSCHLIESSEN</button></div>
  </div>;
}
