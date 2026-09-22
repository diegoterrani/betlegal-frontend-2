export type RegulatoryStatus =
  | 'AUTORIZADA_NACIONAL'
  | 'AUTORIZADA_ESTADUAL'
  | 'DECISAO_JUDICIAL'
  | 'REQUERIMENTO_EM_ANALISE'
  | 'SUSPENSA_REVOGADA'
  | 'NAO_AUTORIZADA_DETECTADA'
  | 'BLOQUEADA_ANATEL'
  | 'INATIVA'
  | 'DESCONHECIDA';

export type LivenessStatus = 'NO_AR' | 'FORA_DO_AR' | 'NAO_CHECADO';

export interface DomainRecord {
  host: string;
  brand_slug: string;
  brand_name: string;
  operator_name: string;
  operator_cnpj: string;
  status: RegulatoryStatus;
  liveness: LivenessStatus;
  first_seen: string;
  last_seen: string;
  verified_at: string;
  effective_at?: string;
  created_at: string;
  source_name: string;
  source_url: string;
  evidence_snippet: string;
  lookalike_of?: string;
  hosting_ip?: string;
  hosting_asn?: string;
  hosting_country?: string;
  in_review?: boolean;
  history?: StatusHistoryItem[];
}

export interface StatusHistoryItem {
  id: string;
  from_status?: RegulatoryStatus;
  to_status: RegulatoryStatus;
  effective_at: string;
  created_at: string;
  source_name: string;
  source_url: string;
  notes: string;
}

export interface CommunityRatingCriteria {
  security: number; // 1-5
  payout: number; // 1-5
  support: number; // 1-5
  speed: number; // 1-5
  responsible_gaming?: number; // 1-5
}

export interface BrandRecord {
  slug: string;
  name: string;
  operator_name: string;
  operator_cnpj: string;
  status: RegulatoryStatus;
  authorization_type: 'NACIONAL' | 'ESTADUAL' | 'DECISAO_JUDICIAL';
  uf?: string;
  ordinance_number?: string;
  domains: string[];
  official_source: string;
  official_url: string;
  verified_at: string;
  effective_at: string;
  community_rating?: {
    score: number;
    count: number;
    criteria: CommunityRatingCriteria;
  };
  reclame_aqui?: {
    score: number; // e.g. 7.8
    complaints: number;
    solved_rate: number; // e.g. 84.5%
    last_sync: string;
    url: string;
  } | null;
}

export interface StatusChangeEvent {
  id: string;
  entity_type: 'domain' | 'brand';
  entity_name: string;
  host?: string;
  from_status: RegulatoryStatus;
  to_status: RegulatoryStatus;
  source_name: string;
  source_url: string;
  effective_at: string;
  created_at: string;
  notes: string;
}

export interface TimeSeriesPoint {
  date: string;
  authorized_national: number;
  authorized_state: number;
  judicial: number;
  unauthorized_detected: number;
  anatel_blocked: number;
}

export interface ContestSubmission {
  id: string;
  type: 'contest' | 'report';
  target_url: string;
  reason: string;
  evidence_description: string;
  email?: string;
  protocol: string;
  created_at: string;
  status: 'pending' | 'under_review' | 'resolved' | 'rejected' | 'DEFERIDA' | 'INDEFERIDA' | 'PENDENTE';
}

export interface UserSession {
  email: string;
  cpf_masked: string;
  is_admin: boolean;
  name: string;
}

export interface CrawlRun {
  id: string;
  started_at: string;
  finished_at: string;
  duration_seconds: number;
  status: 'completed' | 'running' | 'failed';
  new_unauthorized: number;
  verified_count: number;
  blocked_count: number;
  errors_detected: number;
  notes: string;
}

export interface ReviewTask {
  id: string;
  host: string;
  brand_name: string;
  detected_from: string;
  reason: string;
  created_at: string;
  current_status: RegulatoryStatus;
  evidence: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  audit_history: {
    action: string;
    user: string;
    timestamp: string;
    comment: string;
  }[];
}
