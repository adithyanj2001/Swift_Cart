const Cart = require('../models/Cart');

// Add or update item in cart
exports.addToCart = async (req, res) => {
  const { productId, qty } = req.body;
  const userId = req.user._id;

  if (!productId || qty < 1) {
    return res.status(400).json({ message: 'Invalid product or quantity' });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, qty }] });
    } else {
      const itemIndex = cart.items.findIndex(
        (i) => i.productId?.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].qty = qty; // Update quantity
      } else {
        cart.items.push({ productId, qty }); // Add new item
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Add to cart error:', err.message);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

// Get cart for current user
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

    if (!cart) return res.json({ items: [] });

    // Remove any invalid items where product no longer exists
    cart.items = cart.items.filter(item => item.productId !== null);
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error('Get cart error:', err.message);
    res.status(500).json({ message: 'Failed to load cart' });
  }
};

//Remove item from cart (handles missing/null productId safely)
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const initialLength = cart.items.length;

    cart.items = cart.items.filter(
      item => item.productId && item.productId.toString() !== productId
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    await cart.save();
    res.json({ message: 'Item removed from cart', cart });
  } catch (err) {
    console.error('Remove from cart error:', err.message);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
};

// Clear cart (optional, after placing order)
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('Clear cart error:', err.message);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};
