// Middleware xử lý lỗi tập trung
// Nó nhận 4 tham số (err, req, res, next)
function errorHandler(err, req, res, next) {
    console.error("-------------------- ERROR --------------------");
    console.error("Error occurred on path:", req.path);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack); // Log stack trace để debug
    console.error("---------------------------------------------");

    // Xác định status code dựa trên lỗi hoặc mặc định là 500
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Không gửi stack trace cho client trong môi trường production
    const responseBody = {
        message: message,
        // ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Chỉ gửi stack khi dev
    };

    res.status(statusCode).json(responseBody);
}

module.exports = errorHandler;