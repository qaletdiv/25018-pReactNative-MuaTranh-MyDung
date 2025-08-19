import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartApi from '../../api/cartApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchCartAsync = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      
      // Thêm timeout 5 giây
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000);
      });
      
      const apiPromise = cartApi.getCart();
      const response = await Promise.race([apiPromise, timeoutPromise]);
      
      const cartData = response.data;
      let items = [];
      
      if (cartData && cartData.success && cartData.data && Array.isArray(cartData.data.items)) {
        items = cartData.data.items;
      } else if (cartData && cartData.data && Array.isArray(cartData.data.items)) {
        items = cartData.data.items;
      } else if (Array.isArray(cartData)) {
        items = cartData;
      } else if (cartData && Array.isArray(cartData.items)) {
        items = cartData.items;
      } else {
        items = [];
      }
      
      return {
        items: items
      };
    } catch (error) {
      console.error('fetchCartAsync - Error:', error);
      console.error('fetchCartAsync - Error message:', error.message);
      console.error('fetchCartAsync - Error response:', error.response);
      
      if (error.message === 'Timeout') {
        return rejectWithValue('Không thể kết nối đến server');
      }
      
      if (error.response) {
        console.error('fetchCartAsync - Response status:', error.response.status);
        console.error('fetchCartAsync - Response data:', error.response.data);
        return rejectWithValue(error.response.data?.message || `Lỗi server: ${error.response.status}`);
      }
      
      return rejectWithValue(error.message || 'Error when loading cart');
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (productData, { rejectWithValue }) => {
    try {
      // Thêm timeout 5 giây
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000);
      });
      
      const apiPromise = cartApi.addToCart(productData);
      const response = await Promise.race([apiPromise, timeoutPromise]);
      
      if (response.data.success && response.data.data) {
        //console.log('addToCartAsync - Success, cartData:', JSON.stringify(response.data.data, null, 2));
        return {
          success: true,
          cartData: response.data.data
        };
      }
      
      return {
        success: true,
        cartData: { items: [], total: 0, itemCount: 0 }
      };
    } catch (error) {
      if (error.message === 'Timeout') {
        return rejectWithValue('Cannot connect to server');
      }
      return rejectWithValue(error.response?.data?.message || 'Error when adding to cart');
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity, selectedOptions }, { rejectWithValue }) => {
    try {
      // Thêm timeout 5 giây
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000);
      });
      
      const apiPromise = cartApi.updateCartItem(productId, quantity, selectedOptions);
      const response = await Promise.race([apiPromise, timeoutPromise]);
      
      if (response.data.success && response.data.data) {
        return {
          success: true,
          cartData: response.data.data
        };
      }
      
      return {
        success: true,
        cartData: { items: [], total: 0, itemCount: 0 }
      };
    } catch (error) {
      if (error.message === 'Timeout') {
        return rejectWithValue('Cannot connect to server');
      }
      return rejectWithValue(error.response?.data?.message || 'Error when updating cart');
    }
  }
);

// Xóa sản phẩm cụ thể theo selectedOptions
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async ({ productId, selectedOptions }, { rejectWithValue }) => {
    try {
      // Thêm timeout 5 giây
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000);
      });
      
      const apiPromise = cartApi.removeFromCart(productId, selectedOptions);
      const response = await Promise.race([apiPromise, timeoutPromise]);
      
      if (response.data.success && response.data.data) {
        return {
          success: true,
          cartData: response.data.data
        };
      }
      
      return {
        success: true,
        cartData: { items: [], total: 0, itemCount: 0 }
      };
    } catch (error) {
      if (error.message === 'Timeout') {
        return rejectWithValue('Cannot connect to server');
      }
      return rejectWithValue(error.response?.data?.message || 'Error when removing from cart');
    }
  }
);

// Xóa sản phẩm theo index (Dễ dàng hơn)
export const removeCartItemByIndexAsync = createAsyncThunk(
  'cart/removeCartItemByIndex',
  async (index, { rejectWithValue, getState }) => {
    try {
      // Thêm timeout 5 giây
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000);
      });
      
      // Lấy cartItems từ state để fallback
      const state = getState();
      const cartItems = state.cart.cartItems;
      
      const apiPromise = cartApi.removeCartItemByIndex(index, cartItems);
      const response = await Promise.race([apiPromise, timeoutPromise]);
      
      if (response.data.success && response.data.data) {
        return {
          success: true,
          cartData: response.data.data
        };
      }
      
      return {
        success: true,
        cartData: { items: [], total: 0, itemCount: 0 }
      };
    } catch (error) {
      if (error.message === 'Timeout') {
        return rejectWithValue('Cannot connect to server');
      }
      return rejectWithValue(error.response?.data?.message || 'Error when removing from cart');
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.clearCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa giỏ hàng');
    }
  }
);

