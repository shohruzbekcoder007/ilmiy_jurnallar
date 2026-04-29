import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, total, limit, onPage }) {
  const pages = Math.max(1, Math.ceil((total || 0) / (limit || 10)));
  if (pages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-gray-500">{page} / {pages}</div>
      <div className="flex gap-1">
        <button
          className="btn-outline"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          className="btn-outline"
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
