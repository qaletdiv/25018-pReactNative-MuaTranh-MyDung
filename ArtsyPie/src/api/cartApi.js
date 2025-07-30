import axiosClient from './axiosClient';

export const cartApi = {
  // Thêm vào giỏ hàng
  addToCart: (productId, quantity = 1, size = 'Standard', frame = 'No Frame') => {
    return axiosClient.post('/cart/add', { productId, quantity, size, frame });
  },

  // Cập nhật số lượng
  updateCartItem: (productId, quantity) => {
    return axiosClient.put('/cart/update', { productId, quantity });
  },

  // Xóa khỏi giỏ hàng
  removeFromCart: (productId) => {
    return axiosClient.delete('/cart/remove', { data: { productId } });
  },

  // Lấy giỏ hàng
  getCart: () => {
    return axiosClient.get('/cart');
  },
}; 