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
    <main>
      <h1>Inventory Management</h1>

      <InventoryTransactionForm
        onSubmit={async (payload) => {
          setError(null);
          await createTransaction(payload);
          if (summaryProduct.trim()) {
            await reloadSummary(summaryProduct);
          }
        }}
      />

      <section>
        <h2>Load Transaction</h2>
        <input value={loadedTransactionId} onChange={(event) => setLoadedTransactionId(event.target.value)} placeholder="Transaction ID" />
        <button
          type="button"
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
          Load
        </button>
      </section>

      <section>
        <h2>Summary</h2>
        <input value={summaryProduct} onChange={(event) => setSummaryProduct(event.target.value)} placeholder="Product Name" />
        <button
          type="button"
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
      </section>

      <ProductSummaryPanel summary={summary} />
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

      {error ? <p>{error}</p> : null}
    </main>
  );
}
