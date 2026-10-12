import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';

export default function AddTask() {
  const navigate = useNavigate();

  return (
    <main className="page-content" id="add-task-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <button className="breadcrumb-link" onClick={() => navigate('/tasks')} id="breadcrumb-tasks">
          All Tasks
        </button>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <span className="breadcrumb-current">Add Task</span>
      </nav>

      {/* Header */}
      <header className="page-header">
        <h1 className="page-title">Add New Task</h1>
        <p className="page-subtitle">Fill in the details below to create a new task.</p>
      </header>

      <TaskForm mode="create" />
    </main>
  );
}
