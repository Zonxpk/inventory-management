# Inventory Management System Design

## 1) High-Level Architecture

The module is separated into:

- `frontend` (Next.js): transaction entry, historical edit/delete actions, product summary view.
- `backend` (NestJS): API layer and domain services (`InventoryService`, recomputation services).
- In-memory domain state (`InventoryState`) used by business logic for fast deterministic tests.

Request flow:

1. User action in Next.js calls backend REST endpoint.
2. NestJS controller validates DTO and calls inventory service.
3. Service applies mutation in-memory and runs timeline recomputation.
4. If invariant fails (negative stock), mutation is rolled back and error returned.
5. Frontend updates summary/transaction table from API response.

## 2) Database Design (ERP-ready)

Although MVP uses in-memory state, production schema should use an append-friendly ledger model:

- `transactions` table:
  - `id` (PK)
  - `product_name`
  - `type` (`BUY`/`SELL`)
  - `price`
  - `amount`
  - `at` (event time)
  - `sequence` (ingestion tie-break)
  - `created_at`, `updated_at`
- `product_snapshot` table (optional optimization):
  - per product/day rolling `stock`, `inventory_cost`, `average_cost`

Indexes:

- `(product_name, at, sequence)` for chronological recomputation.
- `(id)` primary lookup.
- `(product_name, at DESC)` for latest-month reads.

## 3) Concurrency Control (1,000 concurrent buyers)

To prevent negative stock under concurrency:

- Use per-product serial execution (mutex/queue) at service layer, or
- Use database transaction with row-level lock (`SELECT ... FOR UPDATE`) on product stock aggregate.
- Re-validate stock at commit time after lock acquisition.
- Reject oversell requests deterministically with business error.

For horizontal scale:

- Partition lock key by product name.
- Use distributed lock (e.g., Redis-based) only if DB locking is insufficient.
- Keep operation idempotency keys for retry safety.

## 4) Handling Historical Edits

Historical edit/delete changes downstream economics, so the system must recompute from the earliest
affected transaction for that product.

Approach:

1. Identify impacted product(s) and earliest affected timestamp.
2. Load transactions ordered by `(at, sequence)` from that point onward.
3. Recompute stock, average cost, and realized P/L sequentially.
4. Persist new derived values atomically (or rollback on failure).

Performance strategy:

- Use periodic snapshots/checkpoints to reduce recomputation window.
- Keep recomputation product-scoped (not global).
- Queue expensive backfills asynchronously when possible, with eventual-consistency flag if needed.
