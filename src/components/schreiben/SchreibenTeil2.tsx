import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Eye, FileUp, PenLine, RotateCcw, Send, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SchreibenTeil2Task } from '@/types';
import { useSchreibenProgress } from '@/hooks/useSchreibenProgress';
import { schreibenTeil2SituationRu } from '@/data/schreiben/teil2SituationRu';
import { GermanWordTooltip } from './GermanWordTooltip';

interface Props { tasks: SchreibenTeil2Task[]; onBack: () => void; }

const POINT_RU: Record<string, string> = {
  'Warum?':'Почему?', 'Warum schreiben Sie?':'Почему вы пишете?', 'An welchen Tagen?':'В какие дни?', 'Preis.':'Цена.', 'Preis?':'Цена?',
  'Wann möchten Sie kommen?':'Когда вы хотите приехать?', 'Wie reisen Sie?':'Как вы поедете?', 'Was möchten Sie zusammen machen?':'Что вы хотите делать вместе?',
  'Danken Sie.':'Поблагодарите.', 'Sie können leider nicht kommen.':'К сожалению, вы не можете прийти.', 'Was machen Sie am Wochenende?':'Что вы делаете на выходных?',
  'Sie arbeiten heute länger.':'Сегодня вы работаете дольше.', 'Wann kommen Sie?':'Когда вы придёте?', 'Laden Sie sie ein.':'Пригласите их.',
  'Wann beginnt die Party?':'Когда начинается вечеринка?', 'Was sollen die Gäste mitbringen?':'Что должны принести гости?', 'Wann beginnt der Kurs?':'Когда начинается курс?',
  'Wie viel kostet der Kurs?':'Сколько стоит курс?', 'Neuer Termin.':'Новое время встречи.', 'Neuer Termin: Montag, 18.00 Uhr.':'Новое время встречи: понедельник, 18:00.',
  'Neuer Termin: Dienstag, 17.00 Uhr.':'Новое время встречи: вторник, 17:00.', 'Sie haben im August Geburtstag.':'В августе у вас день рождения.',
  'Wann können Sie den Fernseher abholen?':'Когда вы можете забрать телевизор?', 'Wie kommen die Freunde?':'Как друзья приедут?', 'Wann können Sie arbeiten?':'Когда вы можете работать?',
  'Wie hoch ist der Lohn?':'Какая зарплата?', 'Entschuldigung.':'Извинитесь.', 'Zusammen Kaffee trinken?':'Выпить вместе кофе?', 'Für wie viele Tage?':'На сколько дней?',
  'Sie kommen später.':'Вы придёте позже.', 'Können Sie helfen?':'Можете ли вы помочь?', 'Bitte schnell antworten.':'Попросите быстро ответить.',
  'Informationen über Theater und Museen.':'Информация о театрах и музеях.', 'Hoteladressen.':'Адреса отелей.', 'Informationen über Museen.':'Информация о музеях.',
  'Muss man sich anmelden?':'Нужно ли регистрироваться?', 'Hausaufgaben.':'Домашние задания.', 'Sie kommen morgen in die Schule.':'Завтра вы придёте в школу.',
  'Fragen Sie nach dem Weg.':'Спросите, как добраться.', 'Ihr Handy funktioniert nicht.':'Ваш телефон не работает.',
  'Warum machen Sie die Party?':'Почему вы устраиваете вечеринку?', 'Was sollen die Freunde mitbringen?':'Что должны принести друзья?',
  'Danke für die Einladung.':'Поблагодарите за приглашение.', 'Fragen Sie nach der Adresse.':'Спросите адрес.', 'Fragen Sie nach der Uhrzeit.':'Спросите время.',
  'An welchen Tagen findet der Kurs statt?':'В какие дни проходит курс?', 'Warum können Sie nicht kommen?':'Почему вы не можете прийти?',
  'Wie geht es allen?':'Как у всех дела?', 'Wann besuchen Sie Dortmund?':'Когда вы посещаете Дортмунд?', 'Fragen Sie nach Hotelpreisen.':'Спросите цены на отели.',
  'Fragen Sie nach Sehenswürdigkeiten.':'Спросите о достопримечательностях.', 'Wie geht es Ihnen?':'Как вы себя чувствуете?', 'Sehenswürdigkeiten.':'Достопримечательности.',
  'Stadtplan.':'Карта города.', 'Hotel.':'Отель.', 'Sie arbeiten.':'Вы работаете.', 'Geben Sie Ihrer Freundin den Schlüssel.':'Передайте подруге ключ.',
  'Bedanken Sie sich.':'Поблагодарите.', 'Gibt es noch Garantie?':'Есть ли ещё гарантия?', 'Wo?':'Где?', 'Wer ist krank?':'Кто болен?',
  'Sie können nicht mehr kommen.':'Вы больше не можете приходить.', 'Danken Sie für den Kurs.':'Поблагодарите за курс.', 'Kulturprogramm.':'Культурная программа.',
  'Museen.':'Музеи.', 'Sie rufen später an.':'Вы позвоните позже.', 'Wie lange bleiben Sie?':'Как долго вы останетесь?', 'Welche Kurse gibt es?':'Какие курсы есть?',
  'Informationen über Museen und Ausstellungen.':'Информация о музеях и выставках.', 'Neuer Termin: Sonntagabend.':'Новое время: воскресенье вечером.',
  'Zusammen essen.':'Поужинать вместе.', 'Anmeldung.':'Регистрация.', 'Wann können Sie kommen?':'Когда вы можете прийти?',
  'Wie viel kostet ein Haarschnitt?':'Сколько стоит стрижка?', 'Wann haben Sie Zeit?':'Когда у вас есть время?',
  'Entschuldigen Sie sich.':'Извинитесь.', 'Laden Sie ihn zum Kaffee ein.':'Пригласите его на кофе.',
  'Informieren Sie über die Fehlzeit.':'Сообщите о периоде отсутствия.'
};

