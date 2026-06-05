/**
 * Configuration types and defaults for the Alternative Payments client.
 */

export type Environment = 'production' | 'demo';

export const BASE_URLS: Record<Environment, string> = {
  production: 'https://public-api.alternativepayments.io',
  demo: 'https://public-api.demo.alternativepayments.io',
};

export interface AlternativePaymentsConfig {
  /** OAuth client id (the API key issued in the Partner Dashboard). */
  clientId: string;
  /** OAuth client secret paired with the client id. */
  clientSecret: string;
  /**
   * Which Alternative Payments environment to target. Ignored if `baseUrl` is
   * set explicitly. Defaults to `production`.
   */
  environment?: Environment;
  /** Override the base URL entirely (takes precedence over `environment`). */
  baseUrl?: string;
  /** Max retry attempts for transient failures (429/5xx). Defaults to 3. */
  maxRetries?: number;
  /** Requests/second cap. Defaults to 5 (the documented per-key limit). */
  rateLimitPerSecond?: number;
}

export interface ResolvedConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
  maxRetries: number;
  rateLimitPerSecond: number;
}

export function resolveConfig(config: AlternativePaymentsConfig): ResolvedConfig {
  if (!config.clientId || !config.clientSecret) {
    throw new Error(
      'Alternative Payments client requires both clientId and clientSecret.',
    );
  }
  const environment: Environment = config.environment ?? 'production';
  return {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    baseUrl: (config.baseUrl ?? BASE_URLS[environment]).replace(/\/$/, ''),
    maxRetries: config.maxRetries ?? 3,
    rateLimitPerSecond: config.rateLimitPerSecond ?? 5,
  };
}
