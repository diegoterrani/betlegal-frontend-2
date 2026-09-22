import React from 'react';
import { ShieldCheck, ExternalLink, RefreshCw, CheckCircle2, Clock } from 'lucide-react';

export const SourcesView: React.FC = () => {
  const sources = [
    {
      name: 'Secretaria de Prêmios e Apostas (SPA/MF)',
      scope: 'Nacional (Lei nº 14.790/2023)',
      url: 'https://www.gov.br/fazenda/pt-br/orgaos/secretaria-de-premios-e-apostas',
      frequency: '4x ao dia (06h, 12h, 18h, 00h)',
      lastSync: 'Hoje, há 42 minutos',
      status: 'Operando normalmente',
      docRef: 'Portaria SPA/MF nº 827/2024 e alterações subsequentes no DOU',
    },
    {
      name: 'LOTERJ — Loteria do Estado do Rio de Janeiro',
      scope: 'Estadual (Rio de Janeiro)',
      url: 'https://loterj.rj.gov.br',
      frequency: 'Diária (manhã)',
      lastSync: 'Hoje, há 3 horas',
      status: 'Operando normalmente',
      docRef: 'Credenciamentos pelo Edital nº 01/2023 no DOERJ',
    },
    {
      name: 'LOTTOPAR — Loteria do Estado do Paraná',
      scope: 'Estadual (Paraná)',
      url: 'https://www.lottopar.pr.gov.br',
      frequency: 'Diária (manhã)',
      lastSync: 'Hoje, há 4 horas',
      status: 'Operando normalmente',
      docRef: 'Concessões públicas de apostas de quota fixa no DOE/PR',
    },
    {
      name: 'Agência Nacional de Telecomunicações (Anatel)',
      scope: 'Notificações de Bloqueio DNS / IP',
      url: 'https://www.gov.br/anatel/pt-br',
      frequency: 'A cada atualização de ofício',
      lastSync: 'Ontem, 21:30',
      status: 'Operando normalmente',
      docRef: 'Atos e determinações expedidos pelo judiciário e SPA/MF',
    },
    {
      name: 'Reclame Aqui (Snapshot Reputacional)',
      scope: 'Atendimento ao Consumidor (Terceiro)',
      url: 'https://www.reclameaqui.com.br',
      frequency: 'Semanal (snapshots de índice e reclamações)',
      lastSync: 'Segunda-feira, 08:00',
      status: 'Operando normalmente',
      docRef: 'Dados públicos de reputação consolidados de forma independente',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1769E0] dark:text-[#38BDF8] uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Rastreabilidade de Dados Oficiais</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">
          Fontes oficiais consultadas
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] dark:text-[#94A3B8] mt-1 max-w-3xl leading-relaxed">
          Nossa equipe e robôs de auditoria monitoram continuamente bases do poder executivo, autarquias lotéricas e tribunais para certificar o estado legal das casas.
        </p>
      </div>

      <div className="space-y-4">
        {sources.map((src, i) => (
          <div key={i} className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC]">{src.name}</h2>
                <span className="text-[11px] bg-[#F0F7FF] dark:bg-[#1E3A8A]/30 text-[#1769E0] dark:text-[#38BDF8] font-semibold px-2 py-0.5 rounded">
                  {src.scope}
                </span>
              </div>
              <p className="text-xs text-[#667085] dark:text-[#94A3B8]">{src.docRef}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#667085] dark:text-[#94A3B8] pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1769E0] dark:text-[#38BDF8]" />
                  Frequência: {src.frequency}
                </span>
                <span className="flex items-center gap-1 text-[#16794A] dark:text-[#34D399] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {src.status} ({src.lastSync})
                </span>
              </div>
            </div>

            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F6F8FB] dark:bg-[#0E1724] hover:bg-[#E5E9F0] dark:hover:bg-[#1A293D] border border-[#D7DEE8] dark:border-[#263548] text-xs font-semibold text-[#0B1F33] dark:text-white rounded-md transition-colors shrink-0"
            >
              <span>Acessar portal oficial</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
