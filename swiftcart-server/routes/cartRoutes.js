const express = require('express');
const router = express.Router();

const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Customer-only cart access
router.use(authMiddleware, roleMiddleware(['customer']));

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/item/:productId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;
