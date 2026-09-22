import React from 'react';
import { ExternalLink, FileCheck, ShieldAlert } from 'lucide-react';
import { formatDateBR } from '../../lib/formatters';

interface EvidenceCardProps {
  sourceName: string;
  sourceUrl?: string;
  evidenceSnippet: string;
  date?: string;
  isWarning?: boolean;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  sourceName,
  sourceUrl,
  evidenceSnippet,
  date,
  isWarning = false,
}) => {
  return (
    <div
      className={`p-4 rounded-lg border text-sm ${
        isWarning
          ? 'bg-[#FFF4E5] dark:bg-[#78350F]/25 border-[#FEDF89] dark:border-[#B45309] text-[#263648] dark:text-[#E2E8F0]'
          : 'bg-[#F6F8FB] dark:bg-[#0E1724] border-[#D7DEE8] dark:border-[#263548] text-[#263648] dark:text-[#CBD5E1]'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {isWarning ? (
            <ShieldAlert className="w-4 h-4 text-[#B54708] dark:text-[#FB923C] shrink-0" />
          ) : (
            <FileCheck className="w-4 h-4 text-[#11A8A5] dark:text-[#38BDF8] shrink-0" />
          )}
          <span className="font-semibold text-xs text-[#0B1F33] dark:text-[#F8FAFC] tracking-wide uppercase">
            {sourceName}
          </span>
        </div>
        {date && (
          <span className="text-xs text-[#667085] dark:text-[#94A3B8] font-mono">
            {formatDateBR(date)}
          </span>
        )}
      </div>

      <p className="text-xs leading-relaxed text-[#263648] dark:text-[#CBD5E1] bg-white/70 dark:bg-[#131F2E] p-3 rounded border border-black/5 dark:border-white/5 font-sans whitespace-pre-wrap">
        {evidenceSnippet}
      </p>

      {sourceUrl && (
        <div className="mt-3 flex justify-end">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1769E0] dark:text-[#38BDF8] hover:text-[#0B1F33] dark:hover:text-white transition-colors"
          >
            <span>Abrir fonte oficial</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
