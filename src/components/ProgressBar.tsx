import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export function ProgressBar({ value, max, className }: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className={cn('h-2 w-full rounded-full bg-slate-200 overflow-hidden', className)}>
      <div
        className="h-full rounded-full bg-teal-600 transition-all duration-500 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
