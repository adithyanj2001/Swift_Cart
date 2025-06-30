const Product = require('../models/Product');

// (vendor only)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, category, imageUrl } = req.body;

    if (!name || !price || !stock || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = await Product.create({
      vendorId: req.user._id,
      name,
      price,
      stock,
      category,
      imageUrl
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//products (public)
exports.getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

//products (vendor only)
exports.getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// products(vendor only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.user._id
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: 'Product not found or unauthorized' });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE  (vendor only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.user._id
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: 'Product not found or unauthorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
