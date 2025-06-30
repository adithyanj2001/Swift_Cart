const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      qty: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Ordered', 'Dispatched', 'In Transit', 'Delivered'],
    default: 'Ordered'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Online'],
    default: 'Cash'
  },
  shippingInfo: {
    name: String,
    phone: String,
    address: String,
    pin: String,
    state: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
