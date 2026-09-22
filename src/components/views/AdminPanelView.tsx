import React, { useState } from 'react';
import { store } from '../../lib/store';
import { UserSession, RegulatoryStatus, LivenessStatus, ContestSubmission } from '../../types';
import { KpiCard } from '../ui/KpiCard';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDateBR, formatDateTimeBR } from '../../lib/formatters';
import { trackEvent } from '../../lib/analytics';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle,
  Database,
  RefreshCw,
  FileCheck,
  AlertTriangle,
  Lock,
} from 'lucide-react';

interface AdminPanelViewProps {
  user: UserSession | null;
  onNavigate: (path: string) => void;
  onLoginAsAdmin: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  user,
  onNavigate,
  onLoginAsAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'moderation' | 'ingestion' | 'logs'>('moderation');

  // Form state for manual domain ingestion
  const [newHost, setNewHost] = useState('');
  const [newBrandSlug, setNewBrandSlug] = useState('betano');
  const [newBrandName, setNewBrandName] = useState('Betano');
  const [newOperator, setNewOperator] = useState('Kaizen Gaming Brasil Ltda.');
  const [newCnpj, setNewCnpj] = useState('45.188.761/0001-90');
  const [newStatus, setNewStatus] = useState<RegulatoryStatus>('AUTORIZADA_NACIONAL');
  const [newLiveness, setNewLiveness] = useState<LivenessStatus>('NO_AR');
  const [newSourceName, setNewSourceName] = useState('SPA/MF — Portaria Retificadora 2026');
  const [newSourceUrl, setNewSourceUrl] = useState('https://www.gov.br/fazenda/pt-br');
  const [newEvidence, setNewEvidence] = useState('Inclusão em retificação formal do Diário Oficial da União.');
  const [ingestSuccess, setIngestSuccess] = useState(false);

  // Contest moderation state
  const contests = store.getContests();

  if (!user || !user.is_admin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#FFF4E5] dark:bg-[#78350F]/30 border border-[#FEDF89] dark:border-[#B45309] flex items-center justify-center mx-auto text-[#B54708] dark:text-[#FB923C]">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-[#0B1F33] dark:text-[#F8FAFC]">Acesso Restrito ao Painel Executivo</h1>
        <p className="text-xs text-[#667085] dark:text-[#94A3B8] leading-relaxed">
          Esta área é reservada para auditores e operadores da plataforma Bet Legal com permissão de gerenciamento e revisão de contestações.
        </p>

        <div className="pt-4 space-y-2">
          <button
            type="button"
            onClick={onLoginAsAdmin}
            className="w-full py-2.5 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8] transition-colors"
          >
            Autenticar com Perfil de Administrador →
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="w-full py-2 bg-[#F6F8FB] dark:bg-[#1E293B] border border-[#D7DEE8] dark:border-[#263548] text-xs font-medium rounded-md text-[#263648] dark:text-[#CBD5E1]"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  const kpis = store.getAdminStats();

  const handleModerate = (id: string, newStatus: 'DEFERIDA' | 'INDEFERIDA') => {
    store.updateContestStatus(id, newStatus);
    trackEvent({
      name: 'filter_applied',
      properties: { page: 'admin_moderation', filter_name: 'decision', value_category: newStatus },
    });
  };

  const handleManualIngest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHost.trim()) return;

    store.addOrUpdateDomain({
      host: newHost.trim().toLowerCase(),
      brand_slug: newBrandSlug,
      brand_name: newBrandName,
      operator_name: newOperator,
      operator_cnpj: newCnpj.replace(/\D/g, ''),
      status: newStatus,
      liveness: newLiveness,
      source_name: newSourceName,
      source_url: newSourceUrl,
      evidence_snippet: newEvidence,
      verified_at: new Date().toISOString(),
      first_seen: new Date().toISOString(),
      last_seen: new Date().toISOString(),
      created_at: new Date().toISOString(),
      effective_at: new Date().toISOString().split('T')[0],
      history: [
        {
          id: `h-ingest-${Date.now()}`,
          from_status: 'NAO_AUTORIZADA_DETECTADA',
          to_status: newStatus,
          effective_at: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          source_name: newSourceName,
          source_url: newSourceUrl,
          notes: 'Ingestão manual e validação via Painel Executivo Bet Legal.',
        },
      ],
    });

