# Data Model: Inventory Management Core

## Entity: Transaction

### Fields

- `id` (string, required, immutable): unique transaction identifier.
- `productName` (string, required): normalized product key (trimmed, case strategy defined in service).
- `type` (enum, required): `BUY` or `SELL`.
- `price` (decimal, required, > 0): unit cost for BUY or unit sell price for SELL.
- `amount` (integer, required, > 0): quantity of units.
- `at` (datetime, required): business event timestamp.
- `sequence` (integer, required, immutable): insertion tie-breaker for deterministic ordering.

### Validation Rules

- `price > 0`
- `amount > 0`
- `type ∈ {BUY, SELL}`
- `productName` must be non-empty after normalization.

## Entity: TransactionDetail (read model)

### Fields

- All `Transaction` fields.
- `pnl` (decimal, optional): present only for SELL, calculated via weighted average cost at sale time.

## Entity: ProductLedgerState (derived, internal)

### Fields

- `productName`
- `stock` (integer)
- `inventoryCost` (decimal): cumulative remaining inventory value.
- `averageCost` (decimal): `inventoryCost / stock` when `stock > 0`, else `0`.
- `latestMonthBuyAmount` (integer)
- `latestMonthSalesAmount` (integer)
- `latestMonthProfit` (decimal)

### State Transitions

1. **BUY transition**
   - `stock += amount`
   - `inventoryCost += price * amount`
   - `averageCost = inventoryCost / stock`
2. **SELL transition**
   - Validate `stock >= amount`; otherwise transition is invalid.
   - `revenue = price * amount`
   - `costOfGoods = averageCost * amount`
   - `pnl = revenue - costOfGoods`
   - `stock -= amount`
   - `inventoryCost -= costOfGoods`
   - Recompute `averageCost` when stock remains.

## Entity: ProductSummary (read model)

### Fields

- `transactions: TransactionDetail[]`
- `currentStock: number`
- `latestMonthSalesAmount: number`
- `latestMonthBuyAmount: number`
- `latestMonthProfit: number`

## Relationships

- One `Product` conceptually maps to many `Transaction` rows via `productName`.
- `ProductSummary` is a projection of ordered `Transaction` history for a single product.
- Updating/deleting one `Transaction` may alter every downstream `TransactionDetail.pnl` for that product.
