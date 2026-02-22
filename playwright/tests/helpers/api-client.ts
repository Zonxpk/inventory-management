import { APIRequestContext, expect } from "@playwright/test";

const backendPort = process.env.PW_BACKEND_PORT ?? "3101";
export const API_BASE_URL = `http://127.0.0.1:${backendPort}`;

export type TransactionType = "BUY" | "SELL";

export interface TransactionDetail {
  id: string;
  productName: string;
  type: TransactionType;
  price: number;
  amount: number;
  at: string;
  pnl?: number;
}

export interface ProductSummary {
  transactions: TransactionDetail[];
  currentStock: number;
  latestMonthSalesAmount: number;
  latestMonthBuyAmount: number;
  latestMonthProfit: number;
}

export async function clearState(request: APIRequestContext): Promise<void> {
  const response = await request.post(`${API_BASE_URL}/admin/clear`);
  expect(response.ok()).toBeTruthy();
}

export async function createTransaction(
  request: APIRequestContext,
  payload: {
    productName: string;
    type: TransactionType;
    price: number;
    amount: number;
    at: string;
  },
): Promise<TransactionDetail> {
  const response = await request.post(`${API_BASE_URL}/transactions`, {
    data: payload,
  });
  expect(response.ok()).toBeTruthy();
  return (await response.json()) as TransactionDetail;
}

export async function getSummary(
  request: APIRequestContext,
  productName: string,
): Promise<ProductSummary> {
  const response = await request.get(
    `${API_BASE_URL}/products/${encodeURIComponent(productName)}/summary`,
  );
  expect(response.ok()).toBeTruthy();
  return (await response.json()) as ProductSummary;
}
