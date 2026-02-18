'use client';

interface Props {
  transactionId: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionRowActions({ transactionId, onEdit, onDelete }: Props) {
  return (
    <div>
      <button type="button" onClick={() => onEdit(transactionId)}>
        Edit
      </button>
      <button type="button" onClick={() => onDelete(transactionId)}>
        Delete
      </button>
    </div>
  );
}
