import React from 'react';
import { RatingStars } from './RatingStars';
import { ExternalLink, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatDateBR } from '../../lib/formatters';

interface ReputationCardProps {
  brandName: string;
  communityRating?: {
    score: number;
    count: number;
    criteria: {
      security: number;
      payout: number;
      support: number;
      speed: number;
      responsible_gaming?: number;
    };
  };
  reclameAqui?: {
    score: number;
    complaints: number;
    solved_rate: number;
    last_sync: string;
    url: string;
  } | null;
  onOpenRatingModal?: () => void;
  canRate?: boolean;
}

export const ReputationCard: React.FC<ReputationCardProps> = ({
  brandName,
  communityRating,
  reclameAqui,
  onOpenRatingModal,
  canRate = true,
}) => {
  return (
    <section
      className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 shadow-sm transition-colors"
      aria-labelledby="reputacao-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2F4F7] dark:border-[#1E293B] pb-4 mb-5">
        <div>
          <h2 id="reputacao-heading" className="text-lg font-bold text-[#0B1F33] dark:text-[#F8FAFC]">
            Reputação e Avaliações de Usuários
          </h2>
          <p className="text-xs text-[#667085] dark:text-[#94A3B8] mt-0.5">
            Métricas de experiência e atendimento. <strong className="text-[#263648] dark:text-[#CBD5E1] font-medium">Reputação não se confunde com autorização regulatória.</strong>
          </p>
        </div>

        {canRate && onOpenRatingModal && (
          <button
            type="button"
            onClick={onOpenRatingModal}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8] transition-colors shrink-0"
          >
            <span>Avaliar casa</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: Avaliação Comunitária */}
        <div className="p-4 rounded-lg bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8]/80 dark:border-[#263548] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#1769E0] dark:text-[#38BDF8]" />
                Comunidade Bet Legal
              </span>
              <span className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
                {communityRating ? `${communityRating.count.toLocaleString('pt-BR')} avaliações` : 'Sem avaliações'}
              </span>
            </div>

            {communityRating ? (
              <div className="mt-3">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold font-mono text-[#0B1F33] dark:text-white">
                    {communityRating.score.toFixed(1)}
                  </span>
                  <RatingStars value={communityRating.score} showText={false} size="md" />
                </div>

                {/* Critérios discriminados */}
                <div className="space-y-2 mt-4 pt-3 border-t border-[#E5E9F0] dark:border-[#1E293B] text-xs">
                  <div className="flex justify-between items-center text-[#263648] dark:text-[#CBD5E1]">
                    <span>Segurança percebida</span>
                    <span className="font-mono font-semibold">{communityRating.criteria.security.toFixed(1)} / 5</span>
                  </div>
                  <div className="flex justify-between items-center text-[#263648] dark:text-[#CBD5E1]">
                    <span>Pagamento de prêmios</span>
                    <span className="font-mono font-semibold">{communityRating.criteria.payout.toFixed(1)} / 5</span>
                  </div>
                  <div className="flex justify-between items-center text-[#263648] dark:text-[#CBD5E1]">
                    <span>Suporte ao usuário</span>
                    <span className="font-mono font-semibold">{communityRating.criteria.support.toFixed(1)} / 5</span>
                  </div>
                  <div className="flex justify-between items-center text-[#263648] dark:text-[#CBD5E1]">
                    <span>Velocidade e estabilidade do site</span>
                    <span className="font-mono font-semibold">{communityRating.criteria.speed.toFixed(1)} / 5</span>
                  </div>
                  {communityRating.criteria.responsible_gaming && (
                    <div className="flex justify-between items-center text-[#263648] dark:text-[#CBD5E1]">
                      <span>Política de jogo responsável</span>
                      <span className="font-mono font-semibold">{communityRating.criteria.responsible_gaming.toFixed(1)} / 5</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#667085] dark:text-[#94A3B8] py-6 text-center">
                Ainda não há avaliações registradas para {brandName}. Seja o primeiro a avaliar após efetuar login.
              </div>
            )}
          </div>

          <div className="mt-4 pt-2 text-[11px] text-[#667085] dark:text-[#94A3B8]">
            Média ponderada exclusiva de usuários autenticados.
          </div>
        </div>

        {/* Box 2: Snapshot Reclame Aqui (Fonte Terceira, visualmente isolado) */}
        <div className="p-4 rounded-lg bg-[#F8FAFC] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] uppercase tracking-wider">
                Snapshot Reclame Aqui (Fonte Terceira)
              </span>
              <span className="text-[11px] text-[#667085] dark:text-[#94A3B8]">Base externa</span>
            </div>

            {reclameAqui ? (
              <div className="mt-3">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold font-mono text-[#0B1F33] dark:text-white">
                    {reclameAqui.score.toFixed(1)}
                  </span>
                  <span className="text-xs text-[#667085] dark:text-[#94A3B8]">índice geral / 10</span>
                </div>

                <div className="space-y-2 mt-4 pt-3 border-t border-[#E5E9F0] dark:border-[#1E293B] text-xs">
                  <div className="flex justify-between items-center text-[#263648] dark:text-[#CBD5E1]">
                    <span>Reclamações registradas</span>
                    <span className="font-mono font-semibold">
                      {reclameAqui.complaints.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#263648] dark:text-[#CBD5E1]">
                    <span>Índice de solução</span>
                    <span className="font-mono font-semibold text-[#16794A] dark:text-[#34D399] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {reclameAqui.solved_rate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#667085] dark:text-[#94A3B8]">
                    <span>Última sincronização</span>
                    <span className="font-mono">{formatDateBR(reclameAqui.last_sync)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <a
                    href={reclameAqui.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1769E0] dark:text-[#38BDF8] hover:underline"
                  >
                    <span>Ver perfil no Reclame Aqui</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#667085] dark:text-[#94A3B8] py-6 text-center flex flex-col items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#667085] dark:text-[#94A3B8]" />
                <span>Snapshot não disponível para esta entidade no momento.</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-2 text-[11px] text-[#667085] dark:text-[#94A3B8] border-t border-[#E5E9F0] dark:border-[#1E293B]">
            Dados coletados de fonte terceira independente. Não são computados na média interna do Bet Legal.
          </div>
        </div>
      </div>
    </section>
  );
};
