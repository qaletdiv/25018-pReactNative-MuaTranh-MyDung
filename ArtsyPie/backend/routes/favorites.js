const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const favoritesController = require('../controllers/favoritesController');

// Tất cả routes đều yêu cầu authentication
router.use(authenticateToken);

// Thêm vào yêu thích
router.post('/add', favoritesController.addToFavorites);

// Xóa khỏi yêu thích
router.post('/remove', favoritesController.removeFromFavorites);

// Lấy danh sách yêu thích
router.get('/', favoritesController.getFavorites);

module.exports = router; 