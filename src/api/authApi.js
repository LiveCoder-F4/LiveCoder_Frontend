import axiosInstance from './axiosInstance';

export const authApi = {
  // 회원가입
  register: async (userData) => {
    return await axiosInstance.post('/users/register', userData);
  },
  
  // 로그인
  login: async (credentials) => {
    const response = await axiosInstance.post('/users/login', credentials);
    // 로그인 성공 시 토큰을 로컬 스토리지에 저장
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  
  // 로그아웃
  logout: async () => {
    const response = await axiosInstance.post('/users/logout');
    localStorage.removeItem('token');
    return response;
  },
  
  // 인증 상태 확인
  checkAuth: async () => {
    return await axiosInstance.get('/users/auth-check');
  }
};
