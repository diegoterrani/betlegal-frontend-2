import React, { useState, useMemo } from 'react';
import { store } from '../../lib/store';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDateBR, formatDateTimeBR } from '../../lib/formatters';
import { trackEvent } from '../../lib/analytics';
import { History, Rss, ArrowRight, Calendar, CheckCircle2, Search, ExternalLink, Download } from 'lucide-react';

interface ChangesViewProps {
  onNavigate: (path: string) => void;
}

export const ChangesView: React.FC<ChangesViewProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showRssModal, setShowRssModal] = useState(false);

  const changes = store.getChanges();

  const filtered = useMemo(() => {
    return changes.filter((ch) => {
      const matchText =
        ch.entity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ch.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ch.source_name.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchText) return false;
      if (statusFilter !== 'ALL' && ch.to_status !== statusFilter) return false;
      return true;
    });
  }, [changes, searchTerm, statusFilter]);

  const handleDownloadRss = () => {
    const rssContent = store.exportChangesRSS();
    const blob = new Blob([rssContent], { type: 'application/rss+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feed-mudancas-bet-legal.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1769E0] dark:text-[#38BDF8] uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Auditoria Regulatória Temporal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">
            Mudanças no mercado de apostas
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] dark:text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
            Feed cronológico de alterações de status legal, exclusões, inclusões e decisões judiciais monitoradas pelo Bet Legal com rastreabilidade da fonte.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRssModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#131F2E] border border-[#D7DEE8] dark:border-[#263548] rounded-md text-xs font-semibold text-[#263648] dark:text-[#CBD5E1] hover:bg-[#F6F8FB] dark:hover:bg-[#1A293D] transition-colors"
          >
            <Rss className="w-3.5 h-3.5 text-[#EAA914]" />
            <span>Feed RSS (XML)</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-[#131F2E] p-4 rounded-xl border border-[#D7DEE8] dark:border-[#263548] shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#667085] dark:text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por entidade, anotação ou fonte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#0B1F33] dark:text-white placeholder-[#667085] dark:placeholder-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#1769E0]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md px-3 py-1.5 text-xs text-[#0B1F33] dark:text-white"
        >
          <option value="ALL">Todos os status finais</option>
          <option value="AUTORIZADA_NACIONAL">Autorizada Nacional</option>
          <option value="AUTORIZADA_ESTADUAL">Autorizada Estadual</option>
          <option value="DECISAO_JUDICIAL">Decisão Judicial</option>
          <option value="SUSPENSA_REVOGADA">Suspensa / Revogada</option>
          <option value="BLOQUEADA_ANATEL">Bloqueada Anatel</option>
        </select>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-5 shadow-xs hover:border-[#1769E0] dark:hover:border-[#38BDF8] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC]">
                  {item.entity_name}
                </span>
                {item.host && (
                  <button
                    type="button"
                    onClick={() => onNavigate(`/dominio/${item.host}`)}
                    className="text-xs text-[#1769E0] dark:text-[#38BDF8] hover:underline font-mono"
                  >
                    (ver ficha)
                  </button>
                )}
              </div>

              {/* Status "de -> para" */}
              <div className="flex items-center gap-2">
                <StatusBadge status={item.from_status} size="sm" showIcon={false} />
                <ArrowRight className="w-3.5 h-3.5 text-[#667085] dark:text-[#94A3B8]" />
                <StatusBadge status={item.to_status} size="sm" showIcon={false} />
              </div>
            </div>

            <p className="text-xs text-[#263648] dark:text-[#CBD5E1] leading-relaxed mb-4">
              {item.notes}
            </p>

            {/* Clear distinction between effective_at and created_at */}
            <div className="pt-3 border-t border-[#F2F4F7] dark:border-[#1E293B] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#667085] dark:text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#1769E0] dark:text-[#38BDF8] shrink-0" />
                <span>Vigência legal (quando o fato passou a valer):</span>
                <strong className="font-mono text-[#0B1F33] dark:text-white font-medium">{formatDateBR(item.effective_at)}</strong>
              </div>

              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#11A8A5] dark:text-[#38BDF8] shrink-0" />
                <span>Registrado na plataforma:</span>
                <span className="font-mono text-[#263648] dark:text-[#CBD5E1]">{formatDateTimeBR(item.created_at)}</span>
              </div>
            </div>

            <div className="mt-2 text-right">
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1769E0] dark:text-[#38BDF8] hover:underline"
              >
                <span>Fonte: {item.source_name}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* RSS Modal preview */}
      {showRssModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F33]/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl border border-[#D7DEE8] max-w-2xl w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#D7DEE8] mb-4">
              <div className="flex items-center gap-2">
                <Rss className="w-5 h-5 text-[#EAA914]" />
                <h3 className="font-bold text-[#0B1F33] text-base">Feed RSS Oficial (/mudancas/feed.xml)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRssModal(false)}
                className="text-xs text-[#667085] hover:text-[#0B1F33]"
              >
                Fechar
              </button>
            </div>

            <p className="text-xs text-[#667085] mb-3 leading-relaxed">
              Disponibilizamos o feed em padrão RSS 2.0 para agregação por leitores de notícias, bots de compliance e redações jornalísticas.
            </p>

            <pre className="bg-[#0B1F33] text-[#A6F4C5] p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-60">
              {store.exportChangesRSS()}
            </pre>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleDownloadRss}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1769E0] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar feed.xml</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
