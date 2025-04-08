const express = require('express');
const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const loggerMiddleware = require('./middlewares/logger');
const urlController = require('./controllers/url.controller'); // Import controller

const app = express();

// --- Middlewares ---
app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Redirect Route (Root level) ---
// Route này phải được định nghĩa TRƯỚC route /api/v1 để không bị ghi đè
app.get('/:id', urlController.redirectToOriginalUrl);

// --- API Routes ---
app.use('/api/v1', apiRoutes);

// --- Trang chủ đơn giản ---
app.get('/', (req, res) => {
  res.send('<h1>Welcome to URL Shortener API</h1> <p>Use POST /api/v1/create to shorten a URL and GET /:id to redirect.</p>');
});

// --- Middleware xử lý lỗi tập trung ---
app.use(errorHandler);

module.exports = app;