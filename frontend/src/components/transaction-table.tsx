import { TransactionDetail } from '../lib/inventory-api';
import { TransactionRowActions } from './transaction-row-actions';

interface Props {
  transactions: TransactionDetail[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, onEdit, onDelete }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th>Price</th>
          <th>Amount</th>
          <th>Date</th>
          <th>PNL</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td>{transaction.id}</td>
            <td>{transaction.type}</td>
            <td>{transaction.price}</td>
            <td>{transaction.amount}</td>
            <td>{new Date(transaction.at).toLocaleString()}</td>
            <td>{transaction.pnl ?? '-'}</td>
            <td>
              <TransactionRowActions transactionId={transaction.id} onEdit={onEdit} onDelete={onDelete} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
