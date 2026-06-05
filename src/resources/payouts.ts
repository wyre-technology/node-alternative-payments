import type { HttpClient } from '../http.js';
import type {
  ListPayoutsParams,
  PaginatedList,
  Payout,
  Transaction,
} from '../types/index.js';

export class PayoutsResource {
  constructor(private readonly http: HttpClient) {}

  /** List payout batches. */
  list(params?: ListPayoutsParams): Promise<PaginatedList<Payout>> {
    return this.http.request<PaginatedList<Payout>>('/payouts', { params });
  }

  /** Retrieve a single payout by id. */
  get(id: string): Promise<Payout> {
    return this.http.request<Payout>(`/payouts/${encodeURIComponent(id)}`);
  }

  /** List the transactions included in a payout. */
  listTransactions(id: string): Promise<PaginatedList<Transaction>> {
    return this.http.request<PaginatedList<Transaction>>(
      `/payouts/${encodeURIComponent(id)}/transactions`,
    );
  }
}
