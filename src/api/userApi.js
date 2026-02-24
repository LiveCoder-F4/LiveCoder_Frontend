import axiosInstance from './axiosInstance';

export const userApi = {
  // 특정 사용자 조회
  getUser: (id) => {
    return axiosInstance.get(`/users/${id}`);
  },

  // 사용자 정보 수정 (닉네임, 소개, Github URL)
  updateUser: (id, userData) => {
    return axiosInstance.put(`/users/${id}`, userData);
  },

  // 비밀번호 변경
  changePassword: (id, passwordData) => {
    return axiosInstance.put(`/users/${id}/password`, passwordData);
  },

  // 이메일 변경
  changeEmail: (id, emailData) => {
    return axiosInstance.put(`/users/${id}/email`, emailData);
  },

  // 풀이 공개 여부 변경
  updateSolvedVisibility: (id, solvedData) => {
    return axiosInstance.put(`/users/${id}/solved`, solvedData);
  },

  // 회원 탈퇴
  deleteUser: (id, passwordData) => {
    // passwordData: { password: "your_password" }
    return axiosInstance.delete(`/users/${id}`, { data: passwordData });
  }
};
