import type { ReadingVisual } from '@/types';

interface PostcardCardProps {
  visual: ReadingVisual;
}

export function PostcardCard({ visual }: PostcardCardProps) {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
      <div className="mb-4 flex h-28 items-center justify-center rounded-xl bg-slate-100">
        <span className="text-2xl font-bold text-slate-500">
          Berlin
        </span>
      </div>

      {visual.title && (
        <div className="mb-3 text-base font-semibold text-slate-800">
          {visual.title}
        </div>
      )}

      <p className="whitespace-pre-line text-[15px] leading-6 text-slate-800">
        {visual.message}
      </p>
    </div>
  );
}