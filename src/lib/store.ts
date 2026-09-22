import {
  DomainRecord,
  BrandRecord,
  StatusChangeEvent,
  TimeSeriesPoint,
  ContestSubmission,
  UserSession,
  CrawlRun,
  ReviewTask,
  RegulatoryStatus,
} from '../types';

// Mock Initial Data adhering strictly to brand guardrails and real Brazilian regulatory framework (SPA/MF, LOTERJ, LOTTOPAR, Anatel)
const INITIAL_DOMAINS: DomainRecord[] = [
  {
    host: 'betano.bet.br',
    brand_slug: 'betano',
    brand_name: 'Betano',
    operator_name: 'Kaizen Gaming Brasil Ltda.',
    operator_cnpj: '45.188.761/0001-90',
    status: 'AUTORIZADA_NACIONAL',
    liveness: 'NO_AR',
    first_seen: '2024-01-15T10:00:00Z',
    last_seen: '2026-09-22T12:45:00Z',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-10-01T00:00:00Z',
    created_at: '2024-09-20T14:30:00Z',
    source_name: 'Portaria SPA/MF nº 1.475/2024 - Lista Nacional Vigente',
    source_url: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    evidence_snippet: 'Item 01 do Anexo I da Portaria SPA/MF. Requerimento SIGAP 0001/2024 homologado com outorga concedida para os domínios listados sob a titularidade de Kaizen Gaming Brasil Ltda.',
    hosting_ip: '104.18.22.140',
    hosting_asn: 'AS13335 (Cloudflare, Inc.)',
    hosting_country: 'BR / US',
    history: [
      {
        id: 'h-1',
        from_status: 'REQUERIMENTO_EM_ANALISE',
        to_status: 'AUTORIZADA_NACIONAL',
        effective_at: '2024-10-01T00:00:00Z',
        created_at: '2024-10-01T09:12:00Z',
        source_name: 'DOU - Portaria SPA/MF nº 1.475',
        source_url: 'https://www.in.gov.br',
        notes: 'Publicação da autorização em âmbito nacional após cumprimento integral dos requisitos da Lei nº 14.790/2023.',
      },
    ],
  },
  {
    host: 'superbet.bet.br',
    brand_slug: 'superbet',
    brand_name: 'Superbet',
    operator_name: 'SB Global Operations Brasil Ltda.',
    operator_cnpj: '48.987.214/0001-82',
    status: 'AUTORIZADA_NACIONAL',
    liveness: 'NO_AR',
    first_seen: '2024-02-10T11:00:00Z',
    last_seen: '2026-09-22T12:50:00Z',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-10-01T00:00:00Z',
    created_at: '2024-09-22T10:00:00Z',
    source_name: 'Portaria SPA/MF nº 1.475/2024 - Lista Nacional Vigente',
    source_url: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    evidence_snippet: 'Item 07 do Anexo I da Portaria SPA/MF. Requerimento SIGAP 0007/2024 com outorga conferida para a marca Superbet.',
    hosting_ip: '172.67.149.88',
    hosting_asn: 'AS13335 (Cloudflare, Inc.)',
    hosting_country: 'BR',
    history: [
      {
        id: 'h-2',
        to_status: 'AUTORIZADA_NACIONAL',
        effective_at: '2024-10-01T00:00:00Z',
        created_at: '2024-10-01T09:12:00Z',
        source_name: 'DOU - Portaria SPA/MF nº 1.475',
        source_url: 'https://www.in.gov.br',
        notes: 'Inclusão em portaria nacional da Secretaria de Prêmios e Apostas.',
      },
    ],
  },
  {
    host: 'bet365.bet.br',
    brand_slug: 'bet365',
    brand_name: 'bet365',
    operator_name: 'Hillside (Brasil Entretenimento) Ltda.',
    operator_cnpj: '53.120.450/0001-30',
    status: 'AUTORIZADA_NACIONAL',
    liveness: 'NO_AR',
    first_seen: '2024-01-20T08:00:00Z',
    last_seen: '2026-09-22T12:52:00Z',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-10-01T00:00:00Z',
    created_at: '2024-09-25T11:00:00Z',
    source_name: 'Portaria SPA/MF nº 1.475/2024 - Lista Nacional Vigente',
    source_url: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    evidence_snippet: 'Consta na relação de entidades autorizadas sob o SIGAP 0021/2024 para exploração de apostas sob o domínio .bet.br.',
    hosting_ip: '198.51.100.4',
    hosting_asn: 'AS19800',
    hosting_country: 'BR / GB',
  },
  {
    host: 'estrelabet.bet.br',
    brand_slug: 'estrelabet',
    brand_name: 'EstrelaBet',
    operator_name: 'Estrela do Oriente Entretenimento e Jogos Ltda.',
    operator_cnpj: '46.782.901/0001-55',
    status: 'AUTORIZADA_NACIONAL',
    liveness: 'NO_AR',
    first_seen: '2024-01-10T14:20:00Z',
    last_seen: '2026-09-22T12:40:00Z',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-10-01T00:00:00Z',
    created_at: '2024-09-26T16:00:00Z',
    source_name: 'Portaria SPA/MF nº 1.475/2024 - Lista Nacional Vigente',
    source_url: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    evidence_snippet: 'Requerimento SIGAP 0012/2024 deferido perante o Ministério da Fazenda.',
    hosting_ip: '104.21.44.12',
    hosting_asn: 'AS13335 (Cloudflare, Inc.)',
    hosting_country: 'BR',
  },
  {
    host: 'kto.bet.br',
    brand_slug: 'kto',
    brand_name: 'KTO',
    operator_name: 'Apollo Operations Brasil Ltda.',
    operator_cnpj: '51.984.321/0001-09',
    status: 'AUTORIZADA_NACIONAL',
    liveness: 'NO_AR',
    first_seen: '2024-02-01T09:00:00Z',
    last_seen: '2026-09-22T12:35:00Z',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-10-01T00:00:00Z',
    created_at: '2024-09-28T09:00:00Z',
    source_name: 'Portaria SPA/MF nº 1.475/2024 - Lista Nacional Vigente',
    source_url: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    evidence_snippet: 'SIGAP 0033/2024 com deferimento definitivo publicado no Diário Oficial da União.',
    hosting_ip: '172.67.200.15',
    hosting_asn: 'AS13335 (Cloudflare, Inc.)',
    hosting_country: 'BR',
  },
  {
    host: 'apostaganha.bet.br',
    brand_slug: 'aposta-ganha',
    brand_name: 'Aposta Ganha',
    operator_name: 'Aposta Ganha Loterias Ltda.',
    operator_cnpj: '44.821.903/0001-41',
    status: 'AUTORIZADA_ESTADUAL',
    liveness: 'NO_AR',
    first_seen: '2024-03-01T15:00:00Z',
    last_seen: '2026-09-22T12:30:00Z',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-06-15T00:00:00Z',
    created_at: '2024-06-20T10:00:00Z',
    source_name: 'LOTERJ - Credenciamento nº 004/2023 (Rio de Janeiro)',
    source_url: 'http://www.loterj.rj.gov.br',
    evidence_snippet: 'Credenciamento formal perante a Loteria do Estado do Rio de Janeiro (LOTERJ) através do Edital 01/2023. Operação com abrangência vinculada à respectiva outorga estadual.',
    hosting_ip: '104.26.11.90',
    hosting_asn: 'AS13335 (Cloudflare, Inc.)',
    hosting_country: 'BR',
  },
  {
    host: 'pixbet.com.br',
    brand_slug: 'pixbet',
    brand_name: 'Pixbet',
    operator_name: 'Pix Star Brasilian Operations Ltda.',
    operator_cnpj: '40.633.348/0001-30',
    status: 'AUTORIZADA_ESTADUAL',
    liveness: 'NO_AR',
    first_seen: '2023-12-30T10:00:00Z',
    last_seen: '2026-09-22T12:30:00Z',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-04-10T00:00:00Z',
    created_at: '2024-04-15T10:00:00Z',
    source_name: 'LOTTOPAR - Concessão nº 002/2023 (Paraná)',
    source_url: 'https://www.lottopar.pr.gov.br',
    evidence_snippet: 'Credenciamento formal perante a Loteria do Estado do Paraná (LOTTOPAR). Termo de Concessão publicado em DOE-PR.',
    hosting_ip: '104.22.45.10',
    hosting_asn: 'AS13335 (Cloudflare, Inc.)',
    hosting_country: 'BR',
  },
  {
    host: 'esportesdasorte.net',
    brand_slug: 'esportes-da-sorte',
    brand_name: 'Esportes da Sorte',
    operator_name: 'HSF Gaming Brasil Entretenimento Ltda.',
    operator_cnpj: '42.991.029/0001-11',
    status: 'DECISAO_JUDICIAL',
    liveness: 'NO_AR',
    first_seen: '2024-01-05T12:00:00Z',
    last_seen: '2026-09-22T12:15:00Z',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-10-15T00:00:00Z',
    created_at: '2024-10-16T14:20:00Z',
    source_name: 'Processo Judicial nº 1084920-41.2024.4.01.3400 (TRF-1)',
    source_url: 'https://pje1g.trf1.jus.br',
    evidence_snippet: 'Decisão interlocutória deferindo tutela provisória em sede de agravo de instrumento, assegurando a continuidade das operações até julgamento final de mérito.',
    hosting_ip: '185.220.101.5',
    hosting_asn: 'AS200130',
    hosting_country: 'NL',
    history: [
      {
        id: 'h-3',
        from_status: 'REQUERIMENTO_EM_ANALISE',
        to_status: 'DECISAO_JUDICIAL',
        effective_at: '2024-10-15T00:00:00Z',
        created_at: '2024-10-16T14:20:00Z',
        source_name: 'TRF-1 Decisão Liminar',
        source_url: 'https://pje1g.trf1.jus.br',
        notes: 'Concessão de efeito suspensivo em tutela de urgência autorizando operação provisória.',
      },
    ],
  },
  {
    host: 'novabetbrasil.com',
    brand_slug: 'nova-bet',
    brand_name: 'Nova Bet',
    operator_name: 'Nova Serviços Digitais e Intermediações Ltda.',
    operator_cnpj: '50.112.443/0001-20',
    status: 'REQUERIMENTO_EM_ANALISE',
    liveness: 'NO_AR',
    first_seen: '2024-08-19T10:00:00Z',
    last_seen: '2026-09-22T11:00:00Z',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-08-20T00:00:00Z',
    created_at: '2024-08-20T15:00:00Z',
    source_name: 'Sistema de Gestão de Apostas (SIGAP) - SPA/MF',
    source_url: 'https://sigap.fazenda.gov.br',
    evidence_snippet: 'Protocolo administrativo SPA nº 0089/2024 autuado e em fase de diligência técnica. Não constitui autorização deferida.',
    hosting_ip: '192.0.2.80',
    hosting_asn: 'AS15169',
    hosting_country: 'US',
  },
  {
    host: 'vaidebet.com',
    brand_slug: 'vai-de-bet',
    brand_name: 'Vai de Bet',
    operator_name: 'BPX Sports Gaming Brasil Ltda.',
    operator_cnpj: '49.201.884/0001-70',
    status: 'SUSPENSA_REVOGADA',
    liveness: 'NO_AR',
    first_seen: '2024-01-02T10:00:00Z',
    last_seen: '2026-09-22T12:00:00Z',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-10-11T00:00:00Z',
    created_at: '2024-10-12T08:00:00Z',
    source_name: 'Portaria SPA/MF nº 1.612/2024 - Aditivo de Exclusão',
    source_url: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    evidence_snippet: 'Excluída da lista positiva do Ministério da Fazenda por não comprovação tempestiva dos requisitos de regularidade fiscal e idoneidade estabelecidos na Portaria SPA nº 1.475.',
    hosting_ip: '172.64.198.11',
    hosting_asn: 'AS13335 (Cloudflare, Inc.)',
    hosting_country: 'US',
    history: [
      {
        id: 'h-4',
        from_status: 'REQUERIMENTO_EM_ANALISE',
        to_status: 'SUSPENSA_REVOGADA',
        effective_at: '2024-10-11T00:00:00Z',
        created_at: '2024-10-12T08:00:00Z',
        source_name: 'Portaria SPA/MF nº 1.612/2024',
        source_url: 'https://www.in.gov.br',
        notes: 'Publicação de despacho de encerramento do processo administrativo de transição.',
      },
    ],
  },
  {
    host: 'blaze-brasil.top',
    brand_slug: 'blaze-unauthorized',
    brand_name: 'Blaze (Mirror / Não Consta)',
    operator_name: 'Não identificado nas bases oficiais',
    operator_cnpj: '00.000.000/0000-00',
    status: 'NAO_AUTORIZADA_DETECTADA',
    liveness: 'NO_AR',
    first_seen: '2024-07-15T09:12:00Z',
    last_seen: '2026-09-22T12:45:00Z',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-07-15T00:00:00Z',
    created_at: '2024-07-15T10:00:00Z',
    source_name: 'Varredura Automatizada Bet Legal / Crawler de Mercado',
    source_url: 'https://betlegal.com.br/metodologia',
    evidence_snippet: 'Domínio ativo promovendo apostas em moeda nacional (BRL) via PIX. Não consta no Sistema SIGAP da Fazenda nem em loterias estaduais credenciadas.',
    lookalike_of: 'blaze.com',
    hosting_ip: '198.51.100.99',
    hosting_asn: 'AS4837 (China Unicom)',
    hosting_country: 'HK / CN',
  },
  {
    host: 'betano-promo-bonus.xyz',
    brand_slug: 'betano-fake-mirror',
    brand_name: 'Betano Clone Promocional',
    operator_name: 'Não informado',
    operator_cnpj: 'Não localizado',
    status: 'NAO_AUTORIZADA_DETECTADA',
    liveness: 'NO_AR',
    first_seen: '2026-08-10T14:00:00Z',
    last_seen: '2026-09-22T12:00:00Z',
    verified_at: '2026-09-22T13:00:00Z',
    created_at: '2026-08-10T14:30:00Z',
    source_name: 'Observação Bet Legal - Detecção Ativa',
    source_url: 'https://betlegal.com.br/metodologia',
    evidence_snippet: 'Este domínio apresenta sinais associados a Betano (logotipo, tipografia e assets), utilizando TLD genérico (.xyz) sem registro de titularidade pela Kaizen Gaming Brasil Ltda.',
    lookalike_of: 'betano.bet.br',
    hosting_ip: '185.193.125.10',
    hosting_asn: 'AS202425',
    hosting_country: 'RU',
    in_review: true,
  },
  {
    host: 'betfast365.cc',
    brand_slug: 'betfast-bloqueada',
    brand_name: 'Betfast 365',
    operator_name: 'Desconhecido',
    operator_cnpj: '00.000.000/0000-00',
    status: 'BLOQUEADA_ANATEL',
    liveness: 'NO_AR', // Liveness separate from regulatory status! Responding technically though blocked in Anatel lists
    first_seen: '2024-03-22T08:00:00Z',
    last_seen: '2026-09-22T12:20:00Z',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-10-18T00:00:00Z',
    created_at: '2024-10-19T09:00:00Z',
    source_name: 'Ofício Circular Anatel nº 128/2024 - Notificação aos ISPs',
    source_url: 'https://sistemas.anatel.gov.br',
    evidence_snippet: 'Constou formalmente na 1ª lista consolidada encaminhada pela SPA/MF à Agência Nacional de Telecomunicações para cessação de resolução de DNS por provedores nacionais.',
    hosting_ip: '45.154.255.8',
    hosting_asn: 'AS59711 (Hetzner Online GmbH)',
    hosting_country: 'DE',
  },
  {
    host: 'jogodobicho-online.org',
    brand_slug: 'jogo-do-bicho-net',
    brand_name: 'Bicho Online',
    operator_name: 'Entidade não registrada',
    operator_cnpj: '00.000.000/0000-00',
    status: 'BLOQUEADA_ANATEL',
    liveness: 'FORA_DO_AR',
    first_seen: '2024-02-14T11:00:00Z',
    last_seen: '2024-10-25T14:00:00Z',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-10-22T00:00:00Z',
    created_at: '2024-10-23T10:00:00Z',
    source_name: 'Ofício Circular Anatel nº 145/2024',
    source_url: 'https://sistemas.anatel.gov.br',
    evidence_snippet: 'Listado no Anexo II de bloqueio compulsório da Anatel. O host não responde a ping nem a handshake TLS desde 25/10/2024.',
    hosting_ip: '192.0.2.1',
    hosting_asn: 'AS0',
    hosting_country: 'N/A',
  },
  {
    host: 'velhacasadeaposta.com.br',
    brand_slug: 'velha-casa',
    brand_name: 'Velha Casa de Aposta',
    operator_name: 'Registro expirado',
    operator_cnpj: '11.222.333/0001-44',
    status: 'INATIVA',
    liveness: 'FORA_DO_AR',
    first_seen: '2023-12-30T10:00:00Z',
    last_seen: '2024-05-10T11:00:00Z',
    verified_at: '2026-09-22T13:00:00Z',
    created_at: '2024-05-11T12:00:00Z',
    source_name: 'Verificação Técnica Bet Legal (Health check)',
    source_url: 'https://betlegal.com.br/metodologia',
    evidence_snippet: 'Sem apontamento NS e servidor sem resposta HTTP há mais de 180 dias. Registro estático sem operação.',
    hosting_country: 'BR',
  },
];

