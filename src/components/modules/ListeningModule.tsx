import { useState, useRef, useCallback, useEffect } from 'react';
import { Volume2, Pause, Play, Eye, EyeOff } from 'lucide-react';
import { TaskRunner } from '@/components/TaskRunner';
import { QuestionCard } from '@/components/QuestionCard';
import { listeningTasks } from '@/data/listening';
import { cn } from '@/lib/utils';

interface ListeningModuleProps {
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

export function ListeningModule({ onBack, onComplete }: ListeningModuleProps) {
  return (
    <TaskRunner
      title="Hören"
      subtitle="Аудирование"
      tasks={listeningTasks}
      onBack={onBack}
      onComplete={onComplete}
      accentColor="sky"
      renderTask={(taskIndex, onAnswer) => {
        const task = listeningTasks[taskIndex];
        return (
          <div>
            <AudioPlayer text={task.audioText} />
            <div className="space-y-3">
              {task.questions.map((q, qi) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={qi}
                  onAnswer={onAnswer}
                  showResult={true}
                />
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}

function AudioPlayer({ text }: { text: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => () => {
    window.speechSynthesis?.cancel();
  }, []);

  const speak = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const germanVoice = voices.find((v) => v.lang.startsWith('de'));
    if (germanVoice) utterance.voice = germanVoice;

    utterance.onend = () => {
      setIsPlaying(false);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setPlayCount((c) => c + 1);
  }, [text]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 mb-4">
      <div className="flex items-center gap-4 mb-3">
        <button
          onClick={isPlaying ? stop : speak}
          className={cn(
            'flex items-center justify-center w-14 h-14 rounded-full transition-all hover:scale-105',
            isPlaying ? 'bg-sky-600 text-white' : 'bg-white text-sky-600 border-2 border-sky-300'
          )}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sky-700 font-medium">
            <Volume2 className="w-5 h-5" />
            <span>{isPlaying ? 'Воспроизведение...' : 'Нажмите для прослушивания'}</span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Прослушано раз: {playCount}
          </p>
        </div>
      </div>
      <button
        onClick={() => setShowTranscript((s) => !s)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        {showTranscript ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        {showTranscript ? 'Скрыть текст' : 'Показать текст'}
      </button>
      {showTranscript && (
        <p className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm leading-relaxed animate-fade-in">
          {text}
        </p>
      )}
    </div>
  );
}
