/**
 * Centralized API utility for communicating with the TaskFlow backend.
 * All requests go through this module — never call fetch() directly from components.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generic request helper.
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    // Throw a structured error so callers can use error.message
    const message = data.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

// ─────────────────────────────────────────────
// Health
// ─────────────────────────────────────────────
export const checkHealth = () => request('/api/health');

// ─────────────────────────────────────────────
// Statistics
// ─────────────────────────────────────────────
export const fetchStats = () => request('/api/tasks/stats');

// ─────────────────────────────────────────────
// Tasks
// ─────────────────────────────────────────────

/**
 * Fetch all tasks with optional query parameters.
 * @param {Object} params - { search, status, priority, sort, page, limit }
 */
export const fetchTasks = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });
  const qs = query.toString();
  return request(`/api/tasks${qs ? `?${qs}` : ''}`);
};

/**
 * Fetch a single task by ID.
 */
export const fetchTaskById = (id) => request(`/api/tasks/${id}`);

/**
 * Create a new task.
 * @param {Object} taskData - { title, description, priority, status, dueDate }
 */
export const createTask = (taskData) =>
  request('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });

/**
 * Update all fields of an existing task.
 * @param {string} id
 * @param {Object} taskData
 */
export const updateTask = (id, taskData) =>
  request(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });

/**
 * Update only the status of a task.
 * @param {string} id
 * @param {'Pending'|'Completed'} status
 */
export const updateTaskStatus = (id, status) =>
  request(`/api/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

/**
 * Delete a task.
 * @param {string} id
 */
export const deleteTask = (id) =>
  request(`/api/tasks/${id}`, { method: 'DELETE' });
