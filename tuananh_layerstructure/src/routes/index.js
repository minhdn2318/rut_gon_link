const express = require('express');
const urlRoutes = require('./url.routes');

const router = express.Router();

// Mount các route của từng module vào router chính
router.use('/', urlRoutes); // Gắn urlRoutes vào gốc của /api/v1 (hoặc có thể thêm tiền tố /urls)

// Có thể thêm các route modules khác ở đây
// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);

module.exports = router;