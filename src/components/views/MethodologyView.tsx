import React from 'react';
import { STATUS_UI } from '../../lib/mapper';
import { StatusBadge } from '../ui/StatusBadge';
import { ShieldCheck, FileCheck, Layers, Eye, RefreshCw, AlertTriangle, Scale, Lock } from 'lucide-react';

interface MethodologyViewProps {
  onNavigate: (path: string) => void;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({ onNavigate }) => {
  const steps = [
    { num: '01', title: 'Coletamos', desc: 'Monitoramento automatizado do Diário Oficial da União (DOU), diários oficiais dos estados (LOTERJ, LOTTOPAR, etc.) e ofícios de bloqueio remetidos à Anatel.' },
    { num: '02', title: 'Verificamos', desc: 'Resolução técnica de DNS, status HTTP (liveness), certificados SSL/TLS e análise de registros WHOIS dos domínios em circulação.' },
    { num: '03', title: 'Cruzamos', desc: 'Associação estrita entre o domínio web (.bet.br ou outros), a marca comercial anunciada e a razão social do operador outorgado.' },
    { num: '04', title: 'Classificamos', desc: 'Aplicação das regras determinísticas da taxonomia pública, isolando status regulatório de conectividade técnica.' },
    { num: '05', title: 'Publicamos', desc: 'Divulgação aberta em segundos para consulta gratuita pela população, sem cobrança e sem afiliação.' },
    { num: '06', title: 'Acompanhamos', desc: 'Histórico perpétuo de mudanças de status com data de vigência legal e data de constatação pela plataforma.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#11A8A5] dark:text-[#38BDF8] uppercase tracking-wider mb-1">
          <FileCheck className="w-4 h-4" />
          <span>Critérios Científicos e Rastreabilidade</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">
          Metodologia de apuração e dados
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] dark:text-[#94A3B8] mt-2 max-w-3xl leading-relaxed">
          Entenda como o Bet Legal processa registros oficiais, realiza varreduras técnicas de rede e cataloga informações públicas do mercado brasileiro de apostas.
        </p>
      </div>

      {/* Visual Workflow */}
      <section className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-6">
          O Fluxo Contínuo de Checagem
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="p-4 rounded-lg bg-[#F8FAFC] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#1769E0] dark:text-[#38BDF8] block mb-1">
                  ETAPA {step.num}
                </span>
                <h3 className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-2">{step.title}</h3>
                <p className="text-xs text-[#667085] dark:text-[#94A3B8] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Taxonomia Completa de Status */}
      <section className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#0B1F33] dark:text-[#F8FAFC]">
            Taxonomia Rigorosa de Status
          </h2>
          <p className="text-xs text-[#667085] dark:text-[#94A3B8] mt-1">
            Cada classificação visual reflete exclusivamente uma situação documental verificada perante as fontes públicas.
          </p>
        </div>

        <div className="divide-y divide-[#F2F4F7] dark:divide-[#1E293B]">
          {Object.entries(STATUS_UI).map(([key, item]) => (
            <div key={key} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="sm:w-1/3">
                <StatusBadge status={key as any} size="md" />
              </div>
              <div className="sm:w-2/3 space-y-1">
                <p className="text-xs text-[#0B1F33] dark:text-[#F8FAFC] font-semibold">{item.description}</p>
                <p className="text-xs text-[#667085] dark:text-[#94A3B8]">{item.publicAdvice}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seção: O que o Bet Legal NÃO é */}
      <section className="bg-[#FFF4E5] dark:bg-[#78350F]/25 border border-[#FEDF89] dark:border-[#B45309] rounded-xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-[#B54708] dark:text-[#FDE68A] mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          O que o Bet Legal NÃO é
        </h2>
        <ul className="space-y-2 text-xs text-[#263648] dark:text-[#E2E8F0] leading-relaxed list-disc list-inside">
          <li><strong>Não é uma casa de apostas:</strong> Não oferecemos jogos, apostas, pagamentos ou promoções.</li>
          <li><strong>Não é afiliado comercial:</strong> Não recebemos remuneração, comissões de apostas geradas ou links de bônus de nenhum operador.</li>
          <li><strong>Não é parecer jurídico de mérito:</strong> A plataforma descreve fatos cadastrais públicos nas datas das checagens.</li>
          <li><strong>Não é SAC ou ouvidoria de prêmios:</strong> Não intermediamos disputas de saldo ou saques entre usuários e operadores.</li>
        </ul>
      </section>

      {/* Como Contestar */}
      <section className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC]">
            Identificou alguma inconsistência documental?
          </h2>
          <p className="text-xs text-[#667085] dark:text-[#94A3B8] mt-1 max-w-xl">
            Operadores com novas portarias ou certidões podem submeter pedido formal de revisão através do nosso canal de contestação com prazo de análise de 5 dias úteis.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/contestar')}
          className="px-4 py-2.5 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8] transition-colors shrink-0"
        >
          Abrir contestação documental
        </button>
      </section>
    </div>
  );
};
