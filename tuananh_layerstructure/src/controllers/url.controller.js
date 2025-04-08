const urlService = require('../services/url.service.js');
const { validationResult } = require('express-validator');
// const { successResponse, errorResponse } = require('../utils/apiResponse'); // Tùy chọn dùng response handler

class UrlController {
    /**
     * Chuyển hướng đến URL gốc hoặc trả về 404.
     * GET /:id (Lưu ý: Route này nên được định nghĩa ở root hoặc ngoài /api/v1)
     * Hoặc GET /api/v1/short/:id nếu muốn giữ trong API
     */
    async redirectToOriginalUrl(req, res, next) {
        try {
            const shortId = req.params.id;
            if (!shortId) {
                 // return errorResponse(res, 400, 'Short ID is required.'); // Dùng response handler
                 return res.status(400).json({ message: 'Short ID is required.' });
            }

            const originalUrl = await urlService.getOriginalUrl(shortId);

            if (originalUrl) {
                console.log(`Redirecting ${shortId} to ${originalUrl}`);
                // Thực hiện redirect thực tế
                res.redirect(301, originalUrl); // 301 Moved Permanently tốt cho SEO
            } else {
                console.log(`Short ID ${shortId} not found.`);
                 // return errorResponse(res, 404, 'Short URL not found.'); // Dùng response handler
                 res.status(404).send('<h1>404 - Short URL Not Found</h1>');
            }
        } catch (error) {
            // Chuyển lỗi đến error handling middleware
            next(error);
        }
    }

    /**
     * Tạo một short URL mới.
     * POST /api/v1/create
     * Body: { "url": "https://example.com" }
     */
    async createShortUrl(req, res, next) {
        // 1. Kiểm tra lỗi validation từ middleware
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
             // return errorResponse(res, 400, 'Validation Failed', errors.array()); // Dùng response handler
             return res.status(400).json({ message: 'Validation Failed', errors: errors.array() });
        }

        try {
            const { url } = req.body; // Lấy url từ body thay vì query string

            const shortId = await urlService.shortenUrl(url);

            // Trả về ID ngắn đã tạo
            const fullShortUrl = `${req.protocol}://${req.get('host')}/${shortId}`; // Tạo URL đầy đủ (tùy chọn)

            // return successResponse(res, 201, 'Short URL created successfully', { shortId, fullShortUrl }); // Dùng response handler
            res.status(201).json({
                 message: 'Short URL created successfully',
                 shortId: shortId,
                 // fullShortUrl: fullShortUrl // Trả về URL đầy đủ nếu muốn
            });

        } catch (error) {
             // Bắt lỗi cụ thể từ service nếu cần xử lý khác nhau
             if (error.message.includes('Invalid input')) {
                  // return errorResponse(res, 400, error.message);
                  return res.status(400).json({ message: error.message });
             }
            // Chuyển các lỗi khác đến error handling middleware
            next(error);
        }
    }
}

// Export một instance của Controller
module.exports = new UrlController();