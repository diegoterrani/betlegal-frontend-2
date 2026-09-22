import React, { useState } from 'react';
import { trackEvent } from '../../lib/analytics';
import { ShieldCheck, Lock, Mail, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface RegisterViewProps {
  onNavigate: (path: string) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('É necessário aceitar os termos de uso e política de privacidade.');
      return;
    }

    setSubmitting(true);
    setError(null);

    trackEvent({
      name: 'signup_started',
      properties: { origin: 'register_form' },
    });

    // Simulate backend hash with salt and email dispatch
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      trackEvent({
        name: 'signup_completed',
        properties: { origin: 'register_form' },
      });
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 sm:p-8 shadow-xs">
        {success ? (
          <div className="text-center space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#EAF7F0] dark:bg-[#064E3B]/40 border border-[#A6F4C5] dark:border-[#059669] flex items-center justify-center mx-auto text-[#16794A] dark:text-[#34D399]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[#0B1F33] dark:text-[#F8FAFC]">Confirmação enviada</h2>
            <p className="text-xs text-[#667085] dark:text-[#94A3B8] leading-relaxed">
              Enviamos um link de confirmação para <strong className="text-[#0B1F33] dark:text-white">{email}</strong>. Clique no link do e-mail para ativar sua conta.
            </p>

            <div className="pt-4 space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('/confirmar?token=demo-token-123')}
                className="w-full py-2 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8] transition-colors"
              >
                Simular clique no link do e-mail →
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/entrar')}
                className="w-full py-2 bg-[#F6F8FB] dark:bg-[#1E293B] border border-[#D7DEE8] dark:border-[#263548] text-xs font-medium rounded-md text-[#263648] dark:text-[#CBD5E1]"
              >
                Ir para o login
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">
                Criar conta no Bet Legal
              </h1>
              <p className="text-xs text-[#667085] dark:text-[#94A3B8] mt-1">
                Acesse a área de avaliações comunitárias e acompanhe notificações do mercado.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[#FDECEC] dark:bg-[#7F1D1D]/30 border border-[#FECDCA] dark:border-[#991B1B] rounded-md text-xs text-[#B42318] dark:text-[#FCA5A5]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reg_email" className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
                  E-mail institucional ou pessoal
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#667085] dark:text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    id="reg_email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.nome@exemplo.com"
                    className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md pl-9 pr-3 py-2 text-xs text-[#0B1F33] dark:text-white focus-visible:ring-2 focus-visible:ring-[#1769E0]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg_password" className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
                  Senha segura
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#667085] dark:text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    id="reg_password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md pl-9 pr-3 py-2 text-xs text-[#0B1F33] dark:text-white focus-visible:ring-2 focus-visible:ring-[#1769E0]"
                  />
                </div>
              </div>

              {/* Contextual explanation of CPF according to Section 13 & 17 */}
              <div className="p-3 bg-[#F0F7FF] dark:bg-[#1E3A8A]/30 border border-[#BDDCFF] dark:border-[#1E40AF] rounded-md text-[11px] text-[#0B3A75] dark:text-[#93C5FD] leading-relaxed">
                <strong>Por que solicitamos o CPF?</strong> Para evitar fraudes e votos robóticos duplicados nas avaliações comunitárias. Seu CPF é convertido imediatamente em <em>hash criptográfico com pimenta</em> pelo servidor e nunca fica armazenado em texto claro ou exposto a terceiros.
              </div>

              <div>
                <label htmlFor="reg_cpf" className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
                  CPF (apenas números)
                </label>
                <input
                  id="reg_cpf"
                  type="text"
                  required
                  maxLength={14}
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md px-3 py-2 text-xs font-mono text-[#0B1F33] dark:text-white focus-visible:ring-2 focus-visible:ring-[#1769E0]"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 rounded border-[#D7DEE8] dark:border-[#334155] text-[#1769E0] focus:ring-[#1769E0]"
                />
                <label htmlFor="terms" className="text-xs text-[#667085] dark:text-[#94A3B8] leading-tight">
                  Declaro que li e concordo com a{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('/privacidade')}
                    className="text-[#1769E0] dark:text-[#38BDF8] underline"
                  >
                    Política de Privacidade (LGPD)
                  </button>{' '}
                  e os Termos de Uso do Bet Legal.
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Processando cadastro...' : 'Criar minha conta'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#F2F4F7] dark:border-[#1E293B] text-center text-xs text-[#667085] dark:text-[#94A3B8]">
              Já possui conta cadastrada?{' '}
              <button
                type="button"
                onClick={() => onNavigate('/entrar')}
                className="text-[#1769E0] dark:text-[#38BDF8] font-semibold hover:underline"
              >
                Entrar agora
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
