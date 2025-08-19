# Frontend Quick Start - Cart API Fix

## Vấn đề đã được sửa
- **Trước:** Xóa sản phẩm → xóa tất cả variant (cùng productId)
- **Sau:** Xóa sản phẩm → chỉ xóa variant cụ thể

## Thay đổi cần thiết trong Frontend

### 1. Redux Cart Slice - Thêm 2 actions mới

```javascript
// Thêm vào cartSlice.js
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ productId, selectedOptions }) => {
    const response = await fetch(`/api/cart/${productId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedOptions })
    });
    const data = await response.json();
    return data.data;
  }
);

export const removeCartItemByIndex = createAsyncThunk(
  'cart/removeCartItemByIndex',
  async (index) => {
    const response = await fetch(`/api/cart/item/${index}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    return data.data;
  }
);
```

### 2. Cart Component - Cập nhật xóa sản phẩm

```javascript
// Thay thế hàm xóa cũ
const handleRemoveItem = (productId, selectedOptions) => {
  dispatch(removeFromCart({ productId, selectedOptions }));
};

// HOẶC sử dụng index (dễ hơn)
const handleRemoveItemByIndex = (index) => {
  dispatch(removeCartItemByIndex(index));
};
```

### 3. Product Detail - Thêm selectedOptions

```javascript
// Khi thêm vào cart, luôn gửi selectedOptions
const handleAddToCart = () => {
  const productData = {
    productId: product.id,
    quantity: 1,
    product: product,
    selectedOptions: {
      size: selectedSize,
      frame: selectedFrame
    }
  };
  dispatch(addToCart(productData));
};
```

### 4. Update Cart Item - Thêm selectedOptions

```javascript
// Khi cập nhật quantity
const handleUpdateQuantity = (productId, selectedOptions, newQuantity) => {
  dispatch(updateCartItem({ productId, quantity: newQuantity, selectedOptions }));
};
```

## API Endpoints đã thay đổi

| Action | Endpoint | Method | Body |
|--------|----------|--------|------|
| Xóa sản phẩm cụ thể | `/api/cart/:productId` | DELETE | `{ selectedOptions }` |
| Xóa theo index | `/api/cart/item/:index` | DELETE | - |

## Test nhanh

1. Thêm sản phẩm A (size M)
2. Thêm sản phẩm A (size L) 
3. Xóa sản phẩm A (size M)
4. Kiểm tra: sản phẩm A (size L) vẫn còn

## Lưu ý quan trọng

- **Luôn gửi `selectedOptions`** khi thêm/cập nhật/xóa sản phẩm
- **Sử dụng index** để xóa nếu muốn đơn giản hơn
- **Key cho FlatList:** `keyExtractor={(item, index) => \`${item.productId}-${JSON.stringify(item.selectedOptions)}-${index}\`}`

API đã sẵn sàng sử dụng! 🚀
