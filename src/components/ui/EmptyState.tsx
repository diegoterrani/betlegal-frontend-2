import React from 'react';
import { SearchX, ArrowRight, ShieldAlert } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhum registro correspondente encontrado',
  description = 'Não encontramos correspondências para esta busca. Revise o nome, domínio ou CNPJ ou reporte um site para análise.',
  actionText = 'Reportar site suspeito',
  onAction,
  secondaryActionText = 'Limpar filtros',
  onSecondaryAction,
}) => {
  return (
    <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs my-6">
      <div className="w-12 h-12 rounded-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] flex items-center justify-center mx-auto mb-4 text-[#667085] dark:text-[#94A3B8]">
        <SearchX className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-[#667085] dark:text-[#94A3B8] leading-relaxed mb-6">
        {description}
      </p>

      <div className="bg-[#FFF4E5] dark:bg-[#78350F]/30 border border-[#FEDF89] dark:border-[#B45309] rounded-md p-3 mb-6 text-xs text-[#B54708] dark:text-[#FDE68A] flex items-start gap-2 text-left">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          <strong>Aviso de precisão:</strong> A ausência de resultados imediatos não constitui julgamento jurídico nem atestado de inexistência física. Consulte a grafia exata do endereço ou CNPJ cadastrado.
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8] transition-colors"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {secondaryActionText && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F6F8FB] dark:bg-[#1E293B] border border-[#D7DEE8] dark:border-[#263548] text-[#263648] dark:text-[#CBD5E1] text-xs font-medium rounded-md hover:bg-white dark:hover:bg-[#334155] transition-colors"
          >
            <span>{secondaryActionText}</span>
          </button>
        )}
      </div>
    </div>
  );
};
