const FocusSession = require('../models/FocusSession');
const Task = require('../models/Task');

// @desc    Start focus session
// @route   POST /api/focus-sessions
// @access  Private
exports.startFocusSession = async (req, res) => {
  try {
    const { taskId, plannedDuration } = req.body;

    if (!plannedDuration) {
      return res.status(400).json({ success: false, message: 'Planned duration is required' });
    }

    const session = await FocusSession.create({
      userId: req.user.id,
      taskId,
      startTime: new Date(),
      plannedDuration,
    });

    res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    End focus session
// @route   PUT /api/focus-sessions/:sessionId/end
// @access  Private
exports.endFocusSession = async (req, res) => {
  try {
    const { focusScore, distractionTypes, distractionsCount, notes } = req.body;

    let session = await FocusSession.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Focus session not found' });
    }

    // Check if user owns session
    if (session.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to end this session' });
    }

    session.endTime = new Date();
    session.actualDuration = Math.round((session.endTime - session.startTime) / 60000); // Convert to minutes
    session.focusScore = focusScore;
    session.distractionTypes = distractionTypes;
    session.distractionsCount = distractionsCount || 0;
    session.notes = notes;
    session.isCompleted = true;

    await session.save();

    // Update task with focus session info
    if (session.taskId) {
      await Task.findByIdAndUpdate(session.taskId, {
        $inc: {
          focusSessions: 1,
          timeSpent: session.actualDuration,
        },
      });
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get focus sessions
// @route   GET /api/focus-sessions
// @access  Private
exports.getFocusSessions = async (req, res) => {
  try {
    const { taskId, startDate, endDate, sortBy = '-startTime' } = req.query;

    let filter = { userId: req.user.id, isCompleted: true };

    if (taskId) filter.taskId = taskId;

    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) filter.startTime.$gte = new Date(startDate);
      if (endDate) filter.startTime.$lte = new Date(endDate);
    }

    const sessions = await FocusSession.find(filter).sort(sortBy);

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get focus session analytics
// @route   GET /api/focus-sessions/analytics/summary
// @access  Private
exports.getFocusAnalytics = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sessions = await FocusSession.find({
      userId: req.user.id,
      isCompleted: true,
      startTime: { $gte: startDate },
    });

    // Calculate analytics
    const totalSessions = sessions.length;
    const totalFocusTime = sessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0);
    const averageFocusScore =
      totalSessions > 0
        ? sessions.reduce((sum, s) => sum + (s.focusScore || 0), 0) / totalSessions
        : 0;
    const totalDistractions = sessions.reduce((sum, s) => sum + (s.distractionsCount || 0), 0);

    // Best focus day
    const dailyData = {};
    sessions.forEach((session) => {
      const date = session.startTime.toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { sessions: 0, focusTime: 0, focusScore: 0 };
      }
      dailyData[date].sessions += 1;
      dailyData[date].focusTime += session.actualDuration || 0;
      dailyData[date].focusScore += session.focusScore || 0;
    });

    res.status(200).json({
      success: true,
      analytics: {
        period: `Last ${days} days`,
        totalSessions,
        totalFocusTimeMinutes: totalFocusTime,
        totalFocusTimeHours: (totalFocusTime / 60).toFixed(2),
        averageFocusScore: averageFocusScore.toFixed(2),
        totalDistractions,
        averageSessionDuration:
          totalSessions > 0 ? (totalFocusTime / totalSessions).toFixed(2) : 0,
        dailyBreakdown: dailyData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
