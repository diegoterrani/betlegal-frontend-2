/**
 * Bet Legal Analytics Engine
 * Strict privacy-by-default: NEVER logs CPF, email, passwords, tokens, or freeform text.
 */

export type AnalyticsEvent =
  | { name: 'search_submitted'; properties: { origin: string; query_type: 'domain' | 'cnpj' | 'text'; result_count: number } }
  | { name: 'search_result_opened'; properties: { entity_type: 'domain' | 'brand' | 'operator'; result_position: number } }
  | { name: 'source_opened'; properties: { entity_type: 'domain' | 'brand'; source_type: string } }
  | { name: 'history_opened'; properties: { entity_type: 'domain' | 'brand' } }
  | { name: 'verification_shared'; properties: { entity_type: 'domain' | 'brand'; channel: string } }
  | { name: 'filter_applied'; properties: { page: string; filter_name: string; value_category: string } }
  | { name: 'pagination_changed'; properties: { page: string; page_size: number } }
  | { name: 'report_started'; properties: { type: 'contest' | 'report' } }
  | { name: 'report_submitted'; properties: { type: 'contest' | 'report' } } // No freeform text!
  | { name: 'signup_started'; properties: { origin: string } }
  | { name: 'signup_completed'; properties: { origin: string } }
  | { name: 'login_completed'; properties: { origin: string } }
  | { name: 'rating_started'; properties: { brand_id: string } }
  | { name: 'rating_submitted'; properties: { brand_id: string } } // Never CPF!
  | { name: 'admin_drilldown_opened'; properties: { panel: string; dimension: string } };

export function trackEvent(event: AnalyticsEvent) {
  // In development / client runtime, log sanitized event without PII
  if (typeof window !== 'undefined') {
    // Dispatch custom DOM event for testing and telemetry-less observation
    window.dispatchEvent(new CustomEvent('betlegal_analytics', { detail: event }));
  }
}
