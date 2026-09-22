import React from 'react';
import { formatDateTimeBR, formatRelativeTime } from '../../lib/formatters';
import { Clock } from 'lucide-react';

interface FreshnessProps {
  verifiedAt: string;
  label?: string;
  showRelative?: boolean;
  className?: string;
}

export const Freshness: React.FC<FreshnessProps> = ({
  verifiedAt,
  label = 'Verificado em',
  showRelative = true,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs text-[#667085] ${className}`}
      title={`Data e hora exata da verificação: ${formatDateTimeBR(verifiedAt)}`}
    >
      <Clock className="w-3.5 h-3.5 text-[#667085] shrink-0" aria-hidden="true" />
      <span>
        {label}{' '}
        <span className="font-mono text-[#263648] font-medium">
          {formatDateTimeBR(verifiedAt)}
        </span>
        {showRelative && (
          <span className="text-[#667085] ml-1">({formatRelativeTime(verifiedAt)})</span>
        )}
      </span>
    </div>
  );
};
