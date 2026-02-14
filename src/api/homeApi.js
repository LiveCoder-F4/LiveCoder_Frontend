// 더미 데이터를 반환하는 Home API
export const homeApi = {
  getHomeData: (userId) => {
    return Promise.resolve({
      data: {
        status: "OK",
        data: {
          news: [
            { title: "LiveCoder 서비스 오픈!", content: "실시간 협업 코딩 플랫폼 LiveCoder에 오신 것을 환영합니다." },
            { title: "이번 주 업데이트 안내", content: "실시간 배틀 기능과 협업 에디터가 강화되었습니다." },
            { title: "[공지] 정기 점검 안내", content: "내일 새벽 2시부터 4시까지 서버 점검이 예정되어 있습니다." }
          ],
          recommendedPosts: [
            { title: "React 19에서 변경된 점 정리", id: 1 },
            { title: "백엔드 개발자 로드맵 공유합니다", id: 2 },
            { title: "알고리즘 문제 풀이 꿀팁 (Java)", id: 3 },
            { title: "협업 코딩 시 주의해야 할 점", id: 4 }
          ],
          recentSolved: [
            { problemTitle: "A+B", status: "SOLVED" },
            { problemTitle: "원의 교점", status: "WRONG" },
            { problemTitle: "피보나치 함수", status: "SOLVED" },
            { problemTitle: "별 찍기 - 1", status: "SOLVED" }
          ]
        }
      }
    });
  }
};
