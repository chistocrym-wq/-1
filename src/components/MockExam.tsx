import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Clock, Trophy, RotateCcw, BookOpen, Headphones, Volume2, Play, Pause, CheckCircle2, XCircle } from 'lucide-react';
import { readingTasks } from '@/data/reading';
import { listeningTasks } from '@/data/listening';
import type { MultipleChoiceQuestion, TrueFalseQuestion } from '@/types';
import { cn } from '@/lib/utils';

interface MockExamProps {
  onBack: () => void;
}

interface ExamQuestion {
  id: string;
  module: 'lesen' | 'horen';
  taskTitle: string;
  text?: string;
  audioText?: string;
  question: MultipleChoiceQuestion | TrueFalseQuestion;
}

function buildExamQuestions(): ExamQuestion[] {
  const questions: ExamQuestion[] = [];

  for (const task of readingTasks) {
    for (const q of task.questions) {
      questions.push({
        id: q.id,
        module: 'lesen',
        taskTitle: task.title,
        text: task.text,
        question: q,
      });
    }
  }

  for (const task of listeningTasks) {
    for (const q of task.questions) {
      questions.push({
        id: q.id,
        module: 'horen',
        taskTitle: task.title,
        audioText: task.audioText,
        question: q,
      });
    }
  }

  return questions;
}

const EXAM_DURATION = 20 * 60;

