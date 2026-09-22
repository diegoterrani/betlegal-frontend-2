import React from 'react';
import { Shield, Check, X, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (path: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#11A8A5] dark:text-[#38BDF8] uppercase tracking-wider mb-1">
          <Shield className="w-4 h-4" />
          <span>Independência e Transparência</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">
          Sobre o Bet Legal
        </h1>
        <p className="text-sm text-[#667085] dark:text-[#94A3B8] mt-2 max-w-2xl leading-relaxed">
          Uma infraestrutura cívica de conferência e inteligência para proteger o cidadão e dar transparência ao novo mercado regulado de apostas de quota fixa no Brasil.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#A6F4C5] dark:border-[#059669] p-6 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-[#16794A] dark:text-[#34D399] flex items-center gap-2">
            <Check className="w-5 h-5 text-[#16794A] dark:text-[#34D399]" />
            Nossos Compromissos
          </h2>
          <ul className="space-y-2 text-xs text-[#263648] dark:text-[#CBD5E1] leading-relaxed">
            <li>✓ <strong>Neutralidade absoluta:</strong> Fatos documentais antes de qualquer opinião.</li>
            <li>✓ <strong>Atualização 4x ao dia:</strong> Robôs e checadores humanos varrendo diários oficiais.</li>
            <li>✓ <strong>Isolamento de conceitos:</strong> Status regulatório legal não se mistura com reputação comunitária nem com conectividade técnica de rede.</li>
            <li>✓ <strong>Acesso público:</strong> Dados abertos para consulta gratuita por qualquer pessoa ou pesquisador.</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#FECDCA] dark:border-[#991B1B] p-6 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-[#B42318] dark:text-[#F87171] flex items-center gap-2">
            <X className="w-5 h-5 text-[#B42318] dark:text-[#F87171]" />
            O que Nunca Faremos
          </h2>
          <ul className="space-y-2 text-xs text-[#263648] dark:text-[#CBD5E1] leading-relaxed">
            <li>✕ <strong>Sem links de afiliados:</strong> Não ganhamos comissões sobre perdas ou depósitos de apostadores.</li>
            <li>✕ <strong>Sem venda de bônus:</strong> Não promovemos "ofertas exclusivas", cupons ou "odds turbinadas".</li>
            <li>✕ <strong>Sem patrocínio de bets:</strong> Nenhuma casa de aposta paga para alterar seu status na plataforma.</li>
            <li>✕ <strong>Sem sensacionalismo:</strong> Linguagem neutra, sem adjetivações arbitrárias como "ilegal" ou "aposta garantida".</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#0B1F33] dark:bg-[#0E1724] border dark:border-[#263548] text-white rounded-xl p-8 text-center space-y-4">
        <blockquote className="text-lg sm:text-xl font-bold italic max-w-xl mx-auto">
          “Não presumimos. Não recomendamos. Conferimos.”
        </blockquote>
        <p className="text-xs text-[#D7DEE8]/80 max-w-lg mx-auto leading-relaxed">
          Acreditamos que a informação limpa, precisa e rastreável é o instrumento mais eficaz para a autonomia e segurança de quem consome e quem pesquisa sobre o ecossistema brasileiro de apostas.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onNavigate('/metodologia')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#11A8A5] dark:hover:bg-[#1D4ED8] transition-colors"
          >
            <span>Conheça nossa metodologia completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
