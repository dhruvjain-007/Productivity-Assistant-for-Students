const Task = require('../models/Task');
const DailyPlan = require('../models/DailyPlan');
const { generateDailyPlan, getTaskRecommendation } = require('../config/ai');

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, description, subject, priority, estimatedTime, deadline, category, isRecurring } =
      req.body;

    const task = await Task.create({
      userId: req.user.id,
      title,
      description,
      subject,
      priority,
      estimatedTime,
      deadline,
      category,
      isRecurring,
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all tasks for user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, subject, sortBy = '-createdAt' } = req.query;

    let filter = { userId: req.user.id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (subject) filter.subject = subject;

    const tasks = await Task.find(filter).sort(sortBy);

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:taskId
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if user owns task
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:taskId
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if user owns task
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    // Handle task completion
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = new Date();
    }

    task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:taskId
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if user owns task
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.taskId);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate AI daily plan
// @route   POST /api/tasks/generate-plan
// @access  Private
exports.generateAIPlan = async (req, res) => {
  try {
    const user = req.user;
    const { date = new Date() } = req.body;

    // Get user's incomplete tasks
    const incompleteTasks = await Task.find({
      userId: user.id,
      status: { $in: ['pending', 'in-progress'] },
    }).sort({ priority: 1, deadline: 1 });

    if (incompleteTasks.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No pending tasks to plan',
        plan: [],
      });
    }

    // Prepare user profile
    const userProfile = {
      learningStyle: user.learningStyle,
      subjects: user.preferredSubjects,
      recentPerformance: 'Average',
    };

    // Get available study time (weekday vs weekend)
    const dayOfWeek = new Date(date).getDay();
    const availableTime = [6, 0].includes(dayOfWeek) ? user.weekendStudyTime : user.weekdayStudyTime;

    // Generate plan via AI
    const plan = await generateDailyPlan(
      user.studyGoals?.join(', ') || 'General learning',
      availableTime,
      userProfile
    );

    // Save plan to database
    const dailyPlan = await DailyPlan.create({
      userId: user.id,
      date,
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
        dayOfWeek
      ],
      plannedTasks: plan.tasks.map((task, index) => ({
        sequenceOrder: index,
        plannedDuration: task.timeEstimate,
      })),
      totalPlannedTime: plan.tasks.reduce((sum, task) => sum + task.timeEstimate, 0),
      aiGenerated: true,
    });

    res.status(201).json({
      success: true,
      plan,
      dailyPlan,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get task recommendation
// @route   GET /api/tasks/recommendation
// @access  Private
exports.getTaskRecommendationEndpoint = async (req, res) => {
  try {
    // Get upcoming tasks
    const upcomingTasks = await Task.find({
      userId: req.user.id,
      status: { $in: ['pending', 'in-progress'] },
    })
      .sort({ priority: 1, deadline: 1 })
      .limit(10);

    // Get user context
    const user = await User.findById(req.user.id);
    const userContext = {
      energyLevel: req.body.energyLevel || 'medium',
      timeUntilBreak: req.body.timeUntilBreak || '30 min',
      completionRate: user.completionMetrics?.completionRate || 0,
    };

    // Get recent completion history
    const recentCompletions = await Task.find({
      userId: req.user.id,
      status: 'completed',
      completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    const recommendation = await getTaskRecommendation(upcomingTasks, userContext, recentCompletions);

    res.status(200).json({
      success: true,
      recommendation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
