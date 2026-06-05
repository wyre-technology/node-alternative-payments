import type { HttpClient } from '../http.js';
import type {
  CreateInvoiceData,
  Invoice,
  ListInvoicesParams,
  PaginatedList,
  PaymentLink,
} from '../types/index.js';

export class InvoicesResource {
  constructor(private readonly http: HttpClient) {}

  /** List invoices, optionally filtered by status / customer. */
  list(params?: ListInvoicesParams): Promise<PaginatedList<Invoice>> {
    return this.http.request<PaginatedList<Invoice>>('/invoices', { params });
  }

  /** Retrieve a single invoice by id. */
  get(id: string): Promise<Invoice> {
    return this.http.request<Invoice>(`/invoices/${encodeURIComponent(id)}`);
  }

  /** Create an invoice with line items. */
  create(data: CreateInvoiceData): Promise<Invoice> {
    return this.http.request<Invoice>('/invoices', { method: 'POST', body: data });
  }

  /** Archive an invoice. Destructive. */
  archive(id: string): Promise<void> {
    return this.http.request<void>(`/invoices/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  /** Get the hosted payment link for an invoice. */
  getPaymentLink(id: string): Promise<PaymentLink> {
    return this.http.request<PaymentLink>(
      `/invoices/${encodeURIComponent(id)}/payment-link`,
    );
  }

  /** Get a signed PDF download link for an invoice. */
  getPdfLink(id: string): Promise<PaymentLink> {
    return this.http.request<PaymentLink>(
      `/invoices/${encodeURIComponent(id)}/pdf-link`,
    );
  }
}
