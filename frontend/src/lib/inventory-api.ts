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

const BASE_URL =
  process.env.NEXT_PUBLIC_INVENTORY_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function createTransaction(payload: {
  productName: string;
  type: TransactionType;
  price: number;
  amount: number;
  at: string;
}): Promise<TransactionDetail> {
  return request("/transactions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getTransaction(id: string): Promise<TransactionDetail> {
  return request(`/transactions/${id}`);
}

export function updateTransaction(
  id: string,
  payload: Partial<{
    productName: string;
    type: TransactionType;
    price: number;
    amount: number;
    at: string;
  }>,
): Promise<TransactionDetail> {
  return request(`/transactions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteTransaction(id: string): Promise<void> {
  return request(`/transactions/${id}`, { method: "DELETE" });
}

export function getProductSummary(
  productName: string,
): Promise<ProductSummary> {
  return request(`/products/${encodeURIComponent(productName)}/summary`);
}