const SOURCE_POINTS: Record<number, string[]> = {
  3:['Warum?','Fragen Sie nach den Hausaufgaben.'],
  7:['Warum?','Sie arbeiten heute länger.'],
  19:['Neuer Termin: Montag, 18.00 Uhr.','Bitte schnell antworten.'],
  23:['Fragen Sie nach dem Weg.','Ihr Handy funktioniert nicht.'],
  37:['Warum?','Sie rufen später an.'],
  43:['Warum?','Hausaufgaben.'],
  47:['Warum?','Fragen Sie nach den Hausaufgaben.'],
  53:['Warum?','Wann kommen Sie wieder?'],
  58:['Neuer Termin: Dienstag, 17.00 Uhr.','Bitte schnell antworten.'],
  62:['Warum?','Rufen Sie später an.']
};

export function SchreibenTeil2({ tasks, onBack }: Props) {
  const { progress, record } = useSchreibenProgress(2, tasks.length);
  const [index, setIndex] = useState(progress.nextIndex < tasks.length ? progress.nextIndex : 0);
  const [text, setText] = useState('');
  const [checked, setChecked] = useState(false);
  const [showRu, setShowRu] = useState(false);
  const [fileName, setFileName] = useState('');

  const task = tasks[index];
  const points = SOURCE_POINTS[index + 1] ?? task.points;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const validLength = words >= task.minWords && words <= task.maxWords;
  const situationRu = schreibenTeil2SituationRu[index] ?? '';

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
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50"><Trophy className="h-10 w-10 text-amber-700" /></div>
      <h2 className="text-2xl font-bold text-slate-900">Antwort gespeichert</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Deine Antwort wurde gespeichert. Die inhaltliche Prüfung des freien Textes wird separat angeschlossen.</p>
      <div className="mt-7 flex justify-center gap-3">
        <button onClick={next} className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white transition hover:bg-amber-700">Nächste Aufgabe <Send className="h-4 w-4" /></button>
        <button onClick={onBack} className="rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200">Zurück</button>
      </div>
    </div>
  );

  return <div className="animate-fade-in">
    <div className="mb-5 flex items-center gap-3">
      <button onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50"><ArrowLeft className="h-5 w-5 text-slate-600" /></button>
      <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-wider text-amber-700">SCHREIBEN</p><h1 className="text-xl font-bold text-slate-900">Teil 2</h1></div>
      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{index + 1} / {tasks.length}</span>
    </div>
    <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${((index + 1) / tasks.length) * 100}%` }} /></div>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-200 px-5 py-3 text-center sm:px-8"><div className="text-lg font-extrabold tracking-tight text-slate-900">Schreiben</div><div className="mt-1 inline-block bg-slate-300 px-5 py-1 text-xs font-semibold text-slate-700">Kandidatenblatt</div></div>
      <div className="px-5 py-6 sm:px-10 sm:py-8">
        <div className="mb-6 flex items-center justify-between gap-3"><h2 className="text-2xl font-extrabold text-slate-900">Teil 2</h2><button onClick={() => setShowRu(v => !v)} title="Русский перевод задания" className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition', showRu ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}><Eye className="h-4 w-4" /></button></div>
        <div className="text-[15px] leading-7 text-slate-800">
          <GermanWordTooltip text={task.situation} />
          <div className="mt-5 space-y-1 pl-4 sm:pl-8">{points.map((point, i) => <div key={i} className="flex gap-3"><span className="shrink-0">–</span><GermanWordTooltip text={point} /></div>)}</div>
          {showRu && <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-slate-700"><p className="mb-2 font-bold text-amber-800">Перевод задания</p><p>{situationRu}</p><div className="mt-3 space-y-1">{points.map((point, i) => <p key={i}>– {POINT_RU[point] ?? point}</p>)}</div></div>}
        </div>
        <div className="mx-auto mt-8 max-w-md rotate-[-1deg] border border-slate-300 bg-slate-50 px-5 py-4 text-center shadow-md"><p className="text-sm font-medium italic leading-6 text-slate-600">Schreiben Sie zu jedem Punkt<br />ein bis zwei Sätze auf dem<br />Antwortbogen (circa 30 Wörter).<br />Schreiben Sie auch eine Anrede<br />und einen Gruß.</p></div>
        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800"><PenLine className="h-4 w-4 text-amber-700" /> Ihre Antwort</div>
          <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800"><span>Circa 30 Wörter</span><span className={cn('rounded-full px-2.5 py-1 font-bold', validLength ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-600')}>{words} / {task.minWords}–{task.maxWords}</span></div>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Schreiben Sie Ihre Antwort hier..." className="min-h-[230px] w-full resize-y rounded-xl border border-slate-200 p-4 text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
          <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-amber-400 hover:bg-amber-50"><FileUp className="h-5 w-5 text-slate-500" /><span className="min-w-0 flex-1 text-sm text-slate-600">Oder Foto / Datei des handgeschriebenen Briefes hochladen</span><input type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name || '')} /></label>
          {fileName && <p className="mt-2 text-xs text-slate-500">Datei: {fileName}</p>}
          <button onClick={finish} disabled={!validLength && !fileName} className={cn('mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition', validLength || fileName ? 'bg-amber-600 text-white hover:bg-amber-700' : 'cursor-not-allowed bg-slate-100 text-slate-400')}><CheckCircle2 className="h-4 w-4" /> Prüfen</button>
        </div>
      </div>
    </section>
    <button onClick={() => { setIndex(progress.nextIndex); setText(''); setFileName(''); }} className="mx-auto mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-700"><RotateCcw className="h-3.5 w-3.5" /> Mit gespeicherter Position fortsetzen</button>
  </div>;
}
