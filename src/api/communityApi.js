// 더미 데이터를 반환하는 Community API
export const communityApi = {
  // 게시글 목록 가져오기
  getPosts: () => Promise.resolve({
    data: [
      { id: 1, title: "React 19에서 변경된 점 정리", author: "코딩왕", createdAt: "2024-03-20", likes: 12, comments: 5 },
      { id: 2, title: "백엔드 개발자 로드맵 공유합니다", author: "서버마스터", createdAt: "2024-03-19", likes: 45, comments: 12 },
      { id: 3, title: "알고리즘 문제 풀이 꿀팁 (Java)", author: "알고맨", createdAt: "2024-03-18", likes: 23, comments: 8 },
    ]
  }),

  // 게시글 상세 조회
  getPostDetail: (id) => Promise.resolve({
    data: {
      id,
      title: "백엔드 개발자 로드맵 공유합니다",
      content: "백엔드 개발자가 되기 위해서는 Java, Spring Boot, MySQL 등을 공부해야 합니다...",
      author: "서버마스터",
      createdAt: "2024-03-19",
      likes: 45,
      comments: [
        { id: 101, author: "질문자", content: "도움이 많이 되었습니다!", createdAt: "2024-03-19 14:00" },
        { id: 102, author: "답변자", content: "추가로 Redis도 공부하시면 좋습니다.", createdAt: "2024-03-19 15:30" }
      ]
    }
  }),

  // 게시글 작성
  createPost: (postData) => {
    console.log("게시글 작성 요청:", postData);
    return Promise.resolve({ data: { success: true } });
  },

  // 댓글 작성
  createComment: (postId, commentData) => {
    console.log(`게시글 ${postId}에 댓글 작성:`, commentData);
    return Promise.resolve({ data: { success: true } });
  },

  // 좋아요 클릭
  likePost: (postId) => {
    console.log(`게시글 ${postId} 좋아요 클릭`);
    return Promise.resolve({ data: { success: true } });
  }
};
