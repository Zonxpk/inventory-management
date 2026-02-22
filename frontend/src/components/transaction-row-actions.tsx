'use client';

interface Props {
  transactionId: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionRowActions({ transactionId, onEdit, onDelete }: Props) {
  return (
    <div className="inline-flex gap-2">
      <button
        type="button"
        className="min-h-8 cursor-pointer rounded-lg border-0 bg-violet-100 px-3 font-semibold text-violet-700 transition-colors duration-200 hover:bg-violet-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        onClick={() => onEdit(transactionId)}
      >
        Edit
      </button>
      <button
        type="button"
        className="min-h-8 cursor-pointer rounded-lg border-0 bg-rose-100 px-3 font-semibold text-rose-700 transition-colors duration-200 hover:bg-rose-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        onClick={() => onDelete(transactionId)}
      >
        Delete
      </button>
    </div>
  );
}
