import { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Trophy, RotateCcw, Mic, Square, Eye, Clock, Play, Send, Loader2, AlertCircle, Volume2 } from 'lucide-react';
import { speakingTasks } from '@/data/speaking';
import { cn } from '@/lib/utils';

interface SpeakingModuleProps {
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

interface SpeakingResult {
  transcription: string;
  contentScore: number;
  languageScore: number;
  overallScore: number;
  covered: string[];
  missing: string[];
  corrections: Array<{ original: string; corrected: string; explanation: string }>;
  feedback: string;
  pronunciation: {
    confidence: number | null;
    level: 'good' | 'attention' | 'low' | 'unknown';
    title: string;
    note: string;
  };
  duration: number | null;
}

const MAX_RECORDING_SECONDS = 90;

export function SpeakingModule({ onBack, onComplete }: SpeakingModuleProps) {
  const [currentTask, setCurrentTask] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [showSample, setShowSample] = useState(false);
  const [finished, setFinished] = useState(false);
  const [practiced, setPracticed] = useState<boolean[]>(() => speakingTasks.map(() => false));
  const [scores, setScores] = useState<number[]>(() => speakingTasks.map(() => 0));

  const task = speakingTasks[currentTask];

  const handlePromptChange = (index: number) => {
    setSelectedPrompt(index);
    setShowSample(false);
  };

  const handleNext = () => {
    if (currentTask < speakingTasks.length - 1) {
      setCurrentTask((value) => value + 1);
      setSelectedPrompt(0);
      setShowSample(false);
    } else {
      const completed = practiced.filter(Boolean).length;
      onComplete(completed, speakingTasks.length);
      setFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentTask(0);
    setSelectedPrompt(0);
    setShowSample(false);
    setFinished(false);
    setPracticed(speakingTasks.map(() => false));
    setScores(speakingTasks.map(() => 0));
  };

  if (finished) {
    const completedScores = scores.filter((score, index) => practiced[index] && score > 0);
    const average = completedScores.length
      ? Math.round(completedScores.reduce((sum, score) => sum + score, 0) / completedScores.length)
      : 0;

    return (
      <div className="animate-scale-in flex flex-col items-center justify-center py-12">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-rose-50 mb-6">
          <Trophy className="w-10 h-10 text-rose-700" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Модуль завершён!</h2>
        <p className="text-slate-500 mb-3 text-center max-w-md">Все ответы записаны и проверены Отто.</p>
        <div className="text-3xl font-bold text-rose-700 mb-8">{average}/100</div>
        <div className="flex gap-3">
          <button onClick={handleRetry} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors">
            <RotateCcw className="w-4 h-4" /> Пройти заново
          </button>
          <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors">
            К модулям
          </button>
        </div>
      </div>
    );
  }

  const activePrompt = task.type === 'introduction' ? null : selectedPrompt;
  const requiredPoints = task.type === 'introduction' ? task.prompts : [task.prompts[selectedPrompt]];
  const taskForAI = task.type === 'introduction'
    ? task.instruction
    : `${task.instruction}\nAusgewähltes Thema / Situation: ${task.prompts[selectedPrompt]}`;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors shrink-0">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-slate-900">Sprechen</h2>
          <p className="text-sm text-slate-500">Говорение · запись и проверка Отто</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {speakingTasks.map((_, index) => (
          <div key={index} className={cn('h-2 flex-1 rounded-full transition-all duration-300', index <= currentTask ? 'bg-rose-600' : 'bg-slate-200')} />
        ))}
      </div>

      <div className="rounded-xl p-4 mb-6 bg-rose-50 border border-rose-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-rose-700 mb-1">{task.title}</h3>
            <p className="text-sm text-slate-600">{task.instruction}</p>
          </div>
          <span className="text-xs font-semibold text-rose-700 bg-white px-2.5 py-1 rounded-full whitespace-nowrap">Aufgabe {currentTask + 1}/{speakingTasks.length}</span>
        </div>
      </div>

      {task.type === 'introduction' ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-4">
          <h4 className="font-semibold text-slate-900 mb-2">Erzählen Sie etwas über sich</h4>
          <p className="text-sm text-slate-500 mb-4">Говорите свободно. Отто проверит, какие важные пункты вы назвали.</p>
          <div className="flex flex-wrap gap-2">
            {['Name', 'Herkunft', 'Beruf', 'Freizeit', 'Sprachen'].map((label, index) => (
              <span key={label} className="text-sm px-3 py-2 rounded-full bg-rose-50 border border-rose-100 text-rose-700">{index + 1}. {label}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-4">
          <h4 className="font-semibold text-slate-900 mb-3">Wählen Sie ein Thema</h4>
          <div className="space-y-2">
            {task.prompts.map((prompt, index) => (
              <button key={prompt} onClick={() => handlePromptChange(index)} className={cn('w-full text-left p-3 rounded-xl border transition-colors text-sm', selectedPrompt === index ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-slate-50 border-slate-100 text-slate-700 hover:border-rose-200')}>
                <span className="font-semibold mr-2">{index + 1}.</span>{prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <SpeakingRecorder
        key={`${task.id}-${activePrompt ?? 'intro'}`}
        task={taskForAI}
        points={requiredPoints}
        onChecked={(score) => {
          setPracticed((previous) => {
            const next = [...previous];
            next[currentTask] = true;
            return next;
          });
          setScores((previous) => {
            const next = [...previous];
            next[currentTask] = score;
            return next;
          });
        }}
      />

      {task.sampleAnswer && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-6">
          <button onClick={() => setShowSample((value) => !value)} className="flex items-center gap-2 text-sm font-medium text-rose-700 hover:text-rose-800 transition-colors">
            <Eye className="w-4 h-4" /> {showSample ? 'Скрыть пример ответа' : 'Показать пример ответа'}
          </button>
          {showSample && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 animate-fade-in">
              <p className="text-xs font-medium text-rose-700 mb-2">Beispiel / Пример:</p>
              <p className="text-slate-700 leading-relaxed">{task.sampleAnswer}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={handleNext} disabled={!practiced[currentTask]} className={cn('flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all', practiced[currentTask] ? 'bg-rose-600 text-white hover:opacity-90' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
          {currentTask < speakingTasks.length - 1 ? <><span>Следующее задание</span><ArrowLeft className="w-4 h-4 rotate-180" /></> : <><CheckCircle2 className="w-4 h-4" /> Завершить модуль</>}
        </button>
      </div>
    </div>
  );
}

function SpeakingRecorder({ task, points, onChecked }: { task: string; points: string[]; onChecked: (score: number) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<SpeakingResult | null>(null);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const stopRecordingRef = useRef<() => void>(() => undefined);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    stopTimer();
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
  }, [stopTimer]);

  stopRecordingRef.current = stopRecording;

  useEffect(() => () => {
    stopTimer();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl, stopTimer]);

  const startRecording = useCallback(async () => {
    setError('');
    setResult(null);
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError('Этот браузер не поддерживает запись с микрофона. Попробуйте Chrome, Safari или Edge.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/mpeg'];
      const mimeType = mimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || '';
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 32000 }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      setElapsed(0);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || mimeType || 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.start(250);
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setElapsed((value) => {
          const next = value + 1;
          if (next >= MAX_RECORDING_SECONDS) window.setTimeout(() => stopRecordingRef.current(), 0);
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('Не удалось получить доступ к микрофону. Разрешите микрофон для сайта и попробуйте ещё раз.');
    }
  }, [audioUrl]);

  const resetRecording = () => {
    stopTimer();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setResult(null);
    setError('');
    setElapsed(0);
    setIsRecording(false);
  };

  const blobToDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Audio conversion failed'));
    reader.onerror = () => reject(reader.error || new Error('Audio conversion failed'));
    reader.readAsDataURL(blob);
  });

  const checkWithOtto = async () => {
    if (!audioBlob) return;
    setIsChecking(true);
    setError('');
    try {
      const audioBase64 = await blobToDataUrl(audioBlob);
      const response = await fetch('/api/check-sprechen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, points, audioBase64, mimeType: audioBlob.type, duration: elapsed })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Не удалось проверить ответ.');
      setResult(data as SpeakingResult);
      onChecked(Number(data.overallScore) || 0);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ошибка проверки. Попробуйте ещё раз.');
    } finally {
      setIsChecking(false);
    }
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-4">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h4 className="font-semibold text-slate-900">🎙️ Ihre Antwort</h4>
          <p className="text-sm text-slate-500 mt-1">Говорите по-немецки. Максимум {MAX_RECORDING_SECONDS} секунд.</p>
        </div>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">A1</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button onClick={isRecording ? stopRecording : startRecording} disabled={isChecking} aria-label={isRecording ? 'Остановить запись' : 'Начать запись'} className={cn('flex items-center justify-center w-16 h-16 rounded-full transition-all shrink-0', isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-50 text-rose-600 border-2 border-rose-200 hover:scale-105', isChecking && 'opacity-50 cursor-not-allowed')}>
          {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-7 h-7" />}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-2xl font-bold text-slate-900 tabular-nums">{formatTime(elapsed)}</span>
            <span className="text-xs text-slate-400">/ {formatTime(MAX_RECORDING_SECONDS)}</span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{isRecording ? 'Идёт запись… нажмите ■, когда закончите.' : audioBlob ? 'Запись готова к проверке.' : 'Нажмите на микрофон и расскажите о себе.'}</p>
        </div>
      </div>

      {audioUrl && !isRecording && (
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3">
          <audio controls src={audioUrl} className="w-full min-w-0" />
          <button onClick={resetRecording} className="text-sm text-slate-500 hover:text-slate-700 whitespace-nowrap">Перезаписать</button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
        </div>
      )}

      {audioBlob && !isRecording && !result && (
        <button onClick={checkWithOtto} disabled={isChecking} className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:opacity-60 transition-colors">
          {isChecking ? <><Loader2 className="w-5 h-5 animate-spin" /> Otto проверяет ответ…</> : <><Send className="w-5 h-5" /> Отправить Отто на проверку</>}
        </button>
      )}

      {result && (
        <div className="mt-5 space-y-4 animate-fade-in">
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-rose-200 flex items-center justify-center shrink-0"><span className="text-xl font-bold text-rose-700">{result.overallScore}</span></div>
            <div>
              <p className="font-bold text-slate-900">Тренировочный результат</p>
              <p className="text-sm text-slate-600">Содержание {result.contentScore}/100 · Язык {result.languageScore}/100</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Inhalt / Содержание</p>
              <p className="text-sm text-slate-700">Названо: <strong>{result.covered.length}</strong></p>
              {result.missing.length > 0 ? <div className="mt-2 text-sm text-rose-700">Не хватает: {result.missing.join(', ')}</div> : <div className="mt-2 text-sm text-emerald-700">Все основные пункты выполнены.</div>}
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Aussprache / Понятность</p>
              <div className="flex items-center gap-2"><Volume2 className={cn('w-4 h-4', result.pronunciation.level === 'good' ? 'text-emerald-600' : 'text-amber-600')} /><p className="text-sm font-semibold text-slate-800">{result.pronunciation.title}</p></div>
              <p className="text-xs text-slate-500 mt-1">{result.pronunciation.note}</p>
              <p className="text-[11px] text-slate-400 mt-2">Это ориентир по уверенности распознавания, а не официальный фонетический балл.</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Otto hat gehört / Расшифровка</p>
            <p className="text-sm leading-relaxed text-slate-700">{result.transcription}</p>
          </div>

          {result.corrections.length > 0 && (
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-900 mb-3">Что улучшить</p>
              <div className="space-y-3">
                {result.corrections.map((correction, index) => (
                  <div key={`${correction.original}-${index}`} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-sm text-red-700"><strong>Было:</strong> {correction.original}</p>
                    <p className="text-sm text-emerald-700 mt-1"><strong>Лучше:</strong> {correction.corrected}</p>
                    <p className="text-xs text-slate-500 mt-1">{correction.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4"><p className="text-sm leading-relaxed text-slate-700">{result.feedback}</p></div>
          <div className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ответ проверен. Можно переходить к следующему заданию.</div>
        </div>
      )}

      {!audioBlob && !isRecording && !error && (
        <div className="mt-4 flex items-start gap-2 text-xs text-slate-400"><Play className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span>Запись остаётся в браузере до отправки. AI вызывается только после нажатия «Отправить Отто» — так мы не тратим деньги во время разговора.</span></div>
      )}
    </div>
  );
}
