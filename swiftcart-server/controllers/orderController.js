const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Delivery = require('../models/Delivery');
const User = require('../models/User');
const generateInvoice = require('../utils/generateInvoice');
const path = require('path');
const fs = require('fs');

// Assign first available delivery agent
const getAvailableAgent = async () => {
  const agent = await User.findOne({ role: 'agent' });
  if (!agent) throw new Error('No delivery agent available');
  return agent._id;
};

// Place Order
exports.placeOrder = async (req, res) => {
  const userId = req.user._id;
  const { paymentMethod, name, phone, address, pin, state, selectedItems } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      populate: { path: 'vendorId' }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const filteredItems = cart.items.filter(
      (item) => item.productId && selectedItems.includes(item.productId._id.toString())
    );

    if (filteredItems.length === 0) {
      return res.status(400).json({ message: 'No valid selected items found in cart' });
    }

    const grouped = {};
    for (const item of filteredItems) {
      if (!item.productId || !item.productId.vendorId) continue;
      const vendorId = item.productId.vendorId._id.toString();
      if (!grouped[vendorId]) grouped[vendorId] = [];
      grouped[vendorId].push({
        productId: item.productId._id,
        qty: item.qty
      });
    }

    const orders = [];

    for (const vendorId in grouped) {
      const vendorItems = grouped[vendorId];

      let total = 0;
      for (const i of vendorItems) {
        const match = filteredItems.find(fi => fi.productId._id.equals(i.productId));
        if (match) total += match.productId.price * i.qty;
      }

      const newOrder = await Order.create({
        userId,
        vendorId,
        items: vendorItems,
        total,
        paymentMethod,
        shippingInfo: { name, phone, address, pin, state },
      });

      generateInvoice(newOrder, req.user.name);
      await new Promise((resolve) => setTimeout(resolve, 500));

      orders.push(newOrder);

      const agentId = await getAvailableAgent();
      await Delivery.create({
        orderId: newOrder._id,
        agentId,
        statusUpdates: [{ status: 'Assigned', timestamp: new Date() }],
      });
    }

    cart.items = cart.items.filter(
      (item) => !(item.productId && selectedItems.includes(item.productId._id.toString()))
    );
    await cart.save();

    res.status(201).json({ message: 'Order placed successfully ', orders });

  } catch (err) {
    console.error('Order placement error:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

// Download Invoice
exports.downloadInvoice = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isCustomer = req.user._id.toString() === order.userId.toString();
    const isVendor = req.user._id.toString() === order.vendorId.toString();

    const delivery = await Delivery.findOne({ orderId });
    const isAgent = delivery && delivery.agentId.toString() === req.user._id.toString();

    if (!isCustomer && !isVendor && !isAgent) {
      return res.status(403).json({ message: 'Unauthorized to access this invoice' });
    }

    const invoicePath = path.join(__dirname, `../invoices/invoice-${orderId}.pdf`);
    if (!fs.existsSync(invoicePath)) {
      console.warn('Invoice not found, generating again...');
      generateInvoice(order, req.user.name);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    res.download(invoicePath, `invoice-${orderId}.pdf`);
  } catch (err) {
    console.error('Invoice download error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get My Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    const ordersWithDelivery = await Promise.all(
      orders.map(async (order) => {
        const delivery = await Delivery.findOne({ orderId: order._id })
          .populate('agentId', 'name email');

        return {
          ...order.toObject(),
          deliveryTimeline: delivery?.statusUpdates || [],
          deliveryAgent: delivery?.agentId || null,
        };
      })
    );

    res.json(ordersWithDelivery);
  } catch (err) {
    console.error('Get My Orders error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get Vendor Orders
exports.getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const orders = await Order.find({ 'items.productId': { $exists: true } })
      .populate('userId', 'name email')
      .populate('items.productId')
      .sort({ createdAt: -1 });

    const filteredOrders = [];

    for (const order of orders) {
      const vendorItems = order.items.filter(
        (item) => item.productId?.vendorId?.toString() === vendorId.toString()
      );

      if (vendorItems.length > 0) {
        const delivery = await Delivery.findOne({ orderId: order._id })
          .populate('agentId', 'name email');

        filteredOrders.push({
          ...order.toObject(),
          items: vendorItems,
          deliveryAgent: delivery?.agentId || null,
          deliveryTimeline: delivery?.statusUpdates || [],
        });
      }
    }

    res.json(filteredOrders);
  } catch (err) {
    console.error('Get Vendor Orders error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Vendor Sales Summary
exports.getVendorSalesSummary = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const categoryFilter = req.query.category;

    const orders = await Order.find({ vendorId })
      .populate({
        path: 'items.productId',
        select: 'name price category',
      });

    const summary = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = item.productId;
        if (!product) return;
        if (categoryFilter && product.category !== categoryFilter) return;

        const id = product._id.toString();
        if (!summary[id]) {
          summary[id] = {
            productId: id,
            productName: product.name,
            unitsSold: 0,
            revenue: 0,
          };
        }

        summary[id].unitsSold += item.qty;
        summary[id].revenue += item.qty * product.price;
      });
    });

    res.json(Object.values(summary));
  } catch (err) {
    console.error('Vendor sales summary error:', err);
    res.status(500).json({ message: err.message });
  }
};

