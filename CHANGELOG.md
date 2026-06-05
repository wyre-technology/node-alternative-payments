# 1.0.0 (2026-06-05)


### Features

* initial Alternative Payments SDK ([1c82a66](https://github.com/wyre-technology/node-alternative-payments/commit/1c82a667e14c7dc7190aa20c147082add7af10b0))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial release of the Alternative Payments Node.js/TypeScript SDK.
- OAuth 2.0 client-credentials token manager with automatic refresh.
- Sliding-window rate limiter (5 req/s default) and retry-with-backoff.
- Resources: customers, invoices, transactions, payment requests, payouts, webhooks.
- Typed error hierarchy (`AuthenticationError`, `ValidationError`, `RateLimitError`, etc.).
