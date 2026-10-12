import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import ConfirmationDialog from './ConfirmationDialog';
import { updateTaskStatus, deleteTask } from '../api/tasks';
import { useToast } from './ToastNotification';

function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dateStr, status) {
  if (!dateStr || status === 'Completed') return false;
  return new Date(dateStr) < new Date();
}

export default function TaskCard({ task, onUpdate }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const overdue = isOverdue(task.dueDate, task.status);

  const handleToggleStatus = async () => {
    if (statusLoading) return;
    setStatusLoading(true);
    try {
      const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      await updateTaskStatus(task._id, newStatus);
      toast.success(`Task marked as ${newStatus}`);
      onUpdate();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteTask(task._id);
      toast.success('Task deleted successfully');
      setDeleteOpen(false);
      onUpdate();
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <article
        className={`task-card${task.status === 'Completed' ? ' completed' : ''}`}
        aria-label={`Task: ${task.title}`}
      >
        {/* Checkbox / status toggle */}
        <button
          className={`task-card-checkbox${task.status === 'Completed' ? ' checked' : ''}`}
          onClick={handleToggleStatus}
          disabled={statusLoading}
          aria-label={task.status === 'Completed' ? 'Mark as pending' : 'Mark as completed'}
          title={task.status === 'Completed' ? 'Mark as pending' : 'Mark as completed'}
        >
          {task.status === 'Completed' && <span aria-hidden="true">✓</span>}
          {statusLoading && <span className="spinner spinner-sm" aria-hidden="true" />}
        </button>

        {/* Content */}
        <div className="task-card-body">
          <h3 className={`task-card-title${task.status === 'Completed' ? ' completed' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="task-card-desc">{task.description}</p>
          )}
          <div className="task-card-meta">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {task.dueDate && (
              <span className={`task-card-date${overdue ? ' overdue' : ''}`}>
                <span aria-hidden="true">📅</span>
                {overdue ? 'Overdue: ' : 'Due: '}
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="task-card-actions">
          <button
            className="task-action-btn task-action-btn-view"
            onClick={() => navigate(`/tasks/${task._id}`)}
            aria-label="View task details"
            title="View details"
            id={`view-task-${task._id}`}
          >
            👁
          </button>
          <button
            className="task-action-btn task-action-btn-edit"
            onClick={() => navigate(`/tasks/${task._id}/edit`)}
            aria-label="Edit task"
            title="Edit task"
            id={`edit-task-${task._id}`}
          >
            ✏️
          </button>
          <button
            className="task-action-btn task-action-btn-delete"
            onClick={() => setDeleteOpen(true)}
            aria-label="Delete task"
            title="Delete task"
            id={`delete-task-${task._id}`}
          >
            🗑️
          </button>
        </div>
      </article>

      {/* Delete Confirmation */}
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
  );
}
