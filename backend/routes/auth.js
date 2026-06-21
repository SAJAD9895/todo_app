const router = require('express').Router();
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../validations/authValidation');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.get('/profile', authenticate, getProfile);

module.exports = router;
