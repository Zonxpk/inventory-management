export type TransactionType = "BUY" | "SELL";

export interface CreateTransactionDto {
  productName: string;
  type: TransactionType;
  price: number;
  amount: number;
  at: Date;
}

export interface UpdateTransactionDto {
  productName?: string;
  type?: TransactionType;
  price?: number;
  amount?: number;
  at?: Date;
}

export interface Transaction {
  id: string;
  productName: string;
  type: TransactionType;
  price: number;
  amount: number;
  at: Date;
  sequence: number;
}

export interface TransactionDetail {
  id: string;
  productName: string;
  type: TransactionType;
  price: number;
  amount: number;
  at: Date;
  pnl?: number;
}

export interface ProductSummary {
  transactions: TransactionDetail[];
  currentStock: number;
  latestMonthSalesAmount: number;
  latestMonthBuyAmount: number;
  latestMonthProfit: number;
}

export interface ProductLedgerState {
  productName: string;
  stock: number;
  inventoryCost: number;
  averageCost: number;
  latestMonthSalesAmount: number;
  latestMonthBuyAmount: number;
  latestMonthProfit: number;
}
