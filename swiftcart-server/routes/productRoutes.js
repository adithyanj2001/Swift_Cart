const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getVendorProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public: Get all products
router.get('/', getAllProducts);

// Vendor: Create a product
router.post('/', authMiddleware, roleMiddleware(['vendor']), createProduct);

// Vendor: View all their products
router.get('/my', authMiddleware, roleMiddleware(['vendor']), getVendorProducts);

// Vendor: Update product
router.put('/:id', authMiddleware, roleMiddleware(['vendor']), updateProduct);

// Vendor: Delete product
router.delete('/:id', authMiddleware, roleMiddleware(['vendor']), deleteProduct);

module.exports = router;
