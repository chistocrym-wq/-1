import type { ReadingVisual } from '@/types';

interface EmailCardProps {
  visual: ReadingVisual;
}

export function EmailCard({ visual }: EmailCardProps) {
  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="text-sm font-semibold text-slate-800">
          ✉ E-Mail
        </div>

        <div className="mt-3 space-y-1 text-sm text-slate-600">
          {visual.sender && (
            <div>
              <span className="font-semibold">Von:</span> {visual.sender}
            </div>
          )}

          {visual.recipient && (
            <div>
              <span className="font-semibold">An:</span> {visual.recipient}
            </div>
          )}

          {visual.subject && (
            <div>
              <span className="font-semibold">Betreff:</span>{' '}
              {visual.subject}
            </div>
          )}

          {visual.date && (
            <div className="text-xs text-slate-400">
              {visual.date}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-5">
        <p className="whitespace-pre-line text-[15px] leading-6 text-slate-800">
          {visual.body}
        </p>
      </div>
    </div>
  );
}