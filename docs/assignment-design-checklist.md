# ASSIGNMENTS Design Section Manual Checklist

This checklist covers non-automatable sections from ASSIGNMENTS.MD that are not executable Playwright cases.

## 1) High-Level Architecture

- [ ] System context diagram includes Next.js frontend, NestJS API, storage, and async workers.
- [ ] Request flow for create/update/delete/read summary is documented.
- [ ] Clear boundary for domain logic and transport layer is shown.
- [ ] Failure paths (validation errors, not-found, invariant violations) are represented.

## 2) Database Design

- [ ] Schema proposal includes transactions table with immutable event-style records or audited updates.
- [ ] Index strategy is documented for product+time range summary reads.
- [ ] Read/write tradeoff is explained (OLTP tables plus optional pre-aggregations/materialized views).
- [ ] Migration plan from in-memory state to persistent storage is described.

## 3) Concurrency Control

- [ ] Strategy to prevent negative stock under high contention is stated.
- [ ] Transaction isolation/locking approach is defined.
- [ ] Idempotency key strategy for retry-safe writes is defined.
- [ ] Conflict behavior and user-facing response codes are documented.

## 4) Handling Historical Edits

- [ ] Impact analysis for backdated changes on current summary is described.
- [ ] Recompute strategy (full replay vs scoped recompute) is described.
- [ ] Performance approach for large histories is documented.
- [ ] Operational plan for correctness validation and rollback is included.

## Traceability

- Functional, executable cases are covered by Playwright API/UI specs in `playwright/tests`.
- Design prompts are covered by this checklist for manual review.
