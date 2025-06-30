const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const Cart = require("../models/Cart"); 
const protect = require("../middleware/authMiddleware");

// GET wishlist
router.get("/", protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user._id }).populate("productId");

    const validWishlist = wishlist.filter(item => item.productId);
    const invalidIds = wishlist.filter(item => !item.productId).map(item => item._id);

    if (invalidIds.length > 0) {
      await Wishlist.deleteMany({ _id: { $in: invalidIds } });
    }

    res.json(validWishlist);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist." });
  }
});

// Add product to wishlist with cart check
router.post("/", protect, async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required." });
  }

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found." });

    // Check if already in cart
    const cartItem = await Cart.findOne({ userId: req.user._id, productId });
    if (cartItem) {
      return res.status(400).json({ message: "Already in cart" });
    }

    // Check if already in wishlist
    const alreadyInWishlist = await Wishlist.findOne({ userId: req.user._id, productId });
    if (alreadyInWishlist) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const newItem = new Wishlist({ userId: req.user._id, productId });
    await newItem.save();

    res.status(201).json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add to wishlist." });
  }
});

// DELETE
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await Wishlist.findById(req.params.id);
    if (!item || item.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Item not found or unauthorized" });
    }

    await Wishlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Error removing item" });
  }
});

module.exports = router;
