import { describe, expect, it } from "vitest";
import { InventoryService } from "../../src/inventory/inventory.service.js";
import { InventoryState } from "../../src/inventory/inventory.state.js";
import { ProductSummaryService } from "../../src/inventory/services/product-summary.service.js";
import { LedgerRecomputeService } from "../../src/inventory/services/ledger-recompute.service.js";

function createService(): InventoryService {
  const recompute = new LedgerRecomputeService();
  return new InventoryService(
    new InventoryState(),
    new ProductSummaryService(recompute),
  );
}

describe("POST /transactions and GET /transactions/{id}", () => {
  it("creates BUY transaction and gets it by id", () => {
    const service = createService();
    const created = service.addTransaction({
      productName: "A",
      type: "BUY",
      price: 10,
      amount: 2,
      at: new Date("2026-01-01T00:00:00Z"),
    });

    const loaded = service.getTransaction(created.id);
    expect(loaded.productName).toBe("A");
    expect(loaded.type).toBe("BUY");
  });

  it("rejects SELL that would make stock negative", () => {
    const service = createService();
    expect(() =>
      service.addTransaction({
        productName: "A",
        type: "SELL",
        price: 12,
        amount: 1,
        at: new Date("2026-01-01T00:00:00Z"),
      }),
    ).toThrow();
  });
});
