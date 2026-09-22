import React, { useState, useEffect } from 'react';
import { store } from '../../lib/store';
import { trackEvent } from '../../lib/analytics';
import { AlertBanner } from '../ui/AlertBanner';
import { AlertTriangle, CheckCircle2, ShieldCheck, FileText, Send, ArrowLeft, Copy, Check } from 'lucide-react';

interface ContestViewProps {
  initialUrl?: string;
  onNavigate: (path: string) => void;
}

export const ContestView: React.FC<ContestViewProps> = ({ initialUrl = '', onNavigate }) => {
  const [submissionType, setSubmissionType] = useState<'contest' | 'report'>('contest');
  const [targetUrl, setTargetUrl] = useState(initialUrl);
  const [reason, setReason] = useState('');
  const [evidenceDescription, setEvidenceDescription] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [copiedProtocol, setCopiedProtocol] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialUrl) {
      setTargetUrl(initialUrl);
    }
  }, [initialUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim() || !reason.trim() || !evidenceDescription.trim()) {
      setError('Por favor preencha todos os campos obrigatórios.');
      return;
    }

    setSubmitting(true);
    setError(null);

    trackEvent({
      name: 'report_started',
      properties: { type: submissionType },
    });

    try {
      const res = store.submitContest({
        type: submissionType,
        target_url: targetUrl.trim(),
        reason: reason.trim(),
        evidence_description: evidenceDescription.trim(),
        email: email.trim() || undefined,
      });

      trackEvent({
        name: 'report_submitted',
        properties: { type: submissionType }, // No freeform text!
      });

      setProtocol(res.protocol);
      setSubmitting(false);
    } catch {
      setError('Ocorreu um erro ao processar seu reporte. Tente novamente.');
      setSubmitting(false);
    }
  };

  const handleCopyProtocol = () => {
    if (protocol) {
      navigator.clipboard.writeText(protocol);
      setCopiedProtocol(true);
      setTimeout(() => setCopiedProtocol(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#B54708] dark:text-[#FB923C] uppercase tracking-wider mb-1">
          <AlertTriangle className="w-4 h-4" />
          <span>Direito de Resposta e Canal Comunitário</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">
          Contestar registro ou reportar site
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] dark:text-[#94A3B8] mt-1 leading-relaxed">
          Canal formal para operadores solicitarem correção de apontamento e para cidadãos indicarem endereços não catalogados.
        </p>
      </div>

      {/* SLA & Legal scope banner */}
      <AlertBanner type="warning" title="Aviso de Finalidade">
        Este formulário destina-se exclusivamente a apontamentos regulatórios e correção de dados cadastrais. O Bet Legal <strong>não atua como serviço de atendimento ao consumidor (SAC)</strong>, não arbitra litígios entre apostadores e operadores e não possui competência para restituição de apostas ou prêmios.
      </AlertBanner>

      {protocol ? (
        /* Success State with Protocol */
        <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#A6F4C5] dark:border-[#059669] p-8 text-center shadow-xs space-y-6 animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-[#EAF7F0] dark:bg-[#064E3B]/30 border border-[#A6F4C5] dark:border-[#059669] flex items-center justify-center mx-auto text-[#16794A] dark:text-[#34D399]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0B1F33] dark:text-[#F8FAFC]">Protocolo registrado com sucesso</h2>
            <p className="text-xs text-[#667085] dark:text-[#94A3B8] mt-1 max-w-md mx-auto">
              Nossa equipe técnica e editorial fará a conferência dos dados em até <strong className="text-[#263648] dark:text-[#CBD5E1]">5 dias úteis</strong>.
            </p>
          </div>

          <div className="p-4 bg-[#F8FAFC] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-xl max-w-xs mx-auto">
            <span className="text-xs text-[#667085] dark:text-[#94A3B8] block mb-1">Seu número de protocolo:</span>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-lg font-bold text-[#1769E0] dark:text-[#38BDF8]">{protocol}</span>
              <button
                type="button"
                onClick={handleCopyProtocol}
                className="p-1 text-[#667085] dark:text-[#94A3B8] hover:text-[#1769E0] dark:hover:text-[#38BDF8] transition-colors"
                title="Copiar protocolo"
              >
                {copiedProtocol ? <Check className="w-4 h-4 text-[#16794A] dark:text-[#34D399]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {submissionType === 'contest' && (
            <div className="text-xs text-[#A35C00] dark:text-[#FDE68A] bg-[#FFF4D6] dark:bg-[#78350F]/30 p-3 rounded-lg border border-[#FEDF89] dark:border-[#B45309] max-w-md mx-auto text-left">
              <strong>Efeito no cadastro:</strong> O domínio informado foi sinalizado com a etiqueta temporária <em>“Em revisão”</em> durante a apuração documental.
            </div>
          )}

          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="px-4 py-2 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8]"
            >
              Voltar ao Início
            </button>
            <button
              type="button"
              onClick={() => {
                setProtocol(null);
                setReason('');
                setEvidenceDescription('');
              }}
              className="px-4 py-2 bg-[#F6F8FB] dark:bg-[#1E293B] border border-[#D7DEE8] dark:border-[#263548] text-xs font-semibold rounded-md text-[#263648] dark:text-[#CBD5E1]"
            >
              Novo reporte
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Selection: Contestar vs Reportar */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-2 uppercase tracking-wide">
                Finalidade da manifestação
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSubmissionType('contest')}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    submissionType === 'contest'
                      ? 'border-[#1769E0] dark:border-[#38BDF8] bg-[#F0F7FF] dark:bg-[#1E3A8A]/30 ring-2 ring-[#1769E0]/20'
                      : 'border-[#D7DEE8] dark:border-[#263548] bg-white dark:bg-[#0E1724] hover:bg-[#F6F8FB] dark:hover:bg-[#1A293D]'
                  }`}
                >
                  <span className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC]">Contestar um registro</span>
                  <span className="text-[11px] text-[#667085] dark:text-[#94A3B8] mt-0.5 block">
                    Para operadores ou titulares que possuem outorga e desejam atualizar dados.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubmissionType('report')}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    submissionType === 'report'
                      ? 'border-[#1769E0] dark:border-[#38BDF8] bg-[#F0F7FF] dark:bg-[#1E3A8A]/30 ring-2 ring-[#1769E0]/20'
                      : 'border-[#D7DEE8] dark:border-[#263548] bg-white dark:bg-[#0E1724] hover:bg-[#F6F8FB] dark:hover:bg-[#1A293D]'
                  }`}
                >
                  <span className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC]">Reportar site suspeito</span>
                  <span className="text-[11px] text-[#667085] dark:text-[#94A3B8] mt-0.5 block">
                    Para qualquer usuário que detectou um site de apostas ativo fora das listas.
                  </span>
                </button>
              </div>
            </div>

            {/* Target URL / Host */}
            <div>
              <label htmlFor="target_url" className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
                Domínio ou endereço web <span className="text-[#B42318]">*</span>
              </label>
              <input
                id="target_url"
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="exemplo.bet.br ou https://site-suspeito.com"
                required
                className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md px-3 py-2 text-xs font-mono text-[#0B1F33] dark:text-white placeholder-[#667085] dark:placeholder-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#1769E0]"
              />
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
                Motivo resumido <span className="text-[#B42318]">*</span>
              </label>
              <input
                id="reason"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  submissionType === 'contest'
                    ? 'Ex: Portaria estadual recente não computada / Erro de CNPJ'
                    : 'Ex: Domínio falso clonando marca conhecida / Coleta de PIX suspeito'
                }
                required
                className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md px-3 py-2 text-xs text-[#0B1F33] dark:text-white placeholder-[#667085] dark:placeholder-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#1769E0]"
              />
            </div>

            {/* Evidences description */}
            <div>
              <label htmlFor="evidence" className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
                Descrição detalhada e links das evidências <span className="text-[#B42318]">*</span>
              </label>
              <textarea
                id="evidence"
                rows={4}
                value={evidenceDescription}
                onChange={(e) => setEvidenceDescription(e.target.value)}
                placeholder="Insira os números de processo, links de Diário Oficial ou descrição da publicidade suspeita..."
                required
                className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md p-3 text-xs text-[#0B1F33] dark:text-white placeholder-[#667085] dark:placeholder-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#1769E0]"
              />
            </div>

            {/* Email (optional) */}
            <div>
              <label htmlFor="contact_email" className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
                E-mail para resposta (opcional)
              </label>
              <input
                id="contact_email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md px-3 py-2 text-xs text-[#0B1F33] dark:text-white placeholder-[#667085] dark:placeholder-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#1769E0]"
              />
              <span className="text-[11px] text-[#667085] dark:text-[#94A3B8] mt-1 block">
                Se fornecido, será utilizado estritamente para o envio do parecer da apuração do protocolo.
              </span>
            </div>

            {error && (
              <div className="p-3 bg-[#FDECEC] dark:bg-[#7F1D1D]/30 border border-[#FECDCA] dark:border-[#991B1B] rounded-md text-xs text-[#B42318] dark:text-[#FCA5A5]">
                {error}
              </div>
            )}

            <div className="pt-2 border-t border-[#F2F4F7] dark:border-[#1E293B] flex items-center justify-between">
              <span className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
                Prazo estimado de resposta: 5 dias úteis
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Enviando...' : 'Enviar manifestação'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
