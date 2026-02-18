# Quickstart: Inventory Management Core

## 1) Prerequisites

- Node.js 20 LTS
- Package manager: npm, pnpm, or yarn
- Feature docs in `specs/001-inventory-management/`

## 2) Create project structure

Expected directories:

```text
backend/
frontend/
tests/csv/
```

## 3) Implement backend core (NestJS)

1. Create inventory module with service and controller.
2. Implement in-memory `InventoryManager` class with:
   - `clear`
   - `addTransaction`
   - `getTransaction`
   - `updateTransaction`
   - `deleteTransaction`
   - `getProductSummary`
3. Enforce validation and business invariants:
   - `amount > 0`, `price > 0`
   - no negative stock at any timeline point after mutation
4. Implement weighted-average-cost realized P/L for SELL transactions.

## 4) Implement frontend flow (Next.js)

1. Add inventory page for create/update/delete transaction actions.
2. Add summary view by product name showing stock, latest-month metrics, and transaction list.
3. Integrate with backend endpoints from `contracts/openapi.yaml`.

## 5) Add CSV-driven tests

1. Place provided CSV test cases under `tests/csv/`.
2. Build test loader that converts CSV rows to transaction operations and expected assertions.
3. Cover:
   - valid buy/sell flows
   - invalid negative-stock attempts
   - historical edit/delete recomputation cases
   - monthly aggregation and realized P/L checks

## 6) Run checks

- Run backend unit tests and CSV scenario tests.
- Run frontend unit tests (if UI behavior is implemented in this phase).
- Verify endpoint behavior against `contracts/openapi.yaml`.

## 7) Completion checklist

- All functional requirements FR-001..FR-010 satisfied.
- All CSV scenarios pass.
- No operation can persist an invalid negative stock history.
- Product summary fields match expected latest-month and realized P/L outputs.
