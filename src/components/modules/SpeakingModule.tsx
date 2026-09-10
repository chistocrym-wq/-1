import { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Trophy, RotateCcw, Mic, Square, Eye, Clock, Send, Loader2, AlertCircle, Volume2, X, Lightbulb } from 'lucide-react';
import { speakingTasks } from '@/data/speaking';
import { blobToWav } from '@/lib/audio';
import { cn } from '@/lib/utils';

interface SpeakingModuleProps { onBack: () => void; onComplete: (score: number, total: number) => void; }
interface SpeakingResult {
  transcription: string;
  contentScore: number;
  overallScore: number;
  pointResults: Array<{ point: string; status: 'full' | 'partial' | 'missing'; evidence: string }>;
  covered: string[];
  partial: string[];
  missing: string[];
  feedback: string;
  pronunciation: { confidence: number | null; level: 'good' | 'attention' | 'low' | 'unknown'; title: string; note: string };
  duration: number | null;
}
const MAX_RECORDING_SECONDS = 90;

const promptRu: Record<string, string> = {
  'Name?': 'Имя?', 'Alter?': 'Возраст?', 'Land?': 'Страна?', 'Wohnort?': 'Место жительства?',
  'Beruf?': 'Профессия?', 'Sprachen?': 'Языки?', 'Hobby?': 'Хобби?',
  'Mein Wohnort — Wo wohnen Sie? Wie ist Ihre Wohnung? Was gibt es in der Nähe?': 'Место жительства — Где вы живёте? Какая у вас квартира? Что находится рядом?',
  'Meine Familie — Wie groß ist Ihre Familie? Was machen Ihre Familienmitglieder? Was machen Sie gerne zusammen?': 'Моя семья — Какая у вас семья? Чем занимаются члены семьи? Что вы любите делать вместе?',
  'Meine Arbeit / Mein Studium — Was machen Sie? Wie gefällt Ihnen Ihre Arbeit? Was möchten Sie in Zukunft machen?': 'Моя работа / учёба — Чем вы занимаетесь? Нравится ли вам ваша работа? Что вы хотите делать в будущем?',
  'Meine Hobbys — Was machen Sie in der Freizeit? Wie oft? Mit wem?': 'Мои хобби — Что вы делаете в свободное время? Как часто? С кем?'
};

const instructionRu: Record<string, string> = {
  'Stellen Sie sich vor.': 'Представьтесь. Назовите основные сведения о себе.',
  'Wählen Sie ein Thema und sprechen Sie etwa 2-3 Minuten darüber.': 'Выберите тему и расскажите о ней примерно 2–3 минуты.',
  'Bitten Sie Ihren Partner um etwas. Verwenden Sie höfliche Formen.': 'Попросите партнёра о чём-нибудь. Используйте вежливые формы.'
};

