const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const cartController = require('../controllers/cartController');

// Tất cả routes đều yêu cầu authentication
router.use(authenticateToken);

// Thêm vào giỏ hàng
router.post('/add', cartController.addToCart);

// Cập nhật số lượng
router.put('/update', cartController.updateCartItem);

// Xóa khỏi giỏ hàng
router.delete('/remove', cartController.removeFromCart);

// Lấy giỏ hàng
router.get('/', cartController.getCart);

module.exports = router; 