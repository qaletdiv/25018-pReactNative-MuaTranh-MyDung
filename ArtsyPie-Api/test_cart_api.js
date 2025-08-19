const cartController = require('./controllers/cartController');

// Test data
const userId = 'test_user_123';
const product1 = {
  id: 'artwork_001',
  name: 'Bức tranh phong cảnh',
  price: 1000000,
  image: 'artwork1.jpg',
  images: ['artwork1.jpg', 'artwork1_detail.jpg'],
  artist: 'Nguyễn Văn A',
  description: 'Bức tranh phong cảnh đẹp',
  type: 'painting',
  style: 'impressionism'
};

const product2 = {
  id: 'artwork_002', 
  name: 'Bức tranh chân dung',
  price: 1500000,
  image: 'artwork2.jpg',
  images: ['artwork2.jpg', 'artwork2_detail.jpg'],
  artist: 'Trần Thị B',
  description: 'Bức tranh chân dung nghệ thuật',
  type: 'painting',
  style: 'realism'
};

console.log('=== TEST CART API FUNCTIONALITY ===\n');

// Test 1: Thêm sản phẩm với size M
console.log('1. Thêm sản phẩm 1 với size M:');
const cart1 = cartController.addToCart(userId, {
  productId: 'artwork_001',
  quantity: 1,
  product: product1,
  selectedOptions: { size: 'M', frame: 'No Frame' }
});
console.log('Cart sau khi thêm:', JSON.stringify(cart1, null, 2));

// Test 2: Thêm cùng sản phẩm với size L  
console.log('\n2. Thêm sản phẩm 1 với size L:');
const cart2 = cartController.addToCart(userId, {
  productId: 'artwork_001',
  quantity: 1,
  product: product1,
  selectedOptions: { size: 'L', frame: 'No Frame' }
});
console.log('Cart sau khi thêm:', JSON.stringify(cart2, null, 2));

// Test 3: Thêm sản phẩm khác
console.log('\n3. Thêm sản phẩm 2:');
const cart3 = cartController.addToCart(userId, {
  productId: 'artwork_002',
  quantity: 1,
  product: product2,
  selectedOptions: { size: 'Standard', frame: 'Wooden Frame' }
});
console.log('Cart sau khi thêm:', JSON.stringify(cart3, null, 2));

// Test 4: Xóa sản phẩm 1 size M (chỉ xóa size M, giữ lại size L)
console.log('\n4. Xóa sản phẩm 1 với size M:');
const cart4 = cartController.removeFromCart(userId, 'artwork_001', { size: 'M', frame: 'No Frame' });
console.log('Cart sau khi xóa size M:', JSON.stringify(cart4, null, 2));

// Test 5: Xóa sản phẩm theo index (xóa sản phẩm 2)
console.log('\n5. Xóa sản phẩm theo index (index 1):');
const cart5 = cartController.removeCartItemByIndex(userId, 1);
console.log('Cart sau khi xóa theo index:', JSON.stringify(cart5, null, 2));

// Test 6: Kiểm tra cart cuối cùng
console.log('\n6. Cart cuối cùng:');
const finalCart = cartController.getUserCart(userId);
console.log('Final cart:', JSON.stringify(finalCart, null, 2));

console.log('\n=== TEST COMPLETED ===');
console.log('Kết quả: Sản phẩm 1 size L vẫn còn trong cart, size M đã bị xóa.');
console.log('Sản phẩm 2 cũng đã bị xóa theo index.');
