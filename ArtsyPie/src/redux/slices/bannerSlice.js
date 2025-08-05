import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bannerApi } from '../../api/bannerApi';

export const fetchBanners = createAsyncThunk('banners/fetch', async () => {
  const res = await bannerApi.getBanners();
  return res.data.banners;
});

const bannerSlice = createSlice({
  name: 'banners',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bannerSlice.reducer;
