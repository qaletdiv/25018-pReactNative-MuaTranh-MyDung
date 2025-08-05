import axiosClient from './axiosClient';

const ordersApi = {
  getAllOrders: () => {
    return axiosClient.get('/orders');
  },

  getOrderById: (orderId) => {
    return axiosClient.get(`/orders/${orderId}`);
  },

  createOrder: (orderData) => {
    return axiosClient.post('/orders', orderData);
  },

  updateOrderStatus: (orderId, status) => {
    return axiosClient.patch(`/orders/${orderId}/status`, { status });
  },
};

export default ordersApi; 