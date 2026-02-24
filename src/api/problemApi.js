import axiosInstance from './axiosInstance';

export const problemApi = {
  // 모든 문제 목록 가져오기
  getAllProblems: async () => {
    return await axiosInstance.get('/problems');
  },
  
  // 특정 문제 상세 정보 가져오기
  getProblemDetail: async (id) => {
    return await axiosInstance.get(`/problems/${id}`);
  },
  
  // 특정 제출 내역 상세 가져오기
  getSubmissionDetail: async (submissionId) => {
    return await axiosInstance.get(`/problems/submissions/${submissionId}`);
  },
  
  // 코드 채점하기 (세션 기반)
  judgeCode: async (problemId, codeData) => {
    // codeData: { code: string, language: string }
    return await axiosInstance.post(`/problems/${problemId}/judge`, codeData);
  },

  // 최종 제출하기 (DB 저장)
  submitCode: async (problemId) => {
    return await axiosInstance.post(`/problems/${problemId}/submissions`);
  },

  // 문제 생성하기 (Admin)
  createProblem: async (problemData) => {
    return await axiosInstance.post('/problems', problemData);
  },

  // 문제 수정하기 (Admin)
  updateProblem: async (id, problemData) => {
    return await axiosInstance.put(`/problems/${id}`, problemData);
  },

  // 문제 삭제하기 (Admin)
  deleteProblem: async (id) => {
    return await axiosInstance.delete(`/problems/${id}`);
  }
};
