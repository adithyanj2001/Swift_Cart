const express = require('express');
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getVendorOrders,
  downloadInvoice,
  getVendorSalesSummary,
  getVendorDashboardStats, 
  getVendorRevenueChart
} = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Routes
router.post('/', authMiddleware, roleMiddleware(['customer']), placeOrder);
router.get('/my', authMiddleware, roleMiddleware(['customer']), getMyOrders);
router.get('/vendor', authMiddleware, roleMiddleware(['vendor']), getVendorOrders);
router.get('/invoice/:id', authMiddleware, downloadInvoice);
router.get('/vendor/sales-summary', authMiddleware, roleMiddleware(['vendor']), getVendorSalesSummary);
router.get('/vendor/revenue-chart', authMiddleware, roleMiddleware(['vendor']), getVendorRevenueChart);
router.get('/vendor/dashboard-stats', authMiddleware, roleMiddleware(['vendor']), getVendorDashboardStats); 

module.exports = router;
