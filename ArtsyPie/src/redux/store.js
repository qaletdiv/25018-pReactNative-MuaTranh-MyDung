import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bannerReducer from './slices/bannerSlice';
import favoritesReducer from './slices/favoritesSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    banners: bannerReducer,
    favorites: favoritesReducer,
    cart: cartReducer,
  },
});
