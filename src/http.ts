import { TokenManager } from './auth.js';
import { RateLimiter } from './rate-limiter.js';
import {
  AlternativePaymentsError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
} from './errors.js';

export interface HttpClientConfig {
  baseUrl: string;
  tokenManager: TokenManager;
  rateLimiter: RateLimiter;
  maxRetries: number;
}

export interface RequestOptions {
  method?: string;
  /** Query parameters; serialized via URLSearchParams (arrays repeat the key). */
  params?: object;
  body?: unknown;
}

/**
 * Thin HTTP client wrapping `fetch` with bearer-token auth, rate limiting,
 * retry-with-backoff on transient failures, and a single re-auth retry on 401.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly tokenManager: TokenManager;
  private readonly rateLimiter: RateLimiter;
  private readonly maxRetries: number;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.tokenManager = config.tokenManager;
    this.rateLimiter = config.rateLimiter;
    this.maxRetries = config.maxRetries;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', params, body } = options;

    let url = `${this.baseUrl}${path}`;
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue;
        if (Array.isArray(value)) {
          for (const v of value) searchParams.append(key, String(v));
        } else {
          searchParams.set(key, String(value));
        }
      }
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    let lastError: Error | null = null;
    let reauthed = false;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 30_000);
        await new Promise((r) => setTimeout(r, delay));
      }

      await this.rateLimiter.acquire();

      const token = await this.tokenManager.getToken();
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      };
      if (body !== undefined) headers['Content-Type'] = 'application/json';

      let response: Response;
      try {
        response = await fetch(url, {
          method,
          headers,
          body: body !== undefined ? JSON.stringify(body) : undefined,
        });
      } catch (err) {
        lastError = err as Error;
        continue;
      }

      if (response.ok) {
        if (response.status === 204) return {} as T;
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          return (await response.json()) as T;
        }
        return {} as T;
      }

      // Read the error body once as text, then attempt to parse as JSON.
      const rawText = await response.text();
      let responseBody: unknown;
      try {
        responseBody = JSON.parse(rawText);
      } catch {
        responseBody = rawText;
      }

      switch (response.status) {
        case 401:
          // Token may have been revoked early — invalidate and retry once.
          this.tokenManager.invalidate();
          if (!reauthed) {
            reauthed = true;
            attempt--; // don't consume a retry slot for the re-auth
            continue;
          }
          throw new AuthenticationError('Authentication failed', responseBody);
        case 403:
          throw new ForbiddenError('Forbidden', responseBody);
        case 404:
          throw new NotFoundError('Resource not found', responseBody);
        case 400:
        case 422:
          throw new ValidationError(
            'Request validation failed',
            extractFieldErrors(responseBody),
            responseBody,
          );
        case 429: {
          const retryAfter = parseInt(
            response.headers.get('retry-after') || '1',
            10,
          );
          if (attempt < this.maxRetries) {
            await new Promise((r) => setTimeout(r, retryAfter * 1000));
            continue;
          }
          throw new RateLimitError('Rate limit exceeded', retryAfter, responseBody);
        }
        default:
          if (response.status >= 500) {
            lastError = new ServerError(
              `Server error: ${response.status}`,
              response.status,
              responseBody,
            );
            if (attempt < this.maxRetries) continue;
            throw lastError;
          }
          throw new AlternativePaymentsError(
            `HTTP ${response.status}`,
            response.status,
            responseBody,
          );
      }
    }

    throw lastError || new Error('Request failed after retries');
  }
}

function extractFieldErrors(
  body: unknown,
): Array<{ field: string; message: string }> {
  if (
    body &&
    typeof body === 'object' &&
    'errors' in body &&
    Array.isArray((body as { errors: unknown }).errors)
  ) {
    return (body as { errors: Array<{ field?: string; message?: string }> }).errors.map(
      (e) => ({ field: e.field ?? '', message: e.message ?? '' }),
    );
  }
  return [];
}
