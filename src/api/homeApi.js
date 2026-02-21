import axiosInstance from './axiosInstance';

export const homeApi = {
  getHomeData: (userId = 1) => {
    return axiosInstance.get('/home', { params: { userId } });
  },
  getAllNews: (page = 0, size = 10) => {
    return axiosInstance.get('/home/news', { params: { page, size } });
  }
};
