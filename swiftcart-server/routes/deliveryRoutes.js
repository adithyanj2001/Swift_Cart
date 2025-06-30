const express = require('express');
const router = express.Router();
const {
  getAssignedDeliveries,
  updateStatus
} = require('../controllers/deliveryController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Restrict to delivery agents
router.use(authMiddleware, roleMiddleware(['agent']));


router.get('/', getAssignedDeliveries);


router.put('/:id/status', updateStatus);

module.exports = router;
