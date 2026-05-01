import axios from 'axios';
import { API_URL } from '@/constants';

const axiosApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const logoutAndRedirect = async () => {
  try {
    await axios.delete(`${API_URL}/users/sessions`, {
      withCredentials: true,
      timeout: 2000,
    });
  } catch (e) {
    console.log('Could not notify api about logout', e);
  }

  try {
    const { store } = await import('@/app/store.ts');
    const { unsetUser } = await import('@/features/users/usersSlice.ts');

    store.dispatch(unsetUser());
  } catch (e) {
    console.log('Redux store not found.', e);
  }

  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
};

axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== '/users/token'
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${API_URL}/users/token`,
          {},
          { withCredentials: true },
        );
        return axiosApi(originalRequest);
      } catch (refreshError) {
        await logoutAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosApi;
