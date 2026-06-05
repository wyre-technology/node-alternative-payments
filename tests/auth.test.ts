import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { AlternativePaymentsClient, AuthenticationError, NotFoundError } from '../src/index.js';
import * as f from './fixtures/index.js';
import { server } from './mocks/server.js';

const { BASE_URL } = f;

function makeClient() {
  return new AlternativePaymentsClient({ clientId: 'id', clientSecret: 'secret' });
}

describe('token manager', () => {
  it('fetches the token once and reuses it across requests', async () => {
    let tokenCalls = 0;
    server.use(
      http.post(`${BASE_URL}/oauth/token`, () => {
        tokenCalls++;
        return HttpResponse.json(f.tokenResponse);
      }),
    );
    const client = makeClient();
    await client.customers.list();
    await client.customers.get('cus_123');
    await client.invoices.list();
    expect(tokenCalls).toBe(1);
  });

  it('sends the bearer token on API requests', async () => {
    let authHeader: string | null = null;
    server.use(
      http.get(`${BASE_URL}/customers`, ({ request }) => {
        authHeader = request.headers.get('authorization');
        return HttpResponse.json(f.customerList);
      }),
    );
    await makeClient().customers.list();
    expect(authHeader).toBe('Bearer test-access-token');
  });

  it('re-authenticates once on a 401 then succeeds', async () => {
    let first = true;
    server.use(
      http.get(`${BASE_URL}/customers`, () => {
        if (first) {
          first = false;
          return new HttpResponse(JSON.stringify({ error: 'expired' }), {
            status: 401,
          });
        }
        return HttpResponse.json(f.customerList);
      }),
    );
    const res = await makeClient().customers.list();
    expect(res.data[0]?.id).toBe('cus_123');
  });

  it('throws AuthenticationError if the token endpoint rejects', async () => {
    server.use(
      http.post(`${BASE_URL}/oauth/token`, () =>
        new HttpResponse(JSON.stringify({ error: 'invalid_client' }), {
          status: 401,
        }),
      ),
    );
    await expect(makeClient().customers.list()).rejects.toBeInstanceOf(
      AuthenticationError,
    );
  });
});

describe('error mapping', () => {
  it('maps 404 to NotFoundError', async () => {
    server.use(
      http.get(`${BASE_URL}/customers/:id`, () =>
        new HttpResponse(JSON.stringify({ error: 'not found' }), { status: 404 }),
      ),
    );
    await expect(makeClient().customers.get('missing')).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
