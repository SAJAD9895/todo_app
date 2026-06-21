const { validationResult } = require('express-validator');
const { User } = require('../models');
const { generateToken } = require('../config/jwt');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array());
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 409);
    }

    const user = await User.create({ name, email, password });
    const token = generateToken({ id: user.id, email: user.email });

    return successResponse(res, 'Registration successful', { user, token }, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array());
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = generateToken({ id: user.id, email: user.email });

    return successResponse(res, 'Login successful', { user, token });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    return successResponse(res, 'Profile retrieved', { user: req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile };
