import React from 'react';
import { StatusHistoryItem } from '../../types';
import { StatusBadge } from './StatusBadge';
import { formatDateBR, formatDateTimeBR } from '../../lib/formatters';
import { Calendar, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';

interface TimelineProps {
  items: StatusHistoryItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] text-center text-xs text-[#667085] dark:text-[#94A3B8]">
        Nenhum evento histórico anterior registrado para este domínio. O registro atual reflete a checagem inicial.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#D7DEE8] dark:before:bg-[#263548]">
      {items.map((item, idx) => (
        <div key={item.id || idx} className="relative group">
          {/* Timeline node icon */}
          <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white dark:bg-[#131F2E] border-2 border-[#1769E0] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1769E0]" />
          </div>

          <div className="bg-white dark:bg-[#131F2E] p-4 rounded-lg border border-[#D7DEE8] dark:border-[#263548] shadow-xs">
            {/* Status change representation */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {item.from_status && (
                <>
                  <StatusBadge status={item.from_status} size="sm" />
                  <ArrowRight className="w-3.5 h-3.5 text-[#667085] dark:text-[#94A3B8]" />
                </>
              )}
              <StatusBadge status={item.to_status} size="sm" />
            </div>

            <p className="text-xs text-[#263648] dark:text-[#CBD5E1] leading-relaxed mt-2 font-sans">
              {item.notes}
            </p>

            {/* Clear distinction between effective_at and created_at */}
            <div className="mt-3 pt-3 border-t border-[#F2F4F7] dark:border-[#1E293B] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1 text-[#263648] dark:text-[#CBD5E1]">
                <Calendar className="w-3.5 h-3.5 text-[#1769E0] dark:text-[#38BDF8] shrink-0" />
                <span className="text-[#667085] dark:text-[#94A3B8]">Vigência legal (fato):</span>
                <span className="font-mono font-medium">{formatDateBR(item.effective_at)}</span>
              </div>

              <div className="flex items-center gap-1 text-[#263648] dark:text-[#CBD5E1]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#11A8A5] dark:text-[#38BDF8] shrink-0" />
                <span className="text-[#667085] dark:text-[#94A3B8]">Registrado pelo Bet Legal:</span>
                <span className="font-mono">{formatDateTimeBR(item.created_at)}</span>
              </div>
            </div>

            {item.source_url && (
              <div className="mt-2 text-right">
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1769E0] dark:text-[#38BDF8] hover:underline"
                >
                  <span>Fonte: {item.source_name}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
