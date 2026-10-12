import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask, updateTask } from '../api/tasks';
import { useToast } from './ToastNotification';

const INITIAL_FORM = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  dueDate: '',
};

function validate(fields) {
  const errors = {};
  if (!fields.title || !fields.title.trim()) {
    errors.title = 'Title is required';
  } else if (fields.title.trim().length > 200) {
    errors.title = 'Title cannot exceed 200 characters';
  }
  if (fields.description && fields.description.length > 2000) {
    errors.description = 'Description cannot exceed 2,000 characters';
  }
  if (!['Low', 'Medium', 'High'].includes(fields.priority)) {
    errors.priority = 'Priority must be Low, Medium, or High';
  }
  if (!['Pending', 'Completed'].includes(fields.status)) {
    errors.status = 'Status must be Pending or Completed';
  }
  return errors;
}

export default function TaskForm({ existingTask, mode = 'create' }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Populate form with existing task data when editing
  useEffect(() => {
    if (existingTask) {
      let dueDate = '';
      if (existingTask.dueDate) {
        // Format the date as YYYY-MM-DD for the date input
        const d = new Date(existingTask.dueDate);
        dueDate = d.toISOString().split('T')[0];
      }
      setForm({
        title: existingTask.title || '',
        description: existingTask.description || '',
        priority: existingTask.priority || 'Medium',
        status: existingTask.status || 'Pending',
        dueDate,
      });
    }
  }, [existingTask]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field as user types
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (submitting) return; // Prevent double submission
    setSubmitting(true);
    setErrors({});

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate || null,
      };

      if (mode === 'edit') {
        await updateTask(existingTask._id, payload);
        toast.success('Task updated successfully!');
        navigate(`/tasks/${existingTask._id}`);
      } else {
        const response = await createTask(payload);
        toast.success('Task created successfully!');
        navigate(`/tasks/${response.data._id}`);
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = mode === 'edit';
  const titleRemaining = 200 - (form.title?.length || 0);
  const descRemaining = 2000 - (form.description?.length || 0);

  return (
    <form
      className="form-card"
      onSubmit={handleSubmit}
      noValidate
      aria-label={isEditing ? 'Edit task form' : 'Add task form'}
      id="task-form"
    >
      {/* Title */}
      <div className="form-group">
        <label className="form-label" htmlFor="task-title">
          Title <span className="required" aria-hidden="true">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          className={`form-input${errors.title ? ' error' : ''}`}
          placeholder="e.g. Finish the quarterly report"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          maxLength={200}
          required
          aria-describedby={errors.title ? 'title-error' : 'title-hint'}
          aria-invalid={!!errors.title}
          autoFocus
        />
        {errors.title ? (
          <p className="form-error" id="title-error" role="alert">⚠ {errors.title}</p>
        ) : (
          <p className={`char-count${titleRemaining < 30 ? ' warn' : ''}`} id="title-hint">
            {titleRemaining} characters remaining
          </p>
        )}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="task-description">
          Description <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          id="task-description"
          className={`form-textarea${errors.description ? ' error' : ''}`}
          placeholder="Add more details about this task…"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          maxLength={2000}
          rows={4}
          aria-describedby={errors.description ? 'desc-error' : 'desc-hint'}
          aria-invalid={!!errors.description}
        />
        {errors.description ? (
          <p className="form-error" id="desc-error" role="alert">⚠ {errors.description}</p>
        ) : (
          <p className={`char-count${descRemaining < 100 ? ' warn' : ''}`} id="desc-hint">
            {descRemaining} characters remaining
          </p>
        )}
      </div>

      {/* Priority + Status */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            className={`form-select${errors.priority ? ' error' : ''}`}
            value={form.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            aria-invalid={!!errors.priority}
          >
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>
          {errors.priority && (
            <p className="form-error" role="alert">⚠ {errors.priority}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-status">Status</label>
          <select
            id="task-status"
            className={`form-select${errors.status ? ' error' : ''}`}
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
            aria-invalid={!!errors.status}
          >
            <option value="Pending">⏳ Pending</option>
            <option value="Completed">✅ Completed</option>
          </select>
          {errors.status && (
            <p className="form-error" role="alert">⚠ {errors.status}</p>
          )}
        </div>
      </div>

      {/* Due Date */}
      <div className="form-group">
        <label className="form-label" htmlFor="task-due-date">
          Due Date <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          id="task-due-date"
          type="date"
          className="form-input"
          value={form.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          aria-label="Task due date"
        />
        <p className="form-hint">Leave blank if there is no deadline.</p>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
          disabled={submitting}
          id="form-cancel-btn"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
          id="form-submit-btn"
          aria-busy={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner spinner-sm" aria-hidden="true" />
              {isEditing ? 'Saving…' : 'Creating…'}
            </>
          ) : (
            isEditing ? '💾 Save Changes' : '➕ Create Task'
          )}
        </button>
      </div>
    </form>
  );
}
