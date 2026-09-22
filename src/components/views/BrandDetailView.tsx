import React, { useState } from 'react';
import { store } from '../../lib/store';
import { BrandRecord, UserSession } from '../../types';
import { EntityHeader } from '../ui/EntityHeader';
import { StatusBadge } from '../ui/StatusBadge';
import { ReputationCard } from '../ui/ReputationCard';
import { RatingModal } from '../modals/RatingModal';
import { formatDateBR, formatCNPJ } from '../../lib/formatters';
import { Globe, Building2, FileText, ExternalLink, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

interface BrandDetailViewProps {
  slug: string;
  user: UserSession | null;
  onNavigate: (path: string) => void;
}

export const BrandDetailView: React.FC<BrandDetailViewProps> = ({
  slug,
  user,
  onNavigate,
}) => {
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const brand = store.getBrand(slug);

  if (!brand) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#0B1F33] dark:text-[#F8FAFC]">Marca não localizada</h1>
        <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
          A marca <strong className="font-mono text-[#0B1F33] dark:text-white">{slug}</strong> não consta nos cadastros ativos.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/autorizadas')}
          className="px-4 py-2 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md"
        >
          Voltar às Casas Autorizadas
        </button>
      </div>
    );
  }

  const isEligibleForRating =
    brand.status === 'AUTORIZADA_NACIONAL' ||
    brand.status === 'AUTORIZADA_ESTADUAL' ||
    brand.status === 'DECISAO_JUDICIAL';

  const handleOpenRating = () => {
    if (!user) {
      onNavigate(`/entrar?redirect=${encodeURIComponent(`/marca/${brand.slug}`)}`);
      return;
    }
    setRatingModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Entity Header */}
      <EntityHeader
        title={brand.name}
        subtitle={`Ficha institucional e operacional`}
        operatorName={brand.operator_name}
        operatorCnpj={brand.operator_cnpj}
        status={brand.status}
        onBack={() => onNavigate('/autorizadas')}
        onShare={() => {
          navigator.clipboard.writeText(window.location.href);
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Atos e Autorizações Oficiais */}
        <section className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7] dark:border-[#1E293B] mb-4">
            <h2 className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16794A] dark:text-[#34D399]" />
              Atos regulatórios e outorga oficial
            </h2>
            <span className="text-xs text-[#667085] dark:text-[#94A3B8]">
              Vigência desde: <strong className="font-mono text-[#0B1F33] dark:text-white">{formatDateBR(brand.effective_at)}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-[#F8FAFC] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] space-y-2">
              <div>
                <span className="text-[#667085] dark:text-[#94A3B8] block text-[11px] uppercase tracking-wide">Órgão Regulador</span>
                <span className="font-semibold text-[#0B1F33] dark:text-white text-sm">{brand.official_source}</span>
              </div>
              <div>
                <span className="text-[#667085] dark:text-[#94A3B8] block text-[11px]">Portaria / Ato Administrativo:</span>
                <span className="font-mono font-medium text-[#263648] dark:text-[#CBD5E1]">{brand.ordinance_number || 'Concessão homologada'}</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#F8FAFC] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[#667085] dark:text-[#94A3B8] block text-[11px] uppercase tracking-wide">Abrangência Territorial</span>
                <span className="font-semibold text-[#0B1F33] dark:text-white text-sm">
                  {brand.uf ? `Estadual — Estado do ${brand.uf}` : 'Nacional — Território Brasileiro (SPA/MF)'}
                </span>
              </div>
              <div className="pt-2">
                <a
                  href={brand.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1769E0] dark:text-[#38BDF8] hover:underline"
                >
                  <span>Consultar publicação no Diário Oficial</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Domínios Oficiais Homologados */}
        <section className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 shadow-xs">
          <div className="pb-3 border-b border-[#F2F4F7] dark:border-[#1E293B] mb-4">
            <h2 className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#1769E0] dark:text-[#38BDF8]" />
              Domínios vinculados à marca
            </h2>
            <p className="text-xs text-[#667085] dark:text-[#94A3B8] mt-0.5">
              Endereços web cadastrados perante o órgão regulador sob a titularidade desta marca.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {brand.domains.map((host) => {
              const domObj = store.getDomain(host);
              return (
                <div
                  key={host}
                  className="p-4 rounded-lg bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-mono text-sm font-bold text-[#1769E0] dark:text-[#38BDF8] block">
                      {host}
                    </span>
                    <span className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
                      {domObj ? `Checado em ${formatDateBR(domObj.verified_at)}` : 'Ativo'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate(`/dominio/${host}`)}
                    className="px-3 py-1.5 bg-white dark:bg-[#1E293B] border border-[#D7DEE8] dark:border-[#263548] text-xs font-semibold text-[#0B1F33] dark:text-white rounded hover:border-[#1769E0] dark:hover:border-[#38BDF8] transition-colors shrink-0"
                  >
                    Ficha do domínio →
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Avaliação Comunitária e Reclame Aqui - Somente para homologadas */}
        {isEligibleForRating ? (
          <div>
            {!user && (
              <div className="mb-3 p-3 bg-[#F0F7FF] dark:bg-[#1E3A8A]/30 border border-[#BDDCFF] dark:border-[#1E3A8A] rounded-lg text-xs text-[#0B3A75] dark:text-[#93C5FD] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#1769E0] dark:text-[#38BDF8]" />
                  <span>Você precisa estar conectado à sua conta para avaliar esta casa de apostas.</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(`/entrar?redirect=${encodeURIComponent(`/marca/${brand.slug}`)}`)}
                  className="font-semibold underline hover:opacity-80 ml-2 shrink-0"
                >
                  Entrar agora
                </button>
              </div>
            )}

            <ReputationCard
              brandName={brand.name}
              communityRating={brand.community_rating}
              reclameAqui={brand.reclame_aqui}
              canRate={isEligibleForRating}
              onOpenRatingModal={handleOpenRating}
            />
          </div>
        ) : (
          <div className="p-6 bg-[#F6F8FB] dark:bg-[#131F2E] border border-[#D7DEE8] dark:border-[#263548] rounded-xl text-center text-xs text-[#667085] dark:text-[#94A3B8]">
            Avaliações comunitárias estão temporariamente suspensas para esta entidade por ausência de homologação regular ativa.
          </div>
        )}
      </div>

      {/* Rating modal */}
      {ratingModalOpen && (
        <RatingModal
          brand={brand}
          onClose={() => setRatingModalOpen(false)}
          onSuccess={() => {
            setRatingModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
