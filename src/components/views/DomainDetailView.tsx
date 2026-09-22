import React, { useState } from 'react';
import { store } from '../../lib/store';
import { getStatusMeta } from '../../lib/mapper';
import { EntityHeader } from '../ui/EntityHeader';
import { ConfereCard } from '../ui/ConfereCard';
import { EvidenceCard } from '../ui/EvidenceCard';
import { Timeline } from '../ui/Timeline';
import { AlertBanner } from '../ui/AlertBanner';
import { formatDateTimeBR, formatDateBR } from '../../lib/formatters';
import { trackEvent } from '../../lib/analytics';
import { Server, Shield, AlertTriangle, ExternalLink, History, Share2, Info, ArrowLeft } from 'lucide-react';

interface DomainDetailViewProps {
  host: string;
  onNavigate: (path: string) => void;
}

export const DomainDetailView: React.FC<DomainDetailViewProps> = ({
  host,
  onNavigate,
}) => {
  const [copied, setCopied] = useState(false);
  const domain = store.getDomain(host);

  if (!domain) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#F6F8FB] dark:bg-[#131F2E] border border-[#D7DEE8] dark:border-[#263548] flex items-center justify-center mx-auto text-[#667085] dark:text-[#94A3B8]">
          <Info className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#0B1F33] dark:text-[#F8FAFC]">Domínio não encontrado</h1>
        <p className="text-xs text-[#667085] dark:text-[#94A3B8] max-w-md mx-auto">
          O endereço <span className="font-mono font-medium text-[#0B1F33] dark:text-white">{host}</span> não possui registro no banco de dados ativo do Bet Legal.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="px-4 py-2 bg-[#F6F8FB] dark:bg-[#131F2E] border border-[#D7DEE8] dark:border-[#263548] text-xs font-semibold rounded-md text-[#263648] dark:text-[#CBD5E1]"
          >
            Voltar ao Início
          </button>
          <button
            type="button"
            onClick={() => onNavigate(`/contestar?url=${encodeURIComponent(host)}`)}
            className="px-4 py-2 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8]"
          >
            Reportar para inclusão
          </button>
        </div>
      </div>
    );
  }

  const meta = getStatusMeta(domain.status);

  const handleShare = () => {
    trackEvent({
      name: 'verification_shared',
      properties: { entity_type: 'domain', channel: 'detail_page' },
    });
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Entity Header */}
      <EntityHeader
        title={domain.host}
        subtitle={`Ficha técnica e status regulatório apurado`}
        operatorName={domain.operator_name}
        operatorCnpj={domain.operator_cnpj}
        status={domain.status}
        liveness={domain.liveness}
        inReview={domain.in_review}
        onBack={() => onNavigate('/autorizadas')}
        onShare={handleShare}
        onContest={() => onNavigate(`/contestar?url=${encodeURIComponent(domain.host)}`)}
        onViewBrand={() => onNavigate(`/marca/${domain.brand_slug}`)}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Lookalike Warning if exists */}
        {domain.lookalike_of && (
          <AlertBanner type="warning" title="Identificação de Sinais de Marca (Lookalike)">
            Este domínio apresenta sinais visuais, elementos nominativos ou assets gráficos associados à marca <strong>{domain.lookalike_of}</strong>, porém sem confirmação de titularidade outorgada para exploração legítima perante as autoridades competentes.
          </AlertBanner>
        )}

        {/* First viewport: Signature ConfereCard */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">
              Cartão Oficial de Verificação
            </span>
            {copied && <span className="text-xs text-[#16794A] font-semibold">Link copiado para a área de transferência!</span>}
          </div>

          <ConfereCard
            host={domain.host}
            brandName={domain.brand_name}
            operatorName={domain.operator_name}
            status={domain.status}
            liveness={domain.liveness}
            sourceName={domain.source_name}
            sourceUrl={domain.source_url}
            verifiedAt={domain.verified_at}
            inReview={domain.in_review}
          />
        </div>

        {/* Seção: O que este status significa */}
        <section className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 shadow-xs">
          <h2 className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#1769E0] dark:text-[#38BDF8]" />
            O que este status significa
          </h2>
          <p className="text-xs sm:text-sm text-[#263648] dark:text-[#CBD5E1] leading-relaxed">
            {meta.publicAdvice}
          </p>
          <div className="mt-4 pt-3 border-t border-[#F2F4F7] dark:border-[#1E293B] text-[11px] text-[#667085] dark:text-[#94A3B8]">
            Classificação rigorosamente factual. O Bet Legal não realiza avaliações subjetivas de confiabilidade jurídica.
          </div>
        </section>

        {/* Seção: Fontes e Evidências */}
        <section className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7] dark:border-[#1E293B] mb-4">
            <h2 className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#11A8A5] dark:text-[#38BDF8]" />
              Fontes e evidências documentais
            </h2>
            <span className="text-xs text-[#667085] dark:text-[#94A3B8] font-mono">
              Checado em: {formatDateTimeBR(domain.verified_at)}
            </span>
          </div>

          <div className="space-y-4">
            <EvidenceCard
              sourceName={domain.source_name}
              sourceUrl={domain.source_url}
              evidenceSnippet={domain.evidence_snippet}
              date={domain.effective_at || domain.verified_at}
              isWarning={domain.status === 'BLOQUEADA_ANATEL' || domain.status === 'NAO_AUTORIZADA_DETECTADA'}
            />
          </div>
        </section>

        {/* Seção: Histórico em Linha do Tempo */}
        <section className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7] dark:border-[#1E293B] mb-6">
            <h2 className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC] flex items-center gap-2">
              <History className="w-4 h-4 text-[#1769E0] dark:text-[#38BDF8]" />
              Histórico de alterações
            </h2>
            <span className="text-xs text-[#667085] dark:text-[#94A3B8]">
              Vigência legal vs. Data de registro
            </span>
          </div>

          <Timeline items={domain.history || []} />
        </section>

        {/* Seção: Infraestrutura Observada */}
        <section className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7] dark:border-[#1E293B] mb-4">
            <h2 className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#667085] dark:text-[#94A3B8]" />
              Infraestrutura técnica observada
            </h2>
            <span className="text-xs text-[#667085] dark:text-[#94A3B8]">
              Telemetria de rede
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-[#F8FAFC] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-lg">
              <span className="text-[#667085] dark:text-[#94A3B8] block text-[11px]">Endereço IP resolvido:</span>
              <span className="font-mono font-semibold text-[#0B1F33] dark:text-white text-sm">
                {domain.hosting_ip || 'Oculto / Proxy'}
              </span>
            </div>

            <div className="p-3 bg-[#F8FAFC] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-lg">
              <span className="text-[#667085] dark:text-[#94A3B8] block text-[11px]">Sistema Autônomo (ASN):</span>
              <span className="font-mono font-semibold text-[#0B1F33] dark:text-white text-sm truncate block" title={domain.hosting_asn}>
                {domain.hosting_asn || 'Não identificado'}
              </span>
            </div>

            <div className="p-3 bg-[#F8FAFC] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-lg">
              <span className="text-[#667085] dark:text-[#94A3B8] block text-[11px]">Localização do servidor:</span>
              <span className="font-mono font-semibold text-[#0B1F33] dark:text-white text-sm">
                {domain.hosting_country || 'Não informado'}
              </span>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-[#667085] dark:text-[#94A3B8] italic">
            * Nota obrigatória: A localização ou empresa de hospedagem do servidor é apenas um elemento técnico de observação e <strong>não define nem comprova</strong> autorização legal.
          </p>
        </section>
      </div>
    </div>
  );
};
