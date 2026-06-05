import { http, HttpResponse } from 'msw';
import * as f from '../fixtures/index.js';

const { BASE_URL } = f;

export const handlers = [
  // OAuth token
  http.post(`${BASE_URL}/oauth/token`, () => HttpResponse.json(f.tokenResponse)),

  // Customers
  http.get(`${BASE_URL}/customers`, () => HttpResponse.json(f.customerList)),
  http.post(`${BASE_URL}/customers`, () =>
    HttpResponse.json(f.customer, { status: 201 }),
  ),
  http.get(`${BASE_URL}/customers/:id`, () => HttpResponse.json(f.customer)),
  http.delete(`${BASE_URL}/customers/:id`, () => new HttpResponse(null, { status: 204 })),
  http.get(`${BASE_URL}/customers/:id/users`, () =>
    HttpResponse.json({ data: [f.customerUser], has_more: false }),
  ),
  http.post(`${BASE_URL}/customers/:id/users`, () =>
    HttpResponse.json(f.customerUser, { status: 201 }),
  ),

  // Invoices
  http.get(`${BASE_URL}/invoices`, () => HttpResponse.json(f.invoiceList)),
  http.post(`${BASE_URL}/invoices`, () =>
    HttpResponse.json(f.invoice, { status: 201 }),
  ),
  http.get(`${BASE_URL}/invoices/:id/payment-link`, () =>
    HttpResponse.json(f.paymentLink),
  ),
  http.get(`${BASE_URL}/invoices/:id/pdf-link`, () => HttpResponse.json(f.pdfLink)),
  http.get(`${BASE_URL}/invoices/:id`, () => HttpResponse.json(f.invoice)),
  http.delete(`${BASE_URL}/invoices/:id`, () => new HttpResponse(null, { status: 204 })),

  // Transactions
  http.get(`${BASE_URL}/payments/:id`, () => HttpResponse.json(f.transaction)),
  http.get(`${BASE_URL}/payments`, () => HttpResponse.json(f.transactionList)),

  // Payment requests
  http.post(`${BASE_URL}/payments/request`, () =>
    HttpResponse.json(f.paymentRequest, { status: 201 }),
  ),
  http.get(`${BASE_URL}/payments/request/:id`, () =>
    HttpResponse.json(f.paymentRequest),
  ),

  // Payouts
  http.get(`${BASE_URL}/payouts/:id/transactions`, () =>
    HttpResponse.json(f.transactionList),
  ),
  http.get(`${BASE_URL}/payouts/:id`, () => HttpResponse.json(f.payout)),
  http.get(`${BASE_URL}/payouts`, () => HttpResponse.json(f.payoutList)),

  // Webhooks
  http.get(`${BASE_URL}/webhooks/events`, () => HttpResponse.json(f.webhookEventList)),
  http.post(`${BASE_URL}/webhooks/retry`, () => new HttpResponse(null, { status: 204 })),
  http.get(`${BASE_URL}/webhooks`, () => HttpResponse.json(f.webhookList)),
  http.post(`${BASE_URL}/webhooks`, () =>
    HttpResponse.json(f.webhook, { status: 201 }),
  ),
  http.delete(`${BASE_URL}/webhooks/:id`, () => new HttpResponse(null, { status: 204 })),
];
