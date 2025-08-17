const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById, createOrder, updateOrderStatus } = require('../controllers/orderController');

// Middleware để xử lý user từ frontend
const userMiddleware = (req, res, next) => {
  // Lấy userId từ header hoặc body
  const userId = req.headers['user-id'] || req.body.userId || req.query.userId;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu userId'
    });
  }
  
  req.user = { id: userId };
  next();
};

// Routes không cần userId
router.get('/', (req, res) => {
  // Lấy tất cả orders (có thể filter theo userId nếu cần)
  getAllOrders(req, res);
});

// Routes cần userId
router.get('/user/:userId', userMiddleware, (req, res) => {
  // Lấy orders của user cụ thể
  getAllOrders(req, res);
});

router.get('/:id', (req, res) => {
  getOrderById(req, res);
});

router.post('/', (req, res) => {
  // Tạo order - userId sẽ được lấy từ body
  createOrder(req, res);
});

router.patch('/:id/status', (req, res) => {
  updateOrderStatus(req, res);
});

module.exports = router;