    setIngestSuccess(true);
    setNewHost('');
    setTimeout(() => setIngestSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6941C6] dark:text-[#A78BFA] uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>Console de Governança e Auditoria</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">
            Painel Executivo Bet Legal
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] dark:text-[#94A3B8] mt-1">
            Gerenciamento de fila de contestação, ingestão de portarias e telemetria de liveness.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-[#EAF7F0] dark:bg-[#064E3B]/30 border border-[#A6F4C5] dark:border-[#059669] rounded-md text-xs font-semibold text-[#16794A] dark:text-[#34D399] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sessão Admin Ativa ({user.name})</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total de Domínios"
          value={kpis.total_domains}
          subtext="Catálogo global monitorado"
          tone="default"
          onDrilldown={() => onNavigate('/series')}
        />

        <KpiCard
          label="Casas Autorizadas"
          value={kpis.authorized_count}
          subtext="Federal + Estadual + Judicial"
          trend="+4 nesta semana"
          tone="success"
          onDrilldown={() => onNavigate('/autorizadas')}
        />

        <KpiCard
          label="Radar de Bloqueios"
          value={kpis.blocked_count}
          subtext="Notificações ativas de Anatel"
          tone="danger"
          onDrilldown={() => onNavigate('/nao-autorizadas')}
        />

        <KpiCard
          label="Contestações Pendentes"
          value={kpis.pending_contests}
          subtext="Meta SLA: até 5 dias úteis"
          tone="warning"
          onDrilldown={() => setActiveTab('moderation')}
        />
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-[#D7DEE8] dark:border-[#263548]">
        <button
          type="button"
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'moderation'
              ? 'border-[#1769E0] dark:border-[#38BDF8] text-[#1769E0] dark:text-[#38BDF8]'
              : 'border-transparent text-[#667085] dark:text-[#94A3B8] hover:text-[#0B1F33] dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Fila de Moderação ({contests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ingestion')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'ingestion'
              ? 'border-[#1769E0] dark:border-[#38BDF8] text-[#1769E0] dark:text-[#38BDF8]'
              : 'border-transparent text-[#667085] dark:text-[#94A3B8] hover:text-[#0B1F33] dark:hover:text-white'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Ingestão Manual de Domínio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'logs'
              ? 'border-[#1769E0] dark:border-[#38BDF8] text-[#1769E0] dark:text-[#38BDF8]'
              : 'border-transparent text-[#667085] dark:text-[#94A3B8] hover:text-[#0B1F33] dark:hover:text-white'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Ciclos de Coleta e Sincronização</span>
        </button>
      </div>

      {/* Tab: Fila de Moderação */}
      {activeTab === 'moderation' && (
        <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#F8FAFC] dark:bg-[#0E1724] border-b border-[#D7DEE8] dark:border-[#263548] flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] uppercase tracking-wider">
              Solicitações de Contestação e Denúncias em Fila
            </h2>
            <span className="text-xs text-[#667085] dark:text-[#94A3B8]">SLA médio: 2,4 dias</span>
          </div>

          <div className="divide-y divide-[#F2F4F7] dark:divide-[#1E293B]">
            {contests.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#667085] dark:text-[#94A3B8]">
                Nenhuma manifestação pendente na fila no momento.
              </div>
            ) : (
              contests.map((item: ContestSubmission) => (
                <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#1769E0] dark:text-[#38BDF8] bg-[#F0F7FF] dark:bg-[#1E3A8A]/30 px-2 py-0.5 rounded">
                        {item.protocol}
                      </span>
                      <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${
                        item.type === 'contest' ? 'bg-[#FFF4D6] dark:bg-[#78350F]/40 text-[#A35C00] dark:text-[#FDE68A]' : 'bg-[#FDECEC] dark:bg-[#7F1D1D]/30 text-[#B42318] dark:text-[#FCA5A5]'
                      }`}>
                        {item.type === 'contest' ? 'Contestação Oficial' : 'Reporte de Suspeita'}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        item.status === 'PENDENTE'
                          ? 'bg-[#F6F8FB] dark:bg-[#1E293B] text-[#667085] dark:text-[#94A3B8]'
                          : item.status === 'DEFERIDA'
                          ? 'bg-[#EAF7F0] dark:bg-[#064E3B]/30 text-[#16794A] dark:text-[#34D399]'
                          : 'bg-[#FDECEC] dark:bg-[#7F1D1D]/30 text-[#B42318] dark:text-[#FCA5A5]'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC]">Alvo: </span>
                      <span className="font-mono text-xs text-[#0B1F33] dark:text-white font-medium">{item.target_url}</span>
                    </div>

                    <p className="text-xs text-[#263648] dark:text-[#CBD5E1]">
                      <strong>Motivo alegado:</strong> {item.reason}
                    </p>

                    <p className="text-xs text-[#667085] dark:text-[#94A3B8] bg-[#F8FAFC] dark:bg-[#0E1724] p-3 rounded-lg border border-[#D7DEE8] dark:border-[#263548]">
                      <strong>Evidências:</strong> {item.evidence_description}
                    </p>

                    <div className="text-[11px] text-[#667085] dark:text-[#94A3B8] font-mono">
                      Submetido em: {formatDateTimeBR(item.created_at)} {item.email && `· Contato: ${item.email}`}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleModerate(item.id, 'DEFERIDA')}
                      className="px-3 py-1.5 bg-[#EAF7F0] dark:bg-[#064E3B]/40 hover:bg-[#A6F4C5] dark:hover:bg-[#064E3B]/70 text-[#16794A] dark:text-[#34D399] border border-[#A6F4C5] dark:border-[#059669] text-xs font-semibold rounded-md transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Deferir</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModerate(item.id, 'INDEFERIDA')}
                      className="px-3 py-1.5 bg-[#FDECEC] dark:bg-[#7F1D1D]/30 hover:bg-[#FECDCA] dark:hover:bg-[#7F1D1D]/60 text-[#B42318] dark:text-[#FCA5A5] border border-[#FECDCA] dark:border-[#991B1B] text-xs font-semibold rounded-md transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Indeferir</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Ingestão Manual */}
      {activeTab === 'ingestion' && (
        <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 shadow-xs max-w-2xl">
          <h2 className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
            Cadastrar ou Atualizar Domínio Oficial
          </h2>
          <p className="text-xs text-[#667085] dark:text-[#94A3B8] mb-6">
            Insere novos domínios homologados ou retifica o status de endereços com efeito imediato na API e nas listagens.
          </p>

          {ingestSuccess && (
            <div className="mb-4 p-3 bg-[#EAF7F0] dark:bg-[#064E3B]/30 border border-[#A6F4C5] dark:border-[#059669] rounded-md text-xs text-[#16794A] dark:text-[#34D399] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Domínio inserido com sucesso na base de dados!</span>
            </div>
          )}

          <form onSubmit={handleManualIngest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
                Host / Domínio (ex: novabet.bet.br)
              </label>
              <input
                type="text"
                required
                value={newHost}
                onChange={(e) => setNewHost(e.target.value)}
                placeholder="novamarca.bet.br"
                className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md px-3 py-2 text-xs font-mono text-[#0B1F33] dark:text-white focus-visible:ring-2 focus-visible:ring-[#1769E0]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
                  Nome da Marca Comercial
                </label>
                <input
                  type="text"
                  required
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md px-3 py-2 text-xs text-[#0B1F33] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
                  Razão Social da Operadora
                </label>
                <input
                  type="text"
                  required
                  value={newOperator}
                  onChange={(e) => setNewOperator(e.target.value)}
                  className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md px-3 py-2 text-xs text-[#0B1F33] dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
                  Status Regulatório
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md px-3 py-2 text-xs text-[#0B1F33] dark:text-white"
                >
                  <option value="AUTORIZADA_NACIONAL">Autorizada Nacional (SPA/MF)</option>
                  <option value="AUTORIZADA_ESTADUAL">Autorizada Estadual</option>
                  <option value="DECISAO_JUDICIAL">Decisão Judicial / Liminar</option>
                  <option value="BLOQUEADA_ANATEL">Bloqueada Anatel</option>
                  <option value="NAO_AUTORIZADA_DETECTADA">Não consta nas listas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
                  Liveness (Conectividade Técnica)
                </label>
                <select
                  value={newLiveness}
                  onChange={(e) => setNewLiveness(e.target.value as any)}
                  className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md px-3 py-2 text-xs text-[#0B1F33] dark:text-white"
                >
                  <option value="NO_AR">No ar (responde HTTP 200)</option>
                  <option value="FORA_DO_AR">Fora do ar (timeout / NXDOMAIN)</option>
                  <option value="NAO_VERIFICADO">Não verificado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
                Nome da Fonte / Diário Oficial
              </label>
              <input
                type="text"
                required
                value={newSourceName}
                onChange={(e) => setNewSourceName(e.target.value)}
                className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md px-3 py-2 text-xs text-[#0B1F33] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] mb-1">
                Trecho de Evidência Documental
              </label>
              <textarea
                rows={2}
                required
                value={newEvidence}
                onChange={(e) => setNewEvidence(e.target.value)}
                className="w-full bg-[#F6F8FB] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-md p-2.5 text-xs text-[#0B1F33] dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8] transition-colors"
            >
              Gravar registro na base
            </button>
          </form>
        </div>
      )}

      {/* Tab: Ciclos de Coleta */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#0B1F33] dark:text-[#F8FAFC]">Histórico de Execuções de Rotina</h2>
          <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
            As coletas do Diário Oficial da União rodam 4 vezes ao dia (00h, 06h, 12h, 18h).
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#F8FAFC] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-lg flex items-center justify-between">
              <span className="text-[#16794A] dark:text-[#34D399] font-bold">✓ SYNC_DOU_SPA_MF</span>
              <span className="text-[#667085] dark:text-[#94A3B8]">Hoje, 12:00:04 — 0 novidades detectadas · 98 domínios verificados</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-lg flex items-center justify-between">
              <span className="text-[#16794A] dark:text-[#34D399] font-bold">✓ LIVENESS_SWEEP_JOB</span>
              <span className="text-[#667085] dark:text-[#94A3B8]">Hoje, 11:30:00 — 6.540 hosts pingados · 4.120 fora do ar</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] dark:bg-[#0E1724] border border-[#D7DEE8] dark:border-[#263548] rounded-lg flex items-center justify-between">
              <span className="text-[#16794A] dark:text-[#34D399] font-bold">✓ ANATEL_DNS_NOTIFICATION</span>
              <span className="text-[#667085] dark:text-[#94A3B8]">Ontem, 21:30:15 — 380 novos domínios adicionados à lista de bloqueio</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