const INITIAL_BRANDS: BrandRecord[] = [
  {
    slug: 'betano',
    name: 'Betano',
    operator_name: 'Kaizen Gaming Brasil Ltda.',
    operator_cnpj: '45.188.761/0001-90',
    status: 'AUTORIZADA_NACIONAL',
    authorization_type: 'NACIONAL',
    ordinance_number: 'Portaria SPA/MF nº 1.475/2024',
    domains: ['betano.bet.br'],
    official_source: 'Secretaria de Prêmios e Apostas do Ministério da Fazenda (SPA/MF)',
    official_url: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-10-01T00:00:00Z',
    community_rating: {
      score: 4.4,
      count: 1420,
      criteria: {
        security: 4.6,
        payout: 4.5,
        support: 4.1,
        speed: 4.5,
        responsible_gaming: 4.3,
      },
    },
    reclame_aqui: {
      score: 8.1,
      complaints: 4890,
      solved_rate: 86.4,
      last_sync: '2026-09-22T08:00:00Z',
      url: 'https://www.reclameaqui.com.br/empresa/betano/',
    },
  },
  {
    slug: 'superbet',
    name: 'Superbet',
    operator_name: 'SB Global Operations Brasil Ltda.',
    operator_cnpj: '48.987.214/0001-82',
    status: 'AUTORIZADA_NACIONAL',
    authorization_type: 'NACIONAL',
    ordinance_number: 'Portaria SPA/MF nº 1.475/2024',
    domains: ['superbet.bet.br'],
    official_source: 'Secretaria de Prêmios e Apostas do Ministério da Fazenda (SPA/MF)',
    official_url: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-10-01T00:00:00Z',
    community_rating: {
      score: 4.2,
      count: 980,
      criteria: {
        security: 4.4,
        payout: 4.3,
        support: 4.0,
        speed: 4.4,
        responsible_gaming: 4.0,
      },
    },
    reclame_aqui: {
      score: 7.9,
      complaints: 3120,
      solved_rate: 83.1,
      last_sync: '2026-09-22T08:00:00Z',
      url: 'https://www.reclameaqui.com.br/empresa/superbet/',
    },
  },
  {
    slug: 'bet365',
    name: 'bet365',
    operator_name: 'Hillside (Brasil Entretenimento) Ltda.',
    operator_cnpj: '53.120.450/0001-30',
    status: 'AUTORIZADA_NACIONAL',
    authorization_type: 'NACIONAL',
    ordinance_number: 'Portaria SPA/MF nº 1.475/2024',
    domains: ['bet365.bet.br'],
    official_source: 'Secretaria de Prêmios e Apostas (SPA/MF)',
    official_url: 'https://www.gov.br/fazenda',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-10-01T00:00:00Z',
    community_rating: {
      score: 3.9,
      count: 2450,
      criteria: {
        security: 4.3,
        payout: 3.9,
        support: 3.4,
        speed: 4.1,
        responsible_gaming: 3.8,
      },
    },
    reclame_aqui: {
      score: 6.8,
      complaints: 8400,
      solved_rate: 68.2,
      last_sync: '2026-09-22T08:00:00Z',
      url: 'https://www.reclameaqui.com.br/empresa/bet365/',
    },
  },
  {
    slug: 'estrelabet',
    name: 'EstrelaBet',
    operator_name: 'Estrela do Oriente Entretenimento e Jogos Ltda.',
    operator_cnpj: '46.782.901/0001-55',
    status: 'AUTORIZADA_NACIONAL',
    authorization_type: 'NACIONAL',
    ordinance_number: 'Portaria SPA/MF nº 1.475/2024',
    domains: ['estrelabet.bet.br'],
    official_source: 'Secretaria de Prêmios e Apostas (SPA/MF)',
    official_url: 'https://www.gov.br/fazenda',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-10-01T00:00:00Z',
    community_rating: {
      score: 4.1,
      count: 810,
      criteria: {
        security: 4.2,
        payout: 4.2,
        support: 3.9,
        speed: 4.1,
        responsible_gaming: 4.0,
      },
    },
    reclame_aqui: {
      score: 7.7,
      complaints: 2950,
      solved_rate: 81.0,
      last_sync: '2026-09-22T08:00:00Z',
      url: 'https://www.reclameaqui.com.br/empresa/estrelabet/',
    },
  },
  {
    slug: 'kto',
    name: 'KTO',
    operator_name: 'Apollo Operations Brasil Ltda.',
    operator_cnpj: '51.984.321/0001-09',
    status: 'AUTORIZADA_NACIONAL',
    authorization_type: 'NACIONAL',
    ordinance_number: 'Portaria SPA/MF nº 1.475/2024',
    domains: ['kto.bet.br'],
    official_source: 'Secretaria de Prêmios e Apostas (SPA/MF)',
    official_url: 'https://www.gov.br/fazenda',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-10-01T00:00:00Z',
    community_rating: {
      score: 4.3,
      count: 670,
      criteria: {
        security: 4.4,
        payout: 4.4,
        support: 4.2,
        speed: 4.3,
        responsible_gaming: 4.2,
      },
    },
    reclame_aqui: {
      score: 8.3,
      complaints: 1840,
      solved_rate: 89.2,
      last_sync: '2026-09-22T08:00:00Z',
      url: 'https://www.reclameaqui.com.br/empresa/kto-brasil/',
    },
  },
  {
    slug: 'aposta-ganha',
    name: 'Aposta Ganha',
    operator_name: 'Aposta Ganha Loterias Ltda.',
    operator_cnpj: '44.821.903/0001-41',
    status: 'AUTORIZADA_ESTADUAL',
    authorization_type: 'ESTADUAL',
    uf: 'RJ',
    ordinance_number: 'Edital LOTERJ nº 01/2023 - Termo 004',
    domains: ['apostaganha.bet.br'],
    official_source: 'Loteria do Estado do Rio de Janeiro (LOTERJ)',
    official_url: 'http://www.loterj.rj.gov.br',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-06-15T00:00:00Z',
    community_rating: {
      score: 4.0,
      count: 520,
      criteria: {
        security: 4.1,
        payout: 4.0,
        support: 3.8,
        speed: 4.1,
        responsible_gaming: 3.9,
      },
    },
    reclame_aqui: {
      score: 7.5,
      complaints: 2100,
      solved_rate: 79.5,
      last_sync: '2026-09-22T08:00:00Z',
      url: 'https://www.reclameaqui.com.br/empresa/aposta-ganha/',
    },
  },
  {
    slug: 'pixbet',
    name: 'Pixbet',
    operator_name: 'Pix Star Brasilian Operations Ltda.',
    operator_cnpj: '40.633.348/0001-30',
    status: 'AUTORIZADA_ESTADUAL',
    authorization_type: 'ESTADUAL',
    uf: 'PR',
    ordinance_number: 'Concessão LOTTOPAR nº 002/2023',
    domains: ['pixbet.com.br'],
    official_source: 'Loteria do Estado do Paraná (LOTTOPAR)',
    official_url: 'https://www.lottopar.pr.gov.br',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-04-10T00:00:00Z',
    community_rating: {
      score: 3.9,
      count: 1100,
      criteria: {
        security: 4.1,
        payout: 4.0,
        support: 3.6,
        speed: 4.0,
        responsible_gaming: 3.7,
      },
    },
    reclame_aqui: {
      score: 7.1,
      complaints: 4320,
      solved_rate: 74.0,
      last_sync: '2026-09-22T08:00:00Z',
      url: 'https://www.reclameaqui.com.br/empresa/pixbet/',
    },
  },
  {
    slug: 'esportes-da-sorte',
    name: 'Esportes da Sorte',
    operator_name: 'HSF Gaming Brasil Entretenimento Ltda.',
    operator_cnpj: '42.991.029/0001-11',
    status: 'DECISAO_JUDICIAL',
    authorization_type: 'DECISAO_JUDICIAL',
    ordinance_number: 'TRF-1 Processo 1084920-41.2024.4.01.3400',
    domains: ['esportesdasorte.net'],
    official_source: 'Tribunal Regional Federal da 1ª Região (TRF-1)',
    official_url: 'https://portal.trf1.jus.br',
    verified_at: '2026-09-22T13:00:00Z',
    effective_at: '2024-10-15T00:00:00Z',
    community_rating: {
      score: 3.7,
      count: 1400,
      criteria: {
        security: 3.8,
        payout: 3.6,
        support: 3.5,
        speed: 4.0,
        responsible_gaming: 3.5,
      },
    },
    reclame_aqui: {
      score: 6.9,
      complaints: 5200,
      solved_rate: 71.3,
      last_sync: '2026-09-22T08:00:00Z',
      url: 'https://www.reclameaqui.com.br/empresa/esportes-da-sorte/',
    },
  },
];

