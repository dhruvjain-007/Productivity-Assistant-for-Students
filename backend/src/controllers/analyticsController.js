const Analytics = require('../models/Analytics');
const Task = require('../models/Task');
const FocusSession = require('../models/FocusSession');
const DailyPlan = require('../models/DailyPlan');

// @desc    Get analytics dashboard
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const user = require('../models/User').findById(req.user.id);

    // Get today's metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysCompletedTasks = await Task.countDocuments({
      userId: req.user.id,
      status: 'completed',
      completedAt: { $gte: today },
    });

    const todaysFocusSessions = await FocusSession.find({
      userId: req.user.id,
      isCompleted: true,
      startTime: { $gte: today },
    });

    const todaysFocusTime = todaysFocusSessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0);

    // Get this week's metrics
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekTasks = await Task.find({
      userId: req.user.id,
      status: 'completed',
      completedAt: { $gte: weekStart },
    });

    const weekFocusSessions = await FocusSession.find({
      userId: req.user.id,
      isCompleted: true,
      startTime: { $gte: weekStart },
    });

    const weekFocusTime = weekFocusSessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0);

    // Calculate streaks
    let streakDays = 0;
    const tempDate = new Date();
    tempDate.setHours(0, 0, 0, 0);

    let checking = true;
    while (checking) {
      const dayStart = new Date(tempDate);
      const dayEnd = new Date(tempDate);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayTasks = await Task.countDocuments({
        userId: req.user.id,
        status: 'completed',
        completedAt: { $gte: dayStart, $lt: dayEnd },
      });

      if (dayTasks > 0) {
        streakDays++;
        tempDate.setDate(tempDate.getDate() - 1);
      } else {
        checking = false;
      }
    }

    // Get pending tasks
    const pendingTasks = await Task.countDocuments({
      userId: req.user.id,
      status: { $in: ['pending', 'in-progress'] },
    });

    res.status(200).json({
      success: true,
      dashboard: {
        today: {
          completedTasks: todaysCompletedTasks,
          focusSessionsCount: todaysFocusSessions.length,
          focusTimeMinutes: todaysFocusTime,
          focusTimeHours: (todaysFocusTime / 60).toFixed(2),
        },
        week: {
          completedTasks: weekTasks.length,
          focusSessionsCount: weekFocusSessions.length,
          focusTimeMinutes: weekFocusTime,
          focusTimeHours: (weekFocusTime / 60).toFixed(2),
        },
        stats: {
          currentStreakDays: streakDays,
          pendingTasks,
          averageFocusScore:
            weekFocusSessions.length > 0
              ? (
                  weekFocusSessions.reduce((sum, s) => sum + (s.focusScore || 0), 0) /
                  weekFocusSessions.length
                ).toFixed(2)
              : 0,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get detailed analytics report
// @route   GET /api/analytics/report
// @access  Private
exports.getAnalyticsReport = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Fetch data
    const tasks = await Task.find({
      userId: req.user.id,
      completedAt: { $gte: startDate },
    });

    const focusSessions = await FocusSession.find({
      userId: req.user.id,
      isCompleted: true,
      startTime: { $gte: startDate },
    });

    // Group by subject
    const subjectStats = {};
    tasks.forEach((task) => {
      if (!subjectStats[task.subject]) {
        subjectStats[task.subject] = {
          tasksCompleted: 0,
          totalTimeSpent: 0,
          averageFocusScore: 0,
          focusSessions: 0,
        };
      }
      subjectStats[task.subject].tasksCompleted++;
      subjectStats[task.subject].totalTimeSpent += task.timeSpent || 0;
    });

    // Add focus session data
    focusSessions.forEach((session) => {
      if (session.taskId && subjectStats[session.taskId.subject]) {
        subjectStats[session.taskId.subject].focusSessions++;
        subjectStats[session.taskId.subject].averageFocusScore +=
          session.focusScore || 0;
      }
    });

    // Calculate daily breakdown
    const dailyStats = {};
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const dayEnd = new Date(date);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayTasks = tasks.filter(
        (t) => t.completedAt >= date && t.completedAt < dayEnd
      );

      const daySessions = focusSessions.filter(
        (s) => s.startTime >= date && s.startTime < dayEnd
      );

      dailyStats[dateStr] = {
        date: dateStr,
        tasksCompleted: dayTasks.length,
        focusSessions: daySessions.length,
        focusTime: daySessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0),
        averageFocusScore:
          daySessions.length > 0
            ? (daySessions.reduce((sum, s) => sum + (s.focusScore || 0), 0) /
                daySessions.length)
              .toFixed(2)
            : 0,
      };
    }

    res.status(200).json({
      success: true,
      report: {
        period: `Last ${days} days`,
        totalTasksCompleted: tasks.length,
        totalFocusSessions: focusSessions.length,
        totalFocusTimeMinutes: focusSessions.reduce(
          (sum, s) => sum + (s.actualDuration || 0),
          0
        ),
        subjectBreakdown: subjectStats,
        dailyBreakdown: dailyStats,
        bestStudyDay: Object.keys(dailyStats).reduce((best, key) =>
          dailyStats[key].focusTime > (dailyStats[best]?.focusTime || 0) ? key : best
        ),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get productivity insights
// @route   GET /api/analytics/insights
// @access  Private
exports.getProductivityInsights = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const focusSessions = await FocusSession.find({
      userId: req.user.id,
      isCompleted: true,
      startTime: { $gte: startDate },
    });

    // Find best study time
    const hourlyData = {};
    focusSessions.forEach((session) => {
      const hour = session.startTime.getHours();
      if (!hourlyData[hour]) {
        hourlyData[hour] = {
          sessions: 0,
          avgFocusScore: 0,
          totalFocusTime: 0,
        };
      }
      hourlyData[hour].sessions++;
      hourlyData[hour].avgFocusScore += session.focusScore || 0;
      hourlyData[hour].totalFocusTime += session.actualDuration || 0;
    });

    const bestStudyHour = Object.keys(hourlyData).reduce((best, hour) =>
      (hourlyData[hour]?.avgFocusScore || 0) >
      (hourlyData[best]?.avgFocusScore || 0)
        ? hour
        : best
    );

    // Find most productive day
    const dayData = {};
    focusSessions.forEach((session) => {
      const dayName = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ][session.startTime.getDay()];
      if (!dayData[dayName]) {
        dayData[dayName] = { sessions: 0, avgFocusScore: 0 };
      }
      dayData[dayName].sessions++;
      dayData[dayName].avgFocusScore += session.focusScore || 0;
    });

    const bestStudyDay = Object.keys(dayData).reduce((best, day) =>
      (dayData[day]?.avgFocusScore || 0) > (dayData[best]?.avgFocusScore || 0)
        ? day
        : best
    );

    res.status(200).json({
      success: true,
      insights: {
        bestStudyTime: `${bestStudyHour}:00`,
        bestStudyDay,
        recommendedSessionDuration:
          focusSessions.length > 0
            ? Math.round(
                focusSessions.reduce(
                  (sum, s) => sum + (s.actualDuration || 0),
                  0
                ) / focusSessions.length
              )
            : 25,
        recommendations: [
          `Your best focus time is around ${bestStudyHour}:00. Try scheduling important tasks then.`,
          `You're most productive on ${bestStudyDay}s. Plan challenging work for that day.`,
          `Keep distractions minimal - they reduce your focus score significantly.`,
        ],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
