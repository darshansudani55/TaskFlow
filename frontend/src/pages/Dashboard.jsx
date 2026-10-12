import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StatisticsCard from '../components/StatisticsCard';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { fetchStats } from '../api/tasks';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchStats();
      setStats(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <main className="page-content" id="dashboard-page">
      {/* Header */}
      <header className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">Welcome back 👋</h1>
            <p className="page-subtitle">
              Here's an overview of your tasks today, {new Date().toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })}.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/tasks/new')}
            id="dashboard-add-task-btn"
            aria-label="Add a new task"
          >
            ➕ Add Task
          </button>
        </div>
      </header>

      {loading && <LoadingIndicator message="Loading dashboard…" />}

      {error && !loading && (
        <ErrorMessage
          title="Failed to load dashboard"
          message={error}
          onRetry={loadStats}
        />
      )}

      {stats && !loading && (
        <>
          {/* Stat Cards */}
          <section aria-label="Task statistics">
            <div className="stats-grid">
              <StatisticsCard
                label="Total Tasks"
                value={stats.total}
                icon="📋"
                colorClass="blue"
                sub="All tasks created"
              />
              <StatisticsCard
                label="Completed"
                value={stats.completed}
                icon="✅"
                colorClass="green"
                sub={`${stats.completionRate}% completion rate`}
              />
              <StatisticsCard
                label="Pending"
                value={stats.pending}
                icon="⏳"
                colorClass="yellow"
                sub="Tasks in progress"
              />
              <StatisticsCard
                label="Overdue"
                value={stats.overdue}
                icon="⚠️"
                colorClass="red"
                sub="Past due date"
              />
            </div>
          </section>

          {/* Progress Bar */}
          {stats.total > 0 && (
            <section className="progress-section" aria-label="Task completion progress">
              <div className="progress-header">
                <span className="progress-label">Overall Progress</span>
                <span className="progress-pct">{stats.completionRate}% Complete</span>
              </div>
              <div className="progress-bar-track" role="progressbar" aria-valuenow={stats.completionRate} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </section>
          )}

          {/* Recent Tasks */}
          <section aria-label="Recent tasks">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Recent Tasks</h2>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate('/tasks')}
                  id="dashboard-view-all-btn"
                >
                  View All →
                </button>
              </div>
              <div className="card-body">
                {stats.recentTasks.length === 0 ? (
                  <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                    <div className="empty-state-icon">📋</div>
                    <p className="empty-state-title">No tasks yet</p>
                    <p className="empty-state-description">
                      Create your first task to get started!
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/tasks/new')}
                      id="empty-add-btn"
                    >
                      ➕ Create Task
                    </button>
                  </div>
                ) : (
                  <div>
                    {stats.recentTasks.map((task) => (
                      <div
                        key={task._id}
                        className="recent-task-item"
                        onClick={() => navigate(`/tasks/${task._id}`)}
                        style={{ cursor: 'pointer' }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && navigate(`/tasks/${task._id}`)}
                        aria-label={`View task: ${task.title}`}
                      >
                        <div
                          className={`recent-task-dot recent-task-dot-${task.status.toLowerCase()}`}
                          aria-hidden="true"
                        />
                        <span className={`recent-task-title${task.status === 'Completed' ? ' completed' : ''}`}>
                          {task.title}
                        </span>
                        <PriorityBadge priority={task.priority} />
                        <StatusBadge status={task.status} />
                        {task.dueDate && (
                          <span className="task-card-date" style={{ fontSize: '0.75rem' }}>
                            📅 {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