const INITIAL_CHANGES: StatusChangeEvent[] = [
  {
    id: 'ch-1',
    entity_type: 'domain',
    entity_name: 'betfast365.cc',
    host: 'betfast365.cc',
    from_status: 'NAO_AUTORIZADA_DETECTADA',
    to_status: 'BLOQUEADA_ANATEL',
    source_name: 'Anatel - Notificação nº 128/2024',
    source_url: 'https://sistemas.anatel.gov.br',
    effective_at: '2024-10-18T00:00:00Z',
    created_at: '2024-10-19T09:00:00Z',
    notes: 'Inclusão em listagem técnica de restrição remetida a operadoras de telecomunicações.',
  },
  {
    id: 'ch-2',
    entity_type: 'domain',
    entity_name: 'esportesdasorte.net',
    host: 'esportesdasorte.net',
    from_status: 'REQUERIMENTO_EM_ANALISE',
    to_status: 'DECISAO_JUDICIAL',
    source_name: 'TRF-1 PJe nº 1084920-41.2024',
    source_url: 'https://pje1g.trf1.jus.br',
    effective_at: '2024-10-15T00:00:00Z',
    created_at: '2024-10-16T14:20:00Z',
    notes: 'Ajuizamento com concessão de medida liminar provisória.',
  },
  {
    id: 'ch-3',
    entity_type: 'domain',
    entity_name: 'vaidebet.com',
    host: 'vaidebet.com',
    from_status: 'REQUERIMENTO_EM_ANALISE',
    to_status: 'SUSPENSA_REVOGADA',
    source_name: 'Portaria SPA/MF nº 1.612/2024',
    source_url: 'https://www.in.gov.br',
    effective_at: '2024-10-11T00:00:00Z',
    created_at: '2024-10-12T08:00:00Z',
    notes: 'Exclusão formal do rol provisório nacional da Fazenda.',
  },
  {
    id: 'ch-4',
    entity_type: 'domain',
    entity_name: 'betano.bet.br',
    host: 'betano.bet.br',
    from_status: 'REQUERIMENTO_EM_ANALISE',
    to_status: 'AUTORIZADA_NACIONAL',
    source_name: 'Portaria SPA/MF nº 1.475/2024',
    source_url: 'https://www.in.gov.br',
    effective_at: '2024-10-01T00:00:00Z',
    created_at: '2024-10-01T09:12:00Z',
    notes: 'Outorga nacional plena deferida e publicada no DOU.',
  },
  {
    id: 'ch-5',
    entity_type: 'domain',
    entity_name: 'apostaganha.bet.br',
    host: 'apostaganha.bet.br',
    from_status: 'DESCONHECIDA',
    to_status: 'AUTORIZADA_ESTADUAL',
    source_name: 'LOTERJ DOE-RJ Edital 01/2023',
    source_url: 'http://www.loterj.rj.gov.br',
    effective_at: '2024-06-15T00:00:00Z',
    created_at: '2024-06-20T10:00:00Z',
    notes: 'Homologação de credenciamento estadual no Rio de Janeiro.',
  },
];

