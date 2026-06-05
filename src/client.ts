import { TokenManager } from './auth.js';
import { type AlternativePaymentsConfig, resolveConfig } from './config.js';
import { HttpClient } from './http.js';
import { RateLimiter } from './rate-limiter.js';
import { CustomersResource } from './resources/customers.js';
import { InvoicesResource } from './resources/invoices.js';
import { PaymentRequestsResource } from './resources/payment-requests.js';
import { PayoutsResource } from './resources/payouts.js';
import { TransactionsResource } from './resources/transactions.js';
import { WebhooksResource } from './resources/webhooks.js';

/**
 * Client for the Alternative Payments API.
 *
 * @example
 * ```ts
 * const client = new AlternativePaymentsClient({
 *   clientId: process.env.AP_CLIENT_ID!,
 *   clientSecret: process.env.AP_CLIENT_SECRET!,
 *   environment: 'production',
 * });
 * const customers = await client.customers.list({ limit: 50 });
 * ```
 */
export class AlternativePaymentsClient {
  readonly customers: CustomersResource;
  readonly invoices: InvoicesResource;
  readonly transactions: TransactionsResource;
  readonly paymentRequests: PaymentRequestsResource;
  readonly payouts: PayoutsResource;
  readonly webhooks: WebhooksResource;

  constructor(config: AlternativePaymentsConfig) {
    const resolved = resolveConfig(config);
    const tokenManager = new TokenManager(
      resolved.baseUrl,
      resolved.clientId,
      resolved.clientSecret,
    );
    const rateLimiter = new RateLimiter(resolved.rateLimitPerSecond);
    const http = new HttpClient({
      baseUrl: resolved.baseUrl,
      tokenManager,
      rateLimiter,
      maxRetries: resolved.maxRetries,
    });

    this.customers = new CustomersResource(http);
    this.invoices = new InvoicesResource(http);
    this.transactions = new TransactionsResource(http);
    this.paymentRequests = new PaymentRequestsResource(http);
    this.payouts = new PayoutsResource(http);
    this.webhooks = new WebhooksResource(http);
  }
}
