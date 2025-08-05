import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoritesApi } from '../../api/favoritesApi';

const initialState = {
  favorites: [],
  loading: false,
  error: null,
  checkedFavorites: {}, 
};

export const fetchFavoritesAsync = createAsyncThunk(
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

export const checkFavoriteAsync = createAsyncThunk(
  'favorites/checkFavorite',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await favoritesApi.checkFavorite(productId);
      return { productId, isFavorite: response.data.isFavorite };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi kiểm tra yêu thích');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const product = action.payload;
      const exists = state.favorites.find(item => item.id === product.id);
      if (exists) {
        state.favorites = state.favorites.filter(item => item.id !== product.id);
      } else {
        state.favorites.push(product);
      }
    },
    removeFromFavorites: (state, action) => {
      const productId = action.payload;
      state.favorites = state.favorites.filter(item => item.id !== productId);
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavoritesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoritesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavoritesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to favorites
      .addCase(addToFavoritesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToFavoritesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(addToFavoritesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from favorites
      .addCase(removeFromFavoritesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromFavoritesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(removeFromFavoritesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check favorite
      .addCase(checkFavoriteAsync.fulfilled, (state, action) => {
        const { productId, isFavorite } = action.payload;
        state.checkedFavorites[productId] = isFavorite;
      });
  },
});

export const { 
  toggleFavorite, 
  removeFromFavorites,
  clearFavorites,
  clearError
} = favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.favorites;
export const selectIsFavorite = (state, productId) => {
  // Chỉ sử dụng favorites array để kiểm tra
  return state.favorites.favorites?.some(item => item.id === productId) || false;
};
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesError = (state) => state.favorites.error;

export default favoritesSlice.reducer; 