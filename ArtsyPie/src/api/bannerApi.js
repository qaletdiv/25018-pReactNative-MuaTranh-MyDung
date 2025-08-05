import axiosClient from './axiosClient';

export const bannerApi = {
  // Lấy danh sách banner
  getBanners: () => {
    return axiosClient.get('/home/banner');
  },
}; 