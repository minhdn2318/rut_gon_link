function loggerMiddleware(req, res, next) {
    const start = Date.now();
    res.on('finish', () => { // Sự kiện 'finish' được kích hoạt khi response đã được gửi đi
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} [${duration}ms]`);
    });
    next(); // Chuyển sang middleware hoặc route handler tiếp theo
  }
  
  module.exports = loggerMiddleware;