import type { HttpClient } from '../http.js';
import type {
  ListTransactionsParams,
  PaginatedList,
  Transaction,
} from '../types/index.js';

/**
 * Read-only access to payment transactions (`GET /payments`).
 *
 * Note: the SDK intentionally does NOT expose `POST /payments` (create payment),
 * which directly charges a card or bank account. Money movement is out of scope.
 */
export class TransactionsResource {
  constructor(private readonly http: HttpClient) {}

  /** List transactions with optional filters. */
  list(params?: ListTransactionsParams): Promise<PaginatedList<Transaction>> {
    return this.http.request<PaginatedList<Transaction>>('/payments', { params });
  }

  /** Retrieve a single transaction by id. */
  get(id: string): Promise<Transaction> {
    return this.http.request<Transaction>(`/payments/${encodeURIComponent(id)}`);
  }
}
