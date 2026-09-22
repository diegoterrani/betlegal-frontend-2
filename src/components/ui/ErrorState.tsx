import React from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Falha técnica de comunicação',
  message = 'Não foi possível concluir a consulta agora. Tente novamente em instantes.',
  onRetry,
}) => {
  return (
    <div
      role="alert"
      className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#FECDCA] dark:border-[#991B1B] p-8 text-center max-w-lg mx-auto shadow-xs my-6"
    >
      <div className="w-12 h-12 rounded-full bg-[#FDECEC] dark:bg-[#7F1D1D]/30 border border-[#FECDCA] dark:border-[#991B1B] flex items-center justify-center mx-auto mb-4 text-[#B42318] dark:text-[#F87171]">
        <AlertOctagon className="w-6 h-6" />
      </div>

      <h3 className="text-base font-bold text-[#B42318] dark:text-[#FCA5A5] mb-2">{title}</h3>
      <p className="text-xs text-[#667085] dark:text-[#94A3B8] leading-relaxed mb-4">
        {message}
      </p>

      <div className="p-3 bg-[#F8FAFC] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded text-[11px] text-[#667085] dark:text-[#94A3B8] mb-6">
        <strong>Critério de confiabilidade:</strong> Erros de rede ou infraestrutura nunca são interpretados como status regulatório desfavorável.
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8] transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Tentar novamente</span>
        </button>
      )}
    </div>
  );
};
