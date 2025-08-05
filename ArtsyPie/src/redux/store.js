import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bannerReducer from './slices/bannerSlice';
import favoritesReducer from './slices/favoritesSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/ordersSlice';
import artworksReducer from './slices/artworksSlice';
import catalogReducer from './slices/catalogSlice';
import reviewsReducer from './slices/reviewsSlice';
import notificationsReducer from './slices/notificationsSlice';
import addressesReducer from './slices/addressesSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    banners: bannerReducer,
    favorites: favoritesReducer,
    cart: cartReducer,
    orders: ordersReducer,
    artworks: artworksReducer,
    catalog: catalogReducer,
    reviews: reviewsReducer,
    notifications: notificationsReducer,
    addresses: addressesReducer,
  },
});
