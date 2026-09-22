import React from 'react';
import { LivenessStatus } from '../../types';
import { getLivenessMeta } from '../../lib/mapper';
import { Activity, PowerOff, HelpCircle } from 'lucide-react';

interface LivenessBadgeProps {
  liveness: LivenessStatus;
  size?: 'sm' | 'md';
}

export const LivenessBadge: React.FC<LivenessBadgeProps> = ({
  liveness,
  size = 'md',
}) => {
  const meta = getLivenessMeta(liveness);

  const getIcon = () => {
    switch (liveness) {
      case 'NO_AR':
        return <Activity className="w-3 h-3 shrink-0" aria-hidden="true" />;
      case 'FORA_DO_AR':
        return <PowerOff className="w-3 h-3 shrink-0" aria-hidden="true" />;
      default:
        return <HelpCircle className="w-3 h-3 shrink-0" aria-hidden="true" />;
    }
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs font-medium gap-1'
      : 'px-2.5 py-0.5 text-xs font-medium gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-md border font-mono ${sizeClasses}`}
      style={{
        backgroundColor: meta.bg,
        color: meta.fg,
        borderColor: `${meta.fg}25`,
      }}
      title={`Conectividade técnica: ${meta.description}`}
    >
      {getIcon()}
      <span>{meta.label}</span>
    </span>
  );
};
