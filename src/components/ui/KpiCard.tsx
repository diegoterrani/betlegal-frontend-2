import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'cyan';
  onDrilldown?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtext,
  trend,
  tone = 'default',
  onDrilldown,
}) => {
  const toneClasses = {
    default: 'text-[#0B1F33] dark:text-[#F8FAFC] border-[#D7DEE8] dark:border-[#263548]',
    success: 'text-[#16794A] dark:text-[#34D399] border-[#A6F4C5] dark:border-[#059669] bg-[#EAF7F0]/30 dark:bg-[#064E3B]/20',
    warning: 'text-[#A35C00] dark:text-[#FDE68A] border-[#FEDF89] dark:border-[#B45309] bg-[#FFF4D6]/30 dark:bg-[#78350F]/20',
    danger: 'text-[#B42318] dark:text-[#F87171] border-[#FECDCA] dark:border-[#991B1B] bg-[#FDECEC]/30 dark:bg-[#7F1D1D]/20',
    cyan: 'text-[#0E7377] dark:text-[#38BDF8] border-[#A2ECE9] dark:border-[#0284C7] bg-[#E8F7F7]/40 dark:bg-[#0369A1]/20',
  }[tone];

  return (
    <div className={`bg-white dark:bg-[#131F2E] rounded-xl border p-5 shadow-xs flex flex-col justify-between ${toneClasses}`}>
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8]">
            {label}
          </span>
          {onDrilldown && (
            <button
              type="button"
              onClick={onDrilldown}
              className="text-[#1769E0] dark:text-[#38BDF8] hover:text-[#0B1F33] dark:hover:text-white p-1 -mr-1 -mt-1 rounded focus-visible:ring-2 focus-visible:ring-[#1769E0]"
              aria-label={`Ver detalhes de ${label}`}
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="mt-2 text-3xl font-bold font-mono text-[#0B1F33] dark:text-[#F8FAFC]">
          {value}
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
        {subtext && <span className="text-[#667085] dark:text-[#94A3B8]">{subtext}</span>}
        {trend && (
          <span className="font-mono font-medium text-[#11A8A5] dark:text-[#38BDF8] ml-auto">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