const INITIAL_TIMESERIES: TimeSeriesPoint[] = [
  { date: '2023-12-30', authorized_national: 0, authorized_state: 8, judicial: 2, unauthorized_detected: 412, anatel_blocked: 0 },
  { date: '2024-03-31', authorized_national: 0, authorized_state: 14, judicial: 5, unauthorized_detected: 890, anatel_blocked: 0 },
  { date: '2024-06-30', authorized_national: 0, authorized_state: 21, judicial: 9, unauthorized_detected: 1420, anatel_blocked: 0 },
  { date: '2024-10-01', authorized_national: 98, authorized_state: 26, judicial: 12, unauthorized_detected: 2100, anatel_blocked: 2040 },
  { date: '2025-01-01', authorized_national: 114, authorized_state: 28, judicial: 14, unauthorized_detected: 2850, anatel_blocked: 3120 },
  { date: '2025-06-01', authorized_national: 128, authorized_state: 32, judicial: 15, unauthorized_detected: 3640, anatel_blocked: 4280 },
  { date: '2026-01-01', authorized_national: 142, authorized_state: 35, judicial: 16, unauthorized_detected: 4510, anatel_blocked: 5390 },
  { date: '2026-09-22', authorized_national: 156, authorized_state: 38, judicial: 18, unauthorized_detected: 5420, anatel_blocked: 6180 },
];

