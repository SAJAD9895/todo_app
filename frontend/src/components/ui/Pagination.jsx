import clsx from 'clsx';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of{' '}
        <span className="font-medium">{total}</span> results
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!pagination.hasPrev}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {page > delta + 1 && (
          <>
            <PageButton n={1} current={page} onClick={onPageChange} />
            {page > delta + 2 && <span className="px-2 text-gray-400">...</span>}
          </>
        )}

        {pages.map((n) => (
          <PageButton key={n} n={n} current={page} onClick={onPageChange} />
        ))}

        {page < totalPages - delta && (
          <>
            {page < totalPages - delta - 1 && <span className="px-2 text-gray-400">...</span>}
            <PageButton n={totalPages} current={page} onClick={onPageChange} />
          </>
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!pagination.hasNext}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function PageButton({ n, current, onClick }) {
  return (
    <button
      onClick={() => onClick(n)}
      className={clsx(
        'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
        n === current
          ? 'bg-primary-600 text-white'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
    >
      {n}
    </button>
  );
}
