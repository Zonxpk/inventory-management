# Phase 0 Research: Inventory Management Core

## Decision 1: Monetary precision and rounding policy

- Decision: Use decimal-safe arithmetic and round monetary outputs (realized P/L and monthly profit)
  to 2 decimal places using half-up rounding.
- Rationale: Inventory and accounting values must be deterministic and human-auditable; binary floating
  point introduces drift in cumulative operations.
- Alternatives considered:
  - Native `number` arithmetic only: rejected due to floating-point precision risk.
  - Integer minor units (cents): viable, but additional conversion complexity for average-cost division.

## Decision 2: Timeline ordering for recomputation

- Decision: Recompute per product by ascending timestamp, then ascending creation sequence for tie-breaks.
- Rationale: Out-of-order inserts/edits and identical timestamps must produce deterministic state.
- Alternatives considered:
  - Sort only by timestamp: rejected because equal timestamps become unstable.
  - Persist precomputed snapshots only: rejected in MVP because edit complexity increases.

## Decision 3: Monthly summary boundary

- Decision: Aggregate monthly metrics by UTC month derived from transaction timestamp.
- Rationale: UTC avoids environment-specific timezone ambiguity and keeps tests reproducible.
- Alternatives considered:
  - Local server timezone: rejected due to deployment-dependent month shifts.
  - Configurable business timezone: deferred to future ERP phase.

## Decision 4: Validation strategy for negative stock prevention

- Decision: Run full affected-product recomputation in-memory before committing create/update/delete
  mutations; reject operation if any step yields stock below zero.
- Rationale: Guarantees invariant preservation even for historical edits.
- Alternatives considered:
  - Check only latest stock: rejected because historical edits can break intermediate states.
  - Partial delta patching: rejected due to high risk of drift in average-cost and P/L chains.

## Decision 5: API surface for this feature

- Decision: Expose REST endpoints for transaction CRUD, clear-state utility, and product summary query.
- Rationale: Simple mapping from functional requirements and easy integration with Next.js client.
- Alternatives considered:
  - GraphQL API: rejected to keep MVP contract simpler.
  - Backend-only module with no API: rejected because assignment requires app-level Next.js + NestJS setup.
