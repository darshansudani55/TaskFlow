/**
 * FilterControls — search bar, status/priority filters, and sort selector
 */
export default function FilterControls({ filters, onChange, onReset }) {
  const hasActiveFilters =
    filters.search || filters.status || filters.priority || (filters.sort && filters.sort !== 'newest');

  return (
    <div className="controls-bar">
      {/* Search */}
      <div className="search-wrapper">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          id="task-search-input"
          type="search"
          className="search-input"
          placeholder="Search tasks…"
          value={filters.search || ''}
          onChange={(e) => onChange({ search: e.target.value })}
          aria-label="Search tasks by title or description"
          autoComplete="off"
        />
        {filters.search && (
          <button
            className="search-clear"
            onClick={() => onChange({ search: '' })}
            aria-label="Clear search"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          className="filter-select"
          value={filters.status || ''}
          onChange={(e) => onChange({ status: e.target.value })}
          aria-label="Filter by status"
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="priority-filter">Priority</label>
        <select
          id="priority-filter"
          className="filter-select"
          value={filters.priority || ''}
          onChange={(e) => onChange({ priority: e.target.value })}
          aria-label="Filter by priority"
        >
          <option value="">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Sort */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="sort-select">Sort</label>
        <select
          id="sort-select"
          className="filter-select"
          value={filters.sort || 'newest'}
          onChange={(e) => onChange({ sort: e.target.value })}
          aria-label="Sort tasks"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          id="reset-filters-btn"
          className="btn btn-ghost btn-sm"
          onClick={onReset}
          aria-label="Clear all filters"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}
