import React, { useState } from 'react';
import { store } from '../../lib/store';
import { ConfereCard } from '../ui/ConfereCard';
import { StatusBadge } from '../ui/StatusBadge';
import { trackEvent } from '../../lib/analytics';
import { formatDateBR } from '../../lib/formatters';
import {
  Search,
  ShieldCheck,
  History,
  FileCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [instantResult, setInstantResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;

    trackEvent({
      name: 'search_submitted',
      properties: {
        origin: 'home_hero',
        query_type: clean.includes('.') ? 'domain' : clean.replace(/\D/g, '').length === 14 ? 'cnpj' : 'text',
        result_count: 1,
      },
    });

    // Check if there is an unequivocal exact match
    const searchRes = store.search(clean);
    if (searchRes.exactMatch) {
      if (searchRes.exactMatch.type === 'domain') {
        setInstantResult(searchRes.exactMatch.data);
        return;
      }
    }

    onNavigate(`/busca?q=${encodeURIComponent(clean)}`);
  };

  const recentChanges = store.getChanges().slice(0, 5);

  const statusExamples = [
    {
      status: 'AUTORIZADA_NACIONAL' as const,
      desc: 'Concedida pela SPA/Ministério da Fazenda para atuar com domínio oficial .bet.br.',
    },
    {
      status: 'AUTORIZADA_ESTADUAL' as const,
      desc: 'Credenciamento outorgado por autarquia de loteria estadual (ex: LOTERJ, LOTTOPAR).',
    },
    {
      status: 'DECISAO_JUDICIAL' as const,
      desc: 'Operação amparada por liminar ou mandado de segurança em vigor na justiça federal/estadual.',
    },
    {
      status: 'NAO_AUTORIZADA_DETECTADA' as const,
      desc: 'Domínio ativo em circulação que não consta nos registros oficiais consultados.',
    },
    {
      status: 'BLOQUEADA_ANATEL' as const,
      desc: 'Constou em ofício formal remetido aos provedores de internet para bloqueio de DNS.',
    },
  ];

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1F33] dark:text-white tracking-tight leading-tight">
          Os fatos antes da aposta.
        </h1>

        <p className="mt-4 text-sm sm:text-base text-[#263648] dark:text-[#CBD5E1] max-w-2xl mx-auto leading-relaxed">
          Pesquise uma casa de apostas pelo nome, domínio ou CNPJ e veja seu status, fonte e histórico regulatório no <strong className="text-[#1769E0] dark:text-[#38BDF8]">Bet Legal</strong>.
        </p>

        {/* Dominant SearchBar */}
        <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto relative">
          <div className="relative flex items-center shadow-md rounded-xl bg-white dark:bg-[#131F2E] border-2 border-[#1769E0]/40 dark:border-[#38BDF8]/40 focus-within:border-[#1769E0] dark:focus-within:border-[#38BDF8] transition-all p-1.5 sm:p-2">
            <Search className="w-5 h-5 text-[#667085] dark:text-[#94A3B8] ml-3 shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (instantResult) setInstantResult(null);
              }}
              placeholder="Ex: Betano, bet365.bet.br, ou 45.188.761/0001-90"
              className="w-full px-3 py-2 text-sm sm:text-base text-[#0B1F33] dark:text-white placeholder-[#667085] dark:placeholder-[#94A3B8] bg-transparent focus:outline-hidden"
              aria-label="Pesquisar casa de aposta por nome, domínio ou CNPJ"
            />
            <button
              type="submit"
              className="px-5 sm:px-7 py-2.5 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8] transition-colors shrink-0 shadow-xs"
            >
              Conferir
            </button>
          </div>
        </form>

        {/* Instant result if match */}
        {instantResult && (
          <div className="mt-8 text-left max-w-2xl mx-auto animate-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#16794A] uppercase tracking-wider">
                Resultado Exato Verificado
              </span>
              <button
                type="button"
                onClick={() => setInstantResult(null)}
                className="text-xs text-[#667085] hover:underline"
              >
                Ocultar
              </button>
            </div>
            <ConfereCard
              host={instantResult.host}
              brandName={instantResult.brand_name}
              operatorName={instantResult.operator_name}
              status={instantResult.status}
              liveness={instantResult.liveness}
              sourceName={instantResult.source_name}
              sourceUrl={instantResult.source_url}
              verifiedAt={instantResult.verified_at}
              onNavigateDetail={() => onNavigate(`/dominio/${instantResult.host}`)}
              onNavigateHistory={() => onNavigate(`/dominio/${instantResult.host}`)}
            />
          </div>
        )}

        {/* Trust Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#667085] font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#11A8A5]" />
            Fontes públicas oficiais
          </span>
          <span>·</span>
          <span>Atualização 4x ao dia</span>
          <span>·</span>
          <span>Sem afiliados</span>
          <span>·</span>
          <span>Sem venda de bônus</span>
        </div>
      </section>

      {/* Como Funciona em 3 Passos */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F33]">
            Como funciona a verificação
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Não presumimos. Não recomendamos. Conferimos os dados em fontes públicas auditadas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#131F2E] p-6 rounded-xl border border-[#D7DEE8] dark:border-[#263548] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#EAF7F0] dark:bg-[#064E3B]/30 text-[#16794A] dark:text-[#34D399] flex items-center justify-center font-mono font-bold text-base mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-2">1. Pesquise</h3>
              <p className="text-xs text-[#667085] dark:text-[#94A3B8] leading-relaxed">
                Digite o domínio que você pretende acessar, a marca da casa ou o CNPJ do operador responsável registrado.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F2F4F7] dark:border-[#1E293B] text-[11px] text-[#1769E0] dark:text-[#38BDF8] font-medium">
              Busca com desambiguação automática
            </div>
          </div>

          <div className="bg-white dark:bg-[#131F2E] p-6 rounded-xl border border-[#D7DEE8] dark:border-[#263548] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#F0F7FF] dark:bg-[#1E3A8A]/30 text-[#1769E0] dark:text-[#38BDF8] flex items-center justify-center font-mono font-bold text-base mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-2">2. Confira a fonte</h3>
              <p className="text-xs text-[#667085] dark:text-[#94A3B8] leading-relaxed">
                Veja o número da portaria no Diário Oficial, o órgão expedidor (SPA/MF ou loteria estadual) e o trecho de comprovação.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F2F4F7] dark:border-[#1E293B] text-[11px] text-[#1769E0] dark:text-[#38BDF8] font-medium">
              Rastreabilidade do dado oficial
            </div>
          </div>

          <div className="bg-white dark:bg-[#131F2E] p-6 rounded-xl border border-[#D7DEE8] dark:border-[#263548] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#F4F0FF] dark:bg-[#581C87]/30 text-[#6941C6] dark:text-[#C084FC] flex items-center justify-center font-mono font-bold text-base mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-2">3. Veja o histórico</h3>
              <p className="text-xs text-[#667085] dark:text-[#94A3B8] leading-relaxed">
                Acompanhe a linha do tempo com a data do fato legal e a data de registro pelo Bet Legal, além de reputação comunitária separada.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F2F4F7] dark:border-[#1E293B] text-[11px] text-[#1769E0] dark:text-[#38BDF8] font-medium">
              Transparência temporal contínua
            </div>
          </div>
        </div>
      </section>

      {/* Bloco: Mudanças Recentes */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F2F4F7] dark:border-[#1E293B] mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#0B1F33] dark:text-[#F8FAFC]">
                Mudanças Recentes no Mercado
              </h2>
              <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
                Últimas alterações de status, inclusões e exclusões oficiais monitoradas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/mudancas')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1769E0] dark:text-[#38BDF8] hover:text-[#0B1F33] dark:hover:text-white transition-colors"
            >
              <span>Ver todas as mudanças</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#F2F4F7] dark:divide-[#1E293B]">
            {recentChanges.map((ch) => (
              <div
                key={ch.id}
                onClick={() => ch.host && onNavigate(`/dominio/${ch.host}`)}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#F6F8FB] dark:hover:bg-[#1A293D] px-2 rounded-md transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-[#0B1F33] dark:text-[#F8FAFC]">
                    {ch.entity_name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={ch.from_status} size="sm" showIcon={false} />
                    <ChevronRight className="w-3 h-3 text-[#667085] dark:text-[#94A3B8]" />
                    <StatusBadge status={ch.to_status} size="sm" showIcon={false} />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#667085] dark:text-[#94A3B8]">
                  <span className="truncate max-w-xs">{ch.source_name}</span>
                  <span className="font-mono">{formatDateBR(ch.effective_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloco: Entenda os Status */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-[#F8FAFC] dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D7DEE8] dark:border-[#263548] mb-5">
            <div>
              <h2 className="text-lg font-bold text-[#0B1F33] dark:text-[#F8FAFC]">
                Entenda a Taxonomia dos Status
              </h2>
              <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
                Rótulos rigorosamente factuais. Nunca utilizamos termos arbitrários como “ilegal” ou “aposta segura”.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/metodologia')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1769E0] dark:text-[#38BDF8] hover:text-[#0B1F33] dark:hover:text-white transition-colors"
            >
              <span>Metodologia completa</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statusExamples.map((ex, i) => (
              <div key={i} className="p-4 rounded-lg bg-white dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] flex flex-col justify-between">
                <div>
                  <div className="mb-2">
                    <StatusBadge status={ex.status} size="md" />
                  </div>
                  <p className="text-xs text-[#263648] dark:text-[#CBD5E1] leading-relaxed">
                    {ex.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
