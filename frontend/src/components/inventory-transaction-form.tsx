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
    <form onSubmit={handleSubmit}>
      <h2>Add Transaction</h2>
      <input value={productName} onChange={(event) => setProductName(event.target.value)} placeholder="Product" required />
      <select value={type} onChange={(event) => setType(event.target.value as TransactionType)}>
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>
      <input type="number" step="0.01" value={price} onChange={(event) => setPrice(Number(event.target.value))} min={0.01} required />
      <input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} min={1} required />
      <input type="datetime-local" value={at} onChange={(event) => setAt(event.target.value)} required />
      <button type="submit">Save</button>
      {error ? <p>{error}</p> : null}
    </form>
  );
}
