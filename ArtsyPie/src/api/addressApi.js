import axiosClient from './axiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function để thêm auth header cho address API
const getAuthHeaders = async () => {
  try {
  
    const token = await AsyncStorage.getItem('userToken');
    
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (error) {
    console.error('Address API: Error getting token', error);
    return {};
  }
};

export const addressApi = {
  // Lấy danh sách địa chỉ của user
  getAddresses: async () => {
    const headers = await getAuthHeaders();
    return axiosClient.get('/addresses', { headers });
  },

  // Thêm địa chỉ mới
  addAddress: async (addressData) => {

    const headers = await getAuthHeaders();
    
    return axiosClient.post('/addresses', addressData, { headers });
  },

  // Cập nhật địa chỉ
  updateAddress: async (addressId, addressData) => {
    const headers = await getAuthHeaders();
    return axiosClient.put(`/addresses/${addressId}`, addressData, { headers });
  },

  // Xóa địa chỉ
  deleteAddress: async (addressId) => {
    const headers = await getAuthHeaders();
    return axiosClient.delete(`/addresses/${addressId}`, { headers });
  },
}; 