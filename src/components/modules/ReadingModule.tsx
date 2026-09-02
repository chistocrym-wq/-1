import { TaskRunner } from '@/components/TaskRunner';
import { QuestionCard } from '@/components/QuestionCard';
import { readingTasks } from '@/data/reading';

interface ReadingModuleProps {
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

export function ReadingModule({ onBack, onComplete }: ReadingModuleProps) {
  return (
    <TaskRunner
      title="Lesen"
      subtitle="Чтение"
      tasks={readingTasks}
      onBack={onBack}
      onComplete={onComplete}
      accentColor="teal"
      renderTask={(taskIndex, onAnswer) => {
        const task = readingTasks[taskIndex];
        return (
          <div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 mb-4">
              <p className="text-slate-700 whitespace-pre-line leading-relaxed">{task.text}</p>
            </div>
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
