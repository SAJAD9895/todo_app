const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Todo } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

const getTodos = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array());
    }

    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      priority,
      category,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = { userId: req.user.id };

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = { [Op.iLike]: `%${category}%` };

    const { count, rows: todos } = await Todo.findAndCountAll({
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset,
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    return paginatedResponse(res, 'Todos retrieved successfully', todos, {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      hasNext: parseInt(page) < totalPages,
      hasPrev: parseInt(page) > 1,
    });
  } catch (error) {
    next(error);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!todo) return errorResponse(res, 'Todo not found', 404);
    return successResponse(res, 'Todo retrieved', todo);
  } catch (error) {
    next(error);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array());
    }

    const { title, description, priority, status, category, dueDate, reminderTime } = req.body;

    const todo = await Todo.create({
      userId: req.user.id,
      title,
      description,
      priority: priority || 'medium',
      status: status || 'pending',
      category,
      dueDate,
      reminderTime,
    });

    return successResponse(res, 'Todo created successfully', todo, 201);
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array());
    }

    const todo = await Todo.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!todo) return errorResponse(res, 'Todo not found', 404);

    const { title, description, priority, status, category, dueDate, reminderTime } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;
    if (category !== undefined) updates.category = category;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (reminderTime !== undefined) updates.reminderTime = reminderTime;

    await todo.update(updates);

    return successResponse(res, 'Todo updated successfully', todo);
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!todo) return errorResponse(res, 'Todo not found', 404);
    await todo.destroy();
    return successResponse(res, 'Todo deleted successfully');
  } catch (error) {
    next(error);
  }
};

const bulkDelete = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return errorResponse(res, 'Please provide an array of todo IDs', 400);
    }

    const deleted = await Todo.destroy({
      where: { id: { [Op.in]: ids }, userId: req.user.id },
    });

    return successResponse(res, `${deleted} todo(s) deleted successfully`, { deletedCount: deleted });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTodos, getTodoById, createTodo, updateTodo, deleteTodo, bulkDelete };
