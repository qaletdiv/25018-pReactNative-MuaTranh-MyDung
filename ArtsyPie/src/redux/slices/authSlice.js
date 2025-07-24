import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../../api/axiosClient'; 


// 🔹 LOGIN
export const login = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    console.log('--- Đang gửi request Login với payload:', payload);
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

//  Forgot Password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      // Giả sử API endpoint là '/auth/forgot-password'
      const response = await axiosClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      // Giả sử API endpoint là '/auth/reset-password'
      const response = await axiosClient.post('/auth/reset-password', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể đặt lại mật khẩu');
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
    restoreToken(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user; // Bạn có thể muốn lưu user vào AsyncStorage luôn
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.success = null;
      state.error = null;
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('userData'); // Xóa cả user data nếu có
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
        // Lưu cả token và user
        AsyncStorage.setItem('userToken', action.payload.token);
        AsyncStorage.setItem('userData', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Email hoặc mật khẩu không chính xác';
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
      
    // FORGOT PASSWORD
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.message || 'Yêu cầu đã được gửi';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
    // RESET PASSWORD
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.message || 'Mật khẩu đã được thay đổi thành công';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { restoreToken, logout, clearMessage } = authSlice.actions;
export default authSlice.reducer;
