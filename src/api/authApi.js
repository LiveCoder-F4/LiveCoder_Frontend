// 더미 데이터를 반환하는 Auth API
export const authApi = {
  register: (userData) => {
    console.log("회원가입 요청:", userData);
    return Promise.resolve({ data: "회원가입이 완료되었습니다." });
  },
  
  login: (credentials) => {
    console.log("로그인 요청:", credentials);
    return Promise.resolve({
      data: {
        token: "dummy-jwt-token",
        userId: 1,
        nickname: "코딩왕김개발",
      }
    });
  },
  
  logout: () => {
    return Promise.resolve({ data: "로그아웃 성공" });
  },
  
  checkAuth: () => {
    return Promise.resolve({
      data: {
        authenticated: true,
        userId: 1,
        username: "tester",
        nickname: "코딩왕김개발"
      }
    });
  }
};
