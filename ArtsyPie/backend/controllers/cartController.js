const fs = require('fs');
const path = require('path');

const cartFilePath = path.join(__dirname, '../data/cart.json');

const readCart = () => {
  try {
    if (!fs.existsSync(cartFilePath)) {
      fs.writeFileSync(cartFilePath, '{}', 'utf8');
    }
    const data = fs.readFileSync(cartFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Lỗi khi đọc file cart.json:", error);
    return {};
  }
};

const writeCart = (cart) => {
  fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2), 'utf8');
};

exports.addToCart = (req, res) => {
  const { productId, quantity = 1, size, frame } = req.body;
  const userId = req.user.id;
  
  const cart = readCart();
  
  if (!cart[userId]) {
    cart[userId] = [];
  }
  
  const existingItem = cart[userId].find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart[userId].push({
      productId,
      quantity,
      size,
      frame,
      addedAt: new Date().toISOString()
    });
  }
  
  writeCart(cart);
  
  res.status(200).json({ 
    message: 'Đã thêm vào giỏ hàng',
    cart: cart[userId]
  });
};

exports.updateCartItem = (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;
  
  const cart = readCart();
  
  if (cart[userId]) {
    const item = cart[userId].find(item => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        cart[userId] = cart[userId].filter(item => item.productId !== productId);
      } else {
        item.quantity = quantity;
      }
      writeCart(cart);
    }
  }
  
  res.status(200).json({ 
    message: 'Đã cập nhật giỏ hàng',
    cart: cart[userId] || []
  });
};

exports.removeFromCart = (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;
  
  const cart = readCart();
  
  if (cart[userId]) {
    cart[userId] = cart[userId].filter(item => item.productId !== productId);
    writeCart(cart);
  }
  
  res.status(200).json({ 
    message: 'Đã xóa khỏi giỏ hàng',
    cart: cart[userId] || []
  });
};

exports.getCart = (req, res) => {
  const userId = req.user.id;
  const cart = readCart();
  
  res.status(200).json({ 
    cart: cart[userId] || []
  });
}; 