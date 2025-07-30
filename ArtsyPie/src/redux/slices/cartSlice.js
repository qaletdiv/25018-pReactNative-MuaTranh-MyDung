import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../../api/cartApi';

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart();
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải giỏ hàng');
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, size, frame }, { rejectWithValue }) => {
    try {
      const response = await cartApi.addToCart(productId, quantity, size, frame);
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng');
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartApi.updateCartItem(productId, quantity);
      return response.data.cart;
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
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa khỏi giỏ hàng');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, quantity = 1, size = 'Standard', frame = 'No Frame' } = action.payload;
      const existingItem = state.cartItems.find(item => item.productId === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({
          productId,
          quantity,
          size,
          frame,
          addedAt: new Date().toISOString()
        });
      }
    },
    updateCartItem: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find(item => item.productId === productId);
      
      if (item) {
        if (quantity <= 0) {
          state.cartItems = state.cartItems.filter(item => item.productId !== productId);
        } else {
          item.quantity = quantity;
        }
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(item => item.productId !== productId);
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      // Update cart item
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      });
  },
});

export const { 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartItemCount = (state) => state.cart.cartItems.length;
export const selectCartTotal = (state) => {
  return state.cart.cartItems.reduce((total, item) => {
    // Giả sử có product data trong state hoặc cần fetch từ API
    return total + (item.price || 0) * item.quantity;
  }, 0);
};

export default cartSlice.reducer; 