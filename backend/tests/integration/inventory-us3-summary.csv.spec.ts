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

describe("US3 summary calculations", () => {
  it("matches sample case from assignment", () => {
    const service = createService();
    service.addTransaction({
      productName: "A",
      type: "BUY",
      price: 10,
      amount: 100,
      at: new Date("2026-01-01T00:00:00Z"),
    });
    service.addTransaction({
      productName: "A",
      type: "BUY",
      price: 12,
      amount: 50,
      at: new Date("2026-01-02T00:00:00Z"),
    });
    const sell = service.addTransaction({
      productName: "A",
      type: "SELL",
      price: 15,
      amount: 80,
      at: new Date("2026-01-03T00:00:00Z"),
    });

    expect(sell.pnl).toBe(346.4);
  });
});
