const mongoose = require('mongoose');
const Task = require('../models/Task');

// Helper: validate MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─────────────────────────────────────────────
// GET /api/tasks
// Query params: search, status, priority, sort, page, limit
// ─────────────────────────────────────────────
const getAllTasks = async (req, res, next) => {
  try {
    const {
      search = '',
      status = '',
      priority = '',
      sort = 'newest',
      page = 1,
      limit = 50,
    } = req.query;

    // Build filter object
    const filter = {};

    if (search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (status && ['Pending', 'Completed'].includes(status)) {
      filter.status = status;
    }

    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      filter.priority = priority;
    }

    // Build sort object
    let sortOption = {};
    switch (sort) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'dueDate':
        sortOption = { dueDate: 1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// GET /api/tasks/:id
// ─────────────────────────────────────────────
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID format' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// POST /api/tasks
// ─────────────────────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const taskData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'Medium',
      status: status || 'Pending',
    };

    if (dueDate) {
      const parsed = new Date(dueDate);
      if (isNaN(parsed.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid due date format' });
      }
      taskData.dueDate = parsed;
    }

    const task = await Task.create(taskData);

    res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// PUT /api/tasks/:id
// ─────────────────────────────────────────────
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID format' });
    }

    const { title, description, priority, status, dueDate } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ success: false, message: 'Task title cannot be empty' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (priority !== undefined) {
      if (!['Low', 'Medium', 'High'].includes(priority)) {
        return res.status(400).json({ success: false, message: 'Priority must be Low, Medium, or High' });
      }
      updates.priority = priority;
    }
    if (status !== undefined) {
      if (!['Pending', 'Completed'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Status must be Pending or Completed' });
      }
      updates.status = status;
    }
    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === '') {
        updates.dueDate = null;
      } else {
        const parsed = new Date(dueDate);
        if (isNaN(parsed.getTime())) {
          return res.status(400).json({ success: false, message: 'Invalid due date format' });
        }
        updates.dueDate = parsed;
      }
    }

    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// PATCH /api/tasks/:id/status
// ─────────────────────────────────────────────
const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID format' });
    }

    const { status } = req.body;

    if (!status || !['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Pending or Completed',
      });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: `Task marked as ${status}`, data: task });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// DELETE /api/tasks/:id
// ─────────────────────────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID format' });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
