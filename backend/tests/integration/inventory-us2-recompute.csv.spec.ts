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

describe("US2 historical recomputation", () => {
  it("recomputes downstream P/L after historical edit", () => {
    const service = createService();
    const buy1 = service.addTransaction({
      productName: "A",
      type: "BUY",
      price: 10,
      amount: 1,
      at: new Date("2026-01-01T00:00:00Z"),
    });
    service.addTransaction({
      productName: "A",
      type: "BUY",
      price: 20,
      amount: 1,
      at: new Date("2026-01-02T00:00:00Z"),
    });
    const sell = service.addTransaction({
      productName: "A",
      type: "SELL",
      price: 20,
      amount: 1,
      at: new Date("2026-01-03T00:00:00Z"),
    });

    expect(sell.pnl).toBe(5);
    service.updateTransaction(buy1.id, { price: 15 });
    const recomputed = service.getTransaction(sell.id);
    expect(recomputed.pnl).toBe(2.5);
  });
});
