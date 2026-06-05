# node-alternative-payments

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

Node.js/TypeScript client library for the [Alternative Payments](https://www.alternativepayments.io/)
API — manage customers, invoices, payment requests, transactions, payouts, and webhooks.

> Maintained by [Wyre Technology](https://github.com/wyre-technology).

## Install

```bash
npm install @wyre-technology/node-alternative-payments
```

This package is published to GitHub Packages. Add to your `.npmrc`:

```
@wyre-technology:registry=https://npm.pkg.github.com
```

## Quick start

```ts
import { AlternativePaymentsClient } from '@wyre-technology/node-alternative-payments';

const client = new AlternativePaymentsClient({
  clientId: process.env.AP_CLIENT_ID!,
  clientSecret: process.env.AP_CLIENT_SECRET!,
  environment: 'production', // or 'demo'
});

const customers = await client.customers.list({ limit: 50 });
const invoice = await client.invoices.get('inv_123');
const link = await client.invoices.getPaymentLink('inv_123');
```

## Authentication

Alternative Payments uses **OAuth 2.0 client-credentials**. Generate an API key
(`client_id` / `client_secret`) in the Partner Dashboard. The SDK exchanges them
for a bearer token at `POST /oauth/token`, caches it, and refreshes it
automatically before expiry. You never manage tokens yourself.

## Capabilities

This SDK exposes **read and safe-write** operations. It intentionally does **not**
implement `POST /payments` (create-payment), which directly charges a card or bank
account — money movement is deliberately out of scope.

| Resource | Methods |
|----------|---------|
| `client.customers` | `list`, `get`, `create`, `archive`, `listUsers`, `addUser` |
| `client.invoices` | `list`, `get`, `create`, `archive`, `getPaymentLink`, `getPdfLink` |
| `client.transactions` | `list`, `get` |
| `client.paymentRequests` | `create`, `get` |
| `client.payouts` | `list`, `get`, `listTransactions` |
| `client.webhooks` | `list`, `create`, `delete`, `listEvents`, `retry` |

## Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `clientId` | _(required)_ | OAuth client id from the Partner Dashboard |
| `clientSecret` | _(required)_ | OAuth client secret |
| `environment` | `'production'` | `'production'` or `'demo'` |
| `baseUrl` | — | Override the base URL entirely |
| `maxRetries` | `3` | Retry attempts on 429/5xx |
| `rateLimitPerSecond` | `5` | Request cap (the documented per-key limit) |

## Error handling

All errors extend `AlternativePaymentsError`:

```ts
import {
  AlternativePaymentsError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
} from '@wyre-technology/node-alternative-payments';

try {
  await client.customers.get('missing');
} catch (err) {
  if (err instanceof NotFoundError) {
    // 404
  } else if (err instanceof AlternativePaymentsError) {
    console.error(err.statusCode, err.response);
  }
}
```

The client retries automatically on `429` (respecting `Retry-After`) and `5xx`,
and re-authenticates once on a `401`.

## License

Apache-2.0
