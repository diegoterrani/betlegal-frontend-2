import React, { useState } from 'react';
import { Code2, Copy, Check, ExternalLink, ShieldCheck, Terminal } from 'lucide-react';

export const ApiDocsView: React.FC = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/search',
      params: 'q={query}&type={domain|brand|operator}&limit={n}',
      desc: 'Busca unificada com desambiguação por host, marca ou CNPJ.',
      sampleResponse: {
        query: 'betano',
        total_results: 1,
        results: [
          {
            type: 'domain',
            host: 'betano.bet.br',
            brand_name: 'Betano',
            status: 'AUTORIZADA_NACIONAL',
            liveness: 'NO_AR',
            source_name: 'SPA/MF — Portaria nº 827/2024',
            verified_at: '2026-09-22T10:00:00-03:00',
          },
        ],
        disclaimer: 'Informação regulatória baseada em fontes públicas. Não é parecer jurídico.',
      },
    },
    {
      method: 'GET',
      path: '/api/v1/domains/{host}',
      params: 'host=exemplo.bet.br',
      desc: 'Retorna a ficha completa de um domínio, fonte oficial, histórico de status e infraestrutura de rede.',
      sampleResponse: {
        host: 'betano.bet.br',
        brand_slug: 'betano',
        brand_name: 'Betano',
        operator_name: 'Kaizen Gaming Brasil Ltda.',
        operator_cnpj: '45188761000190',
        status: 'AUTORIZADA_NACIONAL',
        liveness: 'NO_AR',
        source_name: 'SPA/MF — Portaria nº 827/2024',
        source_url: 'https://www.gov.br/fazenda/pt-br/orgaos/secretaria-de-premios-e-apostas',
        evidence_snippet: 'Autorização outorgada para exploração em território nacional sob domínio .bet.br.',
        verified_at: '2026-09-22T10:00:00-03:00',
        effective_at: '2024-10-01T00:00:00-03:00',
        hosting: {
          ip: '104.18.22.45',
          asn: 'AS13335 CLOUDFLARENET',
          country: 'Estados Unidos / Anycast',
        },
        disclaimer: 'O Bet Legal não tem vínculo com casas de apostas e não recomenda onde apostar.',
      },
    },
    {
      method: 'GET',
      path: '/api/v1/authorized',
      params: 'type={nacional|estadual|judicial}&uf={uf}&limit={n}',
      desc: 'Lista paginada de todos os domínios homologados nos âmbitos federal ou estaduais.',
      sampleResponse: {
        count: 98,
        page: 1,
        page_size: 20,
        items: [
          { host: 'betano.bet.br', brand: 'Betano', type: 'AUTORIZADA_NACIONAL', uf: null },
          { host: 'apostaganha.bet.br', brand: 'Aposta Ganha', type: 'AUTORIZADA_ESTADUAL', uf: 'PR' },
        ],
        verified_at: '2026-09-22T12:00:00-03:00',
      },
    },
    {
      method: 'GET',
      path: '/api/v1/unauthorized',
      params: 'status={status}&liveness={liveness}&limit={n}',
      desc: 'Retorna domínios detectados fora das listas oficiais e notificações de bloqueio da Anatel.',
      sampleResponse: {
        count: 6420,
        items: [
          { host: '1xbet.com', status: 'BLOQUEADA_ANATEL', liveness: 'FORA_DO_AR', anatel_listed: true },
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/v1/ranking',
      params: 'sort={community_score|ra_score}&limit={n}',
      desc: 'Métricas de reputação comunitária e snapshot Reclame Aqui para marcas homologadas.',
      sampleResponse: {
        brands: [
          {
            brand_slug: 'betano',
            community_score: 4.8,
            community_reviews_count: 1420,
            reclame_aqui_score: 7.9,
            reclame_aqui_complaints: 342,
          },
        ],
        disclaimer: 'Notas reputacionais são independentes e não interferem na outorga regulatória.',
      },
    },
    {
      method: 'GET',
      path: '/api/v1/changes',
      params: 'from=2026-01-01&limit=50',
      desc: 'Feed cronológico de mudanças de status com data de vigência legal e data de registro na plataforma.',
      sampleResponse: {
        total: 124,
        changes: [
          {
            id: 'ch-1',
            entity_name: '1xbet.com',
            from_status: 'NAO_AUTORIZADA_DETECTADA',
            to_status: 'BLOQUEADA_ANATEL',
            effective_at: '2026-09-18T10:00:00-03:00',
            created_at: '2026-09-18T11:15:00-03:00',
          },
        ],
      },
    },
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#11A8A5] dark:text-[#38BDF8] uppercase tracking-wider mb-1">
          <Code2 className="w-4 h-4" />
          <span>Desenvolvedores & Integrações Cívicas</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">
          API Pública do Bet Legal
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] dark:text-[#94A3B8] mt-1 max-w-3xl leading-relaxed">
          Dados abertos em formato JSON estruturado para pesquisadores, redações de jornalismo de dados, ferramentas de compliance e extensões de navegador.
        </p>
      </div>

      {/* Guidelines & Rate limits */}
      <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-[#667085] dark:text-[#94A3B8] block text-[11px] font-semibold uppercase">Formato Padrão</span>
          <span className="font-mono font-bold text-[#0B1F33] dark:text-white text-sm">JSON (UTF-8)</span>
          <p className="text-[#667085] dark:text-[#94A3B8] text-[11px] mt-1">Todas as respostas possuem timestamp e disclaimer legal.</p>
        </div>
        <div>
          <span className="text-[#667085] dark:text-[#94A3B8] block text-[11px] font-semibold uppercase">Limite de Requisições</span>
          <span className="font-mono font-bold text-[#0B1F33] dark:text-white text-sm">60 req / min</span>
          <p className="text-[#667085] dark:text-[#94A3B8] text-[11px] mt-1">Por endereço IP sem necessidade inicial de token.</p>
        </div>
        <div>
          <span className="text-[#667085] dark:text-[#94A3B8] block text-[11px] font-semibold uppercase">Cache de Borda</span>
          <span className="font-mono font-bold text-[#0B1F33] dark:text-white text-sm">5 minutos</span>
          <p className="text-[#667085] dark:text-[#94A3B8] text-[11px] mt-1">Sincronizado automaticamente após cada batelada oficial.</p>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-[#0B1F33] dark:text-[#F8FAFC]">Endpoints Disponíveis (v1)</h2>

        {endpoints.map((ep, idx) => (
          <div key={idx} className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] shadow-xs overflow-hidden">
            <div className="p-4 bg-[#F8FAFC] dark:bg-[#0E1724] border-b border-[#D7DEE8] dark:border-[#263548] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#1769E0] text-white font-mono text-xs font-bold rounded">
                  {ep.method}
                </span>
                <span className="font-mono text-xs font-bold text-[#0B1F33] dark:text-white">
                  {ep.path}
                </span>
              </div>

              <span className="font-mono text-[11px] text-[#667085] dark:text-[#94A3B8]">
                {ep.params}
              </span>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-[#263648] dark:text-[#CBD5E1]">{ep.desc}</p>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-[#667085] dark:text-[#94A3B8] uppercase tracking-wide">
                    Exemplo de resposta JSON
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(JSON.stringify(ep.sampleResponse, null, 2), ep.path)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#1769E0] dark:text-[#38BDF8] hover:underline"
                  >
                    {copiedEndpoint === ep.path ? (
                      <>
                        <Check className="w-3 h-3 text-[#16794A] dark:text-[#34D399]" />
                        <span className="text-[#16794A] dark:text-[#34D399]">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar JSON</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="bg-[#0B1F33] dark:bg-[#080D1A] border dark:border-[#263548] text-[#A6F4C5] p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-60 leading-relaxed">
                  {JSON.stringify(ep.sampleResponse, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
