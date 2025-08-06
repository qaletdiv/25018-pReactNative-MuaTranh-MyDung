import axiosClient from './axiosClient';

const ordersApi = {
  getAllOrders: (userEmail) => {
    return axiosClient.get(`/orders?email=${userEmail}`);
  },

  getOrderById: (orderId) => {
    return axiosClient.get(`/orders/${orderId}`);
  },

  createOrder: (orderData) => {
    console.log('ordersApi.createOrder called with:', JSON.stringify(orderData, null, 2));
    return axiosClient.post('/orders', orderData);
  },

  updateOrderStatus: (orderId, status) => {
    return axiosClient.patch(`/orders/${orderId}/status`, { status });
  },
};

export default ordersApi; 