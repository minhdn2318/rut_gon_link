const express = require('express');
const urlController = require('../controllers/url.controller');
const { validateCreateUrl } = require('../middlewares/validator'); // Import validator middleware

const router = express.Router();

// Route để tạo short URL mới
// Áp dụng middleware validation trước khi vào controller
router.post('/create', validateCreateUrl, urlController.createShortUrl);

// Route để lấy URL gốc và redirect (nên đặt ngoài /api/v1 nếu muốn URL ngắn gọn вида domain.com/abc)
// Nếu muốn giữ trong API:
// router.get('/short/:id', urlController.redirectToOriginalUrl);

// Nếu muốn đặt route redirect ở root (ví dụ: localhost:3000/abcdef)
// thì cần định nghĩa nó trong app.js *trước* khi mount /api/v1
// Ví dụ trong app.js:
// const urlCtrl = require('./controllers/url.controller');
// app.get('/:id', urlCtrl.redirectToOriginalUrl); // Đặt trước app.use('/api/v1', apiRoutes);

// Trong trường hợp này, ta sẽ định nghĩa route redirect trong app.js để URL ngắn gọn hơn.
// Nếu bạn muốn nó là /api/v1/short/:id, hãy bỏ comment dòng trên và comment phần tương ứng trong app.js

module.exports = router;