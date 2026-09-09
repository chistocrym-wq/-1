import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Lightbulb, X } from 'lucide-react';

interface Secret {
  title: string;
  rule: string;
  exampleDe?: string;
  exampleRu?: string;
  detail?: string;
  mapping?: Array<{ label: string; answer: string; note?: string }>;
}

const secrets: Secret[] = [
  {
    title: 'Сначала смотри на само задание',
    rule: 'Не нужно придумывать письмо с нуля. Возьми информацию прямо из ситуации и трёх пунктов задания. Каждый пункт преврати в свой короткий ответ.',
    detail: 'Секрет: задание уже подсказывает тебе, ЧТО написать. Тебе остаётся правильно превратить эти подсказки в простые немецкие предложения и добавить немного своей информации.',
    mapping: [
      { label: 'Почему вы хотите курс?', answer: 'Ich möchte gern einen Tenniskurs besuchen, weil ich Tennis lernen möchte.', note: 'Берём тему «Tenniskurs» из задания и добавляем свою причину.' },
      { label: 'В какие дни?', answer: 'An welchen Tagen findet der Kurs statt?', note: 'Из пункта «An welchen Tagen?» делаем естественный вопрос.' },
      { label: 'Цена?', answer: 'Wie viel kostet der Kurs?', note: 'Пункт «Preis» превращаем в простой вопрос о стоимости.' },
    ],
    exampleDe: 'Sehr geehrte Damen und Herren,\nich möchte gern einen Tenniskurs besuchen, weil ich Tennis lernen möchte.\nAn welchen Tagen findet der Kurs statt? Wie viel kostet der Kurs?\nMit freundlichen Grüßen\nJulia',
    exampleRu: 'Уважаемые дамы и господа,\nя хотела бы посещать курс тенниса, потому что хочу научиться играть в теннис.\nВ какие дни проходит курс? Сколько стоит курс?\nС уважением,\nЮлия',
  },
  {
    title: 'Три пункта → три ответа',
    rule: 'Главное правило Schreiben A1: не пропусти ни один пункт. За каждый раскрытый пункт начисляются баллы.',
    detail: 'Проверь письмо глазами ещё раз: пункт 1 выполнен? Пункт 2 выполнен? Пункт 3 выполнен? Даже простой ответ лучше красивого текста, в котором один пункт забыт.',
    exampleDe: 'Punkt 1 → ein Satz\nPunkt 2 → ein Satz\nPunkt 3 → ein Satz',
    exampleRu: 'Пункт 1 → один ответ\nПункт 2 → один ответ\nПункт 3 → один ответ',
  },
  {
    title: 'Пиши коротко и понятно',
    rule: 'На уровне A1 лучше использовать простые предложения. Не пытайся показать сложную грамматику, если не уверен(а) в ней.',
    exampleDe: 'Ich bin krank.\nIch kann heute nicht kommen.\nIch komme morgen.',
    exampleRu: 'Я болею.\nЯ сегодня не могу прийти.\nЯ приду завтра.',
    detail: 'Короткое понятное предложение легче проверить и сложнее случайно испортить.',
  },
  {
    title: 'Обращение — обязательно',
    rule: 'В начале письма должно быть правильное обращение. После обращения ставится запятая.',
    mapping: [
      { label: 'Мужчине', answer: 'Lieber Peter,' },
      { label: 'Женщине', answer: 'Liebe Anna,' },
      { label: 'Официально, имя неизвестно', answer: 'Sehr geehrte Damen und Herren,' },
    ],
    detail: 'Выбирай форму по тому, кому адресовано письмо: личное или официальное.',
  },
  {
    title: 'Правильное прощание',
    rule: 'Закончи письмо стандартной формулой и обязательно напиши своё имя.',
    mapping: [
      { label: 'Личное письмо', answer: 'Viele Grüße\nJulia' },
      { label: 'Официальное письмо', answer: 'Mit freundlichen Grüßen\nJulia' },
    ],
  },
  {
    title: 'Глагол — на втором месте',
    rule: 'В обычном повествовательном предложении после подлежащего ставь спрягаемый глагол на второе место.',
    exampleDe: 'Ich komme am Freitag.\nWir können morgen kommen.',
    exampleRu: 'Я приеду в пятницу.\nМы можем прийти завтра.',
    detail: 'Схема: Подлежащее + глагол + остальная часть предложения.',
  },
  {
    title: 'Вопрос начинай правильно',
    rule: 'С вопросительным словом: вопросительное слово → глагол → подлежащее. Без вопросительного слова: глагол → подлежащее.',
    mapping: [
      { label: 'Wann?', answer: 'Wann beginnt der Kurs?' },
      { label: 'Wo?', answer: 'Wo findet der Kurs statt?' },
      { label: 'Ja/Nein-Frage', answer: 'Kostet der Kurs 50 Euro?' },
    ],
    detail: 'На A1 тебе особенно пригодятся: wer, was, wo, wohin, woher, wie, wann, warum, wie viel, wie lange.',
  },
  {
    title: 'Модальный глагол + инфинитив',
    rule: 'Если есть können, wollen, müssen или mögen, модальный глагол стоит на втором месте, а основной глагол уходит в конец.',
    exampleDe: 'Ich will Deutsch lernen.\nWir können morgen kommen.',
    exampleRu: 'Я хочу учить немецкий.\nМы можем прийти завтра.',
  },
  {
    title: 'Не путай am, um и im',
    rule: 'Запомни три маленьких слова для времени: am — день, um — точное время, im — месяц или время года.',
    mapping: [
      { label: 'День', answer: 'am Montag', note: 'в понедельник' },
      { label: 'Точное время', answer: 'um 18 Uhr', note: 'в 18 часов' },
      { label: 'Месяц', answer: 'im September', note: 'в сентябре' },
    ],
  },
  {
    title: 'Финальная проверка перед сдачей',
    rule: 'Перед чистовиком быстро проверь письмо по чек-листу. Это помогает не потерять баллы из-за пропуска.',
    mapping: [
      { label: '1', answer: 'Около 30 слов' },
      { label: '2', answer: 'Есть обращение' },
      { label: '3', answer: 'Все 3 пункта выполнены' },
      { label: '4', answer: 'Есть заключение' },
      { label: '5', answer: 'Есть прощание и имя' },
      { label: '6', answer: 'Проверен порядок слов и глаголы' },
    ],
    detail: 'Формула перед экзаменом: ОБРАЩЕНИЕ → 3 ПУНКТА → ЗАКЛЮЧЕНИЕ → ПРОЩАНИЕ → ИМЯ.',
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SchreibenSecrets({ open, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const secret = secrets[index];

  useEffect(() => {
    if (!open) return;
    setIndex(0);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') setIndex((value) => Math.min(value + 1, secrets.length - 1));
      if (event.key === 'ArrowLeft') setIndex((value) => Math.max(value - 1, 0));
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const isFirst = index === 0;
  const isLast = index === secrets.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label="Секреты успеха написания писем">
      <div className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-white px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Schreiben · Teil 2</p>
              <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">Секреты успеха написания писем</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800" aria-label="Закрыть">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid min-h-full grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="relative hidden overflow-hidden bg-gradient-to-b from-amber-50 via-white to-slate-50 lg:flex lg:flex-col lg:items-center lg:justify-end lg:px-4 lg:pt-6">
              <div className="absolute left-3 top-5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-amber-700 shadow-sm">Отто подсказывает</div>
              <img src="/otto.png" alt="Отто — помощник" className="mb-4 h-64 w-48 object-contain object-bottom drop-shadow-xl" />
              <div className="mb-7 rounded-2xl border border-amber-100 bg-white/90 p-3 text-center text-xs leading-5 text-slate-600 shadow-sm">
                Смотри на задание,<br />пиши просто и<br /><span className="font-bold text-amber-700">не пропускай пункты!</span>
              </div>
            </aside>

            <main className="min-w-0 p-4 sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Секрет {index + 1} из {secrets.length}</p>
                  <h3 className="mt-1 text-xl font-bold leading-tight text-slate-900 sm:text-2xl">{secret.title}</h3>
                </div>
                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700 sm:flex">
                  <span className="text-lg font-extrabold">{index + 1}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-amber-800">Правило</p>
                <p className="mt-2 text-[15px] leading-7 text-slate-800 sm:text-base">{secret.rule}</p>
              </div>

              {secret.mapping && (
                <div className="mt-5 space-y-2.5">
                  {secret.mapping.map((item, itemIndex) => (
                    <div key={`${item.label}-${itemIndex}`} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-4">
                      <div className="flex gap-3">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-xs font-bold text-teal-700">{isFirst ? itemIndex + 1 : item.label}</div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-500">{item.label}</p>
                          <p className="mt-1 whitespace-pre-line text-[15px] font-semibold leading-6 text-slate-900">{item.answer}</p>
                          {item.note && <p className="mt-1 text-xs leading-5 text-slate-500">{item.note}</p>}
                        </div>
                        {isFirst && itemIndex < 2 && <ArrowRight className="mt-2 hidden h-4 w-4 shrink-0 text-amber-500 sm:block" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {secret.exampleDe && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Пример · Deutsch</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-800">{secret.exampleDe}</p>
                  </div>
                  {secret.exampleRu && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Перевод · Русский</p>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{secret.exampleRu}</p>
                    </div>
                  )}
                </div>
              )}

              {secret.detail && (
                <div className="mt-5 flex gap-3 rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                  <p className="text-sm leading-6 text-teal-950">{secret.detail}</p>
                </div>
              )}

              <div className="mt-5 flex items-center justify-center gap-1.5">
                {secrets.map((_, dotIndex) => (
                  <button key={dotIndex} type="button" onClick={() => setIndex(dotIndex)} aria-label={`Секрет ${dotIndex + 1}`} className={`h-2 rounded-full transition-all ${dotIndex === index ? 'w-6 bg-amber-500' : 'w-2 bg-slate-200 hover:bg-slate-300'}`} />
                ))}
              </div>
            </main>
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-white px-4 py-3 sm:px-6">
          <button type="button" disabled={isFirst} onClick={() => setIndex((value) => Math.max(0, value - 1))} className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
            <ChevronLeft className="h-4 w-4" /> Назад
          </button>
          <p className="hidden text-xs font-medium text-slate-400 sm:block">Стрелки ← → тоже работают</p>
          <button type="button" onClick={() => isLast ? onClose() : setIndex((value) => Math.min(secrets.length - 1, value + 1))} className="flex min-h-11 items-center gap-2 rounded-xl bg-amber-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700">
            {isLast ? 'Готово' : 'Следующий секрет'} {isLast ? <CheckCircle2 className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </footer>
      </div>
    </div>
  );
}
