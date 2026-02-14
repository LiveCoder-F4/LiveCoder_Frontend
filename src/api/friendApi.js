// 더미 데이터를 반환하는 Friend/Chat API
export const friendApi = {
  // 친구 목록 조회
  getFriends: () => Promise.resolve({
    data: [
      { id: 2, nickname: "서버마스터", status: "ONLINE" },
      { id: 3, nickname: "알고맨", status: "OFFLINE" },
      { id: 4, nickname: "코딩꿈나무", status: "ONLINE" }
    ]
  }),

  // 쪽지 목록 조회
  getMessages: () => Promise.resolve({
    data: [
      { id: 1, sender: "서버마스터", content: "오늘 배틀 한 판 어때요?", time: "오후 2:30", isRead: false },
      { id: 2, sender: "알고맨", content: "문제 풀이 공유 감사합니다!", time: "어제", isRead: true }
    ]
  }),

  // 쪽지 보내기
  sendMessage: (receiverId, content) => {
    console.log(`${receiverId}에게 메시지 전송:`, content);
    return Promise.resolve({ data: { success: true } });
  }
};
