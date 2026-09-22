import React from 'react';
import { RegulatoryStatus } from '../../types';
import { getStatusMeta } from '../../lib/mapper';
import { ShieldCheck, Scale, AlertCircle, AlertTriangle, XCircle, Clock, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: RegulatoryStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const meta = getStatusMeta(status);

  const getIcon = () => {
    switch (status) {
      case 'AUTORIZADA_NACIONAL':
      case 'AUTORIZADA_ESTADUAL':
        return <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
      case 'DECISAO_JUDICIAL':
        return <Scale className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
      case 'REQUERIMENTO_EM_ANALISE':
        return <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
      case 'SUSPENSA_REVOGADA':
      case 'BLOQUEADA_ANATEL':
        return <XCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
      case 'NAO_AUTORIZADA_DETECTADA':
        return <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
      case 'INATIVA':
        return <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs sm:text-sm font-medium gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border transition-colors ${sizeClasses}`}
      style={{
        backgroundColor: meta.bg,
        color: meta.fg,
        borderColor: `${meta.fg}25`,
      }}
      role="status"
      title={meta.description}
    >
      {showIcon && getIcon()}
      <span className="truncate">{meta.label}</span>
    </span>
  );
};
