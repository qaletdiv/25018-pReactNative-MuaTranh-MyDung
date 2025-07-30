# Hướng dẫn Authentication và Bảo vệ Routes

## Tổng quan
Hệ thống đã được cập nhật để kiểm tra authentication trước khi cho phép người dùng thực hiện các hành động như:
- Thêm/xóa sản phẩm khỏi yêu thích
- Thêm sản phẩm vào giỏ hàng
- Xem giỏ hàng

## Backend Routes được bảo vệ

### Favorites Routes (yêu cầu authentication)
- `POST /favorites/add` - Thêm vào yêu thích
- `POST /favorites/remove` - Xóa khỏi yêu thích  
- `GET /favorites` - Lấy danh sách yêu thích

### Cart Routes (yêu cầu authentication)
- `POST /cart/add` - Thêm vào giỏ hàng
- `PUT /cart/update` - Cập nhật số lượng
- `DELETE /cart/remove` - Xóa khỏi giỏ hàng
- `GET /cart` - Lấy giỏ hàng

## Frontend Authentication Check

### ArtCard Component
- Kiểm tra `token` trước khi cho phép toggle favorite
- Nếu chưa đăng nhập → chuyển đến trang Login

### ProductDetailScreen
- Kiểm tra `token` trước khi cho phép:
  - Thêm vào yêu thích
  - Thêm vào giỏ hàng
- Nếu chưa đăng nhập → chuyển đến trang Login

## Middleware Authentication

### Backend Middleware (`backend/middleware/auth.js`)
```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token không được cung cấp' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }
    req.user = user;
    next();
  });
};
```

## Data Storage

### Backend Files
- `backend/data/users.json` - Lưu thông tin người dùng
- `backend/data/favorites.json` - Lưu danh sách yêu thích theo user
- `backend/data/cart.json` - Lưu giỏ hàng theo user

### Frontend Storage
- `AsyncStorage` - Lưu token và user data
- `Redux Store` - Quản lý state favorites và cart

## API Integration

### Favorites API
```javascript
// Thêm vào yêu thích
dispatch(addToFavoritesAsync(productId));

// Xóa khỏi yêu thích  
dispatch(removeFromFavoritesAsync(productId));

// Lấy danh sách yêu thích
dispatch(fetchFavorites());
```

### Cart API
```javascript
// Thêm vào giỏ hàng
dispatch(addToCartAsync({ productId, quantity, size, frame }));

// Cập nhật số lượng
dispatch(updateCartItemAsync({ productId, quantity }));

// Xóa khỏi giỏ hàng
dispatch(removeFromCartAsync(productId));
```

## Flow hoạt động

1. **User chưa đăng nhập**:
   - Click vào heart icon → Chuyển đến Login screen
   - Click "Thêm vào giỏ hàng" → Chuyển đến Login screen

2. **User đã đăng nhập**:
   - Click vào heart icon → Toggle favorite (local + API)
   - Click "Thêm vào giỏ hàng" → Mở options modal → Thêm vào cart (local + API)

3. **Token hết hạn**:
   - API trả về 401/403 → Logout user → Chuyển đến Login screen

## Cách test

1. **Test chưa đăng nhập**:
   - Xóa token trong AsyncStorage
   - Thử click heart icon hoặc "Thêm vào giỏ hàng"
   - Kiểm tra có chuyển đến Login screen không

2. **Test đã đăng nhập**:
   - Đăng nhập thành công
   - Thử click heart icon và "Thêm vào giỏ hàng"
   - Kiểm tra data có được lưu vào backend không

3. **Test API endpoints**:
   - Sử dụng Postman với Bearer token
   - Test các routes favorites và cart 