const INITIAL_CRAWL_RUNS: CrawlRun[] = [
  {
    id: 'crawl-20260922-04',
    started_at: '2026-09-22T12:00:00Z',
    finished_at: '2026-09-22T12:18:22Z',
    duration_seconds: 1102,
    status: 'completed',
    new_unauthorized: 7,
    verified_count: 5840,
    blocked_count: 14,
    errors_detected: 0,
    notes: 'Varredura de rotina das listas oficiais SPA/MF, diários estaduais e feeds de liveness HTTP.',
  },
  {
    id: 'crawl-20260922-03',
    started_at: '2026-09-22T06:00:00Z',
    finished_at: '2026-09-22T06:16:45Z',
    duration_seconds: 1005,
    status: 'completed',
    new_unauthorized: 11,
    verified_count: 5822,
    blocked_count: 9,
    errors_detected: 0,
    notes: 'Sincronização matutina DOU e lista técnica Anatel.',
  },
  {
    id: 'crawl-20260921-04',
    started_at: '2026-09-21T18:00:00Z',
    finished_at: '2026-09-21T18:19:10Z',
    duration_seconds: 1150,
    status: 'completed',
    new_unauthorized: 5,
    verified_count: 5810,
    blocked_count: 12,
    errors_detected: 0,
    notes: 'Verificação regular concluída com sucesso.',
  },
];

