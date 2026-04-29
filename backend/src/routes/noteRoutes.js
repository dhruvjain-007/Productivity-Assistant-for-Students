const express = require('express');
const noteController = require('../controllers/noteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/:noteId', noteController.getNote);
router.put('/:noteId', noteController.updateNote);
router.delete('/:noteId', noteController.deleteNote);
router.post('/:noteId/summarize', noteController.summarizeNotesWithAI);
router.put('/:noteId/favorite', noteController.toggleFavorite);

module.exports = router;
