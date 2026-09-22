import React from 'react';
import { Lock, ShieldCheck, Database, EyeOff, UserX } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#16794A] dark:text-[#34D399] uppercase tracking-wider mb-1">
          <Lock className="w-4 h-4" />
          <span>LGPD e Segurança da Informação</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">
          Política de privacidade e proteção de dados
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] dark:text-[#94A3B8] mt-1 leading-relaxed">
          Transparência absoluta sobre o tratamento de identificadores e o compromisso de privacidade por padrão do Bet Legal.
        </p>
      </div>

      <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 sm:p-8 shadow-xs space-y-6 text-xs text-[#263648] dark:text-[#CBD5E1] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#0B1F33] dark:text-[#F8FAFC] uppercase tracking-wider">
            1. Tratamento do CPF via Hash Criptográfico
          </h2>
          <p>
            O CPF é coletado unicamente no momento do cadastro com a finalidade legítima de evitar fraudes e votos robóticos nas notas da comunidade. 
            O dado é processado imediatamente por função de hash unidirecional (SHA-256 com sal e pimenta secreta de servidor). O número original em texto claro <strong>nunca é salvo em disco</strong>, não transita para terceiros e não pode ser descriptografado nem mesmo pela equipe do Bet Legal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#0B1F33] dark:text-[#F8FAFC] uppercase tracking-wider">
            2. Consultas e Buscas Públicas
          </h2>
          <p>
            A consulta pública de domínios, marcas e CNPJs é livre e aberta. O sistema não associa o histórico de buscas anônimas a IPs individuais de forma permanente. Nenhuma busca de usuário é vendida ou repassada para casas de apostas.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#0B1F33] dark:text-[#F8FAFC] uppercase tracking-wider">
            3. Cookies e Rastreamento
          </h2>
          <p>
            Utilizamos apenas cookies técnicos estritamente necessários para gerenciamento de sessão autenticada. Não utilizamos rastreadores de publicidade de cassinos, nem pixels de retargeting esportivo.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#0B1F33] dark:text-[#F8FAFC] uppercase tracking-wider">
            4. Direitos do Titular (LGPD)
          </h2>
          <p>
            Qualquer usuário autenticado tem direito de revogar o consentimento, solicitar exclusão definitiva de sua conta ou exportar o histórico de avaliações submetidas através do canal oficial <span className="font-mono text-[#1769E0] dark:text-[#38BDF8]">privacidade@betlegal.com.br</span>.
          </p>
        </section>
      </div>
    </div>
  );
};
