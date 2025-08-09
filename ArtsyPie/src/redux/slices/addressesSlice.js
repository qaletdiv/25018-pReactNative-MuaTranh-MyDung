import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addressApi } from '../../api/addressApi';

const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchAddressesAsync = createAsyncThunk(
  'addresses/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressApi.getAddresses();
  
      // API trả về { success: true, addresses: [...] }
      return response.data.addresses || [];
    } catch (error) {
      console.error('AddressesSlice: Error fetching addresses', error);
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải danh sách địa chỉ');
    }
  }
);

export const addAddressAsync = createAsyncThunk(
  'addresses/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
  
      const response = await addressApi.addAddress(addressData);
      
      // API trả về { success: true, message: '...', address: {...} }
      return response.data.address;
    } catch (error) {
      console.error('AddressesSlice: Error adding address', error);
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi thêm địa chỉ');
    }
  }
);

export const updateAddressAsync = createAsyncThunk(
  'addresses/updateAddress',
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const response = await addressApi.updateAddress(addressId, addressData);
      // API trả về { success: true, message: '...', address: {...} }
      return response.data.address;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật địa chỉ');
    }
  }
);

export const deleteAddressAsync = createAsyncThunk(
  'addresses/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await addressApi.deleteAddress(addressId);
      return { addressId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa địa chỉ');
    }
  }
);

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    
    addAddressImmediate: (state, action) => {
      state.addresses.push(action.payload);
    },
    updateAddressImmediate: (state, action) => {
      const { id, ...addressData } = action.payload;
      const index = state.addresses.findIndex(addr => addr.id === id);
      if (index !== -1) {
        state.addresses[index] = { ...state.addresses[index], ...addressData };
      }
    },
    removeAddressImmediate: (state, action) => {
      const addressId = action.payload;
      state.addresses = state.addresses.filter(addr => addr.id !== addressId);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch addresses
      .addCase(fetchAddressesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddressesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload || [];
      })
      .addCase(fetchAddressesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add address
      .addCase(addAddressAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddressAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Thêm address mới vào danh sách
        if (action.payload) {
          state.addresses.push(action.payload);
        }
      })
      .addCase(addAddressAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update address
      .addCase(updateAddressAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddressAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật address trong danh sách
        if (action.payload) {
          const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
          if (index !== -1) {
            state.addresses[index] = action.payload;
          }
        }
      })
      .addCase(updateAddressAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete address
      .addCase(deleteAddressAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddressAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Xóa address khỏi danh sách
        const addressId = action.payload.addressId;
        state.addresses = state.addresses.filter(addr => addr.id !== addressId);
      })
      .addCase(deleteAddressAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError,
  addAddressImmediate,
  updateAddressImmediate,
  removeAddressImmediate
} = addressesSlice.actions;

export const selectAddresses = (state) => state.addresses.addresses;
export const selectAddressesLoading = (state) => state.addresses.loading;
export const selectAddressesError = (state) => state.addresses.error;

export default addressesSlice.reducer; 