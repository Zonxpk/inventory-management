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

describe("PATCH and DELETE /transactions/{id}", () => {
  it("updates transaction and recomputes summary", () => {
    const service = createService();
    const buy = service.addTransaction({
      productName: "A",
      type: "BUY",
      price: 10,
      amount: 3,
      at: new Date("2026-01-01T00:00:00Z"),
    });

    service.updateTransaction(buy.id, { amount: 5 });
    expect(service.getProductSummary("A").currentStock).toBe(5);
  });

  it("deletes transaction and recomputes summary", () => {
    const service = createService();
    const buy = service.addTransaction({
      productName: "A",
      type: "BUY",
      price: 10,
      amount: 3,
      at: new Date("2026-01-01T00:00:00Z"),
    });

    service.deleteTransaction(buy.id);
    expect(service.getProductSummary("A").currentStock).toBe(0);
  });
});