const INITIAL_REVIEW_TASKS: ReviewTask[] = [
  {
    id: 'rev-01',
    host: 'betano-promo-bonus.xyz',
    brand_name: 'Betano Clone',
    detected_from: 'Crawler de TLDs genéricos / Anúncios detectados',
    reason: 'Uso indevido de marca oficial em TLD não autorizado com coleta de PIX.',
    created_at: '2026-09-22T09:14:00Z',
    current_status: 'NAO_AUTORIZADA_DETECTADA',
    evidence: 'Logotipo da Kaizen reproduzido, formulário solicitando chave PIX direta.',
    status: 'in_review',
    audit_history: [
      {
        action: 'CREATED',
        user: 'sistema_crawler',
        timestamp: '2026-09-22T09:14:00Z',
        comment: 'Detecção automática por correspondência fonética e de favicon.',
      },
    ],
  },
  {
    id: 'rev-02',
    host: 'sportingbets-vip.club',
    brand_name: 'Sportingbet Mirror Suspeito',
    detected_from: 'Reporte da comunidade',
    reason: 'Domínio redirecionando tráfego por VPN sem apontamento para IP oficial.',
    created_at: '2026-09-22T10:30:00Z',
    current_status: 'NAO_AUTORIZADA_DETECTADA',
    evidence: 'Relato de usuário com protocolo gerado CONF-2026-8812.',
    status: 'pending',
    audit_history: [
      {
        action: 'SUBMITTED',
        user: 'usuario_comunidade',
        timestamp: '2026-09-22T10:30:00Z',
        comment: 'Reportado via formulário público.',
      },
    ],
  },
];

