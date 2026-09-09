import { useMemo, useState } from 'react';
import { ArrowLeft, Check, CheckCircle2, FileText, Trophy, X } from 'lucide-react';
import { schreibenTeil1Tasks } from '@/data/schreibenTeil1Imported';
import { useSchreibenProgress } from '@/hooks/useSchreibenProgress';
import { cn } from '@/lib/utils';

const numberWords: Record<string, string> = {
  null: '0',
  eins: '1',
  eine: '1',
  ein: '1',
  zwei: '2',
  drei: '3',
  vier: '4',
  fünf: '5',
  sechs: '6',
  sieben: '7',
  acht: '8',
  neun: '9',
  zehn: '10',
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[.,!?;:/()]/g, ' ')
    .replace(/\b(sechs|fünf|vier|drei|zwei|eins|eine|ein|acht|sieben|neun|zehn|null)\b/g, (m) => numberWords[m] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
}

function isCorrect(actual: string, expected: string) {
  const a = normalize(actual);
  const e = normalize(expected);
  if (!a) return false;
  if (a === e || a.replace(/\s/g, '') === e.replace(/\s/g, '')) return true;

  const alternatives = [
    e.replace(/\b0(\d)/g, '$1'),
    e.replace(/\s+(uhr|jahre?|euro|personen|paar)$/g, ''),
  ];

  return alternatives.some((alt) => a === alt || a.replace(/\s/g, '') === alt.replace(/\s/g, ''));
}

