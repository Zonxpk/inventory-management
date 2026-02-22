'use client';

import { useMemo, useState } from 'react';
import {
  createTransaction,
  deleteTransaction,
  getProductSummary,
  getTransaction,
  ProductSummary,
  updateTransaction,
} from '../../lib/inventory-api';
import { InventoryTransactionForm } from '../../components/inventory-transaction-form';
import { InventoryAiInsights } from '../../components/inventory-ai-insights';
import { ProductSummaryPanel } from '../../components/product-summary-panel';
import { TransactionTable } from '../../components/transaction-table';

export default function InventoryPage() {
  const [summaryProduct, setSummaryProduct] = useState('');
  const [summary, setSummary] = useState<ProductSummary | null>(null);
  const [loadedTransactionId, setLoadedTransactionId] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function reloadSummary(productName: string) {
    if (!productName.trim()) {
      setSummary(null);
      return;
    }
    const loaded = await getProductSummary(productName.trim());
    setSummary(loaded);
  }

  const transactions = useMemo(() => summary?.transactions ?? [], [summary]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(160deg,#faf5ff_0%,#f6f8ff_45%,#fef7ed_100%)] px-4 pb-12 pt-8 text-[#4c1d95] lg:px-6">
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[rgba(124,58,237,0.28)] blur-[80px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-[rgba(249,115,22,0.2)] blur-[80px]"
        aria-hidden="true"
      />

      <header className="mx-auto mb-4 w-full max-w-[1200px] rounded-2xl border border-[rgba(255,255,255,0.85)] bg-[rgba(255,255,255,0.8)] p-6 shadow-[0_10px_35px_rgba(124,58,237,0.14)] backdrop-blur-[14px] lg:p-7">
        <div>
          <p className="mb-1 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-violet-600">Inventory Intelligence</p>
          <h1 className="m-0 text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.15]">Modern Inventory Management SaaS</h1>
          <p className="mt-2 max-w-[55ch] text-violet-700">Track transactions, monitor stock and use AI-generated insights to act faster.</p>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4" aria-label="Summary Controls">
        <article className="rounded-2xl border border-[rgba(255,255,255,0.85)] bg-[rgba(255,255,255,0.8)] p-4 shadow-[0_10px_35px_rgba(124,58,237,0.14)] backdrop-blur-[14px]">
          <h2 className="mb-3 text-[1.05rem]">Load Transaction</h2>
          <div className="mb-3 flex flex-col gap-1.5">
            <label htmlFor="loadTransactionId" className="text-sm text-violet-700">
              Transaction ID
            </label>
            <input
              id="loadTransactionId"
              className="h-10 rounded-xl border border-violet-200 bg-[rgba(255,255,255,0.95)] px-3 text-[#4c1d95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              value={loadedTransactionId}
              onChange={(event) => setLoadedTransactionId(event.target.value)}
              placeholder="txn-123"
            />
          </div>
          <button
            type="button"
            className="h-10 cursor-pointer rounded-xl border-0 bg-violet-100 px-4 font-semibold text-violet-700 transition duration-200 ease-out hover:-translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            onClick={async () => {
              try {
                setError(null);
                const detail = await getTransaction(loadedTransactionId.trim());
                setSummaryProduct(detail.productName);
                await reloadSummary(detail.productName);
              } catch (requestError) {
                setError((requestError as Error).message);
              }
            }}
          >
            Load Details
          </button>
        </article>

        <article className="rounded-2xl border border-[rgba(255,255,255,0.85)] bg-[rgba(255,255,255,0.8)] p-4 shadow-[0_10px_35px_rgba(124,58,237,0.14)] backdrop-blur-[14px]">
          <h2 className="mb-3 text-[1.05rem]">Product Summary</h2>
          <div className="mb-3 flex flex-col gap-1.5">
            <label htmlFor="summaryProduct" className="text-sm text-violet-700">
              Product Name
            </label>
            <input
              id="summaryProduct"
              className="h-10 rounded-xl border border-violet-200 bg-[rgba(255,255,255,0.95)] px-3 text-[#4c1d95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              value={summaryProduct}
              onChange={(event) => setSummaryProduct(event.target.value)}
              placeholder="Laptop"
            />
          </div>
          <button
            type="button"
            className="h-10 cursor-pointer rounded-xl border-0 bg-violet-600 px-4 font-semibold text-white shadow-[0_10px_24px_rgba(124,58,237,0.28)] transition duration-200 ease-out hover:-translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            onClick={async () => {
              try {
                setError(null);
                await reloadSummary(summaryProduct);
              } catch (requestError) {
                setError((requestError as Error).message);
              }
            }}
          >
            Get Summary
          </button>
        </article>
      </section>

      {error ? (
        <p className="mx-auto mt-4 w-full max-w-[1200px] rounded-xl border border-rose-400 bg-rose-50 px-4 py-3 text-rose-700">{error}</p>
      ) : null}

      <section className="mx-auto my-4 grid w-full max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-4">
        <InventoryTransactionForm
          onSubmit={async (payload) => {
            setError(null);
            await createTransaction(payload);
            if (summaryProduct.trim()) {
              await reloadSummary(summaryProduct);
            }
          }}
        />
        <ProductSummaryPanel summary={summary} />
        <InventoryAiInsights summary={summary} productName={summaryProduct} />
      </section>

      <section className="mx-auto mt-4 w-full max-w-[1200px] rounded-2xl border border-[rgba(255,255,255,0.85)] bg-[rgba(255,255,255,0.8)] p-4 shadow-[0_10px_35px_rgba(124,58,237,0.14)] backdrop-blur-[14px]">
        <TransactionTable
          transactions={transactions}
          onEdit={async (id) => {
            setError(null);
            await updateTransaction(id, { amount: 1 });
            if (summaryProduct.trim()) {
              await reloadSummary(summaryProduct);
            }
          }}
          onDelete={async (id) => {
            setError(null);
            await deleteTransaction(id);
            if (summaryProduct.trim()) {
              await reloadSummary(summaryProduct);
            }
          }}
        />
      </section>
    </main>
  );
}