export function MockExam({ onBack }: MockExamProps) {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [questions] = useState(buildExamQuestions);
  const [answers, setAnswers] = useState<(number | boolean | null)[]>(() =>
    Array(buildExamQuestions().length).fill(null)
  );
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [started, finished, timeLeft]);

  const handleAnswer = useCallback((index: number, value: number | boolean) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const handleStart = () => {
    setStarted(true);
    setAnswers(Array(questions.length).fill(null));
    setTimeLeft(EXAM_DURATION);
  };

  const handleFinish = () => setFinished(true);

  const handleRetry = () => {
    setStarted(false);
    setFinished(false);
    setAnswers(Array(questions.length).fill(null));
    setTimeLeft(EXAM_DURATION);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate score
  const calculateScore = () => {
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i].question;
      const ans = answers[i];
      if (ans === null) continue;
      if (q.type === 'multiple-choice') {
        if (ans === (q as MultipleChoiceQuestion).correctIndex) correct++;
      } else {
        if (ans === (q as TrueFalseQuestion).correctAnswer) correct++;
      }
    }
    return { correct, total: questions.length };
  };

  // Start screen
  if (!started) {
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
            <h2 className="text-xl font-bold text-slate-900">Тестовый экзамен</h2>
            <p className="text-sm text-slate-500">Проверьте свою готовность</p>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-800 p-8 mb-6 text-center shadow-xl">
          <Trophy className="w-12 h-12 text-white mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Модельный экзамен A1</h3>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Полный тест по чтению и аудированию в условиях, приближенных к экзамену.
            Время ограничено — 20 минут.
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <div className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm">
              <span className="text-white font-semibold">{questions.length}</span>
              <span className="text-white/60 text-sm ml-1">вопросов</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm">
              <span className="text-white font-semibold">20:00</span>
              <span className="text-white/60 text-sm ml-1">минут</span>
            </div>
          </div>
          <button
            onClick={handleStart}
            className="px-8 py-3 rounded-xl bg-white text-teal-700 font-semibold hover:bg-teal-50 transition-colors"
          >
            Начать экзамен
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h4 className="font-semibold text-slate-900 mb-3">Что вас ждёт:</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-teal-700 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-600">
                <b>Lesen</b> — {readingTasks.reduce((acc, t) => acc + t.questions.length, 0)} вопросов по текстам для чтения
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Headphones className="w-5 h-5 text-sky-700 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-600">
                <b>Hören</b> — {listeningTasks.reduce((acc, t) => acc + t.questions.length, 0)} вопросов по аудированию (с озвучкой)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (finished) {
    const { correct, total } = calculateScore();
    const percent = Math.round((correct / total) * 100);
    const passed = percent >= 60;

    const lesenQuestions = questions.filter((q) => q.module === 'lesen');
    const horenQuestions = questions.filter((q) => q.module === 'horen');

    const calcModuleScore = (qs: ExamQuestion[]) => {
      let c = 0;
      for (const q of qs) {
        const idx = questions.indexOf(q);
        const ans = answers[idx];
        if (ans === null) continue;
        if (q.question.type === 'multiple-choice') {
          if (ans === (q.question as MultipleChoiceQuestion).correctIndex) c++;
        } else {
          if (ans === (q.question as TrueFalseQuestion).correctAnswer) c++;
        }
      }
      return { correct: c, total: qs.length };
    };

    const lesenScore = calcModuleScore(lesenQuestions);
    const horenScore = calcModuleScore(horenQuestions);

    return (
      <div className="animate-scale-in flex flex-col items-center py-8">
        <div className={cn(
          'flex items-center justify-center w-20 h-20 rounded-full mb-6',
          passed ? 'bg-emerald-50' : 'bg-rose-50'
        )}>
          <Trophy className={cn('w-10 h-10', passed ? 'text-emerald-600' : 'text-rose-600')} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {passed ? 'Экзамен сдан!' : 'Экзамен не сдан'}
        </h2>
        <p className="text-slate-500 mb-2 text-center">
          {passed
            ? 'Поздравляем! Вы набрали проходной балл.'
            : 'Не расстраивайтесь — потренируйтесь ещё и попробуйте снова.'}
        </p>
        <div className={cn(
          'text-6xl font-bold mb-8',
          passed ? 'text-emerald-600' : 'text-rose-600'
        )}>
          {percent}%
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 w-full max-w-md">
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-teal-700" />
              <span className="text-sm font-medium text-teal-700">Lesen</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{lesenScore.correct} / {lesenScore.total}</p>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Headphones className="w-4 h-4 text-sky-700" />
              <span className="text-sm font-medium text-sky-700">Hören</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{horenScore.correct} / {horenScore.total}</p>
          </div>
        </div>

        {/* Answer review */}
        <div className="w-full max-w-2xl mb-8">
          <h3 className="font-semibold text-slate-900 mb-3">Разбор ответов</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {questions.map((q, i) => {
              const ans = answers[i];
              const isCorrect = q.question.type === 'multiple-choice'
                ? ans === (q.question as MultipleChoiceQuestion).correctIndex
                : ans === (q.question as TrueFalseQuestion).correctAnswer;
              const isAnswered = ans !== null;
              return (
                <div
                  key={q.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border',
                    !isAnswered ? 'border-slate-200 bg-slate-50' :
                    isCorrect ? 'border-emerald-200 bg-emerald-50' :
                    'border-rose-200 bg-rose-50'
                  )}
                >
                  {isAnswered ? (
                    isCorrect
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                  )}
                  <span className="text-xs text-slate-400 shrink-0">{q.module === 'lesen' ? 'Lesen' : 'Hören'}</span>
                  <span className="text-sm text-slate-700 flex-1 truncate">{q.question.prompt}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Пройти заново
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            К модулям
          </button>
        </div>
      </div>
    );
  }

  // Exam screen
  const answeredCount = answers.filter((a) => a !== null).length;
  const isLowTime = timeLeft < 60;

  return (
    <div className="animate-fade-in">
      {/* Sticky timer header */}
      <div className="sticky top-0 z-10 -mx-4 px-4 py-3 mb-6 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Тестовый экзамен</h2>
              <p className="text-xs text-slate-500">
                Отвечено: {answeredCount} / {questions.length}
              </p>
            </div>
          </div>
          <div className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold tabular-nums transition-colors',
            isLowTime ? 'bg-rose-100 text-rose-700' : 'bg-slate-900 text-white'
          )}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q, i) => (
          <ExamQuestionCard
            key={q.id}
            examQuestion={q}
            index={i}
            selected={answers[i]}
            onAnswer={handleAnswer}
          />
        ))}
      </div>

      {/* Finish button */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          onClick={handleFinish}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:opacity-90 transition-all"
        >
          <CheckCircle2 className="w-5 h-5" />
          Завершить экзамен
        </button>
        <p className="text-sm text-slate-400">
          {answeredCount < questions.length
            ? `Осталось без ответа: ${questions.length - answeredCount}`
            : 'Все вопросы отвечены!'}
        </p>
      </div>
    </div>
  );
}

