const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/dashboard', analyticsController.getDashboardAnalytics);
router.get('/report', analyticsController.getAnalyticsReport);
router.get('/insights', analyticsController.getProductivityInsights);

module.exports = router;
