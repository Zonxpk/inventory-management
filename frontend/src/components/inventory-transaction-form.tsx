'use client';

import { FormEvent, useState } from 'react';
import { TransactionType } from '../lib/inventory-api';

interface Props {
  onSubmit: (payload: {
    productName: string;
    type: TransactionType;
    price: number;
    amount: number;
    at: string;
  }) => Promise<void>;
}

export function InventoryTransactionForm({ onSubmit }: Props) {
  const [productName, setProductName] = useState('');
  const [type, setType] = useState<TransactionType>('BUY');
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(1);
  const [at, setAt] = useState(new Date().toISOString().slice(0, 16));
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await onSubmit({
        productName,
        type,
        price,
        amount,
        at: new Date(at).toISOString(),
      });
    } catch (submitError) {
      setError((submitError as Error).message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[rgba(255,255,255,0.85)] bg-[rgba(255,255,255,0.82)] p-4 shadow-[0_10px_30px_rgba(124,58,237,0.12)] backdrop-blur-[14px]"
    >
      <h2 className="mb-4 text-[1.05rem] text-[#4c1d95]">Add Transaction</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="txProduct" className="text-sm text-violet-700">
            Product
          </label>
          <input
            id="txProduct"
            className="min-h-10 rounded-xl border border-violet-200 bg-[rgba(255,255,255,0.95)] px-3 text-[#4c1d95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            placeholder="Laptop"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="txType" className="text-sm text-violet-700">
            Type
          </label>
          <select
            id="txType"
            className="min-h-10 rounded-xl border border-violet-200 bg-[rgba(255,255,255,0.95)] px-3 text-[#4c1d95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            value={type}
            onChange={(event) => setType(event.target.value as TransactionType)}
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="txPrice" className="text-sm text-violet-700">
            Unit Price
          </label>
          <input
            id="txPrice"
            className="min-h-10 rounded-xl border border-violet-200 bg-[rgba(255,255,255,0.95)] px-3 text-[#4c1d95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            type="number"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            min={0.01}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="txAmount" className="text-sm text-violet-700">
            Amount
          </label>
          <input
            id="txAmount"
            className="min-h-10 rounded-xl border border-violet-200 bg-[rgba(255,255,255,0.95)] px-3 text-[#4c1d95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            type="number"
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            min={1}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="txAt" className="text-sm text-violet-700">
            Date & Time
          </label>
          <input
            id="txAt"
            className="min-h-10 rounded-xl border border-violet-200 bg-[rgba(255,255,255,0.95)] px-3 text-[#4c1d95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            type="datetime-local"
            value={at}
            onChange={(event) => setAt(event.target.value)}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 min-h-10 cursor-pointer rounded-xl border-0 bg-[linear-gradient(90deg,#7c3aed,#a78bfa)] px-4 font-semibold text-white transition duration-200 ease-out hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(124,58,237,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      >
        Save Transaction
      </button>
      {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
    </form>
  );
}
