const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
    },
    description: String,
    subject: {
      type: String,
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    estimatedTime: {
      type: Number,
      description: 'Estimated time in minutes',
    },
    deadline: Date,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    completedAt: Date,
    timeSpent: {
      type: Number,
      default: 0,
      description: 'Actual time spent in minutes',
    },
    focusSessions: {
      type: Number,
      default: 0,
      description: 'Number of focus sessions completed for this task',
    },
    notes: String,
    category: {
      type: String,
      enum: ['studying', 'assignment', 'project', 'exam-prep', 'reading', 'practice', 'other'],
      default: 'studying',
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      type: String,
      enum: ['daily', 'weekly', 'bi-weekly', 'monthly'],
    },
    aiGenerated: {
      type: Boolean,
      default: false,
      description: 'Whether this task was AI-generated',
    },
    aiRecommendedPriority: String,
    tags: [String],
  },
  { timestamps: true }
);

// Index for efficient querying
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, deadline: 1 });
taskSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);
