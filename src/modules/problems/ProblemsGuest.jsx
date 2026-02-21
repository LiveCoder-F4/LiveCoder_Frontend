import { useEffect, useState } from "react";
import AppLayout from "../../app/AppLayout.jsx";
import { problemApi } from "../../api/problemApi";

export default function ProblemsGuest() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const response = await problemApi.getAllProblems();
        setProblems(response.data);
      } catch (err) {
        console.error("문제 목록을 불러오는데 실패했습니다.", err);
      }
    }
    fetchProblems();
  }, []);

  return (
    <AppLayout right={<a href='/login' className='rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50'>로그인</a>}>
      <div className="mb-4 h-10 rounded-lg bg-white/70 border grid place-items-center text-sm text-neutral-500">
        문제 필터 (난이도 / 태그 / 정렬)
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">문제 목록</h2>
        <ul className="space-y-3">
          {problems.map((problem) => (
            <li key={problem.problem_id}>
              <a href={`/problems/${problem.problem_id}`} className="block rounded-xl border border-neutral-100 px-4 py-3 hover:bg-neutral-50 hover:border-neutral-200 transition">
                <span className="font-mono text-neutral-400 mr-3">#{problem.problem_id}</span>
                <span className="font-semibold">{problem.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
