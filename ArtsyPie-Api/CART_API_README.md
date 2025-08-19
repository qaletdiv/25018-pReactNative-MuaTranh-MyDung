# Cart API Documentation

## Vấn đề đã được sửa
Trước đây: Khi xóa sản phẩm trong giỏ hàng, tất cả các variant của sản phẩm đó (cùng productId nhưng khác size/frame) đều bị xóa.

Bây giờ: Chỉ xóa sản phẩm cụ thể được chọn, giữ lại các variant khác.

## API Endpoints

### 1. GET /api/cart
Lấy thông tin giỏ hàng của user
```javascript
GET /api/cart
```

### 2. POST /api/cart
Thêm sản phẩm vào giỏ hàng
```javascript
POST /api/cart
Content-Type: application/json

{
  "productId": "artwork_001",
  "quantity": 1,
  "product": {
    "id": "artwork_001",
    "name": "Bức tranh phong cảnh",
    "price": 1000000,
    "image": "artwork1.jpg",
    "images": ["artwork1.jpg", "artwork1_detail.jpg"],
    "artist": "Nguyễn Văn A",
    "description": "Bức tranh phong cảnh đẹp",
    "type": "painting",
    "style": "impressionism"
  },
  "selectedOptions": {
    "size": "M",
    "frame": "No Frame"
  }
}
```

### 3. PUT /api/cart/:productId
Cập nhật số lượng sản phẩm
```javascript
PUT /api/cart/artwork_001
Content-Type: application/json

{
  "quantity": 2,
  "selectedOptions": {
    "size": "M",
    "frame": "No Frame"
  }
}
```

### 4. DELETE /api/cart/:productId (ĐÃ SỬA)
Xóa sản phẩm cụ thể theo productId và selectedOptions
```javascript
DELETE /api/cart/artwork_001
Content-Type: application/json

{
  "selectedOptions": {
    "size": "M",
    "frame": "No Frame"
  }
}
```

**Lưu ý:** Nếu không gửi `selectedOptions`, sẽ xóa tất cả variant của sản phẩm đó (backward compatibility).

### 5. DELETE /api/cart/item/:index (MỚI)
Xóa sản phẩm theo index trong giỏ hàng
```javascript
DELETE /api/cart/item/0
```

### 6. DELETE /api/cart
Xóa toàn bộ giỏ hàng
```javascript
DELETE /api/cart
```

## Ví dụ sử dụng

### Thêm 2 variant của cùng 1 sản phẩm:
```javascript
// Thêm sản phẩm size M
fetch('/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'artwork_001',
    quantity: 1,
    product: productData,
    selectedOptions: { size: 'M', frame: 'No Frame' }
  })
});

// Thêm sản phẩm size L
fetch('/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'artwork_001',
    quantity: 1,
    product: productData,
    selectedOptions: { size: 'L', frame: 'No Frame' }
  })
});
```

### Xóa chỉ sản phẩm size M:
```javascript
fetch('/api/cart/artwork_001', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    selectedOptions: { size: 'M', frame: 'No Frame' }
  })
});
```

### Xóa theo index (dễ dàng hơn):
```javascript
// Xóa sản phẩm đầu tiên trong giỏ hàng
fetch('/api/cart/item/0', { method: 'DELETE' });

// Xóa sản phẩm thứ 2 trong giỏ hàng
fetch('/api/cart/item/1', { method: 'DELETE' });
```

## Kết quả
- ✅ Sản phẩm size M bị xóa
- ✅ Sản phẩm size L vẫn còn trong giỏ hàng
- ✅ Không ảnh hưởng đến các sản phẩm khác
