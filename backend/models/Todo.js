const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Todo = sequelize.define('Todo', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
      defaultValue: 'pending',
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reminderTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'todos',
    indexes: [
      { fields: ['userId'] },
      { fields: ['status'] },
      { fields: ['priority'] },
      { fields: ['dueDate'] },
    ],
  });

  return Todo;
};
