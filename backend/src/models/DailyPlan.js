const mongoose = require('mongoose');

const dailyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    plannedTasks: [
      {
        taskId: mongoose.Schema.Types.ObjectId,
        sequenceOrder: Number,
        plannedDuration: Number,
        isCompleted: Boolean,
        completedAt: Date,
      },
    ],
    totalPlannedTime: {
      type: Number,
      description: 'Total planned study time in minutes',
    },
    totalActualTime: {
      type: Number,
      default: 0,
      description: 'Total actual study time in minutes',
    },
    completionRate: {
      type: Number,
      default: 0,
      description: 'Percentage of planned tasks completed',
    },
    focusSessionsCompleted: {
      type: Number,
      default: 0,
    },
    breaksTaken: {
      type: Number,
      default: 0,
    },
    distractionInstances: {
      type: Number,
      default: 0,
    },
    mood: {
      type: String,
      enum: ['great', 'good', 'okay', 'tired', 'stressed', 'distracted'],
    },
    notes: String,
    aiGenerated: {
      type: Boolean,
      default: true,
    },
    wasAdaptivelyAdjusted: {
      type: Boolean,
      default: false,
    },
    adjustmentReasons: [String],
  },
  { timestamps: true }
);

dailyPlanSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('DailyPlan', dailyPlanSchema);
