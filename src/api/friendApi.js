import axiosInstance from './axiosInstance';

export const friendApi = {
  // 친구 목록 조회
  getFriends: async () => {
    return await axiosInstance.get('/friends');
  },
  
  // 친구 요청 보내기
  sendFriendRequest: async (receiverId) => {
    return await axiosInstance.post('/friends/requests', { receiverId });
  },
  
  // 받은 친구 요청 목록 조회
  getReceivedRequests: async () => {
    return await axiosInstance.get('/friends/requests/received');
  },
  
  // 보낸 친구 요청 목록 조회
  getSentRequests: async () => {
    return await axiosInstance.get('/friends/requests/sent');
  },
  
  // 친구 요청 수락
  acceptRequest: async (requestId) => {
    return await axiosInstance.put(`/friends/requests/${requestId}/accept`);
  },
  
  // 친구 요청 거절
  rejectRequest: async (requestId) => {
    return await axiosInstance.put(`/friends/requests/${requestId}/reject`);
  },
  
  // 친구 요청 취소
  cancelRequest: async (requestId) => {
    return await axiosInstance.delete(`/friends/requests/${requestId}`);
  },
  
  // 친구 삭제
  deleteFriend: async (userId) => {
    return await axiosInstance.delete(`/friends/${userId}`);
  },

  // 쪽지 보내기 (백엔드: POST /friends/msg/{userId})
  sendMessage: async (userId, content) => {
    // 백엔드는 FriendMessageRequest 레코드를 받음 (content 필드 포함)
    return await axiosInstance.post(`/friends/msg/${userId}`, { content });
  },

  // 받은 쪽지 목록 조회
  getReceivedMessages: async () => {
    return await axiosInstance.get('/friends/msg/received');
  },

  // 보낸 쪽지 목록 조회
  getSentMessages: async () => {
    return await axiosInstance.get('/friends/msg/sent');
  }
};
