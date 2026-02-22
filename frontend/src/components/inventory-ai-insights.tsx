import { ProductSummary } from '../lib/inventory-api';

interface Props {
  summary: ProductSummary | null;
  productName: string;
}

function toCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function InventoryAiInsights({ summary, productName }: Props) {
  if (!summary) {
    return (
      <section
        className="rounded-2xl border border-[rgba(255,255,255,0.85)] bg-[rgba(255,255,255,0.82)] p-4 text-[#4c1d95] shadow-[0_10px_30px_rgba(124,58,237,0.12)] backdrop-blur-[14px]"
        aria-live="polite"
      >
        <h2 className="text-[1.05rem]">AI Insights</h2>
        <p className="mt-3 text-violet-700">Load a product summary to generate AI recommendations.</p>
      </section>
    );
  }

  const sellVolume = summary.latestMonthSalesAmount;
  const buyVolume = summary.latestMonthBuyAmount;
  const profit = summary.latestMonthProfit;
  const stock = summary.currentStock;

  const sellTransactions = summary.transactions.filter((transaction) => transaction.type === 'SELL');
  const avgSellPrice =
    sellTransactions.length > 0
      ? sellTransactions.reduce((total, transaction) => total + transaction.price, 0) / sellTransactions.length
      : 0;

  const trend =
    sellVolume > buyVolume * 1.1
      ? 'High demand trend'
      : buyVolume > sellVolume * 1.2
        ? 'Overstock risk trend'
        : 'Stable demand trend';

  const stockRisk = stock <= Math.max(5, Math.ceil(sellVolume * 0.25)) ? 'Medium to high' : 'Low';

  const recommendations: string[] = [];

  if (stockRisk !== 'Low') {
    recommendations.push('Increase replenishment frequency this week to avoid stockout during peak demand.');
  }

  if (profit < 0) {
    recommendations.push('Current monthly profit is negative; evaluate supplier cost or raise price for low-margin SKUs.');
  } else if (profit > 0 && avgSellPrice > 0) {
    recommendations.push(`Maintain pricing near ${toCurrency(avgSellPrice)} and focus promotions on top-selling bundles.`);
  }

  if (trend === 'Overstock risk trend') {
    recommendations.push('Reduce next purchase quantity by 10-15% until demand stabilizes.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Inventory posture is healthy; keep monitoring weekly trend and margin shifts.');
  }

  return (
    <section
      className="rounded-2xl border border-[rgba(255,255,255,0.85)] bg-[rgba(255,255,255,0.82)] p-4 text-[#4c1d95] shadow-[0_10px_30px_rgba(124,58,237,0.12)] backdrop-blur-[14px]"
      aria-live="polite"
    >
      <h2 className="text-[1.05rem]">AI Insights</h2>
      <p className="mb-3 mt-2 text-sm text-violet-700">Auto-generated insights for {productName.trim() || 'selected product'}.</p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
        <article className="rounded-xl border border-orange-100 bg-orange-50 p-3">
          <p className="m-0 text-xs text-orange-700">Demand Signal</p>
          <p className="mt-1 font-bold text-orange-900">{trend}</p>
        </article>
        <article className="rounded-xl border border-orange-100 bg-orange-50 p-3">
          <p className="m-0 text-xs text-orange-700">Stock Risk</p>
          <p className="mt-1 font-bold text-orange-900">{stockRisk}</p>
        </article>
        <article className="rounded-xl border border-orange-100 bg-orange-50 p-3">
          <p className="m-0 text-xs text-orange-700">Avg Sell Price</p>
          <p className="mt-1 font-bold text-orange-900">{avgSellPrice > 0 ? toCurrency(avgSellPrice) : '-'}</p>
        </article>
      </div>

      <ul className="mt-4 grid list-disc gap-1.5 pl-5 text-violet-700">
        {recommendations.map((recommendation) => (
          <li key={recommendation}>{recommendation}</li>
        ))}
      </ul>
    </section>
  );
}
