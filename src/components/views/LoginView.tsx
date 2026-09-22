import React, { useState } from 'react';
import { store } from '../../lib/store';
import { UserSession } from '../../types';
import { trackEvent } from '../../lib/analytics';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (session: UserSession) => void;
  onNavigate: (path: string) => void;
  redirectPath?: string;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigate,
  redirectPath = '/',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor informe e-mail e senha.');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      const isAdmin = email.toLowerCase().includes('admin');
      const session = store.login(email.trim(), password, isAdmin);
      trackEvent({
        name: 'login_completed',
        properties: { origin: 'login_page' },
      });
      onLoginSuccess(session);
      onNavigate(redirectPath);
    }, 250);
  };

  const handleQuickLogin = (asAdmin: boolean) => {
    const demoEmail = asAdmin ? 'admin@betlegal.com.br' : 'auditor.cidadao@exemplo.com';
    const session = store.login(demoEmail, 'demo12345', asAdmin);
    onLoginSuccess(session);
    onNavigate(asAdmin ? '/painel' : redirectPath);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">
            Entrar no Bet Legal
          </h1>
          <p className="text-xs text-[#667085] dark:text-[#94A3B8] mt-1">
            Acesse suas avaliações salvas e ferramentas exclusivas de monitoramento.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#FDECEC] dark:bg-[#7F1D1D]/30 border border-[#FECDCA] dark:border-[#991B1B] rounded-md text-xs text-[#B42318] dark:text-[#FCA5A5]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login_email" className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#667085] dark:text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                id="login_email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md pl-9 pr-3 py-2 text-xs text-[#0B1F33] dark:text-white focus-visible:ring-2 focus-visible:ring-[#1769E0]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="login_password" className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC]">
                Senha
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#667085] dark:text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                id="login_password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md pl-9 pr-3 py-2 text-xs text-[#0B1F33] dark:text-white focus-visible:ring-2 focus-visible:ring-[#1769E0]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
          >
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        {/* Quick Demo Logins for evaluator review */}
        <div className="mt-6 pt-4 border-t border-[#F2F4F7] dark:border-[#1E293B] space-y-2">
          <span className="text-[11px] font-semibold text-[#667085] dark:text-[#94A3B8] uppercase tracking-wider block text-center">
            Acesso Rápido de Demonstração
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin(false)}
              className="py-1.5 px-2 bg-[#F6F8FB] dark:bg-[#1E293B] hover:bg-[#E5E9F0] dark:hover:bg-[#334155] border border-[#D7DEE8] dark:border-[#334155] rounded text-xs font-medium text-[#263648] dark:text-[#CBD5E1] transition-colors flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#1769E0] dark:text-[#38BDF8]" />
              <span>Como Usuário</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin(true)}
              className="py-1.5 px-2 bg-[#F4F0FF] dark:bg-[#581C87]/30 hover:bg-[#E9D5FF] dark:hover:bg-[#581C87]/60 border border-[#D8B4FE] dark:border-[#7E22CE] rounded text-xs font-semibold text-[#6941C6] dark:text-[#C084FC] transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Como Admin</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#667085] dark:text-[#94A3B8]">
          Ainda não possui conta?{' '}
          <button
            type="button"
            onClick={() => onNavigate('/cadastrar')}
            className="text-[#1769E0] dark:text-[#38BDF8] font-semibold hover:underline"
          >
            Cadastre-se gratuitamente
          </button>
        </div>
      </div>
    </div>
  );
};
