const express = require('express');
const focusController = require('../controllers/focusController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', focusController.startFocusSession);
router.put('/:sessionId/end', focusController.endFocusSession);
router.get('/', focusController.getFocusSessions);
router.get('/analytics/summary', focusController.getFocusAnalytics);

module.exports = router;
