import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = 'http://10.0.2.2:5000/api';

const axiosClient = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để tự động thêm token
axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;