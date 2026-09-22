import { RegulatoryStatus, LivenessStatus } from '../types';

export interface StatusMeta {
  label: string;
  tone: 'success' | 'judicial' | 'warning' | 'danger' | 'caution' | 'neutral';
  fg: string;
  bg: string;
  description: string;
  publicAdvice: string;
}

export const STATUS_UI: Record<RegulatoryStatus, StatusMeta> = {
  AUTORIZADA_NACIONAL: {
    label: 'Autorizada (nacional, SPA/MF)',
    tone: 'success',
    fg: '#16794A',
    bg: '#EAF7F0',
    description: 'Consta na lista oficial de operadores autorizados pela Secretaria de Prêmios e Apostas do Ministério da Fazenda (SPA/MF).',
    publicAdvice: 'Este domínio está formalmente outorgado para operar apostas de quota fixa em território nacional, conforme portaria oficial da SPA/MF.',
  },
  AUTORIZADA_ESTADUAL: {
    label: 'Autorizada (estadual)',
    tone: 'success',
    fg: '#16794A',
    bg: '#EAF7F0',
    description: 'Consta em lista de autorização emitida por loteria estadual regulamentada.',
    publicAdvice: 'A casa possui credenciamento em âmbito estadual (ex.: LOTERJ, LOTTOPAR), com competência circunscrita à respectiva unidade federativa.',
  },
  DECISAO_JUDICIAL: {
    label: 'Opera por decisão judicial',
    tone: 'judicial',
    fg: '#6941C6',
    bg: '#F4F0FF',
    description: 'Opera amparada por decisão judicial ou tutela de urgência em vigor.',
    publicAdvice: 'A operação decorre de determinação do Poder Judiciário. O status pode sofrer alterações de acordo com os desdobramentos processuais.',
  },
  REQUERIMENTO_EM_ANALISE: {
    label: 'Requerimento em análise',
    tone: 'warning',
    fg: '#A35C00',
    bg: '#FFF4D6',
    description: 'Requerimento formal apresentado e em fase de instrução ou revisão perante o órgão regulador.',
    publicAdvice: 'O protocolo administrativo foi registrado, mas ainda não há homologação definitiva de outorga.',
  },
  SUSPENSA_REVOGADA: {
    label: 'Saiu da lista oficial / suspensa',
    tone: 'danger',
    fg: '#B42318',
    bg: '#FDECEC',
    description: 'Constou em listas anteriores, porém teve autorização revogada, suspensa ou não renovada na data de verificação.',
    publicAdvice: 'A autorização anteriormente concedida não se encontra mais em vigor nas fontes públicas consultadas.',
  },
  NAO_AUTORIZADA_DETECTADA: {
    label: 'Não consta nas listas de autorização',
    tone: 'caution',
    fg: '#B54708',
    bg: '#FFF4E5',
    description: 'Domínio ativo ou detectado que não consta nos registros oficiais de autorização até a data da verificação.',
    publicAdvice: 'Com base nas listas consultadas na data da checagem, este endereço não possui registro de autorização publicado.',
  },
  BLOQUEADA_ANATEL: {
    label: 'Constou em lista de bloqueio (Anatel)',
    tone: 'danger',
    fg: '#B42318',
    bg: '#FDECEC',
    description: 'Notificada em listas técnicas de bloqueio remetidas à Anatel para restrição de acesso por provedores de internet.',
    publicAdvice: 'O domínio foi objeto de notificação formal encaminhada à Agência Nacional de Telecomunicações para cessação de tráfego.',
  },
  INATIVA: {
    label: 'Inativa',
    tone: 'neutral',
    fg: '#667085',
    bg: '#F2F4F7',
    description: 'Sem resposta ou estacionada em checagens técnicas.',
    publicAdvice: 'Observação estritamente técnica de ausência de resposta do servidor; não constitui status regulatório positivo ou negativo.',
  },
  DESCONHECIDA: {
    label: 'Em verificação',
    tone: 'neutral',
    fg: '#475467',
    bg: '#F2F4F7',
    description: 'Candidato em triagem técnica ou aguardando publicação.',
    publicAdvice: 'Registro recém-detectado ou sob processo de confirmação cadastral preliminar.',
  },
} as const;

export interface LivenessMeta {
  label: string;
  fg: string;
  bg: string;
  description: string;
}

export const LIVENESS_UI: Record<LivenessStatus, LivenessMeta> = {
  NO_AR: {
    label: 'No ar',
    fg: '#0E7377',
    bg: '#E8F7F7',
    description: 'O servidor do domínio responde a conexões HTTP/HTTPS.',
  },
  FORA_DO_AR: {
    label: 'Fora do ar',
    fg: '#667085',
    bg: '#F2F4F7',
    description: 'O domínio não respondeu às últimas checagens de rede.',
  },
  NAO_CHECADO: {
    label: 'Não checado',
    fg: '#667085',
    bg: '#F2F4F7',
    description: 'Checagem de conectividade não realizada ou em fila.',
  },
};

export function getStatusMeta(status: RegulatoryStatus): StatusMeta {
  return (
    STATUS_UI[status] || {
      label: status,
      tone: 'neutral',
      fg: '#475467',
      bg: '#F2F4F7',
      description: 'Status não categorizado',
      publicAdvice: 'Informação não disponível.',
    }
  );
}

export function getLivenessMeta(liveness: LivenessStatus): LivenessMeta {
  return (
    LIVENESS_UI[liveness] || {
      label: liveness,
      fg: '#667085',
      bg: '#F2F4F7',
      description: 'Estado de conectividade não catalogado',
    }
  );
}
