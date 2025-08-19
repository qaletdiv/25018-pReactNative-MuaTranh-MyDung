const fs = require('fs');
const path = require('path');

const cartDataPath = path.join(__dirname, '../data/cart.json');

// Đảm bảo file cart.json tồn tại
function ensureCartFile() {
  if (!fs.existsSync(cartDataPath)) {
    fs.writeFileSync(cartDataPath, JSON.stringify({}, null, 2));
  }
}

// Đọc dữ liệu cart
function readCartData() {
  ensureCartFile();
  const data = fs.readFileSync(cartDataPath, 'utf8');
  return JSON.parse(data);
}

// Ghi dữ liệu cart
function writeCartData(data) {
  ensureCartFile();
  fs.writeFileSync(cartDataPath, JSON.stringify(data, null, 2));
}

// Tính tổng giá trị giỏ hàng
function calculateCartTotal(items) {
  return items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
}

// Lấy giỏ hàng của user
function getUserCart(userId) {
  const cartData = readCartData();
  const userCart = cartData[userId] || { items: [], total: 0, itemCount: 0 };
  
  // Tính lại tổng giá trị
  userCart.total = calculateCartTotal(userCart.items);
  userCart.itemCount = userCart.items.reduce((total, item) => total + item.quantity, 0);
  
  return userCart;
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(userId, productData) {
  const cartData = readCartData();
  
  if (!cartData[userId]) {
    cartData[userId] = { items: [], total: 0, itemCount: 0 };
  }
  
  const { productId, quantity = 1, product, selectedOptions } = productData;
  
  // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
  const existingItemIndex = cartData[userId].items.findIndex(item => 
    item.productId === productId && 
    JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
  );
  
  if (existingItemIndex !== -1) {
    // Nếu đã có cùng product và options, cập nhật số lượng
    cartData[userId].items[existingItemIndex].quantity += quantity;
  } else {
    // Nếu chưa có, thêm mới
    cartData[userId].items.push({
      productId,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        images: product.images,
        artist: product.artist,
        description: product.description,
        type: product.type,
        style: product.style
      },
      selectedOptions: selectedOptions || {
        size: 'Standard',
        frame: 'No Frame'
      },
      addedAt: new Date().toISOString()
    });
  }
  
  // Cập nhật tổng số lượng và giá trị
  cartData[userId].itemCount = cartData[userId].items.reduce((total, item) => total + item.quantity, 0);
  cartData[userId].total = calculateCartTotal(cartData[userId].items);
  
  writeCartData(cartData);
  return cartData[userId];
}

// Cập nhật số lượng sản phẩm
function updateCartItem(userId, productId, quantity, selectedOptions) {
  const cartData = readCartData();
  
  if (!cartData[userId]) {
    throw new Error('Giỏ hàng không tồn tại');
  }
  
  const itemIndex = cartData[userId].items.findIndex(item => 
    item.productId === productId && 
    JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
  );
  
  if (itemIndex === -1) {
    throw new Error('Sản phẩm không có trong giỏ hàng');
  }
  
  if (quantity <= 0) {
    // Xóa sản phẩm nếu số lượng <= 0
    cartData[userId].items.splice(itemIndex, 1);
  } else {
    cartData[userId].items[itemIndex].quantity = quantity;
  }
  
  // Cập nhật tổng số lượng và giá trị
  cartData[userId].itemCount = cartData[userId].items.reduce((total, item) => total + item.quantity, 0);
  cartData[userId].total = calculateCartTotal(cartData[userId].items);
  
  writeCartData(cartData);
  return cartData[userId];
}

// Xóa sản phẩm khỏi giỏ hàng theo index
function removeCartItemByIndex(userId, itemIndex) {
  const cartData = readCartData();
  
  if (!cartData[userId]) {
    throw new Error('Giỏ hàng không tồn tại');
  }
  
  if (itemIndex < 0 || itemIndex >= cartData[userId].items.length) {
    throw new Error('Index sản phẩm không hợp lệ');
  }
  
  // Xóa sản phẩm theo index
  cartData[userId].items.splice(itemIndex, 1);
  
  // Cập nhật tổng số lượng và giá trị
  cartData[userId].itemCount = cartData[userId].items.reduce((total, item) => total + item.quantity, 0);
  cartData[userId].total = calculateCartTotal(cartData[userId].items);
  
  writeCartData(cartData);
  return cartData[userId];
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(userId, productId, selectedOptions) {
  const cartData = readCartData();
  
  if (!cartData[userId]) {
    throw new Error('Giỏ hàng không tồn tại');
  }
  
  // Nếu có selectedOptions, xóa sản phẩm cụ thể với options đó
  if (selectedOptions) {
    cartData[userId].items = cartData[userId].items.filter(item => 
      !(item.productId === productId && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
    );
  } else {
    // Nếu không có selectedOptions, xóa tất cả sản phẩm có productId đó (backward compatibility)
    cartData[userId].items = cartData[userId].items.filter(item => item.productId !== productId);
  }
  
  // Cập nhật tổng số lượng và giá trị
  cartData[userId].itemCount = cartData[userId].items.reduce((total, item) => total + item.quantity, 0);
  cartData[userId].total = calculateCartTotal(cartData[userId].items);
  
  writeCartData(cartData);
  return cartData[userId];
}

// Xóa toàn bộ giỏ hàng
function clearCart(userId) {
  const cartData = readCartData();
  
  if (cartData[userId]) {
    cartData[userId] = { items: [], total: 0, itemCount: 0 };
    writeCartData(cartData);
  }
  
  return { items: [], total: 0, itemCount: 0 };
}

module.exports = {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  removeCartItemByIndex,
  clearCart
};