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

  const handleSubmit = async () => {
    try {
      const response = await problemApi.submitCode(id, { code });
      alert(`제출 결과: ${response.data}`);
      if (response.data === "CORRECT") {
        navigate("/result", { state: { success: true, problemId: id } });
      }
    } catch (err) {
      alert("제출 중 오류가 발생했습니다.");
    }
  };

  return (
    <AppLayout showMenu={false}>
      <button onClick={() => navigate(-1)} className="mb-4 rounded border px-3 py-1 text-sm hover:bg-neutral-50">← 돌아가기</button>
      
      {problem ? (
        <div className="grid gap-4 md:grid-cols-3 h-[calc(100vh-180px)]">
          {/* 왼쪽: 문제 설명 */}
          <div className="md:col-span-1 rounded-2xl border bg-white p-6 overflow-y-auto">
            <h1 className="text-2xl font-bold mb-2">#{problem.id}. {problem.title}</h1>
            <div className="flex gap-2 mb-4">
              <span className="text-xs px-2 py-1 bg-neutral-100 rounded text-neutral-600">난이도: {problem.difficulty}</span>
              <span className="text-xs px-2 py-1 bg-neutral-100 rounded text-neutral-600">시간 제한: {problem.timeLimit}ms</span>
            </div>
            <div className="prose prose-sm max-w-none text-neutral-700">
              <p className="mb-4"><strong>문제 설명:</strong></p>
              <p>{problem.content}</p>
              <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
                <p className="font-semibold mb-2 text-xs text-neutral-500 uppercase">예제 입력</p>
                <pre className="text-sm">1 2</pre>
                <p className="font-semibold mt-4 mb-2 text-xs text-neutral-500 uppercase">예제 출력</p>
                <pre className="text-sm">3</pre>
              </div>
            </div>
          </div>

          {/* 오른쪽: 에디터 */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex-1 rounded-2xl border bg-neutral-900 p-4 font-mono text-sm text-green-400">
              <textarea 
                className="w-full h-full bg-transparent outline-none resize-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="rounded-2xl border bg-white p-4 flex justify-between items-center shadow-sm">
              <div className="text-sm text-neutral-400">언어: Java 17</div>
              <div className="flex gap-2">
                <Button onClick={() => alert("테스트 케이스를 실행합니다...")}>디버깅</Button>
                <Button variant="solid" onClick={handleSubmit}>코드 제출</Button>
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