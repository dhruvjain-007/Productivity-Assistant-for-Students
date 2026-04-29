const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    dailyMetrics: [
      {
        date: Date,
        studyTime: Number,
        focusSessions: Number,
        tasksCompleted: Number,
        tasksAttempted: Number,
        completionRate: Number,
        averageFocusScore: Number,
        mood: String,
        energyLevel: String,
      },
    ],
    weeklyMetrics: [
      {
        weekStart: Date,
        totalStudyHours: Number,
        averageDailyStudyTime: Number,
        totalTasksCompleted: Number,
        consistencyDays: Number,
        bestDay: String,
        bestPerformanceTime: String,
      },
    ],
    monthlyMetrics: [
      {
        month: String,
        totalStudyHours: Number,
        tasksCompleted: Number,
        taskCompletionRate: Number,
        consistencyScore: Number,
        averageFocusScore: Number,
        improvements: [String],
      },
    ],
    subjectMetrics: [
      {
        subject: String,
        hoursSpent: Number,
        tasksCompleted: Number,
        averageFocusScore: Number,
      },
    ],
    streakInfo: {
      currentStreak: Number,
      longestStreak: Number,
      lastActivityDate: Date,
    },
    preferences: {
      bestStudyTime: String,
      bestStudyDuration: Number,
      mostProductiveDay: String,
      preferredBreakDuration: Number,
    },
    goals: {
      weeklyStudyTarget: Number,
      taskCompletionTarget: Number,
      focusScoreTarget: Number,
    },
  },
  { timestamps: true }
);

analyticsSchema.index({ userId: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
