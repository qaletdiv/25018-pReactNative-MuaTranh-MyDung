const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


const mockUserMiddleware = (req, res, next) => {
  req.user = { id: 'user123' }; 
  next();
};

// GET /api/cart - Get user's cart
router.get('/', mockUserMiddleware, (req, res) => {
  try {
    const userId = req.user.id;
    const cart = cartController.getUserCart(userId);
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
});

// POST /api/cart - Add item to cart
router.post('/', mockUserMiddleware, (req, res) => {
  try {
    const { productId, quantity, product, selectedOptions } = req.body;
    const userId = req.user.id;
    
    if (!productId || !product) {
      return res.status(400).json({ 
        success: false,
        message: 'Thiếu productId hoặc product details' 
      });
    }
    
    const cart = cartController.addToCart(userId, {
      productId,
      quantity: quantity || 1,
      product,
      selectedOptions
    });
    
    res.status(201).json({ 
      success: true,
      message: 'Sản phẩm đã được thêm vào giỏ hàng',
      data: cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
});

// PUT /api/cart/:productId - Update cart item quantity
router.put('/:productId', mockUserMiddleware, (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, selectedOptions } = req.body;
    const userId = req.user.id;
    
    if (quantity === undefined) {
      return res.status(400).json({ 
        success: false,
        message: 'Thiếu quantity' 
      });
    }
    
    const cart = cartController.updateCartItem(userId, productId, quantity, selectedOptions);
    res.json({ 
      success: true,
      message: 'Số lượng đã được cập nhật',
      data: cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
});

// DELETE /api/cart/:productId - Remove item from cart
router.delete('/:productId', mockUserMiddleware, (req, res) => {
  try {
    const { productId } = req.params;
    const { selectedOptions } = req.body;
    const userId = req.user.id;
    
    const cart = cartController.removeFromCart(userId, productId, selectedOptions);
    res.json({ 
      success: true,
      message: 'Sản phẩm đã được xóa khỏi giỏ hàng',
      data: cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
});

// DELETE /api/cart/item/:index - Remove specific cart item by index
router.delete('/item/:index', mockUserMiddleware, (req, res) => {
  try {
    const { index } = req.params;
    const userId = req.user.id;
    
    const cart = cartController.removeCartItemByIndex(userId, parseInt(index));
    res.json({ 
      success: true,
      message: 'Sản phẩm đã được xóa khỏi giỏ hàng',
      data: cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
});

// DELETE /api/cart - Clear entire cart
router.delete('/', mockUserMiddleware, (req, res) => {
  try {
    const userId = req.user.id;
    const cart = cartController.clearCart(userId);
    res.json({ 
      success: true,
      message: 'Giỏ hàng đã được làm trống',
      data: cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
});

module.exports = router;