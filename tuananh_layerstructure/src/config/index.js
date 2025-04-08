require('dotenv').config(); // Đảm bảo dotenv được gọi ở đây nữa

module.exports = {
  port: process.env.PORT,
  database: {
    storage: process.env.DB_STORAGE,
    dialect: 'sqlite' // Hoặc có thể lấy từ .env nếu muốn linh hoạt hơn
  }
};