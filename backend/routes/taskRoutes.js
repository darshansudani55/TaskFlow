const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');

// GET /api/tasks         — Get all tasks (with filtering/sorting/pagination)
router.get('/', getAllTasks);

// POST /api/tasks        — Create a new task
router.post('/', createTask);

// GET /api/tasks/:id     — Get a single task
router.get('/:id', getTaskById);

// PUT /api/tasks/:id     — Update a task
router.put('/:id', updateTask);

// PATCH /api/tasks/:id/status — Update task status only
router.patch('/:id/status', updateTaskStatus);

// DELETE /api/tasks/:id  — Delete a task
router.delete('/:id', deleteTask);

module.exports = router;
