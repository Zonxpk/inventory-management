import { Injectable } from "@nestjs/common";
import {
  CreateTransactionDto,
  ProductSummary,
  Transaction,
  TransactionDetail,
  UpdateTransactionDto,
} from "./entities/transaction.types.js";
import {
  InventoryNotFoundError,
  InventoryValidationError,
} from "./errors/inventory.errors.js";
import { InventoryState } from "./inventory.state.js";
import { ProductSummaryService } from "./services/product-summary.service.js";

@Injectable()
export class InventoryService {
  constructor(
    private readonly state: InventoryState,
    private readonly summaryService: ProductSummaryService,
  ) {}

  public clear(): void {
    this.state.clear();
  }

  public addTransaction(dto: CreateTransactionDto): TransactionDetail {
    this.validateCreateDto(dto);
    const normalizedProductName = this.normalizeProductName(dto.productName);
    const transaction: Transaction = {
      id: this.state.nextId(),
      productName: normalizedProductName,
      type: dto.type,
      price: dto.price,
      amount: dto.amount,
      at: new Date(dto.at),
      sequence: this.state.nextSequence(),
    };

    this.state.set(transaction);

    try {
      const summary = this.getProductSummary(normalizedProductName);
      return summary.transactions.find((item) => item.id === transaction.id)!;
    } catch (error) {
      this.state.delete(transaction.id);
      throw error;
    }
  }

  public getTransaction(id: string): TransactionDetail {
    const transaction = this.state.get(id);
    if (!transaction) {
      throw new InventoryNotFoundError(`Transaction ${id} not found`);
    }
    const summary = this.getProductSummary(transaction.productName);
    return summary.transactions.find((item) => item.id === id)!;
  }

  public updateTransaction(
    id: string,
    dto: UpdateTransactionDto,
  ): TransactionDetail {
    const existing = this.state.get(id);
    if (!existing) {
      throw new InventoryNotFoundError(`Transaction ${id} not found`);
    }

    this.validateUpdateDto(dto);

    const updated: Transaction = {
      ...existing,
      productName: dto.productName
        ? this.normalizeProductName(dto.productName)
        : existing.productName,
      type: dto.type ?? existing.type,
      price: dto.price ?? existing.price,
      amount: dto.amount ?? existing.amount,
      at: dto.at ? new Date(dto.at) : existing.at,
    };

    this.state.set(updated);

    try {
      this.getProductSummary(existing.productName);
      if (updated.productName !== existing.productName) {
        this.getProductSummary(updated.productName);
      }
      return this.getTransaction(id);
    } catch (error) {
      this.state.set(existing);
      throw error;
    }
  }

  public deleteTransaction(id: string): void {
    const existing = this.state.get(id);
    if (!existing) {
      throw new InventoryNotFoundError(`Transaction ${id} not found`);
    }

    this.state.delete(id);

    try {
      this.getProductSummary(existing.productName);
    } catch (error) {
      this.state.set(existing);
      throw error;
    }
  }

  public getProductSummary(productName: string): ProductSummary {
    const normalizedProductName = this.normalizeProductName(productName);
    const transactions = this.state.byProduct(normalizedProductName);
    return this.summaryService.build(normalizedProductName, transactions);
  }

  private validateCreateDto(dto: CreateTransactionDto): void {
    if (!dto.productName?.trim()) {
      throw new InventoryValidationError("productName is required");
    }
    if (dto.amount <= 0) {
      throw new InventoryValidationError("amount must be greater than zero");
    }
    if (dto.price <= 0) {
      throw new InventoryValidationError("price must be greater than zero");
    }
    if (!dto.at || Number.isNaN(new Date(dto.at).getTime())) {
      throw new InventoryValidationError("at must be a valid date");
    }
  }

  private validateUpdateDto(dto: UpdateTransactionDto): void {
    if (dto.productName !== undefined && !dto.productName.trim()) {
      throw new InventoryValidationError("productName cannot be empty");
    }
    if (dto.amount !== undefined && dto.amount <= 0) {
      throw new InventoryValidationError("amount must be greater than zero");
    }
    if (dto.price !== undefined && dto.price <= 0) {
      throw new InventoryValidationError("price must be greater than zero");
    }
    if (dto.at !== undefined && Number.isNaN(new Date(dto.at).getTime())) {
      throw new InventoryValidationError("at must be a valid date");
    }
  }

  private normalizeProductName(value: string): string {
    return value.trim();
  }
}
