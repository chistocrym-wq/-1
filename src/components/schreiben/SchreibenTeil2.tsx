import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Eye, FileUp, Loader2, PenLine, RotateCcw, Send, Trophy, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SchreibenTeil2Task } from '@/types';
import { useSchreibenProgress } from '@/hooks/useSchreibenProgress';
import { schreibenTeil2SituationRu } from '@/data/schreiben/teil2SituationRu';
import { GermanWordTooltip } from './GermanWordTooltip';

interface Props { tasks: SchreibenTeil2Task[]; onBack: () => void; }

interface Criterion { score: number; max: number; comment: string; }
interface CheckResult {
  transcription?: string;
  normalizedText: string;
  score: number;
  passed: boolean;
  wordCount: number;
  criteria: Record<string, Criterion>;
  points: { point: string; covered: boolean; evidence: string }[];
  corrections: { original: string; corrected: string; explanation: string }[];
  strengths: string[];
  feedback: string;
}

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
  'Informieren Sie über die Fehlzeit.':'Сообщите о периоде отсутствия.', 'Fragen Sie nach den Hausaufgaben.':'Спросите о домашних заданиях.',
  'Wann kommen Sie wieder?':'Когда вы снова придёте?', 'Rufen Sie später an.':'Позвоните позже.'
};

const INSTRUCTION_RU = 'На каждый пункт напишите одно-два предложения на бланке ответа (около 30 слов). Также напишите обращение и прощание.';
const MIN_WORDS = 30;
const MAX_WORDS = 35;
const MAX_IMAGE_DATA_URL_LENGTH = 3000000;

