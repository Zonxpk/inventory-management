import {
  ProductSummary,
  TransactionDetail,
} from "../entities/transaction.types.js";

export interface TransactionDetailResponseDto extends TransactionDetail {}

export interface ProductSummaryResponseDto extends ProductSummary {}
