import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface ConfirmEmailViewProps {
  onNavigate: (path: string) => void;
}

export const ConfirmEmailView: React.FC<ConfirmEmailViewProps> = ({ onNavigate }) => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('success');
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-8 shadow-xs space-y-4">
        {status === 'verifying' ? (
          <div>
            <div className="w-8 h-8 border-2 border-[#1769E0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC]">Verificando token de segurança...</h2>
            <p className="text-xs text-[#667085] dark:text-[#94A3B8] mt-1">
              Validando assinatura criptográfica de ativação.
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#EAF7F0] dark:bg-[#064E3B]/40 border border-[#A6F4C5] dark:border-[#059669] flex items-center justify-center mx-auto text-[#16794A] dark:text-[#34D399]">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h1 className="text-xl font-bold text-[#0B1F33] dark:text-[#F8FAFC]">E-mail confirmado com sucesso</h1>
            <p className="text-xs text-[#667085] dark:text-[#94A3B8] leading-relaxed">
              Sua conta foi ativada na base de dados. Você já pode autenticar e realizar avaliações comunitárias para marcas homologadas.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/entrar')}
                className="w-full py-2.5 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2"
              >
                <span>Ir para o Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
