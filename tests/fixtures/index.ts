export const BASE_URL = 'https://public-api.alternativepayments.io';

export const tokenResponse = {
  access_token: 'test-access-token',
  token_type: 'Bearer',
  expires_in: 3600,
  scope: 'payments:read payments:write',
};

export const customer = {
  id: 'cus_123',
  name: 'Acme Corp',
  email: 'billing@acme.example',
  status: 'active',
  created_at: '2026-01-01T00:00:00Z',
};

export const customerList = {
  data: [customer],
  next_cursor: 'cursor_abc',
  has_more: false,
};

export const customerUser = {
  id: 'usr_1',
  email: 'jane@acme.example',
  first_name: 'Jane',
  last_name: 'Doe',
};

export const invoice = {
  id: 'inv_123',
  customer_id: 'cus_123',
  currency: 'USD',
  due_date: '2026-02-01',
  status: 'open',
  amount: 1000,
  line_items: [{ description: 'Services', amount: 1000, quantity: 1 }],
};

export const invoiceList = { data: [invoice], has_more: false };

export const paymentLink = { url: 'https://pay.alternativepayments.io/inv_123' };
export const pdfLink = { url: 'https://files.alternativepayments.io/inv_123.pdf' };

export const transaction = {
  id: 'pay_123',
  customer_id: 'cus_123',
  invoice_id: 'inv_123',
  amount: 1000,
  status: 'succeeded',
  payment_method: 'card',
  created_at: '2026-01-15T00:00:00Z',
};

export const transactionList = { data: [transaction], has_more: false };

export const paymentRequest = {
  id: 'preq_123',
  amount: 2500,
  currency: 'USD',
  redirect_url: 'https://app.example/return',
  reference_id: 'order-9',
  status: 'pending',
  url: 'https://pay.alternativepayments.io/preq_123',
};

export const payout = {
  id: 'po_123',
  amount: 5000,
  status: 'paid',
  created_at: '2026-01-20T00:00:00Z',
};

export const payoutList = { data: [payout], has_more: false };

export const webhook = {
  id: 'wh_123',
  endpoint_url: 'https://app.example/webhooks',
  topic: 'payment.succeeded',
  status: 'active',
};

export const webhookList = { data: [webhook], has_more: false };

export const webhookEvent = {
  id: 'evt_123',
  topic: 'payment.succeeded',
  status: 'delivered',
  created_at: '2026-01-21T00:00:00Z',
};

export const webhookEventList = { data: [webhookEvent], has_more: false };
