const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ['customer', 'vendor', 'agent', 'admin'],
    default: 'customer'
  },

  // Phone number validated only for vendor/agent
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        if (this.role === 'vendor' || this.role === 'agent') {
          return /^\d{10}$/.test(v); // must be 10 digits
        }
        return true; // not required for customer/admin
      },
      message: props => `${props.value} is not a valid 10-digit phone number`
    }
  },

  region: { type: String },     // for agent
  address: { type: String },    // for vendor
  place: { type: String },      // for vendor
  category: { type: String },   // optional vendor field

}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison method
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
