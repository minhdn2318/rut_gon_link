const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database'); // Import sequelize instance đã cấu hình

class Url extends Model {
    // Có thể thêm các phương thức helper vào đây nếu cần
}

Url.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING, // ID ngắn sẽ là string
    primaryKey: true,
    allowNull: false,
    // Không cần autoIncrement vì chúng ta tự tạo ID
  },
  originalUrl: {
    type: DataTypes.STRING, // Lưu URL gốc
    allowNull: false,
    validate: {
      isUrl: true // Sequelize cung cấp sẵn validator cho URL
    }
  },
  // Có thể thêm các trường khác nếu muốn: createdAt, clickCount, userId, etc.
  // Sequelize tự động thêm createdAt và updatedAt nếu không disable timestamps
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Url', // Tên của model trong Sequelize
  tableName: 'urls', // Tên bảng trong database (mặc định Sequelize sẽ tự tạo dạng số nhiều: 'Urls')
  // timestamps: true // Mặc định là true, tự thêm createdAt, updatedAt
});

// Quan trọng: Export cả class Model và sequelize instance để sử dụng ở nơi khác nếu cần
module.exports = { Url, sequelize };