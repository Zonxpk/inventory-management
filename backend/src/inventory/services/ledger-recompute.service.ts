import {
  ProductLedgerState,
  ProductSummary,
  Transaction,
  TransactionDetail,
} from "../entities/transaction.types.js";
import { InventoryInvariantError } from "../errors/inventory.errors.js";
import { round, safeDivide, safeMultiply } from "../utils/money.js";
import { sortTransactionsByTimeline } from "../utils/timeline-sort.js";

export class LedgerRecomputeService {
  public recomputeProduct(
    productName: string,
    transactions: Transaction[],
  ): ProductSummary {
    if (transactions.length === 0) {
      return {
        transactions: [],
        currentStock: 0,
        latestMonthBuyAmount: 0,
        latestMonthSalesAmount: 0,
        latestMonthProfit: 0,
      };
    }

    const ordered = sortTransactionsByTimeline(transactions);
    let stock = 0;
    let inventoryCost = 0;
    let averageCost = 0;

    const details: TransactionDetail[] = [];
    const latestMonth = this.toMonthKey(ordered[ordered.length - 1].at);
    let latestMonthBuyAmount = 0;
    let latestMonthSalesAmount = 0;
    let latestMonthProfit = 0;

    for (const transaction of ordered) {
      const monthKey = this.toMonthKey(transaction.at);

      if (transaction.type === "BUY") {
        stock += transaction.amount;
        inventoryCost = round(
          inventoryCost + safeMultiply(transaction.price, transaction.amount),
          6,
        );
        averageCost = round(safeDivide(inventoryCost, stock), 2);
        details.push(this.toDetail(transaction));

        if (monthKey === latestMonth) {
          latestMonthBuyAmount += transaction.amount;
        }

        continue;
      }

      if (stock < transaction.amount) {
        throw new InventoryInvariantError(
          `Transaction ${transaction.id} would create negative stock for product ${productName}`,
        );
      }

      const roundedAverageCost = round(averageCost, 2);
      const revenue = safeMultiply(transaction.price, transaction.amount);
      const costOfGoods = safeMultiply(roundedAverageCost, transaction.amount);
      const pnl = round(revenue - costOfGoods, 2);

      stock -= transaction.amount;
      inventoryCost = round(inventoryCost - costOfGoods, 6);
      if (stock === 0) {
        inventoryCost = 0;
        averageCost = 0;
      } else {
        averageCost = round(safeDivide(inventoryCost, stock), 2);
      }

      details.push(this.toDetail(transaction, pnl));

      if (monthKey === latestMonth) {
        latestMonthSalesAmount += transaction.amount;
        latestMonthProfit = round(latestMonthProfit + pnl, 2);
      }
    }

    const finalState: ProductLedgerState = {
      productName,
      stock,
      inventoryCost,
      averageCost,
      latestMonthBuyAmount,
      latestMonthSalesAmount,
      latestMonthProfit,
    };

    return {
      transactions: details,
      currentStock: finalState.stock,
      latestMonthBuyAmount: finalState.latestMonthBuyAmount,
      latestMonthSalesAmount: finalState.latestMonthSalesAmount,
      latestMonthProfit: finalState.latestMonthProfit,
    };
  }

  private toMonthKey(at: Date): string {
    return `${at.getUTCFullYear()}-${String(at.getUTCMonth() + 1).padStart(2, "0")}`;
  }

  private toDetail(transaction: Transaction, pnl?: number): TransactionDetail {
    return {
      id: transaction.id,
      productName: transaction.productName,
      type: transaction.type,
      price: transaction.price,
      amount: transaction.amount,
      at: transaction.at,
      ...(pnl !== undefined ? { pnl } : {}),
    };
  }
}
