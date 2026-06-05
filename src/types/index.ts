/**
 * TypeScript interfaces for Alternative Payments API entities.
 *
 * Fields reflect the public API documentation (https://docs.alternativepayments.io).
 * Interfaces are intentionally permissive: unknown extra fields are tolerated so
 * the SDK does not break when the API adds attributes.
 */

/** Generic cursor-paginated list envelope. */
export interface PaginatedList<T> {
  data: T[];
  /** Cursor to pass as `after` to fetch the next page, if any. */
  next_cursor?: string;
  has_more?: boolean;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

export interface Customer {
  id: string;
  name: string;
  email: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CustomerUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  [key: string]: unknown;
}

export interface ListCustomersParams {
  limit?: number;
  after?: string;
}

export interface CreateCustomerData {
  name: string;
  email: string;
  [key: string]: unknown;
}

export interface AddCustomerUserData {
  email: string;
  first_name: string;
  last_name: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Invoices
// ---------------------------------------------------------------------------

export interface InvoiceLineItem {
  description: string;
  amount: number;
  quantity?: number;
  [key: string]: unknown;
}

export interface Invoice {
  id: string;
  customer_id: string;
  currency: string;
  due_date: string;
  status?: string;
  amount?: number;
  line_items?: InvoiceLineItem[];
  created_at?: string;
  [key: string]: unknown;
}

export interface ListInvoicesParams {
  status?: string;
  customer_id?: string;
  limit?: number;
  after?: string;
}

export interface CreateInvoiceData {
  customer_id: string;
  currency: string;
  due_date: string;
  line_items: InvoiceLineItem[];
  [key: string]: unknown;
}

export interface PaymentLink {
  url: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Payments / Transactions
// ---------------------------------------------------------------------------

export type PaymentMethod = 'card' | 'standard_ach' | string;

export interface Transaction {
  id: string;
  customer_id?: string;
  invoice_id?: string;
  amount: number;
  status: string;
  type?: string;
  payment_method?: PaymentMethod;
  created_at?: string;
  [key: string]: unknown;
}

export interface ListTransactionsParams {
  limit?: number;
  after?: string;
  before?: string;
  type?: string;
  status?: string;
  customer_id?: string;
  invoice_id?: string;
  payment_method?: PaymentMethod;
  created_at_start?: string;
  created_at_end?: string;
}

// ---------------------------------------------------------------------------
// Payment Requests
// ---------------------------------------------------------------------------

export interface PaymentRequest {
  id: string;
  amount: number;
  currency: string;
  redirect_url: string;
  reference_id?: string;
  status?: string;
  url?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface CreatePaymentRequestData {
  amount: number;
  currency: string;
  redirect_url: string;
  reference_id?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Payouts
// ---------------------------------------------------------------------------

export interface Payout {
  id: string;
  amount: number;
  status: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface ListPayoutsParams {
  limit?: number;
  after?: string;
}

// ---------------------------------------------------------------------------
// Webhooks
// ---------------------------------------------------------------------------

export interface WebhookSubscription {
  id: string;
  endpoint_url: string;
  topic: string;
  status?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface CreateWebhookData {
  endpoint_url: string;
  topic: string;
  [key: string]: unknown;
}

export interface ListWebhooksParams {
  limit?: number;
  topic?: string;
}

export interface WebhookEvent {
  id: string;
  topic?: string;
  status?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface ListWebhookEventsParams {
  limit?: number;
  status?: string;
}
