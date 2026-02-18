import { readFileSync } from "node:fs";

export interface CsvScenarioRow {
  operation: "ADD" | "UPDATE" | "DELETE" | "GET_SUMMARY";
  id?: string;
  productName?: string;
  type?: "BUY" | "SELL";
  price?: number;
  amount?: number;
  at?: string;
  expectError?: string;
}

export function loadCsvRows(filePath: string): CsvScenarioRow[] {
  const content = readFileSync(filePath, "utf8").trim();
  if (!content) {
    return [];
  }

  const [headerLine, ...dataLines] = content.split(/\r?\n/);
  const headers = headerLine.split(",").map((item) => item.trim());

  return dataLines
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const values = line.split(",").map((item) => item.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] ?? "";
      });

      return {
        operation: (row.operation as CsvScenarioRow["operation"]) ?? "ADD",
        id: row.id || undefined,
        productName: row.productName || undefined,
        type: (row.type as CsvScenarioRow["type"]) || undefined,
        price: row.price ? Number(row.price) : undefined,
        amount: row.amount ? Number(row.amount) : undefined,
        at: row.at || undefined,
        expectError: row.expectError || undefined,
      };
    });
}
