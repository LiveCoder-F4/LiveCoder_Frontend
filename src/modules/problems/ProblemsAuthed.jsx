import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import AppLayout from "../../app/AppLayout.jsx";
import { problemApi } from "../../api/problemApi";

export default function ProblemsAuthed() {
  const navigate = useNavigate(); 
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ 임시 관리자 체크 (userId 1번)
  const isAdmin = localStorage.getItem("userId") === "1";

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await problemApi.getAllProblems();
      setProblems(response.data || []);
    } catch (err) {
      console.error("문제 목록을 불러오는데 실패했습니다.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDeleteProblem = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("정말로 이 문제를 삭제하시겠습니까?")) return;
    try {
      await problemApi.deleteProblem(id);
      alert("문제가 삭제되었습니다.");
      fetchProblems();
    } catch (err) {
      alert("문제 삭제에 실패했습니다.");
    }
  };

  return (
    <AppLayout 
      right={
        <div className='flex items-center gap-2'>
          <a href='/me' className='rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50 font-medium'>마이페이지</a>
          <button className='rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50 font-medium' onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}>로그아웃</button>
        </div>
      }
    >
      <div className="mb-6 h-14 rounded-2xl bg-white border border-neutral-100 flex items-center justify-between px-6 text-sm text-neutral-500 shadow-sm">
        <div className="font-medium">필터: <span className="text-neutral-900">난이도(전체)</span> / <span className="text-neutral-900">태그(전체)</span> / <span className="text-neutral-900">최신순</span></div>
        
        {/* ✅ 관리자만 노출 */}
        {isAdmin && (
          <button 
            onClick={() => navigate("/problems/create")} 
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
          >
            + 새 문제 등록
          </button>
        )}
      </div>

      <div className="rounded-[2rem] border border-neutral-100 bg-white p-8 shadow-xl shadow-neutral-100/50">
        <h2 className="mb-8 text-2xl font-extrabold text-neutral-900 tracking-tight">문제 보관함</h2>
        
        {loading ? (
          <div className="text-center py-20 text-neutral-400 font-light italic">문제를 불러오는 중입니다...</div>
        ) : problems.length > 0 ? (
          <ul className="space-y-4">
            {problems.map((problem) => (
              <li key={problem.problem_id} className="group relative">
                <a 
                  href={`/problems/${problem.problem_id}`} 
                  className="flex items-center justify-between rounded-2xl border border-neutral-100 p-6 transition-all duration-300 hover:bg-neutral-50 hover:border-indigo-100 hover:translate-x-1"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-neutral-300 text-xs font-bold">#{problem.problem_id}</span>
                    <span className="font-bold text-neutral-800 text-lg group-hover:text-indigo-600 transition-colors">{problem.title}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold tracking-widest uppercase border ${
                      problem.difficultyName === 'EASY' ? 'bg-green-50 text-green-600 border-green-100' : 
                      problem.difficultyName === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {problem.difficultyName}
                    </span>
                    
                    {/* ✅ 관리자용 수정/삭제 버튼 */}
                    {isAdmin && (
                      <div className="flex gap-2 ml-4">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/problems/${problem.problem_id}/edit`);
                          }}
                          className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-neutral-400 transition"
                          title="수정"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={(e) => handleDeleteProblem(e, problem.problem_id)}
                          className="p-2 rounded-lg hover:bg-white hover:text-red-500 text-neutral-400 transition"
                          title="삭제"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                    <span className="text-neutral-200 text-xl font-light group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-20 text-neutral-400 font-light italic">등록된 문제가 없습니다.</div>
        )}
      </div>
    </AppLayout>
  );
}
