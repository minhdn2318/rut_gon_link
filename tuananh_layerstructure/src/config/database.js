const { Sequelize } = require('sequelize');
const config = require('./index');

// Khởi tạo Sequelize instance
const sequelize = new Sequelize({
  dialect: config.database.dialect,
  storage: config.database.storage,
  logging: false // Tắt log SQL query của Sequelize cho gọn console, bật (true) nếu cần debug
});

module.exports = sequelize;