const { Url } = require('../models/url.model'); // Chỉ cần import Model Url
const generateUniqueId = require('../utils/idGenerator');
const makeSecureID = require('../utils/idGenerator'); // Tạo ID ngắn hơn và an toàn hơn
const { Op } = require('sequelize'); // Import Operators nếu cần query phức tạp

class UrlService {
    /**
     * Tìm URL gốc dựa trên ID ngắn.
     * @param {string} shortId - ID ngắn cần tìm.
     * @returns {Promise<string|null>} - URL gốc hoặc null nếu không tìm thấy.
     */
    async getOriginalUrl(shortId) {
        try {
            const urlEntry = await Url.findByPk(shortId); // findByPk là cách hiệu quả để tìm bằng Primary Key
            return urlEntry ? urlEntry.originalUrl : null;
        } catch (error) {
            console.error("Error finding original URL:", error);
            // Ném lỗi để controller hoặc error handler xử lý
            throw new Error('Database error while finding URL.');
        }
    }

    /**
     * Tạo một ID ngắn mới cho một URL gốc.
     * Đảm bảo ID là duy nhất.
     * @param {string} originalUrl - URL gốc cần rút gọn.
     * @returns {Promise<string>} - ID ngắn đã được tạo.
     */
    async shortenUrl(originalUrl) {
        // Tùy chọn: Kiểm tra xem URL này đã tồn tại trong DB chưa để trả về ID cũ
        try {
             const existingUrl = await Url.findOne({ where: { originalUrl: originalUrl } });
             if (existingUrl) {
                 console.log(`URL ${originalUrl} already exists with ID: ${existingUrl.id}`);
                 return existingUrl.id; // Trả về ID đã có
             }
        } catch (error) {
             console.error("Error checking existing URL:", error);
             // Có thể bỏ qua lỗi này và tiếp tục tạo mới, hoặc ném lỗi tùy logic
        }


        let shortId;
        let isUnique = false;
        let retries = 0;
        const maxRetries = 5; // Giới hạn số lần thử tạo ID để tránh vòng lặp vô hạn

        while (!isUnique && retries < maxRetries) {
            // shortId = generateUniqueId(); // Tạo ID mới
            shortId = makeSecureID(7);
            try {
                const existing = await Url.findByPk(shortId);
                if (!existing) {
                    isUnique = true; // ID này chưa tồn tại, có thể sử dụng
                } else {
                    console.warn(`ID collision detected for: ${shortId}. Retrying...`);
                    retries++;
                }
            } catch (error) {
                console.error("Error checking ID uniqueness:", error);
                throw new Error('Database error while checking ID uniqueness.');
            }
        }

        if (!isUnique) {
            // Không thể tạo ID duy nhất sau số lần thử tối đa
            throw new Error('Failed to generate a unique short ID after multiple attempts.');
        }

        // Lưu vào database
        try {
            const newUrlEntry = await Url.create({
                id: shortId,
                originalUrl: originalUrl
            });
            console.log(`Created new short URL: ${shortId} for ${originalUrl}`);
            return newUrlEntry.id;
        } catch (error) {
            // Bắt lỗi validation từ Sequelize (ví dụ: originalUrl không hợp lệ)
            if (error.name === 'SequelizeValidationError') {
                // Lấy thông báo lỗi cụ thể hơn
                const messages = error.errors.map(e => e.message).join(', ');
                console.error("Validation Error creating URL:", messages);
                throw new Error(`Invalid input: ${messages}`);
            }
            console.error("Error creating new URL entry:", error);
            throw new Error('Database error while creating new URL.');
        }
    }

    // Có thể thêm các phương thức khác: deleteUrl, updateUrl, getStats, etc.
}

// Export một instance của Service để đảm bảo tính singleton (tuỳ chọn)
module.exports = new UrlService();