const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2,000 characters'],
      default: '',
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be Low, Medium, or High',
      },
      default: 'Medium',
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Completed'],
        message: 'Status must be Pending or Completed',
      },
      default: 'Pending',
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Index for faster search queries
taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
