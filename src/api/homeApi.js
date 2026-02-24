import axiosInstance from './axiosInstance';

export const homeApi = {
  // 홈 데이터 가져오기
  getHomeData: async (userId = 1) => {
    return await axiosInstance.get('/home', { params: { userId } });
  },
  // 모든 뉴스 데이터 가져오기
  getAllNews: async (page = 0, size = 10) => {
    return await axiosInstance.get('/home/news', { params: { page, size } });
  }
};