// Load cart từ AsyncStorage khi app khởi động
export const loadCartFromStorageAsync = createAsyncThunk(
  'cart/loadFromStorage',
  async (_, { dispatch }) => {
    try {
      const cartData = await AsyncStorage.getItem('userCart');
      if (cartData) {
        const cartItems = JSON.parse(cartData);
        dispatch(loadCartFromStorage(cartItems));
      }
    } catch (error) {
      console.error('CartSlice: Error loading cart from storage', error);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, quantity = 1, product, selectedOptions } = action.payload;
      // Check if item exists with same productId AND same options
      const existingItem = state.cartItems.find(item => 
        item.productId === productId && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions || { size: 'Standard', frame: 'No Frame' })
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({
          id: `${productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productId,
          quantity,
          product: product,
          selectedOptions: selectedOptions || { size: 'Standard', frame: 'No Frame' },
          addedAt: new Date().toISOString()
        });
      }
    },
    
    // Thêm sản phẩm vào cart ngay lập tức sau khi add thành công
    addToCartImmediate: (state, action) => {
      const { productId, quantity = 1, product, selectedOptions } = action.payload;
      // Check if item exists with same productId AND same options
      const existingItem = state.cartItems.find(item => 
        item.productId === productId && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions || { size: 'Standard', frame: 'No Frame' })
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({
          id: `${productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productId,
          quantity,
          product: product,
          selectedOptions: selectedOptions || { size: 'Standard', frame: 'No Frame' },
          addedAt: new Date().toISOString()
        });
      }
      
      AsyncStorage.setItem('userCart', JSON.stringify(state.cartItems)).catch(console.error);
    },
    
    updateCartItem: (state, action) => {
      const { productId, quantity, selectedOptions } = action.payload;
      const item = state.cartItems.find(item => 
        item.productId === productId && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
      );
      
      if (item) {
        if (quantity <= 0) {
          state.cartItems = state.cartItems.filter(item => 
            !(item.productId === productId && 
              JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
          );
        } else {
          item.quantity = quantity;
        }
      }
      
      AsyncStorage.setItem('userCart', JSON.stringify(state.cartItems)).catch(console.error);
    },
    
    removeFromCart: (state, action) => {
      const { productId, selectedOptions } = action.payload;
      state.cartItems = state.cartItems.filter(item => 
        !(item.productId === productId && 
          JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
      );
      
      AsyncStorage.setItem('userCart', JSON.stringify(state.cartItems)).catch(console.error);
    },
    
    clearCart: (state) => {
      state.cartItems = [];
      
      // Tự động lưu vào AsyncStorage
      AsyncStorage.setItem('userCart', JSON.stringify(state.cartItems)).catch(console.error);
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    loadCartFromStorage: (state, action) => {
      state.cartItems = action.payload || [];
    },
    
    saveCartToStorage: (state) => {
      AsyncStorage.setItem('userCart', JSON.stringify(state.cartItems)).catch(console.error);
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.items || [];
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to cart
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.cartData && action.payload.cartData.items) {
          state.cartItems = action.payload.cartData.items;
        }
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update cart item
      .addCase(updateCartItemAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.cartData) {
          state.cartItems = action.payload.cartData.items || [];
        }
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove from cart
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.cartData) {
          state.cartItems = action.payload.cartData.items || [];
        }
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove cart item by index
      .addCase(removeCartItemByIndexAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItemByIndexAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.cartData) {
          state.cartItems = action.payload.cartData.items || [];
        }
      })
      .addCase(removeCartItemByIndexAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Clear cart
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.loading = false;
        state.cartItems = [];
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  addToCart, 
  addToCartImmediate,
  updateCartItem, 
  removeFromCart, 
  clearCart,
  clearError,
  loadCartFromStorage,
  saveCartToStorage
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartItemCount = (state) => state.cart.cartItems.length;
export const selectCartTotal = (state) => {
  return state.cart.cartItems.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);
};

export default cartSlice.reducer; 