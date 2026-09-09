import { useMemo, useState } from 'react';
import { ArrowLeft, Check, CheckCircle2, Eye, FileText, Trophy, X } from 'lucide-react';
import { schreibenTeil1Tasks } from '@/data/schreibenTeil1Imported';
import { useSchreibenProgress } from '@/hooks/useSchreibenProgress';
import { GermanWordTooltip } from './GermanWordTooltip';
import { cn } from '@/lib/utils';

const numberWords: Record<string, string> = { null: '0', eins: '1', eine: '1', ein: '1', zwei: '2', drei: '3', vier: '4', fünf: '5', sechs: '6', sieben: '7', acht: '8', neun: '9', zehn: '10' };
function normalize(value: string) {
  return value.toLowerCase().replace(/[.,!?;:/()]/g, ' ').replace(/\b(sechs|fünf|vier|drei|zwei|eins|eine|ein|acht|sieben|neun|zehn|null)\b/g, (m) => numberWords[m] ?? m).replace(/\s+/g, ' ').trim();
}
function isCorrect(actual: string, expected: string) {
  const a = normalize(actual); const e = normalize(expected); if (!a) return false;
  if (a === e || a.replace(/\s/g, '') === e.replace(/\s/g, '')) return true;
  const alternatives = [e.replace(/\b0(\d)/g, '$1'), e.replace(/\s+(uhr|jahre?|euro|personen|paar)$/g, '')];
  return alternatives.some((alt) => a === alt || a.replace(/\s/g, '') === alt.replace(/\s/g, ''));
}

const INSTRUCTION_RU = 'Помогите своей подруге / своему другу и впишите пять недостающих сведений в формуляр.';

