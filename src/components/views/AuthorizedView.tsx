import React, { useState, useMemo } from 'react';
import { store } from '../../lib/store';
import { DomainRecord } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { LivenessBadge } from '../ui/LivenessBadge';
import { Pagination } from '../ui/Pagination';
import { AlertBanner } from '../ui/AlertBanner';
import { formatDateBR } from '../../lib/formatters';
import { trackEvent } from '../../lib/analytics';
import { Search, Filter, ShieldCheck, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface AuthorizedViewProps {
  onNavigate: (path: string) => void;
}

export const AuthorizedView: React.FC<AuthorizedViewProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'NACIONAL' | 'ESTADUAL' | 'DECISAO_JUDICIAL'>('ALL');
  const [ufFilter, setUfFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedMobile, setExpandedMobile] = useState<Record<string, boolean>>({});

  const allAuthorized = store.getAuthorizedDomains();

  const filtered = useMemo(() => {
    return allAuthorized.filter((d) => {
      const matchText =
        d.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.operator_name.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchText) return false;

      if (typeFilter === 'NACIONAL' && d.status !== 'AUTORIZADA_NACIONAL') return false;
      if (typeFilter === 'ESTADUAL' && d.status !== 'AUTORIZADA_ESTADUAL') return false;
      if (typeFilter === 'DECISAO_JUDICIAL' && d.status !== 'DECISAO_JUDICIAL') return false;

      if (ufFilter !== 'ALL') {
        const brand = store.getBrand(d.brand_slug);
        if (brand?.uf !== ufFilter) return false;
      }

      return true;
    });
  }, [allAuthorized, searchTerm, typeFilter, ufFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleMobileExpand = (host: string) => {
    setExpandedMobile((prev) => ({ ...prev, [host]: !prev[host] }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('ALL');
    setUfFilter('ALL');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Title & Factual Subcopy */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#16794A] dark:text-[#34D399] uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Lista Positiva Consolidada</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">
          Casas autorizadas
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] dark:text-[#94A3B8] mt-1 max-w-3xl leading-relaxed">
          Relação de operadores e domínios com autorização formal deferida em âmbito nacional (SPA/MF), estadual (loterias oficiais) ou amparados por decisão judicial em vigor. Não representa endosso ou recomendação de aposta.
        </p>
      </div>

      {/* FilterBar */}
      <div className="bg-white dark:bg-[#131F2E] p-4 rounded-xl border border-[#D7DEE8] dark:border-[#263548] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Text search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#667085] dark:text-[#94A3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filtrar por marca, domínio ou hold..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#0B1F33] dark:text-white placeholder-[#667085] dark:placeholder-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#1769E0]"
            />
          </div>

          {/* Type filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as any);
                setCurrentPage(1);
                trackEvent({
                  name: 'filter_applied',
                  properties: { page: 'authorized', filter_name: 'type', value_category: e.target.value },
                });
              }}
              className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md px-3 py-1.5 text-xs text-[#0B1F33] dark:text-white focus-visible:ring-2 focus-visible:ring-[#1769E0]"
              aria-label="Filtrar por tipo de autorização"
            >
              <option value="ALL">Todos os escopos regulatórios</option>
              <option value="NACIONAL">Nacional (SPA/MF)</option>
              <option value="ESTADUAL">Estadual (LOTERJ / LOTTOPAR etc.)</option>
              <option value="DECISAO_JUDICIAL">Decisão Judicial / Liminar</option>
            </select>
          </div>

          {/* UF filter (only relevant for estadual) */}
          <div>
            <select
              value={ufFilter}
              onChange={(e) => {
                setUfFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md px-3 py-1.5 text-xs text-[#0B1F33] dark:text-white focus-visible:ring-2 focus-visible:ring-[#1769E0]"
              aria-label="Filtrar por Unidade Federativa"
            >
              <option value="ALL">Todas as UFs (ou Âmbito Federal)</option>
              <option value="RJ">Rio de Janeiro (LOTERJ)</option>
              <option value="PR">Paraná (LOTTOPAR)</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="flex items-center justify-end">
            {(searchTerm || typeFilter !== 'ALL' || ufFilter !== 'ALL') && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-1.5 text-xs font-semibold text-[#1769E0] dark:text-[#38BDF8] hover:text-[#0B1F33] dark:hover:text-white transition-colors"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Desktop / Cards Mobile */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-8 text-center text-xs text-[#667085] dark:text-[#94A3B8]">
          Nenhuma casa autorizada encontrada com os filtros selecionados.{' '}
          <button type="button" onClick={clearFilters} className="text-[#1769E0] dark:text-[#38BDF8] font-semibold hover:underline">
            Redefinir filtros
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] shadow-xs overflow-hidden">
          {/* Desktop DataTable */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Tabela de casas de apostas autorizadas">
              <thead className="bg-[#F8FAFC] dark:bg-[#0E1724] border-b border-[#D7DEE8] dark:border-[#263548] text-[#667085] dark:text-[#94A3B8] font-semibold uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3.5 px-4">Marca</th>
                  <th scope="col" className="py-3.5 px-4">Operador / Hold</th>
                  <th scope="col" className="py-3.5 px-4">Domínio Homologado</th>
                  <th scope="col" className="py-3.5 px-4">Status & Tipo</th>
                  <th scope="col" className="py-3.5 px-4">UF</th>
                  <th scope="col" className="py-3.5 px-4">Fonte / Portaria</th>
                  <th scope="col" className="py-3.5 px-4">Atualizado</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7] dark:divide-[#1E293B]">
                {pagedItems.map((dom) => {
                  const brand = store.getBrand(dom.brand_slug);
                  return (
                    <tr key={dom.host} className="hover:bg-[#F6F8FB] dark:hover:bg-[#1A293D] transition-colors">
                      <td className="py-3 px-4 font-bold text-[#0B1F33] dark:text-[#F8FAFC]">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/marca/${dom.brand_slug}`)}
                          className="hover:text-[#1769E0] dark:hover:text-[#38BDF8] transition-colors text-left"
                        >
                          {dom.brand_name}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-[#263648] dark:text-[#CBD5E1] max-w-xs truncate" title={dom.operator_name}>
                        {dom.operator_name}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-[#1769E0] dark:text-[#38BDF8]">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/dominio/${dom.host}`)}
                          className="hover:underline"
                        >
                          {dom.host}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={dom.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 font-mono text-[#667085] dark:text-[#94A3B8]">
                        {brand?.uf ? brand.uf : 'Federal'}
                      </td>
                      <td className="py-3 px-4 text-[#667085] dark:text-[#94A3B8] max-w-xs truncate" title={dom.source_name}>
                        {dom.source_name}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#667085] dark:text-[#94A3B8]">
                        {formatDateBR(dom.verified_at)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/dominio/${dom.host}`)}
                          className="font-semibold text-[#1769E0] dark:text-[#38BDF8] hover:underline"
                        >
                          Ver ficha →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards with expandable details */}
          <div className="lg:hidden divide-y divide-[#F2F4F7] dark:divide-[#1E293B]">
            {pagedItems.map((dom) => {
              const brand = store.getBrand(dom.brand_slug);
              const isExpanded = !!expandedMobile[dom.host];

              return (
                <div key={dom.host} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-[#0B1F33] dark:text-[#F8FAFC]">
                        {dom.brand_name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onNavigate(`/dominio/${dom.host}`)}
                        className="font-mono text-xs text-[#1769E0] dark:text-[#38BDF8] hover:underline"
                      >
                        {dom.host}
                      </button>
                    </div>

                    <StatusBadge status={dom.status} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#667085] dark:text-[#94A3B8] pt-1">
                    <span>{brand?.uf ? `UF: ${brand.uf}` : 'Âmbito Federal'}</span>
                    <button
                      type="button"
                      onClick={() => toggleMobileExpand(dom.host)}
                      className="inline-flex items-center gap-1 text-[#1769E0] dark:text-[#38BDF8] font-medium"
                    >
                      <span>{isExpanded ? 'Menos detalhes' : 'Mais detalhes'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[#F2F4F7] dark:border-[#1E293B] space-y-2 text-xs bg-[#F8FAFC] dark:bg-[#0E1724] p-3 rounded-md">
                      <div>
                        <span className="text-[#667085] dark:text-[#94A3B8] block">Operador:</span>
                        <span className="font-medium text-[#0B1F33] dark:text-white">{dom.operator_name}</span>
                      </div>
                      <div>
                        <span className="text-[#667085] dark:text-[#94A3B8] block">Fonte de autorização:</span>
                        <span className="text-[#263648] dark:text-[#CBD5E1]">{dom.source_name}</span>
                      </div>
                      <div>
                        <span className="text-[#667085] dark:text-[#94A3B8] block">Última checagem:</span>
                        <span className="font-mono text-[#263648] dark:text-[#CBD5E1]">{formatDateBR(dom.verified_at)}</span>
                      </div>
                      <div className="pt-2 flex gap-3">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/dominio/${dom.host}`)}
                          className="font-semibold text-[#1769E0] dark:text-[#38BDF8] hover:underline"
                        >
                          Ficha do domínio →
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate(`/marca/${dom.brand_slug}`)}
                          className="font-semibold text-[#0B1F33] dark:text-white hover:underline"
                        >
                          Ficha da marca →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(sz) => {
              setPageSize(sz);
              setCurrentPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
};
