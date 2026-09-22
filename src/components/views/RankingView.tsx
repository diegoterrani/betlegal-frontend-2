import React, { useState } from 'react';
import { store } from '../../lib/store';
import { BrandRecord, UserSession } from '../../types';
import { RatingStars } from '../ui/RatingStars';
import { RatingModal } from '../modals/RatingModal';
import { AlertBanner } from '../ui/AlertBanner';
import { formatDateBR } from '../../lib/formatters';
import { Star, ExternalLink, ArrowUpDown, UserCheck, MessageSquare } from 'lucide-react';

interface RankingViewProps {
  user: UserSession | null;
  onNavigate: (path: string) => void;
}

export const RankingView: React.FC<RankingViewProps> = ({ user, onNavigate }) => {
  const [sortField, setSortField] = useState<'community' | 'ra' | 'reviews'>('community');
  const [selectedBrandForRating, setSelectedBrandForRating] = useState<BrandRecord | null>(null);

  const eligibleBrands = store
    .getAllBrands()
    .filter(
      (b) =>
        b.status === 'AUTORIZADA_NACIONAL' ||
        b.status === 'AUTORIZADA_ESTADUAL' ||
        b.status === 'DECISAO_JUDICIAL'
    );

  const sorted = [...eligibleBrands].sort((a, b) => {
    if (sortField === 'community') {
      return (b.community_rating?.score || 0) - (a.community_rating?.score || 0);
    }
    if (sortField === 'ra') {
      return (b.reclame_aqui?.score || 0) - (a.reclame_aqui?.score || 0);
    }
    if (sortField === 'reviews') {
      return (b.community_rating?.count || 0) - (a.community_rating?.count || 0);
    }
    return 0;
  });

  const handleRateClick = (b: BrandRecord) => {
    if (!user) {
      onNavigate(`/entrar?redirect=/ranking`);
      return;
    }
    setSelectedBrandForRating(b);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1769E0] dark:text-[#38BDF8] uppercase tracking-wider mb-1">
          <Star className="w-4 h-4" />
          <span>Métricas de Atendimento e Experiência</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">
          Avaliações de usuários
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] dark:text-[#94A3B8] mt-1 max-w-3xl leading-relaxed">
          Avaliações de usuários para marcas homologadas. <strong className="text-[#263648] dark:text-[#CBD5E1] font-medium">Isto não é ranking de legalidade</strong> nem recomendação de operador.
        </p>
      </div>

      {/* Mandatory Separation Notice - Section 14 */}
      <AlertBanner type="info" title="Separação Estrita de Conceitos">
        Todas as marcas listadas nesta página já possuem homologação regulatória ativa válida. As notas abaixo refletem exclusivamente o sentimento comunitário de atendimento e o snapshot do Reclame Aqui. A nota do Reclame Aqui é mantida em coluna separada e nunca é somada ou ponderada com a média comunitária.
      </AlertBanner>

      {/* Controls & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#131F2E] p-4 rounded-xl border border-[#D7DEE8] dark:border-[#263548] shadow-xs">
        <div className="flex items-center gap-2 text-xs text-[#263648] dark:text-[#CBD5E1]">
          <ArrowUpDown className="w-4 h-4 text-[#667085] dark:text-[#94A3B8]" />
          <span className="font-medium text-[#667085] dark:text-[#94A3B8]">Ordenar por:</span>
          <button
            type="button"
            onClick={() => setSortField('community')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              sortField === 'community'
                ? 'bg-[#1769E0] text-white'
                : 'bg-[#F6F8FB] dark:bg-[#0E1724] text-[#263648] dark:text-[#CBD5E1] hover:bg-[#D7DEE8]'
            }`}
          >
            Média da Comunidade
          </button>
          <button
            type="button"
            onClick={() => setSortField('ra')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              sortField === 'ra'
                ? 'bg-[#1769E0] text-white'
                : 'bg-[#F6F8FB] dark:bg-[#0E1724] text-[#263648] dark:text-[#CBD5E1] hover:bg-[#D7DEE8]'
            }`}
          >
            Nota Reclame Aqui
          </button>
          <button
            type="button"
            onClick={() => setSortField('reviews')}
            className={`hidden md:inline-block px-3 py-1.5 rounded-md font-medium transition-colors ${
              sortField === 'reviews'
                ? 'bg-[#1769E0] text-white'
                : 'bg-[#F6F8FB] dark:bg-[#0E1724] text-[#263648] dark:text-[#CBD5E1] hover:bg-[#D7DEE8]'
            }`}
          >
            Volume de Avaliações
          </button>
        </div>

        {!user && (
          <span className="text-xs text-[#667085] dark:text-[#94A3B8]">
            <button
              type="button"
              onClick={() => onNavigate('/entrar?redirect=/ranking')}
              className="text-[#1769E0] dark:text-[#38BDF8] font-semibold hover:underline"
            >
              Conecte-se
            </button>{' '}
            para submeter sua avaliação
          </span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="Tabela de reputação comunitária e Reclame Aqui">
            <thead className="bg-[#F8FAFC] dark:bg-[#0E1724] border-b border-[#D7DEE8] dark:border-[#263548] text-[#667085] dark:text-[#94A3B8] font-semibold uppercase tracking-wider">
              <tr>
                <th scope="col" className="py-3.5 px-4">Marca Homologada</th>
                <th scope="col" className="py-3.5 px-4">Operador / Hold</th>
                <th scope="col" className="py-3.5 px-4">Média Comunidade</th>
                <th scope="col" className="py-3.5 px-4">Nº Avaliações</th>
                <th scope="col" className="py-3.5 px-4">Nota Reclame Aqui (1-10)</th>
                <th scope="col" className="py-3.5 px-4">Reclamações RA</th>
                <th scope="col" className="py-3.5 px-4">Última Checagem</th>
                <th scope="col" className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7] dark:divide-[#1E293B]">
              {sorted.map((brand) => (
                <tr key={brand.slug} className="hover:bg-[#F6F8FB] dark:hover:bg-[#1A293D] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#0B1F33] dark:text-[#F8FAFC]">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/marca/${brand.slug}`)}
                      className="hover:text-[#1769E0] dark:hover:text-[#38BDF8] transition-colors text-left"
                    >
                      {brand.name}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-[#263648] dark:text-[#CBD5E1] max-w-xs truncate" title={brand.operator_name}>
                    {brand.operator_name}
                  </td>
                  <td className="py-3 px-4">
                    {brand.community_rating ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-sm text-[#0B1F33] dark:text-white">
                          {brand.community_rating.score.toFixed(1)}
                        </span>
                        <RatingStars value={brand.community_rating.score} showText={false} size="sm" />
                      </div>
                    ) : (
                      <span className="text-[#667085] dark:text-[#94A3B8]">Sem avaliações</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#263648] dark:text-[#CBD5E1]">
                    {brand.community_rating ? brand.community_rating.count.toLocaleString('pt-BR') : 0}
                  </td>
                  <td className="py-3 px-4">
                    {brand.reclame_aqui ? (
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-[#0B1F33] dark:text-white">
                          {brand.reclame_aqui.score.toFixed(1)}
                        </span>
                        <span className="text-[11px] text-[#667085] dark:text-[#94A3B8]">/ 10</span>
                      </div>
                    ) : (
                      <span className="text-[#667085] dark:text-[#94A3B8]">Não disponível</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#667085] dark:text-[#94A3B8]">
                    {brand.reclame_aqui ? brand.reclame_aqui.complaints.toLocaleString('pt-BR') : '-'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#667085] dark:text-[#94A3B8]">
                    {formatDateBR(brand.verified_at)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleRateClick(brand)}
                        className="px-2.5 py-1 bg-[#F0F7FF] dark:bg-[#1E3A8A]/30 text-[#1769E0] dark:text-[#38BDF8] hover:bg-[#1769E0] hover:text-white font-semibold rounded transition-colors"
                      >
                        Avaliar
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate(`/marca/${brand.slug}`)}
                        className="text-[#667085] dark:text-[#94A3B8] hover:text-[#0B1F33] dark:hover:text-white p-1"
                        title="Ver ficha completa"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBrandForRating && (
        <RatingModal
          brand={selectedBrandForRating}
          onClose={() => setSelectedBrandForRating(null)}
          onSuccess={() => {
            setSelectedBrandForRating(null);
          }}
        />
      )}
    </div>
  );
};
