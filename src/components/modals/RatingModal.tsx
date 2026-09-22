import React, { useState } from 'react';
import { BrandRecord } from '../../types';
import { RatingStars } from '../ui/RatingStars';
import { store } from '../../lib/store';
import { trackEvent } from '../../lib/analytics';
import { X, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RatingModalProps {
  brand: BrandRecord;
  onClose: () => void;
  onSuccess: (updatedBrand: BrandRecord) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  brand,
  onClose,
  onSuccess,
}) => {
  const [security, setSecurity] = useState(4);
  const [payout, setPayout] = useState(4);
  const [support, setSupport] = useState(4);
  const [speed, setSpeed] = useState(4);
  const [responsibleGaming, setResponsibleGaming] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    trackEvent({
      name: 'rating_started',
      properties: { brand_id: brand.slug },
    });

    try {
      const res = store.submitBrandRating(brand.slug, {
        security,
        payout,
        support,
        speed,
        responsible_gaming: responsibleGaming,
      });

      if (res.success && res.brand) {
        trackEvent({
          name: 'rating_submitted',
          properties: { brand_id: brand.slug }, // Never CPF!
        });
        onSuccess(res.brand);
      } else {
        setError(res.error || 'Não foi possível registrar a avaliação.');
        setSubmitting(false);
      }
    } catch {
      setError('Erro de conexão ao salvar avaliação.');
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F33]/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
    >
      <div className="bg-white rounded-xl border border-[#D7DEE8] max-w-lg w-full p-6 shadow-xl relative animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#667085] hover:text-[#0B1F33] p-1.5 rounded-md hover:bg-[#F6F8FB] transition-colors"
          aria-label="Fechar formulário de avaliação"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-xs text-[#16794A] font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Marca Homologada Elegível</span>
          </div>
          <h2 id="rating-modal-title" className="text-xl font-bold text-[#0B1F33]">
            Avaliar experiência com {brand.name}
          </h2>
          <p className="text-xs text-[#667085] mt-1">
            Sua avaliação contribui para o índice reputacional independente. Esta nota não altera o status regulatório da operadora.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#FDECEC] border border-[#FECDCA] rounded-md text-xs text-[#B42318] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Critério 1 */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#F6F8FB] border border-[#D7DEE8]">
            <div>
              <span className="block text-xs font-semibold text-[#0B1F33]">Segurança percebida</span>
              <span className="text-[11px] text-[#667085]">Confiabilidade de conta e estabilidade</span>
            </div>
            <RatingStars
              value={security}
              interactive={true}
              onChange={setSecurity}
              ariaLabel="Avaliar segurança percebida"
            />
          </div>

          {/* Critério 2 */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#F6F8FB] border border-[#D7DEE8]">
            <div>
              <span className="block text-xs font-semibold text-[#0B1F33]">Pagamento de prêmios</span>
              <span className="text-[11px] text-[#667085]">Agilidade e clareza no saque/PIX</span>
            </div>
            <RatingStars
              value={payout}
              interactive={true}
              onChange={setPayout}
              ariaLabel="Avaliar pagamento de prêmios"
            />
          </div>

          {/* Critério 3 */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#F6F8FB] border border-[#D7DEE8]">
            <div>
              <span className="block text-xs font-semibold text-[#0B1F33]">Suporte e atendimento</span>
              <span className="text-[11px] text-[#667085]">Resolução de dúvidas em português</span>
            </div>
            <RatingStars
              value={support}
              interactive={true}
              onChange={setSupport}
              ariaLabel="Avaliar suporte e atendimento"
            />
          </div>

          {/* Critério 4 */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#F6F8FB] border border-[#D7DEE8]">
            <div>
              <span className="block text-xs font-semibold text-[#0B1F33]">Velocidade da plataforma</span>
              <span className="text-[11px] text-[#667085]">Fluidez nos acessos móvel e desktop</span>
            </div>
            <RatingStars
              value={speed}
              interactive={true}
              onChange={setSpeed}
              ariaLabel="Avaliar velocidade da plataforma"
            />
          </div>

          {/* Critério 5 */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#F6F8FB] border border-[#D7DEE8]">
            <div>
              <span className="block text-xs font-semibold text-[#0B1F33]">Política de jogo responsável</span>
              <span className="text-[11px] text-[#667085]">Limites de depósito e autoexclusão</span>
            </div>
            <RatingStars
              value={responsibleGaming}
              interactive={true}
              onChange={setResponsibleGaming}
              ariaLabel="Avaliar política de jogo responsável"
            />
          </div>

          <div className="pt-3 border-t border-[#D7DEE8] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#263648] hover:bg-[#F6F8FB] rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1769E0] hover:bg-[#0B1F33] rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{submitting ? 'Registrando...' : 'Confirmar avaliação'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
