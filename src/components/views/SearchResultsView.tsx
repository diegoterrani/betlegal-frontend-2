import React, { useState, useEffect } from 'react';
import { store } from '../../lib/store';
import { ConfereCard } from '../ui/ConfereCard';
import { StatusBadge } from '../ui/StatusBadge';
import { LivenessBadge } from '../ui/LivenessBadge';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { formatCNPJ, formatDateBR } from '../../lib/formatters';
import { trackEvent } from '../../lib/analytics';
import { Search, Globe, Shield, Building2, ExternalLink, ArrowRight } from 'lucide-react';

interface SearchResultsViewProps {
  initialQuery: string;
  onNavigate: (path: string) => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  initialQuery,
  onNavigate,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'domains' | 'brands' | 'operators'>('all');
  const [loading, setLoading] = useState(false);
  const [simulateError, setSimulateError] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const results = store.search(query);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      trackEvent({
        name: 'search_submitted',
        properties: {
          origin: 'search_results_page',
          query_type: query.includes('.') ? 'domain' : query.replace(/\D/g, '').length === 14 ? 'cnpj' : 'text',
          result_count: results.domains.length + results.brands.length,
        },
      });
    }, 150);
  };

  const totalResults = results.domains.length + results.brands.length + results.operators.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Persistent query input */}
      <div className="bg-white dark:bg-[#131F2E] p-4 sm:p-6 rounded-xl border border-[#D7DEE8] dark:border-[#263548] shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#667085] dark:text-[#94A3B8] absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar por marca, domínio ou CNPJ..."
              className="w-full pl-11 pr-4 py-2.5 text-sm sm:text-base border border-[#D7DEE8] dark:border-[#263548] rounded-lg bg-[#F6F8FB] dark:bg-[#0E1724] text-[#0B1F33] dark:text-white placeholder-[#667085] dark:placeholder-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#1769E0]"
              aria-label="Consulta de busca"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8] transition-colors shrink-0"
          >
            Refazer busca
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#667085] dark:text-[#94A3B8] border-t border-[#F2F4F7] dark:border-[#1E293B] pt-3">
          <div className="flex items-center gap-2">
            <span>Resultados para: <strong className="font-mono text-[#0B1F33] dark:text-white">"{query}"</strong></span>
            <span>·</span>
            <span>Total: <strong className="font-mono text-[#0B1F33] dark:text-white">{totalResults}</strong> correspondências</span>
          </div>

          <button
            type="button"
            onClick={() => setSimulateError(!simulateError)}
            className="text-[11px] text-[#667085] dark:text-[#94A3B8] hover:underline"
            title="Simular resposta de erro de API para validação técnica"
          >
            {simulateError ? 'Normalizar consulta' : 'Simular erro técnico'}
          </button>
        </div>
      </div>

      {simulateError ? (
        <ErrorState
          title="Falha na consulta ao serviço de dados"
          message="Não foi possível consultar os registros oficiais no momento. Tente novamente."
          onRetry={() => setSimulateError(false)}
        />
      ) : loading ? (
        /* Skeleton loading */
        <div className="space-y-4">
          <div className="h-28 bg-white border border-[#D7DEE8] rounded-xl animate-pulse" />
          <div className="h-28 bg-white border border-[#D7DEE8] rounded-xl animate-pulse" />
        </div>
      ) : totalResults === 0 ? (
        <EmptyState
          title={`Nenhuma correspondência para "${query}"`}
          description="Não encontramos registros para este termo nas listas consultadas. Você pode verificar a digitação ou reportar um site suspeito para averiguação da equipe técnica."
          actionText="Reportar este domínio ou marca"
          onAction={() => onNavigate(`/contestar?url=${encodeURIComponent(query)}`)}
          secondaryActionText="Ver lista de autorizadas"
          onSecondaryAction={() => onNavigate('/autorizadas')}
        />
      ) : (
        <div className="space-y-6">
          {/* Destaque Exato: ConfereCard se houver match inequívoco */}
          {results.exactMatch && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#16794A] uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                <span>Correspondência Exata</span>
              </div>

              {results.exactMatch.type === 'domain' ? (
                <ConfereCard
                  host={(results.exactMatch.data as any).host}
                  brandName={(results.exactMatch.data as any).brand_name}
                  operatorName={(results.exactMatch.data as any).operator_name}
                  status={(results.exactMatch.data as any).status}
                  liveness={(results.exactMatch.data as any).liveness}
                  sourceName={(results.exactMatch.data as any).source_name}
                  sourceUrl={(results.exactMatch.data as any).source_url}
                  verifiedAt={(results.exactMatch.data as any).verified_at}
                  inReview={(results.exactMatch.data as any).in_review}
                  onNavigateDetail={() => onNavigate(`/dominio/${(results.exactMatch!.data as any).host}`)}
                  onNavigateHistory={() => onNavigate(`/dominio/${(results.exactMatch!.data as any).host}`)}
                />
              ) : (
                <div className="p-6 bg-white border border-[#D7DEE8] rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1F33]">
                      {(results.exactMatch.data as any).name}
                    </h3>
                    <p className="text-xs text-[#667085] mt-1">
                      Operador: {(results.exactMatch.data as any).operator_name} · CNPJ: {formatCNPJ((results.exactMatch.data as any).operator_cnpj)}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <StatusBadge status={(results.exactMatch.data as any).status} size="md" />
                      <span className="text-xs text-[#667085]">
                        {(results.exactMatch.data as any).domains?.length || 0} domínios cadastrados
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate(`/marca/${(results.exactMatch!.data as any).slug}`)}
                    className="px-4 py-2 bg-[#1769E0] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33] transition-colors shrink-0"
                  >
                    Ver ficha da marca →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Segmented Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-lg max-w-md">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-[#1E293B] text-[#0B1F33] dark:text-white shadow-xs font-semibold'
                  : 'text-[#667085] dark:text-[#94A3B8] hover:text-[#0B1F33] dark:hover:text-white'
              }`}
            >
              Todos ({totalResults})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('domains')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'domains'
                  ? 'bg-white dark:bg-[#1E293B] text-[#0B1F33] dark:text-white shadow-xs font-semibold'
                  : 'text-[#667085] dark:text-[#94A3B8] hover:text-[#0B1F33] dark:hover:text-white'
              }`}
            >
              Domínios ({results.domains.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('brands')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'brands'
                  ? 'bg-white dark:bg-[#1E293B] text-[#0B1F33] dark:text-white shadow-xs font-semibold'
                  : 'text-[#667085] dark:text-[#94A3B8] hover:text-[#0B1F33] dark:hover:text-white'
              }`}
            >
              Marcas ({results.brands.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('operators')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'operators'
                  ? 'bg-white dark:bg-[#1E293B] text-[#0B1F33] dark:text-white shadow-xs font-semibold'
                  : 'text-[#667085] dark:text-[#94A3B8] hover:text-[#0B1F33] dark:hover:text-white'
              }`}
            >
              Operadores ({results.operators.length})
            </button>
          </div>

          {/* Domínios List */}
          {(activeTab === 'all' || activeTab === 'domains') && results.domains.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#667085] dark:text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#1769E0] dark:text-[#38BDF8]" />
                Domínios correspondentes
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.domains.map((dom) => (
                  <div
                    key={dom.host}
                    onClick={() => onNavigate(`/dominio/${dom.host}`)}
                    className="p-4 bg-white dark:bg-[#131F2E] border border-[#D7DEE8] dark:border-[#263548] rounded-xl shadow-xs hover:border-[#1769E0] dark:hover:border-[#38BDF8] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="font-mono text-sm font-bold text-[#1769E0] dark:text-[#38BDF8]">
                            {dom.host}
                          </span>
                          <span className="block text-xs font-medium text-[#0B1F33] dark:text-[#F8FAFC] mt-0.5">
                            {dom.brand_name}
                          </span>
                        </div>
                        <StatusBadge status={dom.status} size="sm" />
                      </div>

                      <p className="text-[11px] text-[#667085] dark:text-[#94A3B8] truncate">
                        Operador: {dom.operator_name}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#F2F4F7] dark:border-[#1E293B] flex items-center justify-between text-[11px] text-[#667085] dark:text-[#94A3B8]">
                      <div className="flex items-center gap-2">
                        <LivenessBadge liveness={dom.liveness} size="sm" />
                        <span>Verificado: {formatDateBR(dom.verified_at)}</span>
                      </div>
                      <span className="text-[#1769E0] dark:text-[#38BDF8] font-semibold flex items-center gap-1">
                        Ver detalhes <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marcas List */}
          {(activeTab === 'all' || activeTab === 'brands') && results.brands.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-bold text-[#667085] dark:text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#11A8A5] dark:text-[#38BDF8]" />
                Marcas comerciais correspondentes
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.brands.map((b) => (
                  <div
                    key={b.slug}
                    onClick={() => onNavigate(`/marca/${b.slug}`)}
                    className="p-4 bg-white dark:bg-[#131F2E] border border-[#D7DEE8] dark:border-[#263548] rounded-xl shadow-xs hover:border-[#1769E0] dark:hover:border-[#38BDF8] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC]">
                          {b.name}
                        </span>
                        <StatusBadge status={b.status} size="sm" />
                      </div>

                      <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
                        {b.operator_name} · {formatCNPJ(b.operator_cnpj)}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {b.domains.map((d) => (
                          <span key={d} className="font-mono text-[11px] bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] px-2 py-0.5 rounded text-[#263648] dark:text-[#CBD5E1]">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-[#F2F4F7] dark:border-[#1E293B] flex items-center justify-between text-xs">
                      <span className="text-[#667085] dark:text-[#94A3B8]">
                        Avaliação comunitária: <strong className="font-mono text-[#0B1F33] dark:text-[#F8FAFC]">{b.community_rating?.score.toFixed(1) || 'S/N'}</strong>
                      </span>
                      <span className="text-[#1769E0] dark:text-[#38BDF8] font-semibold flex items-center gap-1">
                        Ficha da marca <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operadores List */}
          {(activeTab === 'all' || activeTab === 'operators') && results.operators.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-bold text-[#667085] dark:text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#6941C6] dark:text-[#C084FC]" />
                Operadores e Razões Sociais
              </h3>

              <div className="space-y-3">
                {results.operators.map((op, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-[#131F2E] border border-[#D7DEE8] dark:border-[#263548] rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-sm font-bold text-[#0B1F33] dark:text-[#F8FAFC]">{op.operator_name}</span>
                      <p className="text-xs text-[#667085] dark:text-[#94A3B8] mt-0.5">
                        CNPJ: <span className="font-mono">{formatCNPJ(op.cnpj)}</span> · {op.count} domínios sob a titularidade
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {op.brands.map((b) => (
                          <span key={b} className="text-xs bg-[#F0F7FF] dark:bg-[#1E3A8A]/30 text-[#1769E0] dark:text-[#38BDF8] font-medium px-2 py-0.5 rounded">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