// Permanent local translations: no API/AI call is used when the eye is pressed.
const SITUATION_RU: Record<string, string> = {
  'schreiben-teil1-1': 'Ваша подруга Ивонна Легран из Франции, родилась 17.4.1993 в Лионе и хочет с 1 по 28 августа пройти курс немецкого языка в Германии. Она уже шесть месяцев учит немецкий. Утром у неё есть время. В школе она учила английский. Она хочет учиться на курсе для начинающих, и вы помогаете ей заполнить регистрацию.',
  'schreiben-teil1-2': 'Ваш друг Владимир Серяков, 30 лет, живёт в Гамбурге и работает экскурсоводом. Со вчерашнего дня у него температура 39 градусов. Сегодня он идёт к врачу, потому что ему не становится лучше. Он застрахован в AOK. Врач хочет узнать, с какого времени Владимир болеет и что у него болит. Для карты пациента также нужны его почтовый индекс, возраст и профессия.',
  'schreiben-teil1-3': 'Вашему коллеге Кариму Мюллеру 23 года. Он работает в автомастерской и у него ещё нет мобильного телефона. В интернете он нашёл розыгрыш Nokia 8210. Для участия нужно указать имя, год рождения, профессию и личные данные. Карим женат и хочет, чтобы после работы ему позвонили домой. Вы помогаете ему заполнить формуляр.',
  'schreiben-teil1-4': 'Семья Новак хочет провести одну неделю во время летних каникул на озере Химзее. Семья приезжает 20 июля и уезжает 27 июля. Всего приезжают четыре человека. Нужны две спальни. Завтрак семья заказывать не хочет. Они приезжают без домашнего животного.',
  'schreiben-teil1-5': 'Павел Ковальски работает днём на складе и поэтому может посещать курс немецкого только вечером. В сентябре он хочет начать немецкий A1. По понедельникам и средам он может приходить с 18 часов. У него уже есть электронная почта, и он хочет получать материалы курса по e-mail. Языковая школа спрашивает данные о курсе, днях занятий, времени начала, e-mail и оплате.',
  'schreiben-teil1-6': 'Анна Вебер 1 сентября переезжает в новую квартиру и одновременно хочет начать тренироваться. Она родилась 5.11.1990. Больше всего ей нравится фитнес, она может приходить по понедельникам и средам. Ежемесячная плата должна быть не больше 30 евро. FitPlus предлагает подходящий договор за 29 евро в месяц. Анна хочет стать членом клуба с 1 сентября.',
  'schreiben-teil1-7': 'Даниэль Беккер недавно приехал в Кёльн и хочет брать книги в городской библиотеке. Он родился 14.03.1995. Его новый адрес — Hauptstraße 17, почтовый индекс 50667. Библиотека может связаться с ним по телефону 0221 / 333 44 55. Его e-mail: daniel@test.de. Библиотечный билет действителен до 31.12.',
  'schreiben-teil1-8': 'Елена Мартин приехала из Испании и хочет в сентябре посещать вечерний курс немецкого языка. Её родной язык — испанский. Раньше она не посещала курсы немецкого и поэтому может учиться только на курсе для начинающих. Курс начинается 3 сентября. Елена работает до 17 часов и может заниматься по четвергам в 18:30.',
  'schreiben-teil1-9': 'Лукасу Шмидту восемь лет, и во время каникул он хочет научиться плавать. Он новичок и раньше никогда не посещал курс плавания. Его мама может сопровождать его по субботам. Курс всегда начинается в 10 часов. В экстренном случае с мамой можно связаться по телефону 0172 / 555 66 77.',
  'schreiben-teil1-10': 'У Софии Келлер уже два дня сильная зубная боль, и она хочет как можно скорее попасть к стоматологу. Во вторник она может прийти в 14:30. Она застрахована в TK. Клиника может перезвонить Софии по телефону 040 / 444 55 66.',
  'schreiben-teil1-11': 'Семья Новак хочет в июле провести неделю в отпуске. Они приезжают 20.07. и уезжают 27.07. Всего приезжают четыре человека. Семье нужны две спальни. Они хотят забронировать жильё без завтрака и приезжают без домашнего животного.',
  'schreiben-teil1-12': 'Томас Кляйн хочет совершить однодневную поездку в Гамбург с двумя друзьями. Поездка состоится 10.10. Автобус отправляется в 7:30, обратный путь запланирован на 19:00. Три человека встречаются на вокзале у западного входа. Томас хочет сегодня оформить бронирование в туристическом агентстве.',
  'schreiben-teil1-13': 'Эмма Бергер должна с 1 сентября посещать детский сад Sonnenschein. Она родилась 09.05.2021. Её мама Лина Бергер хочет, чтобы Эмма каждый день была в саду с 8 до 14 часов. У Эммы нет аллергии. В экстренном случае с семьёй можно связаться по телефону 030 / 765 43 21.',
  'schreiben-teil1-14': 'Йонасу Фишеру 19 лет, и он хочет впервые научиться играть на пианино. Поэтому он ищет курс для начинающих. В среду в 17 часов у него есть время. Он может регулярно посещать занятия. Музыкальной школе перед первым занятием нужны данные для регистрации.',
  'schreiben-teil1-15': 'Лаура Кёниг хочет осенью получить водительские права. Она родилась 22.01.2002. Ей нужны права для обычного автомобиля — категория B. На теорию она может приходить по понедельникам и четвергам. Следующий курс начинается 05.09. С Лаурой можно связаться по телефону 0178 / 222 11 00.',
  'schreiben-teil1-16': 'Мехмет Йылмаз ждёт посылку. Номер посылки DE123456789. Он хочет забрать её в пятницу в филиале на Hauptstraße 20. С собой он возьмёт удостоверение личности. Для вопросов почта может связаться с ним по телефону 0159 / 456 78 90.',
  'schreiben-teil1-17': 'Макс Хоффман учится в школе Goethe-Schule, в классе 8b. Он родился 14.08.2010 и живёт на Schulstraße 5. Для нового школьного удостоверения ему также нужно предоставить актуальную фотографию.',
  'schreiben-teil1-18': 'Юлия Рот изучает германистику и хочет пополнить свою студенческую карту столовой. Её номер студента — 20261234. У неё нет аллергии. Она хочет положить на карту 20 евро. Забрать карту можно в понедельник в столовой.',
  'schreiben-teil1-19': 'Ахмед Хассан работает поваром и ищет новую работу. Он родился 03.04.1987. В четверг в 10:15 у него есть время для консультации. Причина встречи — поиск работы. Его клиентский номер A-4587.',
  'schreiben-teil1-20': 'Нина Петрова интересуется двухкомнатной квартирой. Арендодатель предлагает осмотр во вторник, 18.06., в 17:30. Нина придёт одна. Её e-mail: nina@test.de. Для связи арендодателю также нужен её телефон 0176 / 333 44 55.',
  'schreiben-teil1-21': 'Стефан Вольф переезжает на Parkstraße и хочет оформить клиентскую карту в прачечной. Его адрес: Parkweg 12, 10115 Berlin. В первую очередь он хочет пользоваться программой для большой стирки. Карта должна действовать с 1 сентября. Ежемесячная плата — 12 евро.',
  'schreiben-teil1-22': 'Надин Бауэр хочет купить две карты на концерт «Sommermusik». Концерт состоится 21.07. Она хочет сидячие места и забрать билеты в вечерней кассе. Цена двух билетов — 40 евро.',
  'schreiben-teil1-23': 'Петер Ланг хочет заказать на субботу два цельнозерновых хлеба и яблочный пирог. Он заберёт заказ в 9 часов в филиале на Hafenstraße 4. При изменениях пекарня должна связаться с ним по телефону 040 / 123 67 89.',
  'schreiben-teil1-24': 'Мария Штайн ведёт свою четырёхлетнюю кошку Мими к ветеринару. Мими нужна прививка. Приём назначен на среду в 11 часов. Мария хочет, чтобы с ней можно было связаться по телефону 0171 / 555 44 33.',
  'schreiben-teil1-25': 'Ева Зоммер хочет посетить городской музей с группой. Посещение запланировано на 14.09. в 11 часов. В группе десять человек. Ева хочет заказать экскурсию на немецком языке.',
  'schreiben-teil1-26': 'Роберт Майер хочет играть в футбол в спортивном клубе. Он родился в 1997 году. Тренировка проходит по вторникам в 19 часов. Размер спортивной одежды Роберта — L. Для регистрации он оставляет телефон 0162 / 777 66 55.',
  'schreiben-teil1-27': 'Сара Али хочет в субботу, 22.06., посидеть в кафе с тремя друзьями. Она бронирует столик на 19 часов для четырёх человек. Бронь оформляется на её имя. Подтверждение кафе может отправить на номер 0173 / 111 22 44. Сара хотела бы сидеть внутри.',
  'schreiben-teil1-28': 'Клаус Рихтер потерял ключ от квартиры и сегодня нуждается в слесаре. Он живёт на Gartenstraße 9. Мастер должен прийти в 20 часов. С Клаусом можно связаться по телефону 0151 / 987 65 40. Он хочет оплатить счёт наличными.',
  'schreiben-teil1-29': 'Лиза Вагнер хочет заказать в обувном магазине модель «City Runner». Она носит размер 39 и хочет чёрные туфли. Ей нужна одна пара, и в пятницу она может забрать заказ в магазине. Для связи она оставляет телефон 0170 / 222 33 11.',
  'schreiben-teil1-30': 'Семья Фишер хочет в начале августа отправиться в поездку с палаткой. Они приезжают 02.08. и уезжают 08.08. Вместе едут три человека. Им нужно место для палатки, и они приезжают на автомобиле.'
};

