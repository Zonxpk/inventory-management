import { describe, expect, it } from "vitest";
import { InventoryService } from "../../src/inventory/inventory.service.js";
import { InventoryState } from "../../src/inventory/inventory.state.js";
import { ProductSummaryService } from "../../src/inventory/services/product-summary.service.js";
import { LedgerRecomputeService } from "../../src/inventory/services/ledger-recompute.service.js";

function createService(): InventoryService {
  return new InventoryService(
    new InventoryState(),
    new ProductSummaryService(new LedgerRecomputeService()),
  );
}

describe("GET /products/{productName}/summary", () => {
  it("returns summary metrics with realized pnl", () => {
    const service = createService();
    service.addTransaction({
      productName: "A",
      type: "BUY",
      price: 10,
      amount: 2,
      at: new Date("2026-01-01T00:00:00Z"),
    });
    service.addTransaction({
      productName: "A",
      type: "SELL",
      price: 20,
      amount: 1,
      at: new Date("2026-01-02T00:00:00Z"),
    });

    const summary = service.getProductSummary("A");
    expect(summary.currentStock).toBe(1);
    expect(summary.latestMonthProfit).toBe(10);
    expect(summary.transactions.some((item) => item.pnl !== undefined)).toBe(
      true,
    );
  });
});
