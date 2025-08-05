import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

const getImageSource = (imagePath) => {
  if (!imagePath) return null;
  
  if (typeof imagePath === 'number') {
    return imagePath;
  }
  
  const imageMap = {
    '/Images/Product/impressionlsm.jpg': require('../../../assets/Images/Product/impressionlsm.jpg'),
    '/Images/Product/modernlsm.jpg': require('../../../assets/Images/Product/modernlsm.jpg'),
    '/Images/Product/plus1.jpg': require('../../../assets/Images/Product/plus1.jpg'),
    '/Images/Product/plus2.jpg': require('../../../assets/Images/Product/plus2.jpg'),
    '/Images/Product/plus3.jpg': require('../../../assets/Images/Product/plus3.jpg'),
    '/Images/Product/plus4.jpg': require('../../../assets/Images/Product/plus4.jpg'),
    '/Images/Product/pool.jpg': require('../../../assets/Images/Product/pool.jpg'),
    '/Images/Product/sportman.jpg': require('../../../assets/Images/Product/sportman.jpg'),
    '/Images/avatar.jpg': require('../../../assets/Images/avatar.jpg'),
  };
  
  return imageMap[imagePath] || require('../../../assets/Images/Product/impressionlsm.jpg');
};

export const fetchCatalog = createAsyncThunk(
  'catalog/fetchCatalog',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/catalog');
      const transformedData = response.data.map((item, index) => ({
        id: index + 1,
        title: item.title,
        author: item.author,
        price: item.price,
        image: getImageSource(item.image),
        avatar: getImageSource(item.avatar),
        isNew: item.isNew
      }));
      
      return transformedData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải catalog');
    }
  }
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    catalog: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.loading = false;
        state.catalog = action.payload;
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default catalogSlice.reducer; 