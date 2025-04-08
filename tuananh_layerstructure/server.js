// Load biến môi trường từ file .env
require('dotenv').config();

const app = require('./src/app');
const { sequelize } = require('./src/models/url.model'); // Import để đảm bảo kết nối và đồng bộ model
const config = require('./src/config');

const port = config.port || 3000;

const startServer = async () => {
    try {
        // Xác thực kết nối DB và đồng bộ models
        // force: false -> không xóa bảng cũ nếu tồn tại
        // force: true -> xóa bảng cũ và tạo lại (dùng trong development)
        await sequelize.sync({ force: false });
        console.log('Database connection established and models synchronized.');

        app.listen(port, () => {
            console.log(`CS1 app listening on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
    }
};

startServer();