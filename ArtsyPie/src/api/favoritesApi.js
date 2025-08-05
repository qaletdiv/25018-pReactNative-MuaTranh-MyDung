import axiosClient from './axiosClient';

export const favoritesApi = {
  // Lấy danh sách yêu thích
  getFavorites: () => {
    return axiosClient.get('/favorites');
  },

  // Thêm vào yêu thích
  addToFavorites: (productId) => {
    return axiosClient.post('/favorites', { productId });
  },

  // Xóa khỏi yêu thích
  removeFromFavorites: (productId) => {
    return axiosClient.delete(`/favorites/${productId}`);
  },

  // Kiểm tra sản phẩm có trong yêu thích không
  checkFavorite: (productId) => {
    return axiosClient.get(`/favorites/check/${productId}`);
  },
}; 