import { expect, test } from "@playwright/test";
import { clearState } from "../helpers/api-client";

async function createTransactionViaUI(
  page: import("@playwright/test").Page,
  payload: {
    productName: string;
    type: "BUY" | "SELL";
    price: string;
    amount: string;
    at: string;
  },
) {
  await page.getByTestId("tx-product").fill(payload.productName);
  await page.getByTestId("tx-type").selectOption(payload.type);
  await page.getByTestId("tx-price").fill(payload.price);
  await page.getByTestId("tx-amount").fill(payload.amount);
  await page.getByTestId("tx-at").fill(payload.at);
  await page.getByTestId("save-transaction").click();
}

test.describe("Inventory UI assignment cases", () => {
  test.beforeEach(async ({ request, page }) => {
    await clearState(request);
    await page.goto("/inventory");
  });

  test("create and load product summary from UI", async ({ page }) => {
    await createTransactionViaUI(page, {
      productName: "UiCaseA",
      type: "BUY",
      price: "10",
      amount: "100",
      at: "2026-01-01T08:00",
    });
    await createTransactionViaUI(page, {
      productName: "UiCaseA",
      type: "BUY",
      price: "12",
      amount: "50",
      at: "2026-01-02T08:00",
    });
    await createTransactionViaUI(page, {
      productName: "UiCaseA",
      type: "SELL",
      price: "15",
      amount: "80",
      at: "2026-01-03T08:00",
    });

    await page.getByTestId("summary-product-input").fill("UiCaseA");
    await page.getByTestId("get-summary-button").click();

    await expect(page.getByTestId("summary-current-stock")).toHaveText("70");
    await expect(page.getByTestId("summary-latest-buy")).toHaveText("150");
    await expect(page.getByTestId("summary-latest-sales")).toHaveText("80");
    await expect(page.getByTestId("summary-latest-profit")).toHaveText("346.4");
    await expect(page.getByTestId("transactions-table")).toBeVisible();
  });

  test("load transaction by id and run edit/delete actions", async ({
    page,
  }) => {
    await createTransactionViaUI(page, {
      productName: "UiCaseCrud",
      type: "BUY",
      price: "10",
      amount: "2",
      at: "2026-01-01T08:00",
    });

    await page.getByTestId("summary-product-input").fill("UiCaseCrud");
    await page.getByTestId("get-summary-button").click();

    const firstIdCell = page
      .locator('[data-testid^="transaction-id-"]')
      .first();
    const transactionId = (await firstIdCell.textContent())?.trim();
    expect(transactionId).toBeTruthy();

    await page.getByTestId("load-transaction-id").fill(transactionId!);
    await page.getByTestId("load-details-button").click();

    const editButton = page.getByTestId(`transaction-edit-${transactionId}`);
    await editButton.click();

    await expect(page.getByTestId("summary-current-stock")).toHaveText("1");

    const deleteButton = page.getByTestId(
      `transaction-delete-${transactionId}`,
    );
    await deleteButton.click();

    await page.getByTestId("get-summary-button").click();
    await expect(page.getByTestId("transactions-empty")).toBeVisible();
  });

  test("show validation error for invalid stock transition in UI", async ({
    page,
  }) => {
    await createTransactionViaUI(page, {
      productName: "UiInvalid",
      type: "BUY",
      price: "10",
      amount: "1",
      at: "2026-01-01T08:00",
    });

    await createTransactionViaUI(page, {
      productName: "UiInvalid",
      type: "SELL",
      price: "20",
      amount: "2",
      at: "2026-01-02T08:00",
    });

    await expect(page.getByTestId("transaction-form-error")).toContainText(
      "stock",
    );
  });
});
