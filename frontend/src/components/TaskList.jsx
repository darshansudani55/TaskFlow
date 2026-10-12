import TaskCard from './TaskCard';
import EmptyState from './EmptyState';
import { useNavigate } from 'react-router-dom';

export default function TaskList({ tasks, onUpdate }) {
  const navigate = useNavigate();

  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No tasks found"
        description="There are no tasks matching your current filters. Try adjusting the search or filters, or create a new task."
        action={
          <button
            className="btn btn-primary"
            onClick={() => navigate('/tasks/new')}
            id="empty-add-task-btn"
          >
            ➕ Add Your First Task
          </button>
        }
      />
    );
  }

  return (
    <div className="task-list" role="list" aria-label="Task list">
      {tasks.map((task) => (
        <div role="listitem" key={task._id}>
          <TaskCard task={task} onUpdate={onUpdate} />
        </div>
      ))}
    </div>
  );
}
