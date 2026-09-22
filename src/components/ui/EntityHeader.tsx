import React from 'react';
import { RegulatoryStatus, LivenessStatus } from '../../types';
import { StatusBadge } from './StatusBadge';
import { LivenessBadge } from './LivenessBadge';
import { Building2, Globe, ArrowLeft, Share2, AlertCircle } from 'lucide-react';
import { formatCNPJ } from '../../lib/formatters';

interface EntityHeaderProps {
  title: string;
  subtitle?: string;
  host?: string;
  operatorName?: string;
  operatorCnpj?: string;
  status: RegulatoryStatus;
  liveness?: LivenessStatus;
  inReview?: boolean;
  onBack?: () => void;
  onShare?: () => void;
  onContest?: () => void;
  onViewBrand?: () => void;
}

export const EntityHeader: React.FC<EntityHeaderProps> = ({
  title,
  subtitle,
  host,
  operatorName,
  operatorCnpj,
  status,
  liveness,
  inReview = false,
  onBack,
  onShare,
  onContest,
  onViewBrand,
}) => {
  return (
    <div className="bg-white dark:bg-[#131F2E] border-b border-[#D7DEE8] dark:border-[#263548] py-6 px-4 sm:px-6 mb-8 shadow-xs">
      <div className="max-w-6xl mx-auto">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] dark:text-[#94A3B8] hover:text-[#0B1F33] dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar</span>
          </button>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">
                {title}
              </h1>
              {host && (
                <span className="font-mono text-sm bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] px-2.5 py-1 rounded text-[#1769E0] dark:text-[#38BDF8] font-medium">
                  {host}
                </span>
              )}
            </div>

            {subtitle && <p className="text-xs text-[#667085] dark:text-[#94A3B8] mt-1">{subtitle}</p>}

            {(operatorName || operatorCnpj) && (
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-[#263648] dark:text-[#CBD5E1]">
                <Building2 className="w-3.5 h-3.5 text-[#667085] dark:text-[#94A3B8] shrink-0" />
                <span className="text-[#667085] dark:text-[#94A3B8]">Operador / Razão Social:</span>
                <span className="font-medium text-[#0B1F33] dark:text-white">{operatorName || 'Não identificado'}</span>
                {operatorCnpj && (
                  <>
                    <span className="text-[#D7DEE8] dark:text-[#334155]">|</span>
                    <span className="text-[#667085] dark:text-[#94A3B8]">CNPJ:</span>
                    <span className="font-mono font-medium">{formatCNPJ(operatorCnpj)}</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <StatusBadge status={status} size="lg" />
              {liveness && <LivenessBadge liveness={liveness} size="md" />}
            </div>

            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              {onContest && (
                <button
                  type="button"
                  onClick={onContest}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#D7DEE8] dark:border-[#263548] bg-white dark:bg-[#1E293B] text-xs font-medium text-[#263648] dark:text-[#CBD5E1] hover:bg-[#F6F8FB] dark:hover:bg-[#334155] transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-[#A35C00] dark:text-[#FDE68A]" />
                  <span>Reportar / Contestar</span>
                </button>
              )}

              {onViewBrand && (
                <button
                  type="button"
                  onClick={onViewBrand}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#1769E0] dark:border-[#38BDF8] bg-white dark:bg-[#1E293B] text-xs font-semibold text-[#1769E0] dark:text-[#38BDF8] hover:bg-[#1769E0] hover:text-white dark:hover:bg-[#38BDF8] dark:hover:text-[#0B1F33] transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Ficha da Marca</span>
                </button>
              )}

              {onShare && (
                <button
                  type="button"
                  onClick={onShare}
                  aria-label="Compartilhar"
                  className="p-1.5 rounded-md border border-[#D7DEE8] dark:border-[#263548] bg-white dark:bg-[#1E293B] text-[#667085] dark:text-[#94A3B8] hover:text-[#0B1F33] dark:hover:text-white hover:bg-[#F6F8FB] dark:hover:bg-[#334155] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {inReview && (
          <div className="mt-4 p-3 rounded-md bg-[#FFF4D6] dark:bg-[#78350F]/30 border border-[#FFE58F] dark:border-[#B45309] text-xs text-[#A35C00] dark:text-[#FDE68A] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Registro sob contestação ativa:</strong> As informações deste domínio estão sendo reavaliadas com a apresentação de novas certidões e evidências pelo operador.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
