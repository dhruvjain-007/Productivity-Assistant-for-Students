const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    firstName: {
      type: String,
      required: [true, 'Please provide a first name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide a last name'],
    },
    studyGoals: [
      {
        type: String,
        enum: ['academics', 'skill-development', 'exam-preparation', 'certification', 'personal-learning'],
      },
    ],
    weekdayStudyTime: {
      type: Number,
      default: 3,
      min: 0.5,
      max: 24,
      description: 'Available study hours on weekdays',
    },
    weekendStudyTime: {
      type: Number,
      default: 4,
      min: 0.5,
      max: 24,
      description: 'Available study hours on weekends',
    },
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'reading-writing', 'kinesthetic', 'mixed'],
      default: 'mixed',
    },
    preferredSubjects: [String],
    focusDuration: {
      type: Number,
      default: 25,
      description: 'Preferred focus session duration in minutes (Pomodoro)',
    },
    breakDuration: {
      type: Number,
      default: 5,
      description: 'Preferred break duration in minutes',
    },
    longBreakDuration: {
      type: Number,
      default: 15,
      description: 'Long break duration after multiple focus sessions',
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
    emailNotifications: {
      type: Boolean,
      default: false,
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
    streakDays: {
      type: Number,
      default: 0,
      description: 'Consecutive days of maintaining goals',
    },
    totalStudyHours: {
      type: Number,
      default: 0,
      description: 'Cumulative study hours tracked',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    completionMetrics: {
      tasksCompleted: {
        type: Number,
        default: 0,
      },
      tasksCompletedThisWeek: {
        type: Number,
        default: 0,
      },
      completionRate: {
        type: Number,
        default: 0,
        description: 'Percentage of tasks completed',
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
