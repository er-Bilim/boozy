import axios from 'axios';
import { API_URL } from '@/constants';
import { store } from '@/app/store';

const axiosApi = axios.create({
  baseURL: API_URL,
});

axiosApi.interceptors.request.use((config) => {
  const token = store.getState().users.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosApi;
