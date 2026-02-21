import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import AppLayout from "../../app/AppLayout.jsx";
import { problemApi } from "../../api/problemApi";

export default function ProblemsAuthed() {
  const navigate = useNavigate(); // ✅ 추가
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const response = await problemApi.getAllProblems();
        setProblems(response.data);
      } catch (err) {
        console.error("문제 목록을 불러오는데 실패했습니다.", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProblems();
  }, []);

  return (
    <AppLayout 
      right={
        <div className='flex items-center gap-2'>
          <a href='/me' className='rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50'>마이페이지</a>
          <button className='rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50' onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}>로그아웃</button>
        </div>
      }
    >
      <div className="mb-4 h-12 rounded-lg bg-white border flex items-center justify-between px-4 text-sm text-neutral-500 shadow-sm">
        <div>필터: 난이도(전체) / 태그(전체) / 정렬(최신순)</div>
        <button 
          onClick={() => navigate("/problems/create")} 
          className="bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-neutral-800 transition"
        >
          + 문제 만들기
        </button>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold">문제 목록</h2>
        
        {loading ? (
          <div className="text-center py-10 text-neutral-400">문제를 불러오는 중입니다...</div>
        ) : problems.length > 0 ? (
          <ul className="space-y-3">
            {problems.map((problem) => (
              <li key={problem.problem_id}>
                <a 
                  href={`/problems/${problem.problem_id}`} 
                  className="flex items-center justify-between rounded-xl border border-neutral-100 p-4 transition hover:bg-neutral-50 hover:border-neutral-200"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-neutral-400">#{problem.problem_id}</span>
                    <span className="font-semibold text-neutral-800">{problem.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wider ${
                      problem.difficultyName === 'EASY' ? 'bg-green-50 text-green-600 border border-green-100' : 
                      problem.difficultyName === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {problem.difficultyName}
                    </span>
                    <span className="text-neutral-300">→</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 text-neutral-400">등록된 문제가 없습니다.</div>
        )}
      </div>
    </AppLayout>
  );
}
