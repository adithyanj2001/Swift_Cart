const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllVendors,
  createVendor,
  updateVendor,
  deleteVendor,
  getAllAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  getAllCustomers,
  deleteCustomer,
  getAllTransactions,
} = require('../controllers/adminController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all admin routes
router.use(authMiddleware, roleMiddleware(['admin']));

// User routes
router.get('/users', getAllUsers);
router.get('/customers', getAllCustomers);
router.delete('/customers/:id', deleteCustomer);

// Vendor routes
router.get('/vendors', getAllVendors);
router.post('/vendors', createVendor);
router.put('/vendors/:id', updateVendor);
router.delete('/vendors/:id', deleteVendor);

// Agent routes
router.get('/agents', getAllAgents);
router.post('/agents', createAgent);
router.put('/agents/:id', updateAgent);
router.delete('/agents/:id', deleteAgent);

// Sales/Transactions route
router.get('/transactions', getAllTransactions);

module.exports = router;
