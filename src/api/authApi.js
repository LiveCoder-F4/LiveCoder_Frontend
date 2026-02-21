import axiosInstance from './axiosInstance';

export const authApi = {
  register: (userData) => {
    return axiosInstance.post('/users/register', userData);
  },
  
  login: (credentials) => {
    return axiosInstance.post('/users/login', credentials);
  },
  
  logout: () => {
    return axiosInstance.post('/users/logout');
  },
  
  checkAuth: () => {
    return axiosInstance.get('/users/auth-check');
  }
};
