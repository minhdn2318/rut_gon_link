/**
 * Tạo response thành công chuẩn.
 * @param {object} res - Response object của Express.
 * @param {number} statusCode - HTTP status code (mặc định 200).
 * @param {string} message - Thông điệp thành công.
 * @param {object|null} data - Dữ liệu trả về (nếu có).
 * @returns {object} - JSON response.
 */
function successResponse(res, statusCode = 200, message = 'Success', data = null) {
    const response = {
      success: true,
      message: message,
    };
    if (data) {
      response.data = data;
    }
    return res.status(statusCode).json(response);
  }
  
  /**
   * Tạo response lỗi chuẩn.
   * @param {object} res - Response object của Express.
   * @param {number} statusCode - HTTP status code (mặc định 500).
   * @param {string} message - Thông điệp lỗi.
   * @param {object|null} errors - Chi tiết lỗi (ví dụ: validation errors).
   * @returns {object} - JSON response.
   */
  function errorResponse(res, statusCode = 500, message = 'Error', errors = null) {
    const response = {
      success: false,
      message: message,
    };
    if (errors) {
      response.errors = errors;
    }
    return res.status(statusCode).json(response);
  }
  
  module.exports = {
    successResponse,
    errorResponse,
  };