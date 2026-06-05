import type { HttpClient } from '../http.js';
import type {
  CreateWebhookData,
  ListWebhookEventsParams,
  ListWebhooksParams,
  PaginatedList,
  WebhookEvent,
  WebhookSubscription,
} from '../types/index.js';

export class WebhooksResource {
  constructor(private readonly http: HttpClient) {}

  /** List webhook subscriptions. */
  list(params?: ListWebhooksParams): Promise<PaginatedList<WebhookSubscription>> {
    return this.http.request<PaginatedList<WebhookSubscription>>('/webhooks', {
      params,
    });
  }

  /** Subscribe to a webhook topic. */
  create(data: CreateWebhookData): Promise<WebhookSubscription> {
    return this.http.request<WebhookSubscription>('/webhooks', {
      method: 'POST',
      body: data,
    });
  }

  /** Unsubscribe from a webhook. Destructive. */
  delete(subscriptionId: string): Promise<void> {
    return this.http.request<void>(
      `/webhooks/${encodeURIComponent(subscriptionId)}`,
      { method: 'DELETE' },
    );
  }

  /** View webhook delivery history. */
  listEvents(
    params?: ListWebhookEventsParams,
  ): Promise<PaginatedList<WebhookEvent>> {
    return this.http.request<PaginatedList<WebhookEvent>>('/webhooks/events', {
      params,
    });
  }

  /** Resume failed webhook delivery. */
  retry(): Promise<void> {
    return this.http.request<void>('/webhooks/retry', { method: 'POST' });
  }
}