export function SchreibenTeil1Runner({ onBack }: { onBack: () => void }) {
  const { progress, record } = useSchreibenProgress(1, 30);
  const taskIndex = progress.nextIndex % schreibenTeil1Tasks.length;
  const task = schreibenTeil1Tasks[taskIndex];
  const editableFields = useMemo(() => task.fields.filter((field) => field.editable), [task]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [completedNumber, setCompletedNumber] = useState(taskIndex + 1);
  const [showRussian, setShowRussian] = useState(false);
  const allAnswered = editableFields.length === 5 && editableFields.every((field) => Boolean(answers[field.id]?.trim()));

  const complete = () => {
    const map: Record<string, boolean> = {};
    editableFields.forEach((field) => { map[field.id] = isCorrect(answers[field.id] || '', field.answer); });
    const correct = editableFields.filter((field) => map[field.id]).length;
    const score = Math.round((correct / editableFields.length) * 100);
    setChecked(map); setCompletedNumber(taskIndex + 1); setResult(score); record(score);
  };
  const nextTask = () => { setAnswers({}); setChecked({}); setResult(null); setShowRussian(false); };
  const errors = editableFields.filter((field) => !checked[field.id]);
  const situationRu = SITUATION_RU[task.id] ?? '';

  if (result !== null) return <div className="animate-fade-in">
    <div className="mb-6 flex items-center gap-3"><button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"><ArrowLeft className="h-5 w-5 text-slate-600" /></button><div><p className="text-sm text-slate-500">SCHREIBEN · TEIL 1</p><h2 className="text-xl font-bold text-slate-900">Ergebnis · Formular {completedNumber} / 30</h2></div></div>
    <div className="mb-5 rounded-2xl border border-sky-200 bg-sky-50 p-6 text-center"><div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm"><Trophy className="h-10 w-10 text-sky-600" /></div><div className="text-5xl font-bold text-sky-700">{result}</div><p className="mt-2 text-sm font-medium text-slate-600">{editableFields.length - errors.length} von {editableFields.length} Antworten richtig</p></div>
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="mb-4 font-bold text-slate-900">Auswertung</h3><div className="space-y-3">{editableFields.map((field) => { const ok = checked[field.id]; return <div key={field.id} className={cn('rounded-xl border p-4', ok ? 'border-emerald-200 bg-emerald-50/60' : 'border-rose-200 bg-rose-50/60')}><div className="flex items-start gap-3"><div className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full', ok ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white')}>{ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}</div><div className="min-w-0 flex-1"><p className="text-sm font-bold text-slate-800"><GermanWordTooltip text={field.label} /></p><p className="mt-1 text-sm text-slate-600">Ihr Antwort: <span className="font-medium">{answers[field.id] || '—'}</span></p><p className="mt-1 text-sm text-slate-700">Richtig: <span className="font-semibold">{field.answer}</span></p>{!ok && <p className="mt-2 text-sm leading-5 text-rose-700">Die Angabe passt nicht zum Text. Lesen Sie die entsprechende Information noch einmal und übertragen Sie sie möglichst genau.</p>}</div></div></div>; })}</div><div className="mt-5 grid gap-3 sm:grid-cols-2"><button onClick={nextTask} className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700">Nächste Aufgabe <CheckCircle2 className="h-4 w-4" /></button><button onClick={onBack} className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200"><ArrowLeft className="h-4 w-4" /> Zu SCHREIBEN</button></div></div></div>;

  return <div className="animate-fade-in">
    <div className="mb-6 flex items-center gap-3"><button onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50" aria-label="Zurück"><ArrowLeft className="h-5 w-5 text-slate-600" /></button><div className="min-w-0 flex-1"><p className="text-sm text-slate-500">SCHREIBEN · TEIL 1</p><h2 className="text-xl font-bold text-slate-900">Formular {taskIndex + 1} / 30</h2></div><button type="button" title="Русский перевод" aria-label="Показать перевод задания" onClick={() => setShowRussian((v) => !v)} className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all', showRussian ? 'border-sky-400 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-500 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700')}><Eye className="h-5 w-5" /></button></div>
    <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${((taskIndex + 1) / 30) * 100}%` }} /></div>
    <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 p-5">
      <div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-bold text-sky-800">{showRussian ? task.title : <GermanWordTooltip text={task.title} />}</h3><span className="rounded-full bg-white/80 px-2 py-1 text-xs font-bold text-sky-700">5 Lücken</span></div>
      <div className="leading-7 text-slate-700">{showRussian ? <><p>{situationRu}</p><p className="mt-3 text-xs font-semibold uppercase tracking-wide text-sky-700">{INSTRUCTION_RU}</p></> : <><p><GermanWordTooltip text={task.situation} /></p><p className="mt-3 text-xs font-semibold uppercase tracking-wide text-sky-700"><GermanWordTooltip text={task.instruction} /></p></>}</div>
    </div>

    <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm sm:p-6"><div className="mb-5 border-b-4 border-slate-300 bg-slate-200 px-4 py-3"><div className="text-xs font-semibold uppercase tracking-wider text-slate-500"><GermanWordTooltip text="Goethe-Zertifikat A1 · Schreiben" /></div><div className="mt-1 text-lg font-bold text-slate-900"><GermanWordTooltip text={task.formTitle} /></div><div className="text-xs text-slate-500"><GermanWordTooltip text={task.formSubtitle} /></div></div>
      <div className="space-y-1 border border-slate-300 bg-slate-100 p-1">{task.fields.map((field) => <div key={field.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] items-stretch border border-slate-300 bg-white sm:grid-cols-[minmax(160px,0.8fr)_minmax(0,1.4fr)]"><div className="flex items-center border-r border-slate-300 bg-slate-100 px-3 py-3 text-sm font-medium text-slate-600"><GermanWordTooltip text={field.label} /></div><div className={cn('min-h-[48px] px-2 py-2',field.editable?'bg-sky-50/70':'bg-slate-50')}>{field.editable && field.type === 'radio' && field.options ? <div className="flex min-h-[40px] flex-wrap items-center gap-2">{field.options.map((option) => { const selected = answers[field.id] === option; return <button key={option} type="button" onClick={() => setAnswers((prev) => ({ ...prev, [field.id]: option }))} className={cn('rounded-lg border px-4 py-2 text-sm font-semibold transition-all',selected?'border-sky-600 bg-sky-600 text-white shadow-sm':'border-sky-200 bg-white text-sky-700 hover:border-sky-400 hover:bg-sky-50')}><GermanWordTooltip text={option} /></button>; })}</div> : field.editable ? <input value={answers[field.id]||''} onChange={(e)=>setAnswers((prev)=>({...prev,[field.id]:e.target.value}))} className="h-10 w-full rounded-md border-2 border-sky-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" placeholder="Ihre Antwort" /> : field.type === 'radio' && field.options ? <div className="flex min-h-[40px] flex-wrap items-center gap-2 rounded-md bg-slate-200 px-3 py-2 text-sm font-medium text-slate-600">{field.options.map((option)=><span key={option}><GermanWordTooltip text={option}/></span>)}</div> : <div className="flex min-h-[40px] items-center rounded-md bg-slate-200 px-3 text-sm font-medium text-slate-700">{field.value || ' '}</div>}</div></div>)}</div>
      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500"><div className="flex items-center gap-2 font-semibold text-slate-700"><FileText className="h-4 w-4 text-sky-600" /> Nur die fünf Lücken ausfüllen</div><div className="mt-1">Lesen Sie die Situation genau und übertragen Sie die fehlenden Informationen in den Formularfeldern.</div></div>
      <button onClick={complete} disabled={!allAnswered} className={cn('mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold transition-all',allAnswered?'bg-sky-600 text-white hover:bg-sky-700':'cursor-not-allowed bg-slate-100 text-slate-400')}><CheckCircle2 className="h-4 w-4" /> PRÜFEN</button>
    </div>
  </div>;
}