export function SchreibenTeil1Runner({ onBack }: { onBack: () => void }) {
  const { progress, record } = useSchreibenProgress(1, 30);
  const taskIndex = progress.nextIndex % schreibenTeil1Tasks.length;
  const task = schreibenTeil1Tasks[taskIndex];
  const editableFields = useMemo(() => task.fields.filter((field) => field.editable), [task]);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [completedNumber, setCompletedNumber] = useState(taskIndex + 1);

  const allAnswered = editableFields.length === 5 && editableFields.every((field) => Boolean(answers[field.id]?.trim()));

  const complete = () => {
    const map: Record<string, boolean> = {};
    editableFields.forEach((field) => {
      map[field.id] = isCorrect(answers[field.id] || '', field.answer);
    });

    const correct = editableFields.filter((field) => map[field.id]).length;
    const score = Math.round((correct / editableFields.length) * 100);

    setChecked(map);
    setCompletedNumber(taskIndex + 1);
    setResult(score);
    record(score);
  };

  const nextTask = () => {
    setAnswers({});
    setChecked({});
    setResult(null);
  };

  const errors = editableFields.filter((field) => !checked[field.id]);

  if (result !== null) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50" aria-label="Zurück">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <p className="text-sm text-slate-500">SCHREIBEN · TEIL 1</p>
            <h2 className="text-xl font-bold text-slate-900">Ergebnis · Formular {completedNumber} / 30</h2>
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-sky-200 bg-sky-50 p-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
            <Trophy className="h-10 w-10 text-sky-600" />
          </div>
          <div className="text-5xl font-bold text-sky-700">{result}</div>
          <p className="mt-2 text-sm font-medium text-slate-600">{editableFields.length - errors.length} von {editableFields.length} Antworten richtig</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-bold text-slate-900">Auswertung</h3>
          <div className="space-y-3">
            {editableFields.map((field) => {
              const ok = checked[field.id];
              return (
                <div key={field.id} className={cn('rounded-xl border p-4', ok ? 'border-emerald-200 bg-emerald-50/60' : 'border-rose-200 bg-rose-50/60')}>
                  <div className="flex items-start gap-3">
                    <div className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full', ok ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white')}>
                      {ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800">{field.label}</p>
                      <p className="mt-1 text-sm text-slate-600">Ihr Antwort: <span className="font-medium">{answers[field.id] || '—'}</span></p>
                      <p className="mt-1 text-sm text-slate-700">Richtig: <span className="font-semibold">{field.answer}</span></p>
                      {!ok && <p className="mt-2 text-sm leading-5 text-rose-700">Die Angabe passt nicht zum Text. Lesen Sie die entsprechende Information noch einmal und übertragen Sie sie möglichst genau.</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button onClick={nextTask} className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700">
              Nächste Aufgabe <CheckCircle2 className="h-4 w-4" />
            </button>
            <button onClick={onBack} className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200">
              <ArrowLeft className="h-4 w-4" /> Zu SCHREIBEN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50" aria-label="Zurück">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-slate-500">SCHREIBEN · TEIL 1</p>
          <h2 className="text-xl font-bold text-slate-900">Formular {taskIndex + 1} / 30</h2>
        </div>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${((taskIndex + 1) / 30) * 100}%` }} />
      </div>

      <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="font-bold text-sky-800">{task.title}</h3>
          <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-bold text-sky-700">5 Lücken</span>
        </div>
        <p className="leading-7 text-slate-700">{task.situation}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-sky-700">{task.instruction}</p>
      </div>

      <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 border-b-4 border-slate-300 bg-slate-200 px-4 py-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Goethe-Zertifikat A1 · Schreiben</div>
          <div className="mt-1 text-lg font-bold text-slate-900">{task.formTitle}</div>
          <div className="text-xs text-slate-500">{task.formSubtitle}</div>
        </div>

        <div className="space-y-1 border border-slate-300 bg-slate-100 p-1">
          {task.fields.map((field) => (
            <div key={field.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] items-stretch border border-slate-300 bg-white sm:grid-cols-[minmax(160px,0.8fr)_minmax(0,1.4fr)]">
              <div className="flex items-center border-r border-slate-300 bg-slate-100 px-3 py-3 text-sm font-medium text-slate-600">{field.label}</div>
              <div className={cn('min-h-[48px] px-2 py-2', field.editable ? 'bg-sky-50/50' : 'bg-slate-50')}>
                {field.editable && field.type === 'radio' && field.options ? (
                  <div className="flex min-h-[40px] flex-wrap items-center gap-2">
                    {field.options.map((option) => {
                      const selected = answers[field.id] === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [field.id]: option }))}
                          className={cn(
                            'rounded-lg border px-4 py-2 text-sm font-semibold transition-all',
                            selected ? 'border-sky-600 bg-sky-600 text-white shadow-sm' : 'border-sky-200 bg-white text-sky-700 hover:border-sky-400 hover:bg-sky-50',
                          )}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                ) : field.editable ? (
                  <input
                    value={answers[field.id] || ''}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))}
                    className="h-10 w-full rounded-md border-2 border-sky-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    placeholder="Ihre Antwort"
                  />
                ) : field.type === 'radio' && field.options ? (
                  <div className="flex min-h-[40px] flex-wrap items-center gap-2 rounded-md bg-slate-200 px-3 py-2 text-sm font-medium text-slate-600">
                    {field.options.map((option) => <span key={option}>{option}</span>)}
                  </div>
                ) : (
                  <div className="flex min-h-[40px] items-center rounded-md bg-slate-200 px-3 text-sm font-medium text-slate-700">{field.value || ' '}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500">
          <div className="flex items-center gap-2 font-semibold text-slate-700"><FileText className="h-4 w-4 text-sky-600" /> Nur die fünf Lücken ausfüllen</div>
          <div className="mt-1">Lesen Sie die Situation genau und übertragen Sie die fehlenden Informationen in den Formularfeldern.</div>
        </div>

        <button
          onClick={complete}
          disabled={!allAnswered}
          className={cn('mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold transition-all', allAnswered ? 'bg-sky-600 text-white hover:bg-sky-700' : 'cursor-not-allowed bg-slate-100 text-slate-400')}
        >
          <CheckCircle2 className="h-4 w-4" /> PRÜFEN
        </button>
      </div>
    </div>
  );
}
