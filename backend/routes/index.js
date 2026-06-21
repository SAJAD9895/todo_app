const router = require('express').Router();
const authRoutes = require('./auth');
const todoRoutes = require('./todos');
const dashboardRoutes = require('./dashboard');

router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
