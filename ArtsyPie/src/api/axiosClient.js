import axios from 'axios';
const url = 'http://10.0.2.2:5000/api';

const axiosClient = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default axiosClient;