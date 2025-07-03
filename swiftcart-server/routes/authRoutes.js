// const express = require('express');
// const router = express.Router();
// const { register, login, getMe } = require('../controllers/authController');
// const authMiddleware = require('../middleware/authMiddleware');

// // Public routes
// router.post('/register', register);
// router.post('/login', login);

// // Protected route to get current user info
// router.get('/me', authMiddleware, getMe);

// module.exports = router;


const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  googleLogin,
} = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin); // ✅ Make sure googleLogin is defined
router.get('/me', authMiddleware, getMe);

module.exports = router;


