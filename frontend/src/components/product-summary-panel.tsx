import { ProductSummary } from '../lib/inventory-api';

interface Props {
  summary: ProductSummary | null;
}

export function ProductSummaryPanel({ summary }: Props) {
  if (!summary) {
    return <p>No summary loaded.</p>;
  }

  return (
    <section>
      <h2>Product Summary</h2>
      <p>Current Stock: {summary.currentStock}</p>
      <p>Latest Month Buy Amount: {summary.latestMonthBuyAmount}</p>
      <p>Latest Month Sales Amount: {summary.latestMonthSalesAmount}</p>
      <p>Latest Month Profit: {summary.latestMonthProfit}</p>
    </section>
  );
}
