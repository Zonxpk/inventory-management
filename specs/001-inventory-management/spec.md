# Feature Specification: Inventory Management Core

## Summary

Build an inventory management capability for an ERP workflow that lets users record buy/sell
transactions, edit historical transactions safely, and view product-level inventory and profit
summaries based on weighted average cost.

## User Scenarios & Testing

### User Scenario 1 - Record inventory movements

As an operations user, I can add buy and sell transactions with product name, price, amount,
and date/time so that stock and profit reporting reflect real business activity.

**Why this matters**: Inventory and financial visibility depend on complete and valid transaction
history.

**Acceptance scenarios**
1. **Given** a valid BUY transaction, **when** the user submits it, **then** the transaction is
   stored and product stock increases by the submitted amount.
2. **Given** sufficient product stock, **when** the user submits a valid SELL transaction,
   **then** the transaction is stored, stock decreases by the sold amount, and realized profit/loss
   is calculated for that sale.
3. **Given** a SELL request that would make stock negative, **when** the user submits,
   **then** the system rejects the request with a validation error and stores no change.

### User Scenario 2 - Correct historical transaction data

As an operations user, I can update or delete a previously recorded transaction so that reporting
stays accurate when data entry mistakes are discovered.

**Why this matters**: Real workflows require retroactive corrections and audit-safe recalculation.

**Acceptance scenarios**
1. **Given** a historical transaction exists, **when** the user updates product, type, price,
   amount, or timestamp, **then** the system recomputes affected inventory and profit values from
   the earliest impacted point in time.
2. **Given** an edit that causes invalid history (such as negative stock at any point),
   **when** the user saves the change, **then** the system rejects it and preserves prior state.
3. **Given** a transaction is deleted, **when** deletion succeeds, **then** all downstream derived
   values are recalculated for impacted products.

### User Scenario 3 - Review product summary and monthly performance

As a manager, I can view product-level transaction details and monthly summary metrics so that I
can monitor inventory health and profitability.

**Why this matters**: Business decisions require up-to-date stock and margin visibility.

**Acceptance scenarios**
1. **Given** a product with transaction history, **when** a user requests summary,
   **then** the response includes current stock, latest-month buy amount, latest-month sales amount,
   latest-month profit, and transaction details with realized P/L on sell entries.
2. **Given** a product with no transactions, **when** summary is requested,
   **then** the system returns an empty transaction list with zero-valued summary metrics.

## Functional Requirements

- **FR-001**: The system MUST support creating a transaction with product name, transaction type
  (BUY or SELL), unit price, amount, and date/time.
- **FR-002**: The system MUST enforce amount and price as positive values greater than zero.
- **FR-003**: The system MUST reject any create, update, or delete action that makes inventory
  negative at any point in chronological evaluation for the affected product.
- **FR-004**: The system MUST support retrieving a transaction by unique identifier.
- **FR-005**: The system MUST support updating any transaction field (product, type, price, amount,
  date/time) and MUST recompute downstream derived values for affected products.
- **FR-006**: The system MUST support deleting a transaction and MUST recompute downstream derived
  values for affected products.
- **FR-007**: The system MUST expose product summary data containing:
  - current stock
  - latest-month buy amount
  - latest-month sales amount
  - latest-month profit
  - transaction details including realized P/L for SELL transactions
- **FR-008**: The system MUST calculate realized P/L for each SELL using weighted average cost based
  on inventory state immediately before that sell.
- **FR-009**: The system MUST provide a state reset operation that clears in-memory data for repeatable
  test execution.
- **FR-010**: The system MUST provide system-design documentation that covers:
  - high-level architecture and component interactions
  - data model optimized for read/write inventory workloads
  - concurrency strategy to prevent oversell under high parallel demand
  - historical edit impact handling with performance strategy

## Edge Cases

- Out-of-order timestamps across transactions for the same product.
- Multiple transactions at identical timestamps.
- Updating a BUY to SELL where current timeline validity changes.
- Moving a transaction to a different product via update.
- Repeated edits/deletes on old records with long history chains.
- Product name case differences and whitespace normalization.
- Large values for price and amount that may affect numeric precision.

## Assumptions

- The primary scope is core domain behavior and reporting rules; delivery channels (user interface,
  API contract shape, and deployment topology) are planned separately.
- Transaction identifiers are system-generated and unique.
- The latest month is derived from the most recent transaction month for each product.
- Monthly metrics are grouped by a single agreed business timezone for all records.
- CSV-based test cases are the authoritative source for acceptance test inputs and expected outputs.

## Dependencies

- Availability of agreed CSV test case files for verification.
- Agreement on business timezone used for monthly grouping.
- Agreement on monetary precision and rounding policy used for reporting.

## Out of Scope

- Authentication, authorization, and role management.
- Multi-warehouse stock distribution rules.
- External accounting, payment, or procurement integrations.
- UI styling and non-functional design system details.

## Success Criteria

- **SC-001**: 100% of provided acceptance test scenarios execute with expected outputs.
- **SC-002**: 100% of invalid operations that would produce negative inventory are rejected.
- **SC-003**: For all sell events in test scenarios, realized P/L matches expected values with the
  agreed rounding policy.
- **SC-004**: For all historical edit/delete test scenarios, downstream summary values remain
  consistent with recomputed transaction history.
- **SC-005**: At least 95% of users in UAT can complete add, correct, and summary-review workflows
  without clarification from support documentation.
