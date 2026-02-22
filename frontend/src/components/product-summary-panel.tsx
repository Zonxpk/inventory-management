import { ProductSummary } from "../lib/inventory-api";

interface Props {
  summary: ProductSummary | null;
}

export function ProductSummaryPanel({ summary }: Props) {
  if (!summary) {
    return (
      <p
        data-testid="summary-empty"
        className="rounded-2xl border border-[rgba(255,255,255,0.85)] bg-[rgba(255,255,255,0.82)] p-4 text-[#4c1d95] shadow-[0_10px_30px_rgba(124,58,237,0.12)] backdrop-blur-[14px]"
      >
        No summary loaded yet. Search a product to see metrics.
      </p>
    );
  }

  return (
    <section
      data-testid="summary-panel"
      className="rounded-2xl border border-[rgba(255,255,255,0.85)] bg-[rgba(255,255,255,0.82)] p-4 text-[#4c1d95] shadow-[0_10px_30px_rgba(124,58,237,0.12)] backdrop-blur-[14px]"
    >
      <h2 className="mb-4 text-[1.05rem]">Product Summary</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
        <article className="rounded-xl border border-violet-100 bg-violet-50 p-3">
          <p className="m-0 text-xs text-violet-700">Current Stock</p>
          <p
            data-testid="summary-current-stock"
            className="mt-1 text-[1.1rem] font-bold"
          >
            {summary.currentStock}
          </p>
        </article>
        <article className="rounded-xl border border-violet-100 bg-violet-50 p-3">
          <p className="m-0 text-xs text-violet-700">Latest Month Buy</p>
          <p
            data-testid="summary-latest-buy"
            className="mt-1 text-[1.1rem] font-bold"
          >
            {summary.latestMonthBuyAmount}
          </p>
        </article>
        <article className="rounded-xl border border-violet-100 bg-violet-50 p-3">
          <p className="m-0 text-xs text-violet-700">Latest Month Sales</p>
          <p
            data-testid="summary-latest-sales"
            className="mt-1 text-[1.1rem] font-bold"
          >
            {summary.latestMonthSalesAmount}
          </p>
        </article>
        <article className="rounded-xl border border-violet-100 bg-violet-50 p-3">
          <p className="m-0 text-xs text-violet-700">Latest Month Profit</p>
          <p
            data-testid="summary-latest-profit"
            className="mt-1 text-[1.1rem] font-bold"
          >
            {summary.latestMonthProfit}
          </p>
        </article>
      </div>
    </section>
  );
}
