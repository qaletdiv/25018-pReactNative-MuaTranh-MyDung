const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById, createOrder, updateOrderStatus } = require('../controllers/orderController');


const mockUserMiddleware = (req, res, next) => {
  req.user = { id: 'user123', name: 'Test User' };
  next();
};

router.use(mockUserMiddleware);

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;