export function SpeakingModule({ onBack, onComplete }: SpeakingModuleProps) {
  const [currentTask, setCurrentTask] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [showSample, setShowSample] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [showRussian, setShowRussian] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [finished, setFinished] = useState(false);
  const [practiced, setPracticed] = useState<boolean[]>(() => speakingTasks.map(() => false));
  const [scores, setScores] = useState<number[]>(() => speakingTasks.map(() => 0));
  const task = speakingTasks[currentTask];

  const handleNext = () => {
    if (currentTask < speakingTasks.length - 1) {
      setCurrentTask((value) => value + 1); setSelectedPrompt(0); setShowSample(false); setShowRussian(false); setShowGuide(false);
    } else {
      onComplete(practiced.filter(Boolean).length, speakingTasks.length); setFinished(true);
    }
  };
  const handleRetry = () => {
    setCurrentTask(0); setSelectedPrompt(0); setShowSample(false); setShowRussian(false); setShowGuide(false); setFinished(false);
    setPracticed(speakingTasks.map(() => false)); setScores(speakingTasks.map(() => 0));
  };

  if (finished) {
    const completedScores = scores.filter((score, index) => practiced[index] && score >= 0);
    const average = completedScores.length ? Math.round(completedScores.reduce((a, b) => a + b, 0) / completedScores.length) : 0;
    return <div className="animate-scale-in flex flex-col items-center justify-center py-12">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#faf7ef] mb-6"><Trophy className="w-10 h-10 text-[#80672d]" /></div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Modul abgeschlossen!</h2>
      <p className="text-slate-500 mb-3 text-center max-w-md">Alle Antworten wurden aufgenommen und von Otto geprüft.</p>
      <div className="text-3xl font-bold text-[#80672d] mb-8">{average}/100</div>
      <div className="flex gap-3"><button onClick={handleRetry} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium"><RotateCcw className="w-4 h-4" /> Erneut üben</button><button onClick={onBack} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#183b63] text-white font-medium">Zu den Modulen</button></div>
    </div>;
  }

  const isIntro = task.type === 'introduction';
  const activePrompt = isIntro ? null : selectedPrompt;
  const requiredPoints = isIntro ? task.prompts : [task.prompts[selectedPrompt]];
  const taskForAI = isIntro ? task.instruction : `${task.instruction}\nAusgewähltes Thema / Situation: ${task.prompts[selectedPrompt]}`;

  return <div className="speaking-module animate-fade-in">
    <div className="flex items-center gap-3 mb-5"><button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 shrink-0"><ArrowLeft className="w-5 h-5 text-slate-600" /></button><div className="flex-1 min-w-0"><h2 className="text-xl font-bold text-slate-900">Sprechen</h2><p className="text-sm text-slate-500">Mündlicher Teil · Aufnahme und Prüfung durch Otto</p></div><button type="button" onClick={() => setShowRussian((v) => !v)} aria-label="Übersetzung anzeigen" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#80672d]"><Eye className="w-5 h-5" /></button></div>
    <div className="flex items-center gap-2 mb-5">{speakingTasks.map((_, i) => <div key={i} className={cn('h-1.5 flex-1 rounded-full', i <= currentTask ? 'bg-[#c69b3c]' : 'bg-slate-200')} />)}</div>
    <div className="rounded-xl p-4 mb-3 bg-[#faf7ef] border border-[#e2ddd1]"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-[#80672d] mb-1">{task.title}</h3><p className="text-sm text-slate-600">{showRussian ? (instructionRu[task.instruction] || task.instruction) : task.instruction}</p></div><span className="text-xs font-semibold text-[#80672d] bg-white px-2.5 py-1 rounded-full whitespace-nowrap">Aufgabe {currentTask + 1}/{speakingTasks.length}</span></div></div>

    {showRussian && <div className="rounded-xl border border-[#e2ddd1] bg-white px-4 py-3 mb-3 text-sm text-slate-600">Перевод задания включён. Нажмите 👁 ещё раз, чтобы скрыть перевод.</div>}

    {isIntro ? <>
      <div className="flex items-center justify-end mb-2"><button type="button" onClick={() => setShowSecrets(true)} className="text-xs sm:text-sm font-medium text-[#80672d] px-2 py-1">Erfolgs-Tipps</button></div>
      <div className="border border-slate-300 bg-white mb-2 overflow-hidden rounded-xl">{task.prompts.map((prompt, i) => <div key={prompt} className={cn('min-h-[54px] sm:min-h-[60px] flex items-center justify-center px-4 text-center text-base sm:text-lg font-medium text-slate-800', i !== 0 && 'border-t border-slate-200')}>{showRussian ? promptRu[prompt] || prompt : prompt}</div>)}</div>
      <div className="flex justify-end mb-4"><button type="button" onClick={() => setShowGuide((v) => !v)} aria-label="Sprechhilfe öffnen" title="Sprechhilfe" className={cn('flex items-center justify-center w-10 h-10 rounded-full border transition', showGuide ? 'bg-[#faf7ef] border-[#c69b3c] text-[#80672d]' : 'bg-white border-slate-200 text-[#80672d]')}><Lightbulb className="w-5 h-5" /></button></div>
      {showGuide && <div className="rounded-xl border border-[#e2ddd1] bg-[#faf7ef] p-4 mb-4"><div className="flex items-center gap-2 mb-3"><Lightbulb className="w-4 h-4 text-[#80672d]" /><h4 className="font-semibold text-slate-900">Sprechhilfe</h4></div><p className="text-sm text-slate-600 mb-3">Füllen Sie die Lücken mit Ihren eigenen Angaben und sprechen Sie den ganzen Text frei.</p><div className="space-y-2 text-[15px] leading-relaxed text-slate-800"><p>Ich heiße <span className="inline-block min-w-[72px] border-b border-slate-400">&nbsp;</span>.</p><p>Ich bin <span className="inline-block min-w-[48px] border-b border-slate-400">&nbsp;</span> Jahre alt.</p><p>Ich komme aus <span className="inline-block min-w-[80px] border-b border-slate-400">&nbsp;</span>.</p><p>Ich wohne in <span className="inline-block min-w-[80px] border-b border-slate-400">&nbsp;</span>.</p><p>Ich bin <span className="inline-block min-w-[80px] border-b border-slate-400">&nbsp;</span> von Beruf.</p><p>Ich spreche <span className="inline-block min-w-[80px] border-b border-slate-400">&nbsp;</span>.</p><p>Mein Hobby ist <span className="inline-block min-w-[80px] border-b border-slate-400">&nbsp;</span>.</p></div><p className="text-xs text-slate-500 mt-3">Die Hilfe ist nur eine Vorlage. Sprechen Sie danach möglichst frei.</p></div>}
      <div className="border border-slate-200 bg-white rounded-xl h-20 mb-4" aria-label="Otto" />
    </> : <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-4"><h4 className="font-semibold text-slate-900 mb-3">Wählen Sie ein Thema</h4><div className="space-y-2">{task.prompts.map((prompt, i) => <button key={prompt} onClick={() => { setSelectedPrompt(i); setShowSample(false); }} className={cn('w-full text-left p-3 rounded-xl border text-sm', selectedPrompt === i ? 'bg-[#faf7ef] border-[#c69b3c] text-[#80672d]' : 'bg-slate-50 border-slate-100 text-slate-700')}><span className="font-semibold mr-2">{i + 1}.</span>{showRussian ? promptRu[prompt] || prompt : prompt}</button>)}</div></div>}

    <SpeakingRecorder key={`${task.id}-${activePrompt ?? 'intro'}`} task={taskForAI} points={requiredPoints} onChecked={(score) => { setPracticed((p) => { const n = [...p]; n[currentTask] = true; return n; }); setScores((p) => { const n = [...p]; n[currentTask] = score; return n; }); }} />
    {task.sampleAnswer && <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-6"><button onClick={() => setShowSample((v) => !v)} className="flex items-center gap-2 text-sm font-medium text-[#80672d]"><Eye className="w-4 h-4" /> {showSample ? 'Beispiel ausblenden' : 'Beispiel anzeigen'}</button>{showSample && <div className="mt-4 p-4 rounded-xl bg-[#faf7ef] border border-[#e2ddd1]"><p className="text-xs font-medium text-[#80672d] mb-2">Beispiel:</p><p className="text-slate-700 leading-relaxed">{task.sampleAnswer}</p></div>}</div>}
    <div className="flex justify-end"><button onClick={handleNext} disabled={!practiced[currentTask]} className={cn('flex items-center gap-2 px-6 py-3 rounded-xl font-medium', practiced[currentTask] ? 'bg-[#183b63] text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>{currentTask < speakingTasks.length - 1 ? <><span>Weiter</span><ArrowLeft className="w-4 h-4 rotate-180" /></> : <><CheckCircle2 className="w-4 h-4" /> Modul abschließen</>}</button></div>
    {showSecrets && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onMouseDown={() => setShowSecrets(false)}><div className="relative w-full max-w-md h-64 bg-white border border-slate-300 rounded-2xl" onMouseDown={(e) => e.stopPropagation()}><button type="button" onClick={() => setShowSecrets(false)} aria-label="Schließen" className="absolute right-2 top-2 p-2 text-slate-500"><X className="w-4 h-4" /></button></div></div>}
  </div>;
}

function SpeakingRecorder({ task, points, onChecked }: { task: string; points: string[]; onChecked: (score: number) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<SpeakingResult | null>(null);
  const [error, setError] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const stopRecordingRef = useRef<() => void>(() => undefined);

  const stopTimer = useCallback(() => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } }, []);
  const stopRecording = useCallback(() => { stopTimer(); setIsRecording(false); if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop(); }, [stopTimer]);
  stopRecordingRef.current = stopRecording;
  useEffect(() => () => { stopTimer(); streamRef.current?.getTracks().forEach((t) => t.stop()); if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl, stopTimer]);

  const startRecording = useCallback(async () => {
    setError(''); setResult(null); setShowTranscript(false); setAudioBlob(null); if (audioUrl) URL.revokeObjectURL(audioUrl); setAudioUrl(null);
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { setError('Dieser Browser unterstützt keine Mikrofonaufnahme. Bitte Chrome, Safari oder Edge verwenden.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); streamRef.current = stream;
      const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/mpeg']; const mimeType = types.find((t) => MediaRecorder.isTypeSupported(t)) || '';
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 32000 }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder; chunksRef.current = []; setElapsed(0);
      recorder.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      recorder.onstop = () => { const blob = new Blob(chunksRef.current, { type: recorder.mimeType || mimeType || 'audio/webm' }); setAudioBlob(blob); setAudioUrl(URL.createObjectURL(blob)); stream.getTracks().forEach((t) => t.stop()); streamRef.current = null; };
      recorder.start(250); setIsRecording(true);
      timerRef.current = setInterval(() => setElapsed((v) => { const next = v + 1; if (next >= MAX_RECORDING_SECONDS) window.setTimeout(() => stopRecordingRef.current(), 0); return next; }), 1000);
    } catch (err) { console.error(err); setError('Der Zugriff auf das Mikrofon ist nicht möglich. Erlauben Sie den Mikrofonzugriff für diese Website.'); }
  }, [audioUrl]);

  const resetRecording = () => { stopTimer(); if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop(); streamRef.current?.getTracks().forEach((t) => t.stop()); if (audioUrl) URL.revokeObjectURL(audioUrl); setAudioBlob(null); setAudioUrl(null); setResult(null); setShowTranscript(false); setError(''); setElapsed(0); setIsRecording(false); };
  const blobToDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onloadend = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Audio conversion failed')); reader.onerror = () => reject(reader.error || new Error('Audio conversion failed')); reader.readAsDataURL(blob); });

  const checkWithOtto = async () => {
    if (!audioBlob) return; setIsChecking(true); setError('');
    try {
      const wavBlob = await blobToWav(audioBlob);
      const audioBase64 = await blobToDataUrl(wavBlob);
      const response = await fetch('/api/check-sprechen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task, points, audioBase64, mimeType: 'audio/wav', duration: elapsed }) });
      const data = await response.json(); if (!response.ok) throw new Error(data?.error || 'Die Antwort konnte nicht geprüft werden.');
      setResult(data as SpeakingResult); onChecked(Number(data.contentScore) || 0);
    } catch (err) { console.error(err); setError(err instanceof Error ? err.message : 'Fehler bei der Prüfung. Bitte erneut versuchen.'); } finally { setIsChecking(false); }
  };
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-4">
    <div className="flex items-start justify-between gap-3 mb-4"><div><h4 className="font-semibold text-slate-900">🎙️ Ihre Antwort</h4><p className="text-sm text-slate-500 mt-1">Sprechen Sie auf Deutsch. Maximal {MAX_RECORDING_SECONDS} Sekunden.</p></div><span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">A1</span></div>
    <div className="flex flex-col sm:flex-row sm:items-center gap-4"><button onClick={isRecording ? stopRecording : startRecording} disabled={isChecking} aria-label={isRecording ? 'Aufnahme stoppen' : 'Aufnahme starten'} className={cn('flex items-center justify-center w-16 h-16 rounded-full shrink-0', isRecording ? 'bg-[#183b63] text-white animate-pulse' : 'bg-[#faf7ef] text-[#80672d] border-2 border-[#dfd4bb]', isChecking && 'opacity-50 cursor-not-allowed')}>{isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-7 h-7" />}</button><div className="flex-1"><div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /><span className="text-2xl font-bold text-slate-900 tabular-nums">{formatTime(elapsed)}</span><span className="text-xs text-slate-400">/ {formatTime(MAX_RECORDING_SECONDS)}</span></div><p className="text-sm text-slate-500 mt-0.5">{isRecording ? 'Aufnahme läuft … drücken Sie ■, wenn Sie fertig sind.' : audioBlob ? 'Aufnahme ist bereit zur Prüfung.' : 'Klicken Sie auf das Mikrofon und sprechen Sie.'}</p></div></div>
    {audioUrl && !isRecording && <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200"><audio controls src={audioUrl} className="w-full" /><div className="flex flex-col sm:flex-row gap-2 mt-3"><button onClick={checkWithOtto} disabled={isChecking} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#183b63] text-white font-medium disabled:opacity-60">{isChecking ? <><Loader2 className="w-4 h-4 animate-spin" /> Otto prüft…</> : <><Send className="w-4 h-4" /> An Otto senden</>}</button><button onClick={resetRecording} disabled={isChecking} className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium">Neu aufnehmen</button></div></div>}
    {error && <div className="mt-4 flex gap-2 items-start p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span></div>}

    {result && <div className="mt-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#e2ddd1] bg-[#faf7ef] p-4"><p className="text-xs font-medium text-[#80672d] mb-1">Aufgabe</p><p className="text-2xl font-bold text-slate-900">{result.contentScore}/100</p><p className="text-xs text-slate-600 mt-1">Jeder Punkt wurde einzeln geprüft.</p></div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center gap-2 mb-1"><Volume2 className="w-4 h-4 text-slate-500" /><p className="text-xs font-medium text-slate-600">Aussprache / Verständlichkeit</p></div><p className="text-2xl font-bold text-slate-900">{result.pronunciation.confidence === null ? '—' : `${result.pronunciation.confidence}/100`}</p><p className="text-xs text-slate-600 mt-1">{result.pronunciation.title}</p></div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden"><div className="px-4 py-3 border-b border-slate-200"><h5 className="font-semibold text-slate-900">Alle Punkte</h5><p className="text-xs text-slate-500 mt-1">Otto prüft, was Sie tatsächlich gesagt haben.</p></div>{result.pointResults.map((item) => { const isFull = item.status === 'full'; const isPartial = item.status === 'partial'; return <div key={item.point} className="px-4 py-3 border-b last:border-b-0 border-slate-100"><div className="flex items-start gap-3"><div className={cn('mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center', isFull ? 'bg-emerald-100 text-emerald-700' : isPartial ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')}>{isFull ? <CheckCircle2 className="w-4 h-4" /> : isPartial ? <span className="text-xs font-bold">~</span> : <span className="text-xs font-bold">×</span>}</div><div className="min-w-0"><p className="font-medium text-slate-800">{item.point}</p><p className={cn('text-xs mt-1', isFull ? 'text-emerald-700' : isPartial ? 'text-amber-700' : 'text-red-700')}>{isFull ? 'Gesagt' : isPartial ? 'Teilweise gesagt' : 'Nicht gesagt'}</p>{item.evidence && <p className="text-sm text-slate-600 mt-1">{item.evidence}</p>}</div></div></div>; })}</div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="font-semibold text-slate-900">Aussprache und Verständlichkeit</p><p className="text-sm text-slate-600 mt-1">{result.pronunciation.note}</p><p className="text-xs text-slate-500 mt-2">Orientierung anhand der Spracherkennung; keine Rechtschreibprüfung.</p></div>
      {result.feedback && <div className="rounded-xl border border-[#e2ddd1] bg-[#faf7ef] p-4"><p className="font-semibold text-[#80672d] mb-1">Otto</p><p className="text-sm text-slate-700 whitespace-pre-line">{result.feedback}</p></div>}
      <div className="border-t border-slate-200 pt-3"><button onClick={() => setShowTranscript((value) => !value)} className="flex items-center gap-2 text-xs text-slate-500"><Eye className="w-4 h-4" /> {showTranscript ? 'Technische Transkription ausblenden' : 'Technische Transkription anzeigen'}</button>{showTranscript && <p className="mt-2 p-3 rounded-lg bg-slate-50 text-sm text-slate-600 leading-relaxed">{result.transcription}</p>}</div>
    </div>}
  </div>;
}
