const Task = require('../models/Task');

// ─────────────────────────────────────────────
// GET /api/tasks/stats
// Returns dashboard statistics
// ─────────────────────────────────────────────
const getStats = async (req, res, next) => {
  try {
    const now = new Date();

    const [total, completed, pending, overdue] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: 'Completed' }),
      Task.countDocuments({ status: 'Pending' }),
      Task.countDocuments({
        status: 'Pending',
        dueDate: { $lt: now, $ne: null },
      }),
    ]);

    // Recent tasks (last 5 created)
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status priority dueDate createdAt');

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        overdue,
        completionRate,
        recentTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
