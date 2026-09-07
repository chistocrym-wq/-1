import type { ReadingVisual } from '@/types';

interface FridgeNoteCardProps {
  visual: ReadingVisual;
}

export function FridgeNoteCard({ visual }: FridgeNoteCardProps) {
  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl bg-slate-200 p-5 shadow-inner">
      <div className="mx-auto max-w-sm -rotate-1 rounded-md border border-yellow-200 bg-yellow-100 px-5 py-5 shadow-md">
        {visual.title && (
          <div className="mb-4 text-center text-base font-semibold text-slate-800">
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

      <div className="pt-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        Kühlschrank
      </div>
    </div>
  );
}