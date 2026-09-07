import { lesenTeil1Tasks } from '@/data/lesen/teil1';
import { Teil1Runner } from '@/components/lesen/Teil1Runner';

interface ReadingModuleProps {
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

export function ReadingModule({
  onBack,
  onComplete,
}: ReadingModuleProps) {
  return (
    <Teil1Runner
      tasks={lesenTeil1Tasks}
      onBack={onBack}
      onComplete={onComplete}
    />
  );
}