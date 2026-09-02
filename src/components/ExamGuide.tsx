import { ArrowLeft, Clock, BookOpen, Headphones, PenTool, Mic, Award, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface ExamGuideProps {
  onBack: () => void;
}

const examParts = [
  {
    icon: BookOpen,
    title: 'Lesen — Чтение',
    duration: '30 минут',
    parts: '3 части, 15 заданий',
    maxPoints: '75 баллов',
    tips: [
      'Сначала прочитайте вопросы, потом текст',
      'Teil 1: краткие письма/сообщения — выберите правильный ответ',
      'Teil 2: информационные тексты — верно/неверно',
      'Teil 3: текст с деталями — выберите правильный ответ',
    ],
  },
  {
    icon: Headphones,
    title: 'Hören — Аудирование',
    duration: '~20 минут',
    parts: '4 части, 15 заданий',
    maxPoints: '75 баллов',
    tips: [
      'Каждый диалог звучит дважды',
      'Teil 1: короткие повседневные диалоги',
      'Teil 2–4: более длинные разговоры',
      'Делайте пометки во время прослушивания',
    ],
  },
  {
    icon: PenTool,
    title: 'Schreiben — Письмо',
    duration: '20 минут',
    parts: '2 части',
    maxPoints: '45 баллов',
    tips: [
      'Teil 1: заполнить формуляр личными данными',
      'Teil 2: написать email/сообщение по ситуации',
      'Покройте все пункты задания (5 пунктов)',
      'Соблюдайте объём: 30–80 слов',
    ],
  },
  {
    icon: Mic,
    title: 'Sprechen — Говорение',
    duration: '~15 минут',
    parts: '3 части',
    maxPoints: '45 баллов',
    tips: [
      'Teil 1: представиться (Name, Herkunft, Beruf, etc.)',
      'Teil 2: тема на выбор — говорить 2–3 минуты',
      'Teil 3: попросить о чём-то / задать вопросы',
      'Говорите чётко и не торопитесь',
    ],
  },
];

const generalTips = [
  { icon: CheckCircle2, text: 'Проходите все 4 модуля тренажёра последовательно', type: 'do' },
  { icon: CheckCircle2, text: 'Повторяйте слабые места до уверенного результата', type: 'do' },
  { icon: CheckCircle2, text: 'Перед экзаменом пройдите тестовый экзамен целиком', type: 'do' },
  { icon: CheckCircle2, text: 'Учите базовую лексику A1: ~650 слов', type: 'do' },
  { icon: XCircle, text: 'Не пытайтесь угадывать — лучше честно отметить ответ', type: 'dont' },
  { icon: XCircle, text: 'Не тратьте слишком много времени на одно задание', type: 'dont' },
  { icon: XCircle, text: 'Не пишите слишком длинный текст в Schreiben', type: 'dont' },
];

export function ExamGuide({ onBack }: ExamGuideProps) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Гайды и помощники</h2>
          <p className="text-sm text-slate-500">Материалы для успешной сдачи экзамена</p>
        </div>
      </div>

      {/* Exam overview */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 mb-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-6 h-6 text-teal-400" />
          <h3 className="text-lg font-semibold text-white">Goethe-Zertifikat A1 — структура экзамена</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-white/10 p-3">
            <Clock className="w-5 h-5 text-teal-400 mb-1.5" />
            <p className="text-white/90 text-sm font-medium">~65 минут</p>
            <p className="text-white/50 text-xs">общее время</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3">
            <BookOpen className="w-5 h-5 text-teal-400 mb-1.5" />
            <p className="text-white/90 text-sm font-medium">4 части</p>
            <p className="text-white/50 text-xs">Lesen, Hören, Schreiben, Sprechen</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3">
            <Award className="w-5 h-5 text-teal-400 mb-1.5" />
            <p className="text-white/90 text-sm font-medium">240 баллов</p>
            <p className="text-white/50 text-xs">максимум</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3">
            <CheckCircle2 className="w-5 h-5 text-teal-400 mb-1.5" />
            <p className="text-white/90 text-sm font-medium">60%</p>
            <p className="text-white/50 text-xs">для сдачи</p>
          </div>
        </div>
      </div>

      {/* Exam parts */}
      <div className="space-y-4 mb-6">
        {examParts.map((part, idx) => {
          const Icon = part.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-5 animate-slide-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 shrink-0">
                  <Icon className="w-5 h-5 text-teal-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{part.title}</h3>
                  <div className="flex flex-wrap gap-x-3 text-xs text-slate-500">
                    <span>{part.duration}</span>
                    <span>·</span>
                    <span>{part.parts}</span>
                    <span>·</span>
                    <span>{part.maxPoints}</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-1.5 ml-13">
                {part.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                    <span className="text-sm text-slate-600">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Do's and Don'ts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="font-semibold text-emerald-800 mb-3">Что делать</h3>
          <div className="space-y-2">
            {generalTips.filter((t) => t.type === 'do').map((tip, i) => {
              const Icon = tip.icon;
              return (
                <div key={i} className="flex items-start gap-2">
                  <Icon className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-emerald-700">{tip.text}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <h3 className="font-semibold text-rose-800 mb-3">Чего избегать</h3>
          <div className="space-y-2">
            {generalTips.filter((t) => t.type === 'dont').map((tip, i) => {
              const Icon = tip.icon;
              return (
                <div key={i} className="flex items-start gap-2">
                  <Icon className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-rose-700">{tip.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scoring */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Оценка результатов</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Для успешной сдачи экзамена необходимо набрать минимум 60% баллов (144 из 240).
              Результаты оцениваются как «bestanden» (сдано) или «nicht bestanden» (не сдано).
              Оценки не делятся на «отлично» или «хорошо» — важно только преодолеть порог.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
