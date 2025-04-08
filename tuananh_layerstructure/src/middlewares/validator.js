const { body, validationResult } = require('express-validator');

// Middleware để kiểm tra dữ liệu đầu vào cho route /create
const validateCreateUrl = [
  // Kiểm tra 'url' trong body request
  body('url')
    .trim() // Xóa khoảng trắng thừa
    .notEmpty().withMessage('URL is required.') // Không được rỗng
    .isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('Invalid URL format. Must include http:// or https://'), // Phải là URL hợp lệ

  // Middleware con để kiểm tra kết quả validation
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       // Nếu có lỗi, trả về 400 Bad Request với danh sách lỗi
//       return res.status(400).json({ message: 'Validation Failed', errors: errors.array() });
//     }
//     // Nếu không có lỗi, chuyển sang middleware/controller tiếp theo
//     next();
//   }
  // Bỏ phần kiểm tra ở đây, để controller tự gọi validationResult() và xử lý
];


module.exports = {
  validateCreateUrl
};