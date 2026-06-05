import { describe, expect, it } from 'vitest';
import { AlternativePaymentsClient } from '../src/index.js';

function makeClient() {
  return new AlternativePaymentsClient({
    clientId: 'id',
    clientSecret: 'secret',
    environment: 'production',
  });
}

describe('customers', () => {
  const client = makeClient();

  it('lists customers', async () => {
    const res = await client.customers.list({ limit: 10 });
    expect(res.data[0]?.id).toBe('cus_123');
  });

  it('gets a customer', async () => {
    const res = await client.customers.get('cus_123');
    expect(res.email).toBe('billing@acme.example');
  });

  it('creates a customer', async () => {
    const res = await client.customers.create({
      name: 'Acme Corp',
      email: 'billing@acme.example',
    });
    expect(res.id).toBe('cus_123');
  });

  it('archives a customer', async () => {
    await expect(client.customers.archive('cus_123')).resolves.toBeDefined();
  });

  it('lists and adds customer users', async () => {
    const list = await client.customers.listUsers('cus_123');
    expect(list.data[0]?.email).toBe('jane@acme.example');
    const added = await client.customers.addUser('cus_123', {
      email: 'jane@acme.example',
      first_name: 'Jane',
      last_name: 'Doe',
    });
    expect(added.id).toBe('usr_1');
  });
});

describe('invoices', () => {
  const client = makeClient();

  it('lists, gets, and creates invoices', async () => {
    expect((await client.invoices.list()).data[0]?.id).toBe('inv_123');
    expect((await client.invoices.get('inv_123')).currency).toBe('USD');
    const created = await client.invoices.create({
      customer_id: 'cus_123',
      currency: 'USD',
      due_date: '2026-02-01',
      line_items: [{ description: 'Services', amount: 1000 }],
    });
    expect(created.id).toBe('inv_123');
  });

  it('fetches payment and pdf links', async () => {
    expect((await client.invoices.getPaymentLink('inv_123')).url).toContain('pay');
    expect((await client.invoices.getPdfLink('inv_123')).url).toContain('.pdf');
  });
});

describe('transactions', () => {
  const client = makeClient();

  it('lists and gets transactions', async () => {
    expect((await client.transactions.list()).data[0]?.status).toBe('succeeded');
    expect((await client.transactions.get('pay_123')).id).toBe('pay_123');
  });
});

describe('payment requests', () => {
  const client = makeClient();

  it('creates and gets a payment request', async () => {
    const created = await client.paymentRequests.create({
      amount: 2500,
      currency: 'USD',
      redirect_url: 'https://app.example/return',
    });
    expect(created.url).toContain('preq_123');
    expect((await client.paymentRequests.get('preq_123')).status).toBe('pending');
  });
});

describe('payouts', () => {
  const client = makeClient();

  it('lists, gets, and lists payout transactions', async () => {
    expect((await client.payouts.list()).data[0]?.id).toBe('po_123');
    expect((await client.payouts.get('po_123')).status).toBe('paid');
    expect((await client.payouts.listTransactions('po_123')).data[0]?.id).toBe(
      'pay_123',
    );
  });
});

describe('webhooks', () => {
  const client = makeClient();

  it('manages webhook subscriptions and events', async () => {
    expect((await client.webhooks.list()).data[0]?.topic).toBe('payment.succeeded');
    const created = await client.webhooks.create({
      endpoint_url: 'https://app.example/webhooks',
      topic: 'payment.succeeded',
    });
    expect(created.id).toBe('wh_123');
    await expect(client.webhooks.delete('wh_123')).resolves.toBeDefined();
    expect((await client.webhooks.listEvents()).data[0]?.status).toBe('delivered');
    await expect(client.webhooks.retry()).resolves.toBeDefined();
  });
});
