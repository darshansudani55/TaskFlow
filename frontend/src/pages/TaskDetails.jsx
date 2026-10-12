import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ConfirmationDialog from '../components/ConfirmationDialog';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import { fetchTaskById, deleteTask, updateTaskStatus } from '../api/tasks';
import { useToast } from '../components/ToastNotification';

function formatDate(dateStr) {
  if (!dateStr) return 'Not set';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function isOverdue(dateStr, status) {
  if (!dateStr || status === 'Completed') return false;
  return new Date(dateStr) < new Date();
}

export default function TaskDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const loadTask = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTaskById(id);
      setTask(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!task || statusLoading) return;
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    setStatusLoading(true);
    try {
      const res = await updateTaskStatus(id, newStatus);
      setTask(res.data);
      toast.success(`Task marked as ${newStatus}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteTask(id);
      toast.success('Task deleted successfully');
      navigate('/tasks');
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
      setDeleteLoading(false);
    }
  };

  const overdue = task ? isOverdue(task.dueDate, task.status) : false;

  return (
    <main className="page-content" id="task-details-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <button className="breadcrumb-link" onClick={() => navigate('/tasks')} id="breadcrumb-tasks">
          All Tasks
        </button>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <span className="breadcrumb-current">
          {task ? (task.title.length > 50 ? task.title.slice(0, 50) + '…' : task.title) : 'Task Details'}
        </span>
      </nav>

      {/* Header */}
      <header className="page-header">
        <h1 className="page-title">Task Details</h1>
      </header>

      {loading && <LoadingIndicator message="Loading task details…" />}

      {error && !loading && (
        <ErrorMessage title="Failed to load task" message={error} onRetry={loadTask} />
      )}

      {task && !loading && (
        <>
          <article className="detail-card">
            {/* Title + Badges */}
            <div className="detail-header">
              <h2 className="detail-title">{task.title}</h2>
              <div className="detail-badges">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                {overdue && (
                  <span className="badge" style={{
                    background: 'var(--danger-50)', color: 'var(--danger-700)',
                    border: '1px solid var(--danger-100)',
                  }}>
                    ⚠ Overdue
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="detail-body">
              <div className="detail-section">
                <p className="detail-section-label">Description</p>
                {task.description ? (
                  <p className="detail-section-value">{task.description}</p>
                ) : (
                  <p className="detail-section-value" style={{ color: 'var(--gray-400)', fontStyle: 'italic' }}>
                    No description provided.
                  </p>
                )}
              </div>

              {task.dueDate && (
                <div className="detail-section">
                  <p className="detail-section-label">Due Date</p>
                  <p className={`detail-section-value${overdue ? ' task-card-date overdue' : ''}`}>
                    📅 {formatDate(task.dueDate)}
                    {overdue && ' (Overdue)'}
                  </p>
                </div>
              )}
            </div>

            {/* Meta grid */}
            <div className="detail-meta-grid">
              <div className="detail-meta-item">
                <p className="detail-meta-label">Created</p>
                <p className="detail-meta-value">{formatDateTime(task.createdAt)}</p>
              </div>
              <div className="detail-meta-item">
                <p className="detail-meta-label">Last Updated</p>
                <p className="detail-meta-value">{formatDateTime(task.updatedAt)}</p>
              </div>
              <div className="detail-meta-item">
                <p className="detail-meta-label">Task ID</p>
                <p className="detail-meta-value" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {task._id}
                </p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="detail-footer">
              <button
                className={`btn ${task.status === 'Completed' ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleToggleStatus}
                disabled={statusLoading}
                id="toggle-status-btn"
                aria-label={task.status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed'}
              >
                {statusLoading ? (
                  <><span className="spinner spinner-sm" aria-hidden="true" /> Updating…</>
                ) : task.status === 'Completed' ? (
                  '↩ Mark as Pending'
                ) : (
                  '✅ Mark as Completed'
                )}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate(`/tasks/${id}/edit`)}
                id="detail-edit-btn"
              >
                ✏️ Edit Task
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setDeleteOpen(true)}
                id="detail-delete-btn"
              >
                🗑️ Delete
              </button>
            </div>
          </article>

          <ConfirmationDialog
            isOpen={deleteOpen}
            title="Delete Task"
            message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
            confirmLabel="Delete Task"
            onConfirm={handleDelete}
            onCancel={() => setDeleteOpen(false)}
            isLoading={deleteLoading}
          />
        </>
      )}
    </main>
  );
}
