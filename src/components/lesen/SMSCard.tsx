import type { ReadingVisual } from '@/types';

interface SMSCardProps {
  visual: ReadingVisual;
}

export function SMSCard({ visual }: SMSCardProps) {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-sm">
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="text-center text-sm font-semibold text-slate-800">
          {visual.sender}
        </div>

        {visual.date && (
          <div className="mt-0.5 text-center text-xs text-slate-400">
            {visual.date}
          </div>
        )}
      </div>

      <div className="min-h-[220px] bg-slate-50 p-5">
        <div className="max-w-[90%] rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm">
          <p className="whitespace-pre-line text-[15px] leading-6 text-slate-800">
            {visual.message}
          </p>
        </div>
      </div>
    </div>
  );
}