const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: Date,
    plannedDuration: {
      type: Number,
      required: true,
      description: 'Planned duration in minutes',
    },
    actualDuration: {
      type: Number,
      description: 'Actual duration in minutes',
    },
    focusScore: {
      type: Number,
      min: 0,
      max: 100,
      description: 'How focused the user was (1-100)',
    },
    distractionsCount: {
      type: Number,
      default: 0,
    },
    distractionTypes: [
      {
        type: String,
        enum: ['phone', 'social-media', 'other-tab', 'external', 'internal-thought'],
      },
    ],
    completedTasks: Number,
    notes: String,
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

focusSessionSchema.index({ userId: 1, startTime: -1 });
focusSessionSchema.index({ userId: 1, taskId: 1 });

module.exports = mongoose.model('FocusSession', focusSessionSchema);
