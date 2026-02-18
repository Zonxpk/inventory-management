import { Transaction } from "../entities/transaction.types.js";

export function sortTransactionsByTimeline(
  transactions: Transaction[],
): Transaction[] {
  return [...transactions].sort((left, right) => {
    const byDate = left.at.getTime() - right.at.getTime();
    if (byDate !== 0) {
      return byDate;
    }
    const bySequence = left.sequence - right.sequence;
    if (bySequence !== 0) {
      return bySequence;
    }
    return left.id.localeCompare(right.id);
  });
}
