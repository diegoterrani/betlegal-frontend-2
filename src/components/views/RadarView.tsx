import React, { useState, useMemo } from 'react';
import { store } from '../../lib/store';
import { StatusBadge } from '../ui/StatusBadge';
import { LivenessBadge } from '../ui/LivenessBadge';
import { Pagination } from '../ui/Pagination';
import { AlertBanner } from '../ui/AlertBanner';
import { formatDateBR } from '../../lib/formatters';
import { trackEvent } from '../../lib/analytics';
import { Radar, Search, ShieldAlert, ExternalLink, Info, Activity } from 'lucide-react';

interface RadarViewProps {
  onNavigate: (path: string) => void;
}

export const RadarView: React.FC<RadarViewProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [livenessFilter, setLivenessFilter] = useState<string>('ALL');
  const [countryFilter, setCountryFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const radarDomains = store.getRadarDomains();

  const filtered = useMemo(() => {
    return radarDomains.filter((d) => {
      const matchText =
        d.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.evidence_snippet && d.evidence_snippet.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchText) return false;
      if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
      if (livenessFilter !== 'ALL' && d.liveness !== livenessFilter) return false;
      if (countryFilter !== 'ALL' && d.hosting_country && !d.hosting_country.includes(countryFilter)) return false;

      return true;
    });
  }, [radarDomains, searchTerm, statusFilter, livenessFilter, countryFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setLivenessFilter('ALL');
    setCountryFilter('ALL');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Title & Best-effort Disclaimer */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#B54708] dark:text-[#FB923C] uppercase tracking-wider mb-1">
          <Radar className="w-4 h-4" />
          <span>Monitoramento Contínuo e Bloqueios</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">
          Radar de não autorizadas
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] dark:text-[#94A3B8] mt-1 max-w-3xl leading-relaxed">
          Detecção ativa automatizada e registros de notificações da Anatel. Trata-se de levantamento técnico contínuo (best-effort) e não constitui inventário exaustivo de todo o tráfego da internet.
        </p>
      </div>

      {/* Strong Disclaimer Banner - Section 13 */}
      <AlertBanner type="warning" title="Critério de Neutralidade e Rastreabilidade">
        A classificação <strong>“Não consta nas listas de autorização”</strong> é uma observação estritamente factual baseada nos arquivos públicos consultados na data indicada. Não representa juízo de valor, qualificação jurídica penal ou parecer de mérito sobre operadores.
      </AlertBanner>

      {/* FilterBar */}
      <div className="bg-white dark:bg-[#131F2E] p-4 rounded-xl border border-[#D7DEE8] dark:border-[#263548] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Text search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-[#667085] dark:text-[#94A3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por host, marca ou evidência..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#0B1F33] dark:text-white placeholder-[#667085] dark:placeholder-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#1769E0]"
            />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
                trackEvent({
                  name: 'filter_applied',
                  properties: { page: 'radar', filter_name: 'status', value_category: e.target.value },
                });
              }}
              className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md px-3 py-1.5 text-xs text-[#0B1F33] dark:text-white focus-visible:ring-2 focus-visible:ring-[#1769E0]"
              aria-label="Filtrar por status factual"
            >
              <option value="ALL">Todos os status</option>
              <option value="NAO_AUTORIZADA_DETECTADA">Não consta nas listas</option>
              <option value="BLOQUEADA_ANATEL">Constou em lista Anatel</option>
              <option value="SUSPENSA_REVOGADA">Suspensa / Excluída</option>
              <option value="INATIVA">Inativa</option>
              <option value="REQUERIMENTO_EM_ANALISE">Requerimento em análise</option>
            </select>
          </div>

          {/* Liveness filter */}
          <div>
            <select
              value={livenessFilter}
              onChange={(e) => {
                setLivenessFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md px-3 py-1.5 text-xs text-[#0B1F33] dark:text-white focus-visible:ring-2 focus-visible:ring-[#1769E0]"
              aria-label="Filtrar por conectividade técnica"
            >
              <option value="ALL">Qualquer conectividade</option>
              <option value="NO_AR">No ar (responde HTTP)</option>
              <option value="FORA_DO_AR">Fora do ar</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="flex items-center justify-end">
            {(searchTerm || statusFilter !== 'ALL' || livenessFilter !== 'ALL' || countryFilter !== 'ALL') && (
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

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-8 text-center text-xs text-[#667085] dark:text-[#94A3B8]">
          Nenhum domínio encontrado no radar com estes filtros.{' '}
          <button type="button" onClick={clearFilters} className="text-[#1769E0] dark:text-[#38BDF8] font-semibold hover:underline">
            Redefinir filtros
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Tabela do Radar de domínios não autorizados">
              <thead className="bg-[#F8FAFC] dark:bg-[#0E1724] border-b border-[#D7DEE8] dark:border-[#263548] text-[#667085] dark:text-[#94A3B8] font-semibold uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3.5 px-4">Domínio Detectado</th>
                  <th scope="col" className="py-3.5 px-4">Marca Aparente</th>
                  <th scope="col" className="py-3.5 px-4">Status Factual</th>
                  <th scope="col" className="py-3.5 px-4">Liveness</th>
                  <th scope="col" className="py-3.5 px-4">Primeiro Visto</th>
                  <th scope="col" className="py-3.5 px-4">Última Verificação</th>
                  <th scope="col" className="py-3.5 px-4">Evidência / Fonte</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7] dark:divide-[#1E293B]">
                {pagedItems.map((dom) => (
                  <tr key={dom.host} className="hover:bg-[#F6F8FB] dark:hover:bg-[#1A293D] transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#0B1F33] dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/dominio/${dom.host}`)}
                          className="hover:text-[#1769E0] dark:hover:text-[#38BDF8] hover:underline text-left font-bold"
                        >
                          {dom.host}
                        </button>
                        {dom.in_review && (
                          <span className="text-[10px] bg-[#FFF4D6] dark:bg-[#78350F]/40 text-[#A35C00] dark:text-[#FDE68A] font-semibold px-1.5 py-0.5 rounded border border-[#FEDF89] dark:border-[#B45309]" title="Contestação em análise documental">
                            Em revisão
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#263648] dark:text-[#CBD5E1] font-medium">
                      {dom.brand_name}
                      {dom.lookalike_of && (
                        <span className="block text-[10px] text-[#B54708] dark:text-[#FB923C]">
                          Sinais de {dom.lookalike_of}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={dom.status} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <LivenessBadge liveness={dom.liveness} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono text-[#667085] dark:text-[#94A3B8]">
                      {formatDateBR(dom.first_seen)}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#667085] dark:text-[#94A3B8]">
                      {formatDateBR(dom.verified_at)}
                    </td>
                    <td className="py-3 px-4 text-[#667085] dark:text-[#94A3B8] max-w-xs truncate" title={dom.evidence_snippet}>
                      {dom.evidence_snippet}
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
                ))}
              </tbody>
            </table>
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
