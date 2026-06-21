const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

let sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const User = require('./User')(sequelize);
const Todo = require('./Todo')(sequelize);

// Associations
User.hasMany(Todo, { foreignKey: 'userId', as: 'todos', onDelete: 'CASCADE' });
Todo.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { sequelize, Sequelize, User, Todo };
