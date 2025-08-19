# Frontend Cart Integration Guide

## Vấn đề đã được sửa trong API

**Trước đây:** Khi xóa sản phẩm trong giỏ hàng, tất cả các variant của sản phẩm đó (cùng productId nhưng khác size/frame) đều bị xóa.

**Bây giờ:** Chỉ xóa sản phẩm cụ thể được chọn, giữ lại các variant khác.

## API Endpoints

### 1. Lấy giỏ hàng
```javascript
GET /api/cart
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
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
        },
        "addedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 1000000,
    "itemCount": 1
  }
}
```

### 2. Thêm sản phẩm vào giỏ hàng
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

### 3. Cập nhật số lượng sản phẩm
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

### 4. Xóa sản phẩm cụ thể (ĐÃ SỬA)
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

### 5. Xóa sản phẩm theo index (MỚI - Dễ dàng hơn)
```javascript
DELETE /api/cart/item/0  // Xóa sản phẩm đầu tiên
DELETE /api/cart/item/1  // Xóa sản phẩm thứ 2
```

### 6. Xóa toàn bộ giỏ hàng
```javascript
DELETE /api/cart
```

## Code Frontend Implementation

### 1. Redux Toolkit Cart Slice

```javascript
// cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async () => {
    const response = await fetch('/api/cart');
    const data = await response.json();
    return data.data;
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (productData) => {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    const data = await response.json();
    return data.data;
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity, selectedOptions }) => {
    const response = await fetch(`/api/cart/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity, selectedOptions })
    });
    const data = await response.json();
    return data.data;
  }
);

// Xóa sản phẩm cụ thể theo selectedOptions
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

// Xóa sản phẩm theo index (Dễ dàng hơn)
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

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async () => {
    const response = await fetch('/api/cart', {
      method: 'DELETE'
    });
    const data = await response.json();
    return data.data;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    itemCount: 0,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.itemCount = action.payload.itemCount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.itemCount = action.payload.itemCount;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.itemCount = action.payload.itemCount;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.itemCount = action.payload.itemCount;
      })
      .addCase(removeCartItemByIndex.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.itemCount = action.payload.itemCount;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.itemCount = action.payload.itemCount;
      });
  }
});

export default cartSlice.reducer;
```

### 2. Cart Component Implementation

```javascript
// CartScreen.js
import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCart, 
  removeFromCart, 
  removeCartItemByIndex,
  updateCartItem 
} from '../redux/cartSlice';

