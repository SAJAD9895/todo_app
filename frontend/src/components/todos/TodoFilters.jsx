import { useRef, useCallback } from 'react';
import { debounce } from '../../utils/helpers';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, SORT_OPTIONS } from '../../utils/constants';

export default function TodoFilters({ filters, onFilterChange, onReset, hasActive }) {
  const searchRef = useRef(null);

  const debouncedSearch = useCallback(
    debounce((value) => onFilterChange({ search: value }), 400),
    [onFilterChange]
  );

  return (
    <div className="card p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={searchRef}
            type="search"
            placeholder="Search tasks..."
            defaultValue={filters.search}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Status filter */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="input w-full sm:w-40"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Priority filter */}
        <select
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value })}
          className="input w-full sm:w-40"
        >
          <option value="">All Priority</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Category search */}
        <input
          type="text"
          placeholder="Filter by category..."
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="input flex-1"
        />

        {/* Sort */}
        <div className="flex gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            className="input w-44"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button
            onClick={() => onFilterChange({ sortOrder: filters.sortOrder === 'ASC' ? 'DESC' : 'ASC' })}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={`Sort ${filters.sortOrder === 'ASC' ? 'descending' : 'ascending'}`}
          >
            {filters.sortOrder === 'ASC' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            )}
          </button>
        </div>

        {hasActive && (
          <button
            onClick={onReset}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
