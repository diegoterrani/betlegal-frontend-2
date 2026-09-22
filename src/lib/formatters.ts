/**
 * Bet Legal formatters and sanitizers
 */

export function formatCNPJ(cnpj: string): string {
  const clean = cnpj.replace(/\D/g, '');
  if (clean.length !== 14) return cnpj;
  return clean.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

export function maskCPF(cpf: string): string {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return '***.***.***-**';
  return `${clean.slice(0, 3)}.***.***-${clean.slice(9)}`;
}

export function normalizeHost(input: string): string {
  let cleaned = input.trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//, '');
  cleaned = cleaned.replace(/^www\./, '');
  cleaned = cleaned.split('/')[0];
  cleaned = cleaned.split('?')[0];
  return cleaned;
}

export function formatDateBR(dateStr: string | Date): string {
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return String(dateStr);

    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return String(dateStr);
  }
}

export function formatDateTimeBR(dateStr: string | Date): string {
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return String(dateStr);

    const dateFormatted = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);

    return `${dateFormatted} (horário de Brasília)`;
  } catch {
    return String(dateStr);
  }
}

export function formatRelativeTime(dateStr: string | Date): string {
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'agora há pouco';
    if (diffMin < 60) return `há ${diffMin} min`;
    if (diffHour < 24) return `há ${diffHour}h`;
    if (diffDays === 1) return 'ontem';
    if (diffDays < 30) return `há ${diffDays} dias`;
    return formatDateBR(date);
  } catch {
    return String(dateStr);
  }
}

export function formatScore(num: number, max: number = 5): string {
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
