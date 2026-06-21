const { Op, fn, col, literal } = require('sequelize');
const { Todo, sequelize } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const [
      total,
      completed,
      pending,
      inProgress,
      overdue,
      todayTasks,
      priorityStats,
      weeklyStats,
    ] = await Promise.all([
      // Total
      Todo.count({ where: { userId } }),
      // Completed
      Todo.count({ where: { userId, status: 'completed' } }),
      // Pending
      Todo.count({ where: { userId, status: 'pending' } }),
      // In Progress
      Todo.count({ where: { userId, status: 'in_progress' } }),
      // Overdue (due date passed and not completed)
      Todo.count({
        where: {
          userId,
          dueDate: { [Op.lt]: now },
          status: { [Op.ne]: 'completed' },
        },
      }),
      // Today's tasks
      Todo.count({
        where: {
          userId,
          dueDate: { [Op.between]: [todayStart, todayEnd] },
        },
      }),
      // Priority breakdown
      Todo.findAll({
        where: { userId },
        attributes: ['priority', [fn('COUNT', col('id')), 'count']],
        group: ['priority'],
        raw: true,
      }),
      // Last 7 days task creation
      sequelize.query(
        `SELECT DATE("createdAt") as date, COUNT(*) as count
         FROM todos
         WHERE "userId" = :userId
           AND "createdAt" >= NOW() - INTERVAL '7 days'
         GROUP BY DATE("createdAt")
         ORDER BY date ASC`,
        { replacements: { userId }, type: sequelize.QueryTypes.SELECT }
      ),
    ]);

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const priorityMap = { low: 0, medium: 0, high: 0 };
    priorityStats.forEach(({ priority, count }) => {
      priorityMap[priority] = parseInt(count);
    });

    return successResponse(res, 'Dashboard stats retrieved', {
      overview: {
        total,
        completed,
        pending,
        inProgress,
        overdue,
        todayTasks,
        completionRate,
      },
      priorityBreakdown: priorityMap,
      weeklyActivity: weeklyStats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
