import axiosInstance from './axiosInstance';

export const friendApi = {
  // 친구 목록 조회
  getFriends: () => {
    return axiosInstance.get('/friends');
  },
  
  // 친구 요청 보내기
  sendFriendRequest: (receiverId) => {
    return axiosInstance.post('/friends/requests', { receiverId });
  },
  
  // 받은 친구 요청 목록 조회
  getReceivedRequests: () => {
    return axiosInstance.get('/friends/requests/received');
  },
  
  // 보낸 친구 요청 목록 조회
  getSentRequests: () => {
    return axiosInstance.get('/friends/requests/sent');
  },
  
  // 친구 요청 수락
  acceptRequest: (requestId) => {
    return axiosInstance.put(`/friends/requests/${requestId}/accept`);
  },
  
  // 친구 요청 거절
  rejectRequest: (requestId) => {
    return axiosInstance.put(`/friends/requests/${requestId}/reject`);
  },
  
  // 친구 요청 취소
  cancelRequest: (requestId) => {
    return axiosInstance.delete(`/friends/requests/${requestId}`);
  },
  
  // 친구 삭제
  deleteFriend: (userId) => {
    return axiosInstance.delete(`/friends/${userId}`);
  },

  // 쪽지 보내기
  sendMessage: (userId, content) => {
    return axiosInstance.post(`/friends/msg/${userId}`, { content });
  }
};
