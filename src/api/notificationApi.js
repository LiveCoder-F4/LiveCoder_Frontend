import axiosInstance from './axiosInstance';

export const notificationApi = {
  // 읽지 않은 알림 조회
  getUnreadNotifications: async () => {
    return await axiosInstance.get('/notifications/unread');
  },
  
  // 알림 읽음 처리
  markAsRead: async (notificationId) => {
    return await axiosInstance.put(`/notifications/${notificationId}/read`);
  },
  
  // 모든 알림 읽음 처리
  markAllAsRead: async () => {
    return await axiosInstance.put('/notifications/read-all');
  }
};
