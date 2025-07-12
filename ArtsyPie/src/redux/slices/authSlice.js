import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../../api/axiosClient'; 


// 🔹 LOGIN
export const login = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/login', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

// 🔹 REGISTER
export const register = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/register', payload);
      console.log('Register response:', response.data);

      const data = response.data ?? { message: 'Đăng ký thành công' };

      return data;
    } catch (error) {
      console.log('Register error:', error.response?.data, error.message);

      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.description ||
        JSON.stringify(error.response?.data) ||
        'Đăng ký thất bại'
      );
    }
  }
);


// 🔹 SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.success = null;
      state.error = null;
      // Xóa token khỏi AsyncStorage
      AsyncStorage.removeItem('userToken');
    },
    clearMessage(state) {
      state.success = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // 🔹 LOGIN
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = 'Đăng nhập thành công';
        // Lưu token vào AsyncStorage
        AsyncStorage.setItem('userToken', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 🔹 REGISTER
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.message || 'Đăng ký thành công';
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearMessage } = authSlice.actions;
export default authSlice.reducer;
