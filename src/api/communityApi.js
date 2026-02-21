import axiosInstance from './axiosInstance';

export const communityApi = {
  // 게시판별 최신 요약 가져오기 (공지, 질문, 정보공유 5개씩)
  getSummary: () => {
    return axiosInstance.get('/posts/summary');
  },

  // 특정 카테고리의 게시글 목록 가져오기
  getPostsByCategory: (category, page = 0, size = 10) => {
    return axiosInstance.get('/posts', { params: { category, page, size } });
  },

  // 게시글 목록 가져오기 (전체/기존 방식 하위호환)
  getPosts: (page = 0, size = 10) => {
    return axiosInstance.get('/posts/community', { params: { page, size } });
  },

  // 게시글 상세 조회
  getPostDetail: (id) => {
    return axiosInstance.get(`/posts/${id}`);
  },

  // 조회수 증가
  increaseViewCount: (id) => {
    return axiosInstance.post(`/posts/${id}/view`);
  },

  // 게시글 작성
  createPost: (postData) => {
    return axiosInstance.post('/posts', postData);
  },

  // 게시글 수정
  updatePost: (id, postData) => {
    return axiosInstance.put(`/posts/${id}`, postData);
  },

  // 게시글 삭제
  deletePost: (id) => {
    return axiosInstance.delete(`/posts/${id}`);
  },

  // 댓글 작성
  createComment: (postId, commentData) => {
    return axiosInstance.post(`/posts/${postId}/comments`, commentData);
  },

  // 댓글 수정
  updateComment: (postId, commentId, content) => {
    return axiosInstance.put(`/posts/${postId}/comments/${commentId}`, { content });
  },

  // 댓글 삭제
  deleteComment: (postId, commentId) => {
    return axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
  },

  // 좋아요 클릭
  likePost: (postId) => {
    return axiosInstance.post(`/posts/${postId}/likes`);
  },

  // 좋아요 취소
  unlikePost: (postId) => {
    return axiosInstance.delete(`/posts/${postId}/likes`);
  }
};
