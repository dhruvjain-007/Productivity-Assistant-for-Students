const mongoose = require('mongoose');

const studyNoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a note title'],
    },
    content: {
      type: String,
      required: [true, 'Please provide note content'],
    },
    subject: String,
    category: {
      type: String,
      enum: ['lecture', 'textbook', 'research', 'personal-notes', 'web-content'],
      default: 'personal-notes',
    },
    summary: {
      summary: String,
      keyPoints: [String],
      importantTerms: [
        {
          term: String,
          definition: String,
        },
      ],
      revisionBullets: [String],
      studyTips: [String],
    },
    tags: [String],
    isFavorited: {
      type: Boolean,
      default: false,
    },
    relevantTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    aiSummarized: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

studyNoteSchema.index({ userId: 1, subject: 1 });
studyNoteSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('StudyNote', studyNoteSchema);