interface ExamQuestionCardProps {
  examQuestion: ExamQuestion;
  index: number;
  selected: number | boolean | null;
  onAnswer: (index: number, value: number | boolean) => void;
}

function ExamQuestionCard({ examQuestion, index, selected, onAnswer }: ExamQuestionCardProps) {
  const { question, module, text, audioText } = examQuestion;
  const [showText, setShowText] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = useCallback(() => {
    if (!audioText || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(audioText);
    utterance.lang = 'de-DE';
    utterance.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const germanVoice = voices.find((v) => v.lang.startsWith('de'));
    if (germanVoice) utterance.voice = germanVoice;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }, [audioText]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className={cn(
          'text-xs font-semibold px-2 py-1 rounded-full',
          module === 'lesen' ? 'bg-teal-100 text-teal-700' : 'bg-sky-100 text-sky-700'
        )}>
          {module === 'lesen' ? 'Lesen' : 'Hören'}
        </span>
        <span className="text-xs text-slate-400">{examQuestion.taskTitle}</span>
      </div>

      {/* Reading text toggle */}
      {text && (
        <div className="mb-3">
          <button
            onClick={() => setShowText((s) => !s)}
            className="flex items-center gap-2 text-sm text-teal-700 hover:text-teal-800 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            {showText ? 'Скрыть текст' : 'Показать текст'}
          </button>
          {showText && (
            <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 animate-fade-in">
              <p className="text-slate-700 whitespace-pre-line leading-relaxed text-sm">{text}</p>
            </div>
          )}
        </div>
      )}

      {/* Listening audio */}
      {audioText && (
        <div className="mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={isPlaying ? stop : speak}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-105',
                isPlaying ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-600 border-2 border-sky-200'
              )}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div className="flex items-center gap-1.5 text-sky-700 text-sm">
              <Volume2 className="w-4 h-4" />
              <span>{isPlaying ? 'Воспроизведение...' : 'Прослушать'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Question */}
      <div className="flex items-start gap-3 mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-semibold text-sm shrink-0">
          {index + 1}
        </span>
        <p className="text-slate-900 font-medium pt-0.5">{question.prompt}</p>
      </div>

      {/* Options */}
      {question.type === 'multiple-choice' ? (
        <div className="space-y-2.5 ml-11">
          {(question as MultipleChoiceQuestion).options.map((option, i) => (
            <button
              key={i}
              onClick={() => onAnswer(index, i)}
              className={cn(
                'flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200',
                selected === i
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-slate-200 hover:border-teal-300 hover:bg-teal-50/50'
              )}
            >
              <span className={cn(
                'flex items-center justify-center w-6 h-6 rounded-full border-2 text-xs font-bold shrink-0',
                selected === i ? 'border-teal-500 bg-teal-500 text-white' : 'border-slate-300 text-slate-400'
              )}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-slate-800">{option}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 ml-11">
          {[
            { label: 'Richtig', value: true },
            { label: 'Falsch', value: false },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => onAnswer(index, opt.value)}
              className={cn(
                'px-6 py-3 rounded-xl border-2 font-medium transition-all duration-200',
                selected === opt.value
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-slate-200 hover:border-teal-300 text-slate-700'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
