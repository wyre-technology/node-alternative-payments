import { AuthenticationError } from './errors.js';

/** Shape of a successful `POST /oauth/token` response. */
interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

/**
 * Manages the OAuth 2.0 client-credentials token lifecycle.
 *
 * Alternative Payments issues short-lived bearer tokens. This manager exchanges
 * the `clientId:clientSecret` pair (via HTTP Basic auth) for an access token at
 * `POST /oauth/token`, caches it, and transparently refreshes it shortly before
 * `expires_in` elapses. Concurrent callers share a single in-flight refresh.
 */
export class TokenManager {
  private accessToken: string | null = null;
  /** Epoch ms at which the cached token should be considered stale. */
  private expiresAt = 0;
  /** Refresh this many ms before the real expiry to avoid races. */
  private readonly refreshMarginMs = 60_000;
  private inflight: Promise<string> | null = null;

  constructor(
    private readonly baseUrl: string,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  /** Returns a valid bearer token, fetching/refreshing as needed. */
  async getToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.expiresAt - this.refreshMarginMs) {
      return this.accessToken;
    }
    // Coalesce concurrent refreshes into one network call.
    if (!this.inflight) {
      this.inflight = this.fetchToken().finally(() => {
        this.inflight = null;
      });
    }
    return this.inflight;
  }

  /** Forces the next `getToken()` to re-authenticate (e.g. after a 401). */
  invalidate(): void {
    this.accessToken = null;
    this.expiresAt = 0;
  }

  private async fetchToken(): Promise<string> {
    const basic = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
      'base64',
    );
    const body = new URLSearchParams({ grant_type: 'client_credentials' });

    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: body.toString(),
    });

    const rawText = await response.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = rawText;
    }

    if (!response.ok) {
      throw new AuthenticationError(
        `OAuth token request failed (HTTP ${response.status})`,
        parsed,
      );
    }

    const token = parsed as TokenResponse;
    if (!token.access_token) {
      throw new AuthenticationError(
        'OAuth token response did not include an access_token',
        parsed,
      );
    }

    this.accessToken = token.access_token;
    this.expiresAt = Date.now() + (token.expires_in ?? 3600) * 1000;
    return this.accessToken;
  }
}