const CartScreen = () => {
  const dispatch = useDispatch();
  const { items, total, loading } = useSelector(state => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Cách 1: Xóa theo selectedOptions (chính xác)
  const handleRemoveItem = (productId, selectedOptions) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa sản phẩm này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: () => {
            dispatch(removeFromCart({ productId, selectedOptions }));
          }
        }
      ]
    );
  };

  // Cách 2: Xóa theo index (dễ dàng hơn)
  const handleRemoveItemByIndex = (index) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa sản phẩm này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: () => {
            dispatch(removeCartItemByIndex(index));
          }
        }
      ]
    );
  };

  const handleUpdateQuantity = (productId, selectedOptions, newQuantity) => {
    if (newQuantity <= 0) {
      // Nếu quantity <= 0, xóa sản phẩm
      dispatch(removeFromCart({ productId, selectedOptions }));
    } else {
      dispatch(updateCartItem({ productId, quantity: newQuantity, selectedOptions }));
    }
  };

  const renderCartItem = ({ item, index }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.productPrice}>
          {item.product.price.toLocaleString('vi-VN')} VNĐ
        </Text>
        
        {/* Hiển thị selectedOptions */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionText}>
            Size: {item.selectedOptions.size}
          </Text>
          <Text style={styles.optionText}>
            Frame: {item.selectedOptions.frame}
          </Text>
        </View>

        {/* Quantity controls */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            onPress={() => handleUpdateQuantity(
              item.productId, 
              item.selectedOptions, 
              item.quantity - 1
            )}
          >
            <Text style={styles.quantityBtn}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            onPress={() => handleUpdateQuantity(
              item.productId, 
              item.selectedOptions, 
              item.quantity + 1
            )}
          >
            <Text style={styles.quantityBtn}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Delete button - Cách 1: Theo selectedOptions */}
      <TouchableOpacity 
        style={styles.deleteBtn}
        onPress={() => handleRemoveItem(item.productId, item.selectedOptions)}
      >
        <Text style={styles.deleteText}>Xóa</Text>
      </TouchableOpacity>

      {/* Delete button - Cách 2: Theo index */}
      <TouchableOpacity 
        style={styles.deleteBtn}
        onPress={() => handleRemoveItemByIndex(index)}
      >
        <Text style={styles.deleteText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>
      
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item, index) => `${item.productId}-${JSON.stringify(item.selectedOptions)}-${index}`}
          />
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Tổng cộng: {total.toLocaleString('vi-VN')} VNĐ
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionText: {
    fontSize: 12,
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityBtn: {
    width: 30,
    height: 30,
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    lineHeight: 30,
    borderRadius: 15,
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  deleteBtn: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 4,
    justifyContent: 'center',
  },
  deleteText: {
    color: 'white',
    fontSize: 12,
  },
  totalContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CartScreen;
```

### 3. Product Detail - Add to Cart

```javascript
// ProductDetailScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [selectedFrame, setSelectedFrame] = useState('No Frame');

  const handleAddToCart = () => {
    const productData = {
      productId: product.id,
      quantity: 1,
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
      selectedOptions: {
        size: selectedSize,
        frame: selectedFrame
      }
    };

    dispatch(addToCart(productData))
      .then(() => {
        Alert.alert('Thành công', 'Sản phẩm đã được thêm vào giỏ hàng');
      })
      .catch((error) => {
        Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng');
      });
  };

  return (
    <View style={styles.container}>
      {/* Product info */}
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>
        {product.price.toLocaleString('vi-VN')} VNĐ
      </Text>

      {/* Size selection */}
      <View style={styles.optionSection}>
        <Text style={styles.optionTitle}>Chọn kích thước:</Text>
        <View style={styles.optionButtons}>
          {['Standard', 'S', 'M', 'L', 'XL'].map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.optionButton,
                selectedSize === size && styles.selectedOption
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text style={[
                styles.optionText,
                selectedSize === size && styles.selectedOptionText
              ]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Frame selection */}
      <View style={styles.optionSection}>
        <Text style={styles.optionTitle}>Chọn khung:</Text>
        <View style={styles.optionButtons}>
          {['No Frame', 'Wooden Frame', 'Metal Frame'].map((frame) => (
            <TouchableOpacity
              key={frame}
              style={[
                styles.optionButton,
                selectedFrame === frame && styles.selectedOption
              ]}
              onPress={() => setSelectedFrame(frame)}
            >
              <Text style={[
                styles.optionText,
                selectedFrame === frame && styles.selectedOptionText
              ]}>
                {frame}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Add to cart button */}
      <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
        <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    color: '#666',
    marginBottom: 24,
  },
  optionSection: {
    marginBottom: 24,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
  },
  selectedOptionText: {
    color: 'white',
  },
  addToCartBtn: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
```

## Lưu ý quan trọng

### 1. Key cho FlatList
```javascript
// Sử dụng key unique cho mỗi item
keyExtractor={(item, index) => `${item.productId}-${JSON.stringify(item.selectedOptions)}-${index}`}
```

### 2. Xóa sản phẩm
- **Cách 1:** Sử dụng `selectedOptions` - chính xác nhưng phức tạp hơn
- **Cách 2:** Sử dụng `index` - đơn giản và dễ implement

### 3. Cập nhật quantity
- Khi quantity <= 0, tự động xóa sản phẩm
- Luôn gửi `selectedOptions` khi update

### 4. Error Handling
```javascript
// Luôn xử lý lỗi khi gọi API
.catch((error) => {
  Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
  console.error('Cart API Error:', error);
});
```

## Testing

Để test chức năng:

1. Thêm cùng 1 sản phẩm với 2 size khác nhau
2. Xóa 1 size, kiểm tra size còn lại vẫn tồn tại
3. Cập nhật quantity của từng variant riêng biệt
4. Test xóa theo index vs xóa theo selectedOptions

API đã được sửa và sẵn sàng sử dụng!
