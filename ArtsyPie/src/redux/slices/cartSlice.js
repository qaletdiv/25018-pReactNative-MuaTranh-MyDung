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
      
             // Xử lý response theo API documentation: { success: true, data: { items: [], total: 0, itemCount: 0 } }
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
      if (error.message === 'Timeout') {
        return rejectWithValue('Không thể kết nối đến server');
      }
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải giỏ hàng');
    }
  }
);



export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (productData, { rejectWithValue }) => {
    try {
      console.log('🚀 addToCartAsync - Sending productData:', JSON.stringify(productData, null, 2));
      
      const response = await cartApi.addToCart(productData);
      console.log('📡 addToCartAsync - API Response:', JSON.stringify(response.data, null, 2));
      
      // API trả về { success: true, message: "...", data: { items: [...], total: ..., itemCount: ... } }
      if (response.data.success && response.data.data) {
        console.log('✅ addToCartAsync - Success, cartData:', JSON.stringify(response.data.data, null, 2));
        return {
          success: true,
          cartData: response.data.data // Trả về toàn bộ cart data từ API
        };
      }
      
      console.log('⚠️ addToCartAsync - No success or data');
      return {
        success: true,
        cartData: { items: [], total: 0, itemCount: 0 }
      };
    } catch (error) {
      console.log('❌ addToCartAsync - Error:', error);
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng');
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity, selectedOptions }, { rejectWithValue }) => {
    try {
      const response = await cartApi.updateCartItem(productId, quantity, selectedOptions);
      
      // API trả về { success: true, message: "...", data: { items: [...], total: ..., itemCount: ... } }
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
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật giỏ hàng');
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await cartApi.removeFromCart(productId);
      
      
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
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa khỏi giỏ hàng');
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
    // Local actions for immediate UI updates (fallback)
    addToCart: (state, action) => {
      const { productId, quantity = 1, product, selectedOptions } = action.payload;
      const existingItem = state.cartItems.find(item => item.productId === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
        
        if (selectedOptions) {
          existingItem.selectedOptions = selectedOptions;
        }
      } else {
        state.cartItems.push({
          id: `${productId}-${Date.now()}`,
          productId,
          quantity,
          product: product, // Thêm thông tin sản phẩm
          selectedOptions: selectedOptions || { size: 'Standard', frame: 'No Frame' },
          addedAt: new Date().toISOString()
        });
      }
    },
    
    // Thêm sản phẩm vào cart ngay lập tức sau khi add thành công
    addToCartImmediate: (state, action) => {
      const { productId, quantity = 1, product, selectedOptions } = action.payload;
      const existingItem = state.cartItems.find(item => item.productId === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
        
        if (selectedOptions) {
          existingItem.selectedOptions = selectedOptions;
        }
      } else {
        state.cartItems.push({
          id: productId, 
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
      const item = state.cartItems.find(item => item.productId === productId);
      
      if (item) {
        if (quantity <= 0) {
          state.cartItems = state.cartItems.filter(item => item.productId !== productId);
        } else {
          item.quantity = quantity;
          if (selectedOptions) {
            item.selectedOptions = selectedOptions;
          }
        }
      }
      
      AsyncStorage.setItem('userCart', JSON.stringify(state.cartItems)).catch(console.error);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(item => item.productId !== productId);
      
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
        // console.log('Redux - addToCartAsync.fulfilled - action.payload:', JSON.stringify(action.payload, null, 2));
        
        // Cập nhật cart trực tiếp từ API response
        if (action.payload.cartData && action.payload.cartData.items) {
          // console.log('Redux - Updating cartItems with:', JSON.stringify(action.payload.cartData.items, null, 2));
          state.cartItems = action.payload.cartData.items;
          // console.log('Redux - cartItems updated, new length:', state.cartItems.length);
        } else {
          // console.log('Redux - No cartData or items found in payload');
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
        // Cập nhật cart trực tiếp từ API response
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
        // Cập nhật cart trực tiếp từ API response
        if (action.payload.cartData) {
          state.cartItems = action.payload.cartData.items || [];
        }
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
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