// Persistent state management using localStorage with in-memory fallback
class BetLegalStore {
  private domains: DomainRecord[] = [];
  private brands: BrandRecord[] = [];
  private changes: StatusChangeEvent[] = [];
  private timeseries: TimeSeriesPoint[] = [];
  private reviewTasks: ReviewTask[] = [];
  private crawlRuns: CrawlRun[] = [];
  private userSession: UserSession | null = null;
  private submissions: ContestSubmission[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch {
        // ignore subscriber errors
      }
    });
  }

  private getStorageItem(newKey: string, oldKey: string): string | null {
    try {
      const newVal = localStorage.getItem(newKey);
      if (newVal !== null) return newVal;
      const oldVal = localStorage.getItem(oldKey);
      if (oldVal !== null) {
        // Migrate old key to new key
        localStorage.setItem(newKey, oldVal);
        localStorage.removeItem(oldKey);
        return oldVal;
      }
      return null;
    } catch {
      return null;
    }
  }

  private init() {
    try {
      const savedDomains = this.getStorageItem('betlegal_domains', 'confere_domains');
      this.domains = savedDomains ? JSON.parse(savedDomains) : INITIAL_DOMAINS;

      const savedBrands = this.getStorageItem('betlegal_brands', 'confere_brands');
      this.brands = savedBrands ? JSON.parse(savedBrands) : INITIAL_BRANDS;

      const savedChanges = this.getStorageItem('betlegal_changes', 'confere_changes');
      this.changes = savedChanges ? JSON.parse(savedChanges) : INITIAL_CHANGES;

      const savedSubmissions = this.getStorageItem('betlegal_submissions', 'confere_submissions');
      this.submissions = savedSubmissions ? JSON.parse(savedSubmissions) : [];

      const savedUser = this.getStorageItem('betlegal_user_session', 'confere_user_session');
      this.userSession = savedUser ? JSON.parse(savedUser) : null;

      const savedTasks = this.getStorageItem('betlegal_review_tasks', 'confere_review_tasks');
      this.reviewTasks = savedTasks ? JSON.parse(savedTasks) : INITIAL_REVIEW_TASKS;

      this.timeseries = INITIAL_TIMESERIES;
      this.crawlRuns = INITIAL_CRAWL_RUNS;
    } catch {
      this.domains = INITIAL_DOMAINS;
      this.brands = INITIAL_BRANDS;
      this.changes = INITIAL_CHANGES;
      this.timeseries = INITIAL_TIMESERIES;
      this.crawlRuns = INITIAL_CRAWL_RUNS;
      this.reviewTasks = INITIAL_REVIEW_TASKS;
    }
  }

  private save() {
    try {
      localStorage.setItem('betlegal_domains', JSON.stringify(this.domains));
      localStorage.setItem('betlegal_brands', JSON.stringify(this.brands));
      localStorage.setItem('betlegal_changes', JSON.stringify(this.changes));
      localStorage.setItem('betlegal_submissions', JSON.stringify(this.submissions));
      localStorage.setItem('betlegal_review_tasks', JSON.stringify(this.reviewTasks));
      if (this.userSession) {
        localStorage.setItem('betlegal_user_session', JSON.stringify(this.userSession));
      } else {
        localStorage.removeItem('betlegal_user_session');
        localStorage.removeItem('confere_user_session');
      }
      this.notify();
    } catch {
      // Storage full or unavailable
    }
  }

  // --- Search & Queries ---
  public search(query: string): {
    exactMatch?: { type: 'domain' | 'brand'; data: DomainRecord | BrandRecord };
    domains: DomainRecord[];
    brands: BrandRecord[];
    operators: { operator_name: string; cnpj: string; count: number; brands: string[] }[];
  } {
    const q = query.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
    if (!q) return { domains: [], brands: [], operators: [] };

    // Search domains
    const matchedDomains = this.domains.filter(
      (d) =>
        d.host.toLowerCase().includes(q) ||
        d.brand_name.toLowerCase().includes(q) ||
        d.operator_name.toLowerCase().includes(q) ||
        d.operator_cnpj.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
    );

    // Search brands
    const matchedBrands = this.brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        b.operator_name.toLowerCase().includes(q) ||
        b.operator_cnpj.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
        b.domains.some((d) => d.toLowerCase().includes(q))
    );

    // Group operators
    const operatorMap = new Map<string, { operator_name: string; cnpj: string; count: number; brands: Set<string> }>();
    this.brands.forEach((b) => {
      const matchOp =
        b.operator_name.toLowerCase().includes(q) ||
        b.operator_cnpj.replace(/\D/g, '').includes(q.replace(/\D/g, ''));
      if (matchOp) {
        const existing = operatorMap.get(b.operator_name) || {
          operator_name: b.operator_name,
          cnpj: b.operator_cnpj,
          count: 0,
          brands: new Set<string>(),
        };
        existing.count += b.domains.length;
        existing.brands.add(b.name);
        operatorMap.set(b.operator_name, existing);
      }
    });

    const operators = Array.from(operatorMap.values()).map((op) => ({
      operator_name: op.operator_name,
      cnpj: op.cnpj,
      count: op.count,
      brands: Array.from(op.brands),
    }));

    // Check exact matches
    let exactMatch: { type: 'domain' | 'brand'; data: DomainRecord | BrandRecord } | undefined;
    const exactDomain = this.domains.find((d) => d.host.toLowerCase() === q);
    if (exactDomain) {
      exactMatch = { type: 'domain', data: exactDomain };
    } else {
      const exactBrand = this.brands.find((b) => b.name.toLowerCase() === q || b.slug.toLowerCase() === q);
      if (exactBrand) {
        exactMatch = { type: 'brand', data: exactBrand };
      }
    }

    return {
      exactMatch,
      domains: matchedDomains,
      brands: matchedBrands,
      operators,
    };
  }

  public getDomain(host: string): DomainRecord | undefined {
    const cleanHost = host.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    return this.domains.find((d) => d.host.toLowerCase() === cleanHost);
  }

  public getBrand(slug: string): BrandRecord | undefined {
    const cleanSlug = slug.trim().toLowerCase();
    return this.brands.find((b) => b.slug.toLowerCase() === cleanSlug || b.name.toLowerCase() === cleanSlug);
  }

  public getAuthorizedDomains(): DomainRecord[] {
    return this.domains.filter(
      (d) =>
        d.status === 'AUTORIZADA_NACIONAL' ||
        d.status === 'AUTORIZADA_ESTADUAL' ||
        d.status === 'DECISAO_JUDICIAL'
    );
  }

  public getRadarDomains(): DomainRecord[] {
    return this.domains.filter(
      (d) =>
        d.status === 'NAO_AUTORIZADA_DETECTADA' ||
        d.status === 'BLOQUEADA_ANATEL' ||
        d.status === 'SUSPENSA_REVOGADA' ||
        d.status === 'INATIVA' ||
        d.status === 'REQUERIMENTO_EM_ANALISE' ||
        d.status === 'DESCONHECIDA'
    );
  }

  public getAllDomains(): DomainRecord[] {
    return [...this.domains];
  }

  public getAllBrands(): BrandRecord[] {
    return [...this.brands];
  }

  public getChanges(): StatusChangeEvent[] {
    return [...this.changes].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public getTimeSeries(): TimeSeriesPoint[] {
    return [...this.timeseries];
  }

  public getCrawlRuns(): CrawlRun[] {
    return [...this.crawlRuns];
  }

  public getReviewTasks(): ReviewTask[] {
    return [...this.reviewTasks];
  }

  // --- Auth Session ---
  public getUser(): UserSession | null {
    return this.userSession;
  }

  public getCurrentUser(): UserSession | null {
    return this.userSession;
  }

  public login(email: string, pass: string, asAdmin: boolean = false): UserSession {
    const session: UserSession = {
      email,
      cpf_masked: '342.***.***-18',
      is_admin: asAdmin,
      name: email.split('@')[0].replace(/[._]/g, ' '),
    };
    this.userSession = session;
    this.save();
    return session;
  }

  public logout() {
    this.userSession = null;
    this.save();
  }

  // --- Community Rating Submission ---
  public submitBrandRating(
    slug: string,
    criteria: {
      security: number;
      payout: number;
      support: number;
      speed: number;
      responsible_gaming?: number;
    }
  ): { success: boolean; brand?: BrandRecord; error?: string } {
    const brand = this.brands.find((b) => b.slug === slug);
    if (!brand) return { success: false, error: 'Marca não encontrada.' };
    if (
      brand.status !== 'AUTORIZADA_NACIONAL' &&
      brand.status !== 'AUTORIZADA_ESTADUAL' &&
      brand.status !== 'DECISAO_JUDICIAL'
    ) {
      return { success: false, error: 'Apenas marcas com autorização vigente podem receber avaliações comunitárias.' };
    }

    const currentRating = brand.community_rating || {
      score: 4.0,
      count: 0,
      criteria: { security: 4, payout: 4, support: 4, speed: 4, responsible_gaming: 4 },
    };

    const newCount = currentRating.count + 1;
    // Calculate new average of criteria
    const criteriaScores = [
      criteria.security,
      criteria.payout,
      criteria.support,
      criteria.speed,
      criteria.responsible_gaming || 4,
    ];
    const userAvg = criteriaScores.reduce((a, b) => a + b, 0) / criteriaScores.length;
    const newGlobalScore = (currentRating.score * currentRating.count + userAvg) / newCount;

    brand.community_rating = {
      score: Number(newGlobalScore.toFixed(1)),
      count: newCount,
      criteria: {
        security: Number(((currentRating.criteria.security * currentRating.count + criteria.security) / newCount).toFixed(1)),
        payout: Number(((currentRating.criteria.payout * currentRating.count + criteria.payout) / newCount).toFixed(1)),
        support: Number(((currentRating.criteria.support * currentRating.count + criteria.support) / newCount).toFixed(1)),
        speed: Number(((currentRating.criteria.speed * currentRating.count + criteria.speed) / newCount).toFixed(1)),
        responsible_gaming: Number(
          (((currentRating.criteria.responsible_gaming || 4) * currentRating.count + (criteria.responsible_gaming || 4)) / newCount).toFixed(1)
        ),
      },
    };

    this.save();
    return { success: true, brand };
  }

  // --- Contest & Report Submissions ---
  public submitContest(data: {
    type: 'contest' | 'report';
    target_url: string;
    reason: string;
    evidence_description: string;
    email?: string;
  }): { protocol: string } {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const protocol = `CONF-2026-${randomNum}`;

    const submission: ContestSubmission = {
      id: `sub-${Date.now()}`,
      type: data.type,
      target_url: data.target_url,
      reason: data.reason,
      evidence_description: data.evidence_description,
      email: data.email,
      protocol,
      created_at: new Date().toISOString(),
      status: 'pending',
    };

    this.submissions.push(submission);

    // If it is a contest of an existing domain, mark it as in_review
    const targetHost = data.target_url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
    const domain = this.domains.find((d) => d.host.toLowerCase() === targetHost);
    if (domain) {
      domain.in_review = true;
    }

    // Add to review task queue
    const reviewTask: ReviewTask = {
      id: `rev-${Date.now()}`,
      host: targetHost || data.target_url,
      brand_name: domain ? domain.brand_name : 'Reporte Externo',
      detected_from: data.type === 'contest' ? 'Contestação do Titular / Operador' : 'Reporte de Usuário',
      reason: data.reason,
      created_at: new Date().toISOString(),
      current_status: domain ? domain.status : 'DESCONHECIDA',
      evidence: data.evidence_description,
      status: 'pending',
      audit_history: [
        {
          action: 'PROTOCOL_CREATED',
          user: data.email || 'anonimo@comunidade',
          timestamp: new Date().toISOString(),
          comment: `Protocolo ${protocol} aberto. Prazo alvo de revisão em até 5 dias úteis.`,
        },
      ],
    };
    this.reviewTasks.unshift(reviewTask);

    this.save();
    return { protocol };
  }

  // --- Admin Review Actions ---
  public getContests(): ContestSubmission[] {
    return [...this.submissions];
  }

  public updateContestStatus(
    id: string,
    status: 'DEFERIDA' | 'INDEFERIDA' | 'PENDENTE'
  ): boolean {
    const sub = this.submissions.find((s) => s.id === id);
    if (!sub) return false;
    sub.status = status;
    this.save();
    return true;
  }

  public addOrUpdateDomain(newDomain: DomainRecord): void {
    const idx = this.domains.findIndex((d) => d.host.toLowerCase() === newDomain.host.toLowerCase());
    if (idx >= 0) {
      this.domains[idx] = newDomain;
    } else {
      this.domains.unshift(newDomain);
    }
    this.save();
  }

  public getAdminStats() {
    const total_domains = this.domains.length;
    const authorized_count = this.getAuthorizedDomains().length;
    const blocked_count = this.domains.filter((d) => d.status === 'BLOQUEADA_ANATEL').length;
    const pending_contests = this.submissions.filter((s) => s.status === 'pending' || s.status === 'PENDENTE').length;

    return {
      total_domains,
      authorized_count,
      blocked_count,
      pending_contests,
    };
  }

  public decideReviewTask(
    taskId: string,
    action: 'approved' | 'rejected' | 'in_review',
    comment: string,
    author: string
  ): boolean {
    const task = this.reviewTasks.find((t) => t.id === taskId);
    if (!task) return false;

    task.status = action;
    task.audit_history.push({
      action: action.toUpperCase(),
      user: author,
      timestamp: new Date().toISOString(),
      comment,
    });

    if (action === 'approved') {
      const domain = this.domains.find((d) => d.host.toLowerCase() === task.host.toLowerCase());
      if (domain) {
        domain.in_review = false;
      }
    }

    this.save();
    return true;
  }

  // --- Statistics ---
  public getStats() {
    const totalAuthorized = this.getAuthorizedDomains().length;
    const totalUnauthorized = this.domains.filter((d) => d.status === 'NAO_AUTORIZADA_DETECTADA').length;
    const totalBlocked = this.domains.filter((d) => d.status === 'BLOQUEADA_ANATEL').length;
    const totalReview = this.reviewTasks.filter((t) => t.status === 'pending' || t.status === 'in_review').length;
    const brandsWithSnapshot = this.brands.filter((b) => b.reclame_aqui !== null).length;

    return {
      totalAuthorized,
      totalUnauthorized,
      totalBlocked,
      totalReview,
      brandsWithSnapshot,
      totalBrands: this.brands.length,
      lastCrawl: this.crawlRuns[0] || null,
      todayBrasilia: {
        newUnauthorized: 7,
        newAuthorized: 2,
        newBlocked: 4,
      },
    };
  }

  public exportTimeSeriesCSV(): string {
    const header = 'date,authorized_national,authorized_state,judicial,unauthorized_detected,anatel_blocked\n';
    const rows = this.timeseries
      .map(
        (p) =>
          `${p.date},${p.authorized_national},${p.authorized_state},${p.judicial},${p.unauthorized_detected},${p.anatel_blocked}`
      )
      .join('\n');
    return header + rows;
  }

  public exportChangesRSS(): string {
    const itemsXml = this.changes
      .map(
        (c) => `
    <item>
      <title><![CDATA[${c.entity_name}: ${c.from_status} -> ${c.to_status}]]></title>
      <link>https://betlegal.com.br/dominio/${c.host || ''}</link>
      <description><![CDATA[${c.notes} - Fonte: ${c.source_name}]]></description>
      <pubDate>${new Date(c.created_at).toUTCString()}</pubDate>
      <guid>${c.id}</guid>
    </item>`
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Bet Legal - Mudanças no Mercado de Apostas</title>
    <link>https://betlegal.com.br/mudancas</link>
    <description>Feed oficial de alterações regulatórias e atualizações de status do Bet Legal</description>
    <language>pt-BR</language>
    ${itemsXml}
  </channel>
</rss>`;
  }
}

export const store = new BetLegalStore();
