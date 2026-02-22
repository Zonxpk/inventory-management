import { expect, test } from "@playwright/test";
import {
  API_BASE_URL,
  clearState,
  createTransaction,
  getSummary,
} from "../helpers/api-client";

test.describe("Inventory API assignment cases", () => {
  test.beforeEach(async ({ request }) => {
    await clearState(request);
  });

  test("CRUD flow: create/get/update/delete transaction", async ({
    request,
  }) => {
    const created = await createTransaction(request, {
      productName: "CaseCrud",
      type: "BUY",
      price: 10,
      amount: 5,
      at: "2026-01-01T08:00:00.000Z",
    });

    const getResponse = await request.get(
      `${API_BASE_URL}/transactions/${created.id}`,
    );
    expect(getResponse.ok()).toBeTruthy();
    const loaded = await getResponse.json();
    expect(loaded.id).toBe(created.id);
    expect(loaded.productName).toBe("CaseCrud");

    const updateResponse = await request.patch(
      `${API_BASE_URL}/transactions/${created.id}`,
      {
        data: { amount: 6, price: 12 },
      },
    );
    expect(updateResponse.ok()).toBeTruthy();
    const updated = await updateResponse.json();
    expect(updated.amount).toBe(6);
    expect(updated.price).toBe(12);

    const deleteResponse = await request.delete(
      `${API_BASE_URL}/transactions/${created.id}`,
    );
    expect(deleteResponse.ok()).toBeTruthy();

    const getAfterDeleteResponse = await request.get(
      `${API_BASE_URL}/transactions/${created.id}`,
    );
    expect(getAfterDeleteResponse.status()).toBe(404);
  });

  test("rejects invalid stock state (selling more than available)", async ({
    request,
  }) => {
    await createTransaction(request, {
      productName: "CaseInvalidStock",
      type: "BUY",
      price: 10,
      amount: 1,
      at: "2026-01-01T08:00:00.000Z",
    });

    const invalidSellResponse = await request.post(
      `${API_BASE_URL}/transactions`,
      {
        data: {
          productName: "CaseInvalidStock",
          type: "SELL",
          price: 20,
          amount: 2,
          at: "2026-01-02T08:00:00.000Z",
        },
      },
    );

    expect(invalidSellResponse.status()).toBe(400);
    const errorBody = await invalidSellResponse.json();
    expect(JSON.stringify(errorBody)).toContain("stock");
  });

  test("realized P/L average-cost calculation case 1", async ({ request }) => {
    await createTransaction(request, {
      productName: "Case1",
      type: "BUY",
      price: 10,
      amount: 100,
      at: "2026-01-01T08:00:00.000Z",
    });
    await createTransaction(request, {
      productName: "Case1",
      type: "BUY",
      price: 12,
      amount: 50,
      at: "2026-01-02T08:00:00.000Z",
    });
    const sell = await createTransaction(request, {
      productName: "Case1",
      type: "SELL",
      price: 15,
      amount: 80,
      at: "2026-01-03T08:00:00.000Z",
    });

    expect(Number(sell.pnl?.toFixed(2))).toBe(346.4);

    const summary = await getSummary(request, "Case1");
    expect(summary.currentStock).toBe(70);
    expect(summary.latestMonthBuyAmount).toBe(150);
    expect(summary.latestMonthSalesAmount).toBe(80);
    expect(Number(summary.latestMonthProfit.toFixed(2))).toBe(346.4);
  });

  test("historical edit triggers recompute (case 2 style)", async ({
    request,
  }) => {
    const buy1 = await createTransaction(request, {
      productName: "Case2",
      type: "BUY",
      price: 10,
      amount: 1,
      at: "2026-01-01T08:00:00.000Z",
    });
    await createTransaction(request, {
      productName: "Case2",
      type: "BUY",
      price: 20,
      amount: 1,
      at: "2026-01-02T08:00:00.000Z",
    });
    const sell1 = await createTransaction(request, {
      productName: "Case2",
      type: "SELL",
      price: 20,
      amount: 1,
      at: "2026-01-03T08:00:00.000Z",
    });
    await createTransaction(request, {
      productName: "Case2",
      type: "BUY",
      price: 25,
      amount: 1,
      at: "2026-01-04T08:00:00.000Z",
    });
    const sell2 = await createTransaction(request, {
      productName: "Case2",
      type: "SELL",
      price: 20,
      amount: 1,
      at: "2026-01-05T08:00:00.000Z",
    });

    expect(Number(sell1.pnl?.toFixed(2))).toBe(5);
    expect(Number(sell2.pnl?.toFixed(2))).toBe(0);

    const patchResponse = await request.patch(
      `${API_BASE_URL}/transactions/${buy1.id}`,
      {
        data: { price: 5 },
      },
    );
    expect(patchResponse.ok()).toBeTruthy();

    const summaryAfter = await getSummary(request, "Case2");
    const sells = summaryAfter.transactions.filter(
      (transaction) => transaction.type === "SELL",
    );

    expect(sells).toHaveLength(2);
    expect(Number((sells[0].pnl ?? 0).toFixed(2))).toBe(7.5);
    expect(Number((sells[1].pnl ?? 0).toFixed(2))).toBe(1.25);
  });
});