async function imageToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Для рукописного ответа нужен файл изображения (JPG, PNG или WEBP).');
  const source = await new Promise<HTMLImageElement>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Не удалось прочитать изображение.'));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Не удалось прочитать файл.'));
    reader.readAsDataURL(file);
  });

  const maxSide = 1600;
  const scale = Math.min(1, maxSide / Math.max(source.naturalWidth, source.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(source.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(source.naturalHeight * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Не удалось подготовить изображение.');
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.78);
}

export function SchreibenTeil2({ tasks, onBack }: Props) {
  const { progress, record } = useSchreibenProgress(2, tasks.length);
  const [index, setIndex] = useState(progress.nextIndex < tasks.length ? progress.nextIndex : 0);
  const [text, setText] = useState('');
  const [checked, setChecked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showRu, setShowRu] = useState(false);
  const [fileName, setFileName] = useState('');
  const [imageData, setImageData] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);

  const task = tasks[index];
  const points = task.points;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const validLength = words >= MIN_WORDS && words <= MAX_WORDS;
  const situationRu = schreibenTeil2SituationRu[index] ?? '';

  const handleImage = async (file?: File) => {
    if (!file) return;
    setError(''); setResult(null); setChecked(false);
    try {
      const dataUrl = await imageToDataUrl(file);
      if (dataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) throw new Error('Фото слишком большое. Сделайте более компактное фото листа.');
      setImageData(dataUrl);
      setFileName(file.name);
      setText('');
    } catch (e) {
      setImageData(''); setFileName('');
      setError(e instanceof Error ? e.message : 'Не удалось загрузить фото.');
    }
  };

  const finish = async () => {
    if (!text.trim() && !imageData) return;
    setChecking(true); setError('');
    try {
      const response = await fetch('/api/check-schreiben', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: task.situation, points, minWords: MIN_WORDS, maxWords: MAX_WORDS, text: text.trim(), image: imageData || undefined })
      });
      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await response.json() : { error: `Сервер проверки вернул ${response.status} без JSON. Проверьте, что тренажёр открыт на Vercel с API /api/check-schreiben.` };
      if (!response.ok) throw new Error(data?.error || `Ошибка API (${response.status}).`);
      if (!data || typeof data.score !== 'number') throw new Error('API проверки вернул неполный ответ. Попробуйте ещё раз.');
      setResult(data as CheckResult);
      record(Number(data.score) || 0);
      setChecked(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось проверить ответ.');
    } finally {
      setChecking(false);
    }
  };

  const next = () => {
    setIndex((index + 1) % tasks.length);
    setText(''); setFileName(''); setImageData(''); setChecked(false); setShowRu(false); setResult(null); setError('');
  };

  if (checked && result) return (
    <div className="animate-scale-in py-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <div className={cn('mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full', result.passed ? 'bg-emerald-50' : 'bg-amber-50')}>
            {result.passed ? <Trophy className="h-10 w-10 text-emerald-600" /> : <XCircle className="h-10 w-10 text-amber-600" />}
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Schreiben · Teil 2</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">{result.passed ? 'Gut gemacht!' : 'Нужно немного доработать'}</h2>
          <div className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-xl font-extrabold text-slate-800">{Math.round(result.score)}</div>
          <p className="mt-2 text-xs text-slate-500">Оценка тренажёра по критериям A1, не официальный балл Goethe</p>
        </div>

        {result.transcription && <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-blue-700">Распознанный рукописный текст</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">{result.transcription}</p></div>}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {Object.entries(result.criteria).map(([key, criterion]) => <div key={key} className="rounded-xl bg-slate-50 p-3"><div className="flex items-center justify-between text-sm font-bold text-slate-800"><span>{({taskCompletion:'Выполнение задания',format:'Формат письма',communicativeSuccess:'Понятность',grammar:'Грамматика A1',vocabulary:'Лексика A1',spelling:'Орфография'} as Record<string,string>)[key] ?? key}</span><span>{criterion.score}/{criterion.max}</span></div><p className="mt-1 text-xs leading-5 text-slate-500">{criterion.comment}</p></div>)}
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 p-4"><p className="text-sm font-bold text-slate-800">Пункты задания</p>{result.points.map((p, i) => <div key={i} className="mt-2 flex gap-2 text-sm"><span className={p.covered ? 'text-emerald-600' : 'text-red-500'}>{p.covered ? '✓' : '✕'}</span><div><span className="font-medium">{p.point}</span>{p.evidence && <span className="ml-1 text-slate-500">— {p.evidence}</span>}</div></div>)}</div>

        {result.corrections.length > 0 && <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4"><p className="text-sm font-bold text-amber-900">Что исправить</p>{result.corrections.map((c, i) => <div key={i} className="mt-3 text-sm"><p><span className="text-red-600 line-through">{c.original}</span> → <span className="font-bold text-emerald-700">{c.corrected}</span></p><p className="mt-1 text-xs leading-5 text-slate-600">{c.explanation}</p></div>)}</div>}

        {result.strengths.length > 0 && <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4"><p className="text-sm font-bold text-emerald-900">Что получилось хорошо</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">{result.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div>}
        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"><span className="font-bold">Обратная связь: </span>{result.feedback}</div>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={next} className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white transition hover:bg-amber-700">Следующее задание <Send className="h-4 w-4" /></button><button onClick={onBack} className="rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200">Назад</button></div>
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
        <div className="mb-6 flex items-center justify-between gap-3"><h2 className="text-2xl font-extrabold text-slate-900">Teil 2</h2><button onClick={() => setShowRu(v => !v)} title="Русский перевод" className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition', showRu ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}><Eye className="h-4 w-4" /></button></div>
        <div className="text-[15px] leading-7 text-slate-800">
          <GermanWordTooltip text={task.situation} />
          <div className="mt-5 space-y-1 pl-4 sm:pl-8">{points.map((point, i) => <div key={i} className="flex gap-3"><span className="shrink-0">–</span><GermanWordTooltip text={point} /></div>)}</div>
          {showRu && <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-slate-700"><p className="mb-2 font-bold text-amber-800">Перевод задания</p><p>{situationRu}</p><div className="mt-3 space-y-1">{points.map((point, i) => <p key={i}>– {POINT_RU[point] ?? point}</p>)}</div></div>}
        </div>

        <div className="mx-auto mt-8 max-w-md rotate-[-1deg] border border-slate-300 bg-slate-50 px-5 py-4 text-center shadow-md"><p className="text-sm font-medium italic leading-6 text-slate-600">Schreiben Sie zu jedem Punkt<br />ein bis zwei Sätze auf dem<br />Antwortbogen (circa 30 Wörter).<br />Schreiben Sie auch eine Anrede<br />und einen Gruß.</p>{showRu && <p className="mt-3 border-t border-slate-200 pt-3 text-xs font-medium not-italic leading-5 text-amber-800">{INSTRUCTION_RU}</p>}</div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800"><PenLine className="h-4 w-4 text-amber-700" /> {showRu ? 'Ваш ответ' : 'Ihre Antwort'}</div>
          <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800"><span>{showRu ? 'Около 30 слов' : 'Circa 30 Wörter'}</span><span className={cn('rounded-full px-2.5 py-1 font-bold', validLength ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-600')}>{words} / {MIN_WORDS}–{MAX_WORDS}</span></div>
          <textarea value={text} onChange={e => { setText(e.target.value); setImageData(''); setFileName(''); setResult(null); }} placeholder={showRu ? 'Напишите здесь свой ответ…' : 'Schreiben Sie Ihre Antwort hier...'} className="min-h-[230px] w-full resize-y rounded-xl border border-slate-200 p-4 text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />

          <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-amber-400 hover:bg-amber-50"><FileUp className="h-5 w-5 shrink-0 text-slate-500" /><span className="min-w-0 flex-1 text-sm text-slate-600">{showRu ? 'Или загрузите фото рукописного письма — ИИ распознает и проверит его' : 'Oder Foto des handgeschriebenen Briefes hochladen — die KI erkennt und prüft den Text'}</span><input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => { void handleImage(e.target.files?.[0]); e.currentTarget.value = ''; }} /></label>
          {fileName && <div className="mt-2 flex items-center gap-2 text-xs text-slate-500"><span className="truncate">Фото: {fileName}</span>{imageData && <img src={imageData} alt="Предпросмотр рукописного ответа" className="h-12 w-12 rounded-lg border border-slate-200 object-cover" />}</div>}
          {error && <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3 text-sm leading-5 text-red-700">{error}</div>}

          <button onClick={() => void finish()} disabled={checking || (!text.trim() && !imageData)} className={cn('mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition', !checking && (text.trim() || imageData) ? 'bg-amber-600 text-white hover:bg-amber-700' : 'cursor-not-allowed bg-slate-100 text-slate-400')}>{checking ? <><Loader2 className="h-4 w-4 animate-spin" /> ИИ проверяет письмо…</> : <><CheckCircle2 className="h-4 w-4" /> {showRu ? 'Проверить письмо' : 'Prüfen'}</>}</button>
          <p className="mt-2 text-center text-xs leading-5 text-slate-400">ИИ проверяет выполнение всех пунктов, обращение и прощание, понятность, грамматику, лексику и орфографию уровня A1.</p>
        </div>
      </div>
    </section>
    <button onClick={() => { setIndex(progress.nextIndex); setText(''); setFileName(''); setImageData(''); setResult(null); setError(''); }} className="mx-auto mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-700"><RotateCcw className="h-3.5 w-3.5" /> Mit gespeicherter Position fortsetzen</button>
  </div>;
}
