import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchArtworks = createAsyncThunk(
  'artworks/fetchArtworks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/artworks');
      return response.data;
    } catch (error) {
      // Fallback to mock data if API fails

      const mockArtworks = [
        {
          id: 1,
          title: 'Dream Portrait',
          artist: 'Vincent van Gogh',
          price: 356000,
          image: 'impressionlsm.jpg',
          description: 'A beautiful dreamy portrait'
        },
        {
          id: 2,
          title: 'Urban Geometry',
          artist: 'Pablo Picasso',
          price: 208000,
          image: 'modernlsm.jpg',
          description: 'Modern urban geometric art'
        },
        {
          id: 3,
          title: 'Sunset Bridge',
          artist: 'Claude Monet',
          price: 450000,
          image: 'plus1.jpg',
          description: 'Impressionist bridge painting'
        }
      ];
      return mockArtworks;
    }
  }
);

export const searchArtworks = createAsyncThunk(
  'artworks/searchArtworks',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/artworks/search?q=${searchTerm}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Cannot find product');
    }
  }
);

const artworksSlice = createSlice({
  name: 'artworks',
  initialState: {
    artworks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtworks.fulfilled, (state, action) => {
        state.loading = false;
        state.artworks = action.payload;
      })
      .addCase(fetchArtworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchArtworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchArtworks.fulfilled, (state, action) => {
        state.loading = false;
        state.artworks = action.payload;
      })
      .addCase(searchArtworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default artworksSlice.reducer; 