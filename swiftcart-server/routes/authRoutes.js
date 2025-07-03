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
router.post('/google', googleLogin); //  googleLogin is defined
router.get('/me', authMiddleware, getMe);

module.exports = router;


