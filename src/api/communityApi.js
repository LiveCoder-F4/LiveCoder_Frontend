import axiosInstance from './axiosInstance';

export const communityApi = {
  // 게시판별 최신 요약 가져오기 (공지, 질문, 정보공유 5개씩)
  getSummary: async () => {
    return await axiosInstance.get('/posts/summary');
  },

  // 특정 카테고리의 게시글 목록 가져오기
  getPostsByCategory: async (category, page = 0, size = 10) => {
    return await axiosInstance.get('/posts', { params: { category, page, size } });
  },

  // 게시글 목록 가져오기 (전체/기존 방식 하위호환)
  getPosts: async (page = 0, size = 10) => {
    return await axiosInstance.get('/posts/community', { params: { page, size } });
  },

  // 게시글 상세 조회
  getPostDetail: async (id) => {
    return await axiosInstance.get(`/posts/${id}`);
  },

  // 조회수 증가
  increaseViewCount: async (id) => {
    return await axiosInstance.post(`/posts/${id}/view`);
  },

  // 게시글 작성
  createPost: async (postData) => {
    return await axiosInstance.post('/posts', postData);
  },

  // 게시글 수정
  updatePost: async (id, postData) => {
    return await axiosInstance.put(`/posts/${id}`, postData);
  },

  // 게시글 삭제
  deletePost: async (id) => {
    return await axiosInstance.delete(`/posts/${id}`);
  },

  // 댓글 작성
  createComment: async (postId, commentData) => {
    return await axiosInstance.post(`/posts/${postId}/comments`, commentData);
  },

  // 댓글 수정
  updateComment: async (postId, commentId, content) => {
    return await axiosInstance.put(`/posts/${postId}/comments/${commentId}`, { content });
  },

  // 댓글 삭제
  deleteComment: async (postId, commentId) => {
    return await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
  },

  // 좋아요 클릭
  likePost: async (postId) => {
    return await axiosInstance.post(`/posts/${postId}/likes`);
  },

  // 좋아요 취소
  unlikePost: async (postId) => {
    return await axiosInstance.delete(`/posts/${postId}/likes`);
  }
};
