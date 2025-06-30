const express = require('express');
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getVendorOrders,
  downloadInvoice,
  getVendorSalesSummary, // included
} = require('../controllers/orderController');
const { getVendorRevenueChart } = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Routes
router.post('/', authMiddleware, roleMiddleware(['customer']), placeOrder);
router.get('/my', authMiddleware, roleMiddleware(['customer']), getMyOrders);
router.get('/vendor', authMiddleware, roleMiddleware(['vendor']), getVendorOrders);
router.get('/invoice/:id', authMiddleware, downloadInvoice);
router.get('/vendor/sales-summary', authMiddleware, roleMiddleware(['vendor']), getVendorSalesSummary);
router.get('/vendor/revenue-chart', authMiddleware, roleMiddleware(['vendor']), getVendorRevenueChart);


module.exports = router;
