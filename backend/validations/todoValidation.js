const { body, query } = require('express-validator');

const createTodoValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),

  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed']).withMessage('Status must be pending, in_progress, or completed'),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Category cannot exceed 100 characters'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid date')
    .toDate(),

  body('reminderTime')
    .optional()
    .isISO8601().withMessage('Reminder time must be a valid date')
    .toDate(),
];

const updateTodoValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),

  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed']).withMessage('Status must be pending, in_progress, or completed'),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Category cannot exceed 100 characters'),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid date')
    .toDate(),

  body('reminderTime')
    .optional({ nullable: true })
    .isISO8601().withMessage('Reminder time must be a valid date')
    .toDate(),
];

const getTodosValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'in_progress', 'completed']).withMessage('Invalid status'),
  query('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'dueDate', 'title', 'priority']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC'),
];

module.exports = { createTodoValidation, updateTodoValidation, getTodosValidation };
