/**
 * Error hierarchy for the Alternative Payments SDK.
 *
 * All errors extend {@link AlternativePaymentsError} so callers can catch the
 * base class, while specific subclasses allow targeted handling (e.g. retrying
 * on {@link RateLimitError} or re-authenticating on {@link AuthenticationError}).
 */
export class AlternativePaymentsError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response: unknown,
  ) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends AlternativePaymentsError {
  constructor(message: string, response: unknown) {
    super(message, 401, response);
  }
}

export class ForbiddenError extends AlternativePaymentsError {
  constructor(message: string, response: unknown) {
    super(message, 403, response);
  }
}

export class NotFoundError extends AlternativePaymentsError {
  constructor(message: string, response: unknown) {
    super(message, 404, response);
  }
}

export class ValidationError extends AlternativePaymentsError {
  constructor(
    message: string,
    public errors: Array<{ field: string; message: string }>,
    response: unknown,
  ) {
    super(message, 422, response);
  }
}

export class RateLimitError extends AlternativePaymentsError {
  constructor(
    message: string,
    public retryAfter: number,
    response: unknown,
  ) {
    super(message, 429, response);
  }
}

export class ServerError extends AlternativePaymentsError {
  constructor(message: string, statusCode: number, response: unknown) {
    super(message, statusCode, response);
  }
}
