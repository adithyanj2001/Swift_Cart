const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const User = require('../models/User');

// Get assigned deliveries with order, customer, and product details
exports.getAssignedDeliveries = async (req, res) => {
  try {
    console.log("Agent user:", req.user);

    const deliveries = await Delivery.find({ agentId: req.user._id })
      .populate({
        path: 'orderId',
        populate: [
          {
            path: 'items.productId',
            model: 'Product'
          },
          {
            path: 'userId',
            model: 'User',
            select: 'name email'
          }
        ]
      });

    const formatted = deliveries.map((delivery) => {
      const order = delivery.orderId;

      if (!order || !order.userId) {
        return {
          _id: delivery._id,
          orderId: null,
          customer: null,
          products: [],
          shippingInfo: null,
          statusUpdates: delivery.statusUpdates
        };
      }

      return {
        _id: delivery._id,
        orderId: {
          _id: order._id,
          total: order.total
        },
        customer: {
          _id: order.userId._id,
          name: order.userId.name,
          email: order.userId.email
        },
        products: order.items.map(i => ({
          name: i.productId?.name || 'Unknown Product',
          qty: i.qty
        })),
        shippingInfo: order.shippingInfo || {},
        statusUpdates: delivery.statusUpdates
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching deliveries:', err.message);
    res.status(500).json({ message: 'Failed to load deliveries. Check backend logs.' });
  }
};

// Update delivery status
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['Assigned', 'Dispatched', 'In Transit', 'Delivered'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const delivery = await Delivery.findOne({ _id: id, agentId: req.user._id });
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found or unauthorized' });
    }

    delivery.statusUpdates.push({ status, timestamp: new Date() });
    await delivery.save();

    res.json({
      message: `Status updated to '${status}'`,
      statusTimeline: delivery.statusUpdates,
      deliveryId: delivery._id
    });
  } catch (err) {
    console.error('Error updating delivery status:', err.message);
    res.status(500).json({ message: 'Failed to update status' });
  }
};
