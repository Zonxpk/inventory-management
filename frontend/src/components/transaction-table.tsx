import { TransactionDetail } from '../lib/inventory-api';
import { TransactionRowActions } from './transaction-row-actions';

interface Props {
  transactions: TransactionDetail[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, onEdit, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <p className="m-0 rounded-xl border border-dashed border-violet-300 bg-violet-50 p-4 text-violet-700">
        No transactions available for this product yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[720px] w-full border-collapse">
        <thead>
        <tr>
          <th className="border-b border-violet-100 px-2.5 py-3 text-left text-xs uppercase tracking-[0.05em] text-violet-700">ID</th>
          <th className="border-b border-violet-100 px-2.5 py-3 text-left text-xs uppercase tracking-[0.05em] text-violet-700">Type</th>
          <th className="border-b border-violet-100 px-2.5 py-3 text-left text-xs uppercase tracking-[0.05em] text-violet-700">Price</th>
          <th className="border-b border-violet-100 px-2.5 py-3 text-left text-xs uppercase tracking-[0.05em] text-violet-700">Amount</th>
          <th className="border-b border-violet-100 px-2.5 py-3 text-left text-xs uppercase tracking-[0.05em] text-violet-700">Date</th>
          <th className="border-b border-violet-100 px-2.5 py-3 text-left text-xs uppercase tracking-[0.05em] text-violet-700">PNL</th>
          <th className="border-b border-violet-100 px-2.5 py-3 text-left text-xs uppercase tracking-[0.05em] text-violet-700">Actions</th>
        </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="text-[#4c1d95] hover:bg-[rgba(167,139,250,0.12)]">
              <td className="border-b border-violet-100 px-2.5 py-3 font-mono text-[0.82rem]">{transaction.id}</td>
              <td className="border-b border-violet-100 px-2.5 py-3">{transaction.type}</td>
              <td className="border-b border-violet-100 px-2.5 py-3">{transaction.price}</td>
              <td className="border-b border-violet-100 px-2.5 py-3">{transaction.amount}</td>
              <td className="border-b border-violet-100 px-2.5 py-3">{new Date(transaction.at).toLocaleString()}</td>
              <td className="border-b border-violet-100 px-2.5 py-3">{transaction.pnl ?? '-'}</td>
              <td className="border-b border-violet-100 px-2.5 py-3">
                <TransactionRowActions transactionId={transaction.id} onEdit={onEdit} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
