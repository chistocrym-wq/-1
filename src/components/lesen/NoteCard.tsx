import type { ReadingVisual } from '@/types';

interface NoteCardProps {
  visual: ReadingVisual;
}

export function NoteCard({ visual }: NoteCardProps) {
  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-5 shadow-sm">
        {visual.title && (
          <div className="mb-4 text-base font-semibold text-slate-800">
            {visual.title}
          </div>
        )}

        <p className="whitespace-pre-line text-[16px] leading-7 text-slate-800">
          {visual.message}
        </p>

        {visual.signature && (
          <div className="mt-5 text-sm text-slate-600">
            {visual.signature}
          </div>
        )}
      </div>
    </div>
  );
}