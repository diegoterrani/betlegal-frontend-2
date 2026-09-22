import React, { useState } from 'react';
import { RegulatoryStatus, LivenessStatus } from '../../types';
import { StatusBadge } from './StatusBadge';
import { LivenessBadge } from './LivenessBadge';
import { Freshness } from './Freshness';
import { Copy, Check, ExternalLink, Share2, History, Shield, Info } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

interface ConfereCardProps {
  host: string;
  brandName: string;
  operatorName?: string;
  status: RegulatoryStatus;
  liveness?: LivenessStatus;
  sourceName: string;
  sourceUrl?: string;
  verifiedAt: string;
  onNavigateHistory?: () => void;
  onNavigateDetail?: () => void;
  inReview?: boolean;
}

export const ConfereCard: React.FC<ConfereCardProps> = ({
  host,
  brandName,
  operatorName,
  status,
  liveness,
  sourceName,
  sourceUrl,
  verifiedAt,
  onNavigateHistory,
  onNavigateDetail,
  inReview = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopyHost = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(host);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;
    trackEvent({
      name: 'verification_shared',
      properties: { entity_type: 'domain', channel: hasNativeShare ? 'native' : 'clipboard' },
    });

    const shareUrl = `${window.location.origin}/#/dominio/${host}`;
    const shareData = {
      title: `Bet Legal — Verificação de ${host}`,
      text: `Verificação oficial para ${brandName} (${host}) no Bet Legal`,
      url: shareUrl,
    };

    if (hasNativeShare) {
      try {
        await (navigator as any).share(shareData);
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <article
      className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
      aria-label={`Cartão de verificação de ${brandName}`}
    >
      {/* Top Banner if in review */}
      {inReview && (
        <div className="bg-[#FFF4D6] dark:bg-[#78350F]/20 border-b border-[#FFE58F] dark:border-[#78350F]/40 px-4 py-1.5 flex items-center gap-2 text-xs text-[#A35C00] dark:text-[#FBBF24] font-medium">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Este registro possui contestação ativa em processo de revisão documental.</span>
        </div>
      )}

      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Header: Brand Name & Host */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">{brandName}</h3>
              {operatorName && (
                <span className="text-xs text-[#667085] dark:text-[#94A3B8] hidden md:inline truncate max-w-xs">
                  · {operatorName}
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyHost}
                className="font-mono text-sm text-[#1769E0] dark:text-[#38BDF8] hover:underline inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#1769E0] rounded px-1 -ml-1 py-0.5"
                title="Copiar domínio completo"
              >
                <span>{host}</span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#16794A] dark:text-[#34D399]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#667085] dark:text-[#94A3B8] hover:text-[#1769E0] dark:hover:text-[#38BDF8]" />
                )}
              </button>
            </div>
          </div>

          {/* Badges: Status and separate Liveness */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <StatusBadge status={status} size="md" />
            {liveness && <LivenessBadge liveness={liveness} size="md" />}
          </div>
        </div>

        {/* Source citation */}
        <div className="mt-2 pt-3 border-t border-[#F2F4F7] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[#667085] dark:text-[#94A3B8]">
            <Shield className="w-3.5 h-3.5 text-[#11A8A5] dark:text-[#38BDF8] shrink-0" />
            <span className="font-medium text-[#263648] dark:text-[#CBD5E1]">Fonte:</span>
            <span className="truncate max-w-md">{sourceName}</span>
          </div>

          <Freshness verifiedAt={verifiedAt} showRelative={true} />
        </div>

        {/* Actions row */}
        <div className="mt-5 pt-3 border-t border-[#F2F4F7] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent({
                    name: 'source_opened',
                    properties: { entity_type: 'domain', source_type: sourceName },
                  })
                }
                className="inline-flex items-center gap-1 text-xs font-medium text-[#1769E0] dark:text-[#38BDF8] hover:text-[#0B1F33] dark:hover:text-white py-1.5 px-2.5 rounded-md hover:bg-[#F6F8FB] dark:hover:bg-[#1A293D] transition-colors"
              >
                <span>Ver fonte</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {onNavigateHistory && (
              <button
                type="button"
                onClick={onNavigateHistory}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#263648] dark:text-[#CBD5E1] hover:text-[#1769E0] dark:hover:text-[#38BDF8] py-1.5 px-2.5 rounded-md hover:bg-[#F6F8FB] dark:hover:bg-[#1A293D] transition-colors"
              >
                <History className="w-3 h-3 text-[#667085] dark:text-[#94A3B8]" />
                <span>Ver histórico</span>
              </button>
            )}

            {onNavigateDetail && (
              <button
                type="button"
                onClick={onNavigateDetail}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1769E0] dark:text-[#38BDF8] hover:underline py-1.5 px-2.5 rounded-md hover:bg-[#EAF7F0]/30 dark:hover:bg-[#38BDF8]/10 transition-colors"
              >
                <span>Ficha completa →</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs text-[#667085] dark:text-[#94A3B8] hover:text-[#0B1F33] dark:hover:text-white py-1.5 px-2.5 rounded-md hover:bg-[#F6F8FB] dark:hover:bg-[#1A293D] transition-colors ml-auto"
            aria-label="Compartilhar verificação"
          >
            {shared ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#16794A] dark:text-[#34D399]" />
                <span className="text-[#16794A] dark:text-[#34D399] font-medium">Link copiado</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartilhar verificação</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mandatory compact disclaimer */}
      <footer className="bg-[#F8FAFC] dark:bg-[#0E1724] border-t border-[#D7DEE8] dark:border-[#263548] px-5 py-2 text-[11px] text-[#667085] dark:text-[#94A3B8] flex items-center justify-between">
        <span>Status informativo; em divergência, prevalece a fonte oficial.</span>
        <span className="text-[#11A8A5] dark:text-[#38BDF8] font-mono font-medium">Bet Legal</span>
      </footer>
    </article>
  );
};

export const BetLegalCard = ConfereCard;
export type BetLegalCardProps = ConfereCardProps;

