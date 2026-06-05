import type { HttpClient } from '../http.js';
import type {
  CreatePaymentRequestData,
  PaymentRequest,
} from '../types/index.js';

/**
 * Payment requests are one-time hosted checkout links. Creating one does not
 * move money — it returns a URL the customer can visit to choose to pay.
 */
export class PaymentRequestsResource {
  constructor(private readonly http: HttpClient) {}

  /** Create a one-time payment request, returning a hosted link. */
  create(data: CreatePaymentRequestData): Promise<PaymentRequest> {
    return this.http.request<PaymentRequest>('/payments/request', {
      method: 'POST',
      body: data,
    });
  }

  /** Retrieve a payment request and its current status. */
  get(id: string): Promise<PaymentRequest> {
    return this.http.request<PaymentRequest>(
      `/payments/request/${encodeURIComponent(id)}`,
    );
  }
}
