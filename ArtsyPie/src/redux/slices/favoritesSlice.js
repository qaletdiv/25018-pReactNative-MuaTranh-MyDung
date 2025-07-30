import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoritesApi } from '../../api/favoritesApi';

const initialState = {
  favorites: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await favoritesApi.getFavorites();
      return response.data.favorites;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải danh sách yêu thích');
    }
  }
);

export const addToFavoritesAsync = createAsyncThunk(
  'favorites/addToFavorites',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await favoritesApi.addToFavorites(productId);
      return response.data.favorites;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi thêm vào yêu thích');
    }
  }
);

export const removeFromFavoritesAsync = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await favoritesApi.removeFromFavorites(productId);
      return response.data.favorites;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa khỏi yêu thích');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // 
    toggleFavorite: (state, action) => {
      const product = action.payload;
      const exists = state.favorites.find(item => item.id === product.id);
      if (exists) {
        state.favorites = state.favorites.filter(item => item.id !== product.id);
      } else {
        state.favorites.push(product);
      }
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to favorites
      .addCase(addToFavoritesAsync.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      // Remove from favorites
      .addCase(removeFromFavoritesAsync.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  },
});

export const { 
  toggleFavorite, 
  clearFavorites 
} = favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.favorites;
export const selectIsFavorite = (state, productId) => 
  state.favorites.favorites.some(item => item.id === productId);
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesError = (state) => state.favorites.error;

export default favoritesSlice.reducer; 