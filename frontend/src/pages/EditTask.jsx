import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import { fetchTaskById } from '../api/tasks';

export default function EditTask() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchTaskById(id);
        setTask(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <main className="page-content" id="edit-task-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <button className="breadcrumb-link" onClick={() => navigate('/tasks')} id="breadcrumb-tasks">
          All Tasks
        </button>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        {task && (
          <>
            <button
              className="breadcrumb-link"
              onClick={() => navigate(`/tasks/${id}`)}
              id="breadcrumb-detail"
            >
              {task.title.length > 40 ? task.title.slice(0, 40) + '…' : task.title}
            </button>
            <span className="breadcrumb-sep" aria-hidden="true">›</span>
          </>
        )}
        <span className="breadcrumb-current">Edit</span>
      </nav>

      {/* Header */}
      <header className="page-header">
        <h1 className="page-title">Edit Task</h1>
        <p className="page-subtitle">Update the task details below.</p>
      </header>

      {loading && <LoadingIndicator message="Loading task…" />}
      {error && !loading && (
        <ErrorMessage title="Failed to load task" message={error} />
      )}
      {task && !loading && (
        <TaskForm existingTask={task} mode="edit" />
      )}
    </main>
  );
}
