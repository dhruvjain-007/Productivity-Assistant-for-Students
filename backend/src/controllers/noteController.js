const StudyNote = require('../models/StudyNote');
const { summarizeNotes } = require('../config/ai');

// @desc    Create study note
// @route   POST /api/notes
// @access  Private
exports.createNote = async (req, res) => {
  try {
    const { title, content, subject, category, tags } = req.body;

    const note = await StudyNote.create({
      userId: req.user.id,
      title,
      content,
      subject,
      category,
      tags,
    });

    res.status(201).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all notes for user
// @route   GET /api/notes
// @access  Private
exports.getNotes = async (req, res) => {
  try {
    const { subject, category, isFavorited, sortBy = '-createdAt' } = req.query;

    let filter = { userId: req.user.id };

    if (subject) filter.subject = subject;
    if (category) filter.category = category;
    if (isFavorited !== undefined) filter.isFavorited = isFavorited === 'true';

    const notes = await StudyNote.find(filter).sort(sortBy);

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:noteId
// @access  Private
exports.getNote = async (req, res) => {
  try {
    const note = await StudyNote.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Check if user owns note
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this note' });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:noteId
// @access  Private
exports.updateNote = async (req, res) => {
  try {
    let note = await StudyNote.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Check if user owns note
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this note' });
    }

    note = await StudyNote.findByIdAndUpdate(req.params.noteId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:noteId
// @access  Private
exports.deleteNote = async (req, res) => {
  try {
    const note = await StudyNote.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Check if user owns note
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this note' });
    }

    await StudyNote.findByIdAndDelete(req.params.noteId);

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Summarize notes with AI
// @route   POST /api/notes/:noteId/summarize
// @access  Private
exports.summarizeNotesWithAI = async (req, res) => {
  try {
    const { detailLevel = 'balanced' } = req.body;

    let note = await StudyNote.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Check if user owns note
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to summarize this note' });
    }

    const summary = await summarizeNotes(note.content, detailLevel);

    note.summary = summary;
    note.aiSummarized = true;
    await note.save();

    res.status(200).json({
      success: true,
      note,
      summary,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle favorite note
// @route   PUT /api/notes/:noteId/favorite
// @access  Private
exports.toggleFavorite = async (req, res) => {
  try {
    let note = await StudyNote.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Check if user owns note
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to favorite this note' });
    }

    note.isFavorited = !note.isFavorited;
    await note.save();

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