//Vendor Revenue Chart
exports.getVendorRevenueChart = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const orders = await Order.find({ vendorId }).sort({ createdAt: 1 });

    const monthlyRevenue = {};

    orders.forEach(order => {
      const month = new Date(order.createdAt).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });

      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = 0;
      }

      monthlyRevenue[month] += order.total;
    });

    res.json({
      labels: Object.keys(monthlyRevenue),
      data: Object.values(monthlyRevenue),
    });
  } catch (err) {
    console.error('Vendor revenue chart error:', err);
    res.status(500).json({ message: err.message });
  }
};
// Vendor Sales Summary with optional category filtering
exports.getVendorSalesSummary = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const categoryFilter = req.query.category;

    const orders = await Order.find({ vendorId })
      .populate({
        path: 'items.productId',
        select: 'name price category', // include category
      });

    const summary = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = item.productId;
        if (!product) return;

        if (categoryFilter && product.category !== categoryFilter) return; 

        const id = product._id.toString();
        if (!summary[id]) {
          summary[id] = {
            productId: id,
            productName: product.name,
            unitsSold: 0,
            revenue: 0,
          };
        }

        summary[id].unitsSold += item.qty;
        summary[id].revenue += item.qty * product.price;
      });
    });

    res.json(Object.values(summary));
  } catch (err) {
    console.error('Vendor sales summary error:', err);
    res.status(500).json({ message: err.message });
  }
};

// 📊 Vendor Dashboard Stats API
exports.getVendorDashboardStats = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const products = await Product.find({ vendorId });
    const orders = await Order.find({ vendorId }).sort({ createdAt: 1 });

    let orderCount = orders.length;
    let itemsSold = 0;
    let totalRevenue = 0;
    let deliveredCount = 0;

    const monthlyMap = {};
    const statusMap = {
      Assigned: 0,
      Dispatched: 0,
      'In Transit': 0,
      Delivered: 0,
    };

    const orderIds = orders.map(o => o._id);
    const deliveries = await Delivery.find({ orderId: { $in: orderIds } });

    const deliveryStatusMap = {};

    // Collect latest statuses
    deliveries.forEach(delivery => {
      const updates = delivery.statusUpdates;
      const latest = updates[updates.length - 1]?.status;

      if (latest && statusMap.hasOwnProperty(latest)) {
        statusMap[latest] += 1;
        if (latest === 'Delivered') deliveredCount += 1;
        deliveryStatusMap[delivery.orderId.toString()] = latest;
      }
    });

    for (const order of orders) {
      totalRevenue += order.total;
      for (const item of order.items) {
        itemsSold += item.qty;
      }

      const monthKey = new Date(order.createdAt).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { revenue: 0 };
      }
      monthlyMap[monthKey].revenue += order.total;
    }

    const monthlyOrderStats = Object.entries(monthlyMap).map(([month, values]) => ({
      month,
      revenue: values.revenue,
    }));

    res.json({
      productCount: products.length,
      orderCount,
      itemsSold,
      totalRevenue,
      deliveredCount,
      monthlyOrderStats,
      orderStatusDistribution: statusMap,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Failed to load vendor dashboard stats' });
  }
};




