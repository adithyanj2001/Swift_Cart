const User = require('../models/User');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery'); 

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).select('-password');
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create vendor
exports.createVendor = async (req, res) => {
  try {
    const { name, email, phone, address, city } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Vendor already exists' });

    const newVendor = await User.create({
      name,
      email,
      phone,
      address,
      city,
      password: 'vendor123',
      role: 'vendor'
    });

    res.status(201).json(newVendor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update vendor
exports.updateVendor = async (req, res) => {
  try {
    const vendor = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete vendor
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await User.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password');
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create agent
exports.createAgent = async (req, res) => {
  try {
    const { name, email, phone, region, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Agent already exists' });

    const newAgent = await User.create({
      name,
      email,
      phone,
      region,
      password,
      role: 'agent'
    });

    res.status(201).json({ message: 'Agent created', agent: newAgent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update agent
exports.updateAgent = async (req, res) => {
  try {
    const agent = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete agent
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await User.findByIdAndDelete(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json({ message: 'Agent deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all transactions with detailed info for Admin Sales Report
exports.getAllTransactions = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('vendorId', 'name email');

    const deliveries = await Delivery.find().populate('agentId', 'name email');
    const deliveryMap = {};
    deliveries.forEach(delivery => {
      deliveryMap[delivery.orderId.toString()] = delivery.agentId?.name || 'Not Assigned';
    });

    const transactions = orders.map(order => ({
      _id: order._id,
      date: order.createdAt,
      time: new Date(order.createdAt).toLocaleTimeString(),
      amount: order.total,
      status: order.status,
      customerName: order.userId?.name || 'Unknown',
      vendorName: order.vendorId?.name || 'Unknown',
      paymentMethod: order.paymentMethod,
      agentName: deliveryMap[order._id.toString()] || 'Not Assigned',
    }));

    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transaction details:', err);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};
