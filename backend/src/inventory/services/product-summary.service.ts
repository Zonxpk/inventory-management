import { ProductSummary, Transaction } from "../entities/transaction.types.js";
import { LedgerRecomputeService } from "./ledger-recompute.service.js";

export class ProductSummaryService {
  constructor(private readonly recomputeService: LedgerRecomputeService) {}

  public build(
    productName: string,
    transactions: Transaction[],
  ): ProductSummary {
    return this.recomputeService.recomputeProduct(productName, transactions);
  }
}
