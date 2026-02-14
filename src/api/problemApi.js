// 더미 데이터를 반환하는 Problem API
export const problemApi = {
  // 모든 문제 목록 가져오기
  getAllProblems: () => {
    return Promise.resolve({
      data: [
        { id: 1001, title: "A+B", difficulty: "EASY" },
        { id: 1002, title: "원의 교점", difficulty: "MEDIUM" },
        { id: 1003, title: "피보나치 함수", difficulty: "MEDIUM" },
        { id: 1004, title: "최단 경로 찾기", difficulty: "HARD" },
        { id: 1005, title: "행렬 곱셈", difficulty: "MEDIUM" },
        { id: 1006, title: "N-Queen 문제", difficulty: "HARD" },
      ]
    });
  },
  
  // 특정 문제 상세 정보 가져오기
  getProblemDetail: (id) => {
    return Promise.resolve({
      data: {
        id: id,
        title: "더미 문제 제목",
        description: "문제 설명이 여기에 들어갑니다.",
        inputDescription: "첫째 줄에 정수 N이 주어집니다.",
        outputDescription: "첫째 줄에 N번째 피보나치 수를 출력합니다.",
        sampleInput: "10",
        sampleOutput: "55",
        constraints: "N은 45보다 작거나 같은 자연수이다.",
        difficulty: "EASY",
        timeLimit: 1000,
        memoryLimit: 128
      }
    });
  },
  
  // 코드 제출하기
  submitCode: (problemId, codeData) => {
    console.log(`문제 ${problemId}에 코드 제출:`, codeData);
    return Promise.resolve({ data: "CORRECT" });
  },

  // 문제 생성하기 (Admin)
  createProblem: (problemData) => {
    console.log("문제 생성 요청:", problemData);
    return Promise.resolve({ data: { success: true, id: 1007 } });
  },

  // 문제 수정하기 (Admin)
  updateProblem: (id, problemData) => {
    console.log(`문제 ${id} 수정 요청:`, problemData);
    return Promise.resolve({ data: { success: true } });
  },

  // 문제 삭제하기 (Admin)
  deleteProblem: (id) => {
    console.log(`문제 ${id} 삭제 요청`);
    return Promise.resolve({ data: { success: true } });
  }
};
