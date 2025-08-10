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
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// 🔹 REGISTER
export const register = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/register', payload);
      

      const data = response.data ?? { message: 'Registered successfully'};

      return data;
    } catch (error) {
      

      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.description ||
        JSON.stringify(error.response?.data) ||
        'Register failed'
      );
    }
  }
);

//  Forgot Password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/reset-password', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Cannot reset password');
    }
  }
);

// Update User Profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put('/auth/profile', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Cannot update profile');
    }
  }
);


// 🔹 SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    restoreToken(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.success = null;
      state.error = null;
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('userData');
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
        state.isAuthenticated = true;
        state.success = 'Đăng nhập thành công';
        // Lưu cả token và user
        AsyncStorage.setItem('userToken', action.payload.token);
        AsyncStorage.setItem('userData', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Email or password is incorrect';
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
        state.success = action.payload?.message || 'Login successfully';
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
        state.success = action.payload?.message || 'Request sent';
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
        state.success = action.payload?.message || 'Password changed successfully';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
    // UPDATE PROFILE
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.message || 'Update profile successfully';
        // Update user data in state
        if (action.payload?.user) {
          state.user = { ...state.user, ...action.payload.user };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { restoreToken, logout, clearMessage } = authSlice.actions;
export default authSlice.reducer;
