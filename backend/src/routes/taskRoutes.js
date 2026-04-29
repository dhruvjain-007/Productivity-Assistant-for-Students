const express = require('express');
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:taskId', taskController.getTask);
router.put('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);
router.post('/generate-plan', taskController.generateAIPlan);
router.get('/recommendation', taskController.getTaskRecommendationEndpoint);

module.exports = router;
