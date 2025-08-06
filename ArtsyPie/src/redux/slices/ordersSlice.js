import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ordersApi from '../../api/ordersApi';

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (userEmail, { rejectWithValue }) => {
    try {
      const response = await ordersApi.getAllOrders(userEmail);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Cannot load orders');
    }
  }
);

export const fetchOrderDetail = createAsyncThunk(
  'orders/fetchOrderDetail',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersApi.getOrderById(orderId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Cannot load order detail');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
      const response = await ordersApi.createOrder(orderData);
      console.log('Order creation response:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Order creation error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Cannot create order');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await ordersApi.updateOrderStatus(orderId, status);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Cannot update order status');
    }
  }
);

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  success: null,
};

// Slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrdersError: (state) => {
      state.error = null;
    },
    clearOrdersSuccess: (state) => {
      state.success = null;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    addNewOrder: (state, action) => {
      console.log('addNewOrder called with:', action.payload);
      
      const existingOrder = state.orders.find(order => order.id === action.payload.id);
      if (existingOrder) {
        console.log('Order already exists, updating...');
        // Update existing order
        Object.assign(existingOrder, action.payload);
        return;
      }
      
      const newOrder = {
        id: action.payload.id || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderNumber: action.payload.orderNumber || action.payload.id || `ORD-${new Date().getFullYear()}-${String(state.orders.length + 1).padStart(3, '0')}`,
        date: action.payload.date || action.payload.orderDate || new Date().toISOString().split('T')[0],
        status: action.payload.status || 'pending',
        total: action.payload.total || 0,
        products: (action.payload.products || []).map((product, index) => ({
          ...product,
          id: product.id || `${action.payload.id}_product_${index}`,
          hasReview: false,
          rating: 0
        })),
        address: action.payload.address,
        paymentMethod: action.payload.paymentMethod,
        deliveryTime: action.payload.deliveryTime,
        shippingMethod: action.payload.shippingMethod,
      };
      
      console.log('Adding new order to state:', newOrder);
      // Thêm order mới vào đầu danh sách
      state.orders.unshift(newOrder);
      
      // Sắp xếp lại toàn bộ danh sách theo createdAt
      state.orders.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date || 0);
        const dateB = new Date(b.createdAt || b.date || 0);
        return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
      });
      
      state.success = 'Your order was successfully created';
    },
  },
  extraReducers: (builder) => {
    // Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
          .addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false;
      console.log('fetchOrders.fulfilled - API response:', action.payload);
      
      // Sắp xếp orders theo createdAt (mới nhất ở đầu)
      const sortedOrders = action.payload.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date || 0);
        const dateB = new Date(b.createdAt || b.date || 0);
        return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
      });
      
      state.orders = sortedOrders;
    })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Order Detail
    builder
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        
        // Sắp xếp lại toàn bộ danh sách theo createdAt
        state.orders.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date || 0);
          const dateB = new Date(b.createdAt || b.date || 0);
          return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
        });
        
        state.success = 'Your order was successfully created';
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Order Status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(order => order.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        if (state.currentOrder && state.currentOrder.id === updatedOrder.id) {
          state.currentOrder = updatedOrder;
        }
        state.success = 'Status of your order was updated';
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrdersError, clearOrdersSuccess, setCurrentOrder, addNewOrder } = ordersSlice.actions;
export default ordersSlice.reducer; 