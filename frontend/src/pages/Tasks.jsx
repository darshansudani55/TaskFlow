import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterControls from '../components/FilterControls';
import TaskList from '../components/TaskList';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import { fetchTasks } from '../api/tasks';

const INITIAL_FILTERS = {
  search: '',
  status: '',
  priority: '',
  sort: 'newest',
};

export default function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchTimer = useRef(null);

  const loadTasks = useCallback(async (currentFilters, currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTasks({ ...currentFilters, page: currentPage, limit: 20 });
      setTasks(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadTasks(filters, page);
  }, []);

  // Debounce search input, immediate for other filters
  const handleFilterChange = useCallback((patch) => {
    const newFilters = { ...filters, ...patch };
    setFilters(newFilters);
    setPage(1);

    if ('search' in patch) {
      // Debounce search
      clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => loadTasks(newFilters, 1), 400);
    } else {
      loadTasks(newFilters, 1);
    }
  }, [filters, loadTasks]);

  const handleReset = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
    loadTasks(INITIAL_FILTERS, 1);
  }, [loadTasks]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    loadTasks(filters, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, loadTasks]);

  return (
    <main className="page-content" id="tasks-page">
      {/* Header */}
      <header className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">All Tasks</h1>
            <p className="page-subtitle">
              Manage and track all your tasks in one place.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/tasks/new')}
            id="tasks-add-btn"
            aria-label="Add a new task"
          >
            ➕ Add Task
          </button>
        </div>
      </header>

      {/* Filters */}
      <FilterControls
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Task count summary */}
      {!loading && !error && (
        <div className="task-list-header">
          <p className="task-count" aria-live="polite">
            Showing <strong>{tasks.length}</strong> of <strong>{total}</strong> tasks
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingIndicator message="Loading tasks…" />}

      {/* Error */}
      {error && !loading && (
        <ErrorMessage
          title="Failed to load tasks"
          message={error}
          onRetry={() => loadTasks(filters, page)}
        />
      )}

      {/* Task list */}
      {!loading && !error && (
        <TaskList tasks={tasks} onUpdate={() => loadTasks(filters, page)} />
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <nav className="pagination" aria-label="Task list pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            id="pagination-prev"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`pagination-btn${p === page ? ' active' : ''}`}
              onClick={() => handlePageChange(p)}
              aria-label={`Go to page ${p}`}
              aria-current={p === page ? 'page' : undefined}
              id={`pagination-page-${p}`}
            >
              {p}
            </button>
          ))}
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            id="pagination-next"
          >
            ›
          </button>
        </nav>
      )}
    </main>
  );
}
