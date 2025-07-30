import axiosClient from './axiosClient';

export const favoritesApi = {
  // Thêm vào yêu thích
  addToFavorites: (productId) => {
    return axiosClient.post('/favorites/add', { productId });
  },

  // Xóa khỏi yêu thích
  removeFromFavorites: (productId) => {
    return axiosClient.post('/favorites/remove', { productId });
  },

  // Lấy danh sách yêu thích
  getFavorites: () => {
    return axiosClient.get('/favorites');
  },
}; 