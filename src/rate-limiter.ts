/**
 * Sliding-window rate limiter.
 *
 * Alternative Payments enforces 5 requests/second per API key. This limiter
 * defaults to that, blocking (via `acquire()`) until a slot is free rather than
 * letting requests fail with 429.
 */
export class RateLimiter {
  private timestamps: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 5, windowMs = 1_000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async acquire(): Promise<void> {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);

    if (this.timestamps.length >= this.maxRequests) {
      const oldest = this.timestamps[0]!;
      const waitMs = this.windowMs - (now - oldest) + 50;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      return this.acquire();
    }

    this.timestamps.push(now);
  }
}
