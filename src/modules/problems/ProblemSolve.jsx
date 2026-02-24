import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../app/AppLayout.jsx";
import Button from "../../components/ui/Button.jsx";
import { problemApi } from "../../api/problemApi";

export default function ProblemSolve() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("// 여기에 코드를 작성하세요\n\npublic class Solution {\n  public static void main(String[] args) {\n    System.out.println(\"Hello World\");\n  }\n}");
  const [debugResult, setDebugResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchProblem() {
      try {
        const response = await problemApi.getProblemDetail(id);
        setProblem(response.data);
      } catch (err) {
        console.error("문제 정보를 불러오는데 실패했습니다.", err);
      }
    }
    fetchProblem();
  }, [id]);

  const handleJudge = async () => {
    setSubmitting(true);
    setDebugResult(null);
    try {
      // 현재는 Java만 지원하므로 language: "java" 고정
      const response = await problemApi.judgeCode(id, { code, language: "java" });
      setDebugResult(response.data);
    } catch (err) {
      alert("디버깅 실행 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!debugResult) {
      alert("먼저 디버깅(코드 실행)을 완료해 주세요.");
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await problemApi.submitCode(id);
      // 백엔드가 SubmissionResponse 또는 관련 데이터를 반환한다고 가정
      // 만약 response.data에 submissionId가 있다면 해당 상세 페이지로 이동
      const submissionId = response.data.submissionId;
      
      alert(`최종 제출 완료! 결과: ${response.data.status}`);
      
      if (submissionId) {
        navigate(`/problems/${id}/submissions/${submissionId}`);
      } else {
        navigate("/problems/auth");
      }
    } catch (err) {
      alert(err.response?.data || "제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout showMenu={false}>
      <button onClick={() => navigate(-1)} className="mb-4 rounded border px-3 py-1 text-sm hover:bg-neutral-50">← 돌아가기</button>
      
      {problem ? (
        <div className="grid gap-4 md:grid-cols-3 h-[calc(100vh-180px)]">
          {/* 왼쪽: 문제 설명 */}
          <div className="md:col-span-1 rounded-2xl border bg-white p-6 overflow-y-auto shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono text-neutral-400">#{problem.problem_id}</span>
              <h1 className="text-2xl font-bold text-neutral-900">{problem.title}</h1>
            </div>
            <div className="flex gap-2 mb-6">
              <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                problem.difficultyName === 'EASY' ? 'bg-green-50 text-green-600' : 
                problem.difficultyName === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {problem.difficultyName}
              </span>
              <span className="text-[10px] px-2 py-1 bg-neutral-100 rounded text-neutral-500 font-medium">시간 제한: {problem.timeLimit}ms</span>
              <span className="text-[10px] px-2 py-1 bg-neutral-100 rounded text-neutral-500 font-medium">메모리 제한: {problem.memoryLimit}MB</span>
            </div>
            <div className="prose prose-sm max-w-none text-neutral-700 leading-relaxed">
              <section className="mb-6">
                <p className="font-bold mb-2 text-neutral-900 border-l-4 border-indigo-500 pl-2">문제 설명</p>
                <p className="whitespace-pre-line">{problem.description}</p>
              </section>

              {problem.inputDescription && (
                <section className="mb-6">
                  <p className="font-bold mb-2 text-neutral-900 border-l-4 border-neutral-300 pl-2">입력</p>
                  <p className="text-sm">{problem.inputDescription}</p>
                </section>
              )}

              {problem.outputDescription && (
                <section className="mb-6">
                  <p className="font-bold mb-2 text-neutral-900 border-l-4 border-neutral-300 pl-2">출력</p>
                  <p className="text-sm">{problem.outputDescription}</p>
                </section>
              )}
              
              <div className="mt-8 space-y-4">
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <p className="font-bold mb-2 text-xs text-neutral-500 uppercase tracking-widest">예제 입력</p>
                  <pre className="text-sm font-mono text-neutral-700 bg-white p-2 rounded border border-neutral-200">{problem.sampleInput || "없음"}</pre>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <p className="font-bold mb-2 text-xs text-neutral-500 uppercase tracking-widest">예제 출력</p>
                  <pre className="text-sm font-mono text-neutral-700 bg-white p-2 rounded border border-neutral-200">{problem.sampleOutput || "없음"}</pre>
                </div>
              </div>

              {problem.constraints && (
                <div className="mt-6 text-[11px] text-neutral-400 italic">
                  * 제약 사항: {problem.constraints}
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 에디터 */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex-1 rounded-2xl border bg-neutral-900 p-4 font-mono text-sm text-green-400 shadow-inner">
              <textarea 
                className="w-full h-full bg-transparent outline-none resize-none spellcheck-false"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
              />
            </div>
            
            {/* 결과 표시 보드 */}
            {debugResult && (
              <div className={`rounded-xl border p-4 transition-all duration-300 ${
                debugResult.correct ? 'bg-green-50 border-green-200' : 'bg-rose-50 border-rose-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-bold flex items-center gap-2 ${
                    debugResult.correct ? 'text-green-700' : 'text-rose-700'
                  }`}>
                    {debugResult.correct ? '✅ 정답입니다' : `❌ ${debugResult.status}`}
                  </h3>
                  <div className="flex gap-4 text-xs font-mono text-neutral-500">
                    <span>시간: {debugResult.executionTime}ms</span>
                    <span>메모리: {(debugResult.memoryUsage / 1024).toFixed(2)}MB</span>
                  </div>
                </div>
                <div className="bg-white/50 p-2 rounded text-xs font-mono text-neutral-600 border border-black/5">
                  {debugResult.message || "상세 실행 결과 없음"}
                </div>
              </div>
            )}

            <div className="rounded-2xl border bg-white p-4 flex justify-between items-center shadow-sm">
              <div className="text-sm text-neutral-400">언어: Java 17</div>
              <div className="flex gap-2">
                <Button onClick={handleJudge} disabled={submitting}>
                  {submitting ? '실행 중...' : '디버깅 (코드 실행)'}
                </Button>
                <Button variant="solid" onClick={handleSubmit} disabled={submitting || !debugResult}>
                  최종 코드 제출
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">문제를 불러오는 중...</div>
      )}
    </AppLayout>
  );
}