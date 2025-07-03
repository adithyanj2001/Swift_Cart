const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register new user
const register = async (req, res) => {
  const { name, email, password, role, region, address, place, category } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const userData = { name, email, password, role };
    if (role === 'agent') userData.region = region;
    if (role === 'vendor') {
      userData.address = address;
      userData.place = place;
      userData.category = category;
    }

    const user = await User.create(userData);
    const token = generateToken(user);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get logged-in user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

// ✅ Google Login
const googleLogin = async (req, res) => {
  const { email, name, picture } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).slice(-8), // generate random password
        role: 'customer'
      });
    }

    const token = generateToken(user);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Google login failed' });
  }
};

// Export all handlers properly
module.exports = {
  register,
  login,
  getMe,
  googleLogin
};
