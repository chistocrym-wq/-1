import { ArrowLeft, BookOpen, Headphones, PenTool, Mic, Target, Lightbulb, CheckCircle2 } from 'lucide-react';

interface InstructionsProps {
  onBack: () => void;
}

const steps = [
  {
    icon: BookOpen,
    title: 'Модуль «Lesen» — Чтение',
    description: 'Вам предлагаются аутентичные тексты: письма, объявления, описания. Прочитайте текст, затем ответьте на вопросы, выбрав правильный вариант (A, B, C) или отметив «Richtig / Falsch». После ответа сразу появляется объяснение.',
    tips: ['Внимательно читайте инструкцию к каждому заданию', 'Сначала просмотрите вопросы, потом читайте текст', 'Ищите ключевые слова в тексте'],
  },
  {
    icon: Headphones,
    title: 'Модуль «Hören» — Аудирование',
    description: 'Вы слушаете короткие диалоги и разговоры через встроенный синтезатор речи (озвучивание на немецком языке). Прослушайте аудио и ответьте на вопросы. Можно слушать несколько раз и при необходимости посмотреть транскрипт.',
    tips: ['Слушайте активно — делайте пометки', 'При первом прослушивании уловите общий смысл', 'Используйте повторное прослушивание для деталей'],
  },
  {
    icon: PenTool,
    title: 'Модуль «Schreiben» — Письмо',
    description: 'Вы пишете email, сообщение или заполняете форму по заданной ситуации. Поле для ввода текста показывает количество слов. Чек-лист помогает проверить, все ли ключевые пункты покрыты. После написания можно сравнить с примером ответа.',
    tips: ['Соблюдайте формулу письма: приветствие, основная часть, прощание', 'Покрывайте все пункты из задания', 'Следите за объёмом: 30–80 слов'],
  },
  {
    icon: Mic,
    title: 'Модуль «Sprechen» — Говорение',
    description: 'Вы практикуете устную речь: представляете себя, говорите на выбранную тему, формулируете просьбы. Таймер помогает контролировать время ответа. После практики можно сравнить с примером ответа.',
    tips: ['Говорите вслух, не про себя', 'Записывайте себя на диктофон и прослушивайте', 'Стремитесь к 1–3 минутам на ответ'],
  },
];

export function Instructions({ onBack }: InstructionsProps) {
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
          <h2 className="text-xl font-bold text-slate-900">Инструкция</h2>
          <p className="text-sm text-slate-500">Как заниматься с тренажёром</p>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-800 p-6 mb-6 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <Target className="w-6 h-6 text-white" />
          <h3 className="text-lg font-semibold text-white">Как устроен тренажёр</h3>
        </div>
        <p className="text-white/80 leading-relaxed">
          Тренажёр состоит из четырёх модулей, соответствующих частям экзамена Goethe-Zertifikat A1.
          Каждый модуль содержит несколько заданий. Вы можете проходить их в любом порядке и повторять сколько угодно раз.
          Прогресс сохраняется автоматически в браузере.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-5 animate-slide-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 shrink-0">
                  <Icon className="w-6 h-6 text-teal-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1.5">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{step.description}</p>
                  <div className="space-y-1.5">
                    {step.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                        <span className="text-sm text-slate-600">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">Рекомендация по занятиям</h3>
            <p className="text-sm text-amber-700 leading-relaxed">
              Занимайтесь регулярно, по 20–30 минут в день. Начните с модуля «Lesen», затем переходите к «Hören».
              Письмо и говорение лучше практиковать после освоения первых двух модулей. Перед экзаменом пройдите
              тестовый экзамен, чтобы оценить готовность.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
