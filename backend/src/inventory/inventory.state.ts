import { randomUUID } from "node:crypto";
import { Transaction } from "./entities/transaction.types.js";

export class InventoryState {
  private readonly transactions = new Map<string, Transaction>();
  private sequence = 0;

  public clear(): void {
    this.transactions.clear();
    this.sequence = 0;
  }

  public nextId(): string {
    return randomUUID();
  }

  public nextSequence(): number {
    this.sequence += 1;
    return this.sequence;
  }

  public set(transaction: Transaction): void {
    this.transactions.set(transaction.id, transaction);
  }

  public get(id: string): Transaction | undefined {
    return this.transactions.get(id);
  }

  public delete(id: string): boolean {
    return this.transactions.delete(id);
  }

  public all(): Transaction[] {
    return Array.from(this.transactions.values());
  }

  public byProduct(productName: string): Transaction[] {
    return this.all().filter((item) => item.productName === productName);
  }
}
