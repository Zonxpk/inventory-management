import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadCsvRows } from "../helpers/csv-scenario-runner.js";
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

describe("US1 CSV scenarios", () => {
  it("processes valid transactions csv", () => {
    const baseDir = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.resolve(
      baseDir,
      "..",
      "..",
      "..",
      "tests",
      "csv",
      "transactions-valid.csv",
    );
    const rows = loadCsvRows(filePath);
    const service = createService();

    for (const row of rows) {
      service.addTransaction({
        productName: row.productName!,
        type: row.type!,
        price: row.price!,
        amount: row.amount!,
        at: new Date(row.at!),
      });
    }

    const summary = service.getProductSummary("Widget A");
    expect(summary.currentStock).toBe(60);
  });

  it("rejects invalid sell from csv", () => {
    const baseDir = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.resolve(
      baseDir,
      "..",
      "..",
      "..",
      "tests",
      "csv",
      "transactions-invalid.csv",
    );
    const rows = loadCsvRows(filePath);
    const service = createService();

    expect(() => {
      for (const row of rows) {
        service.addTransaction({
          productName: row.productName!,
          type: row.type!,
          price: row.price!,
          amount: row.amount!,
          at: new Date(row.at!),
        });
      }
    }).toThrow();
  });
});
