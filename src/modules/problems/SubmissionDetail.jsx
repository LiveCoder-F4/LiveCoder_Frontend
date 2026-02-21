import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../app/AppLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import { problemApi } from "../../api/problemApi";

export default function SubmissionDetail() {
  const { problemId, submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSubmissionDetail() {
      try {
        const response = await problemApi.getSubmissionDetail(submissionId);
        setSubmission(response.data);
      } catch (err) {
        console.error("제출 내역을 불러오는데 실패했습니다.", err);
        setError("제출 내역을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissionDetail();
  }, [submissionId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64 text-neutral-400">
          데이터를 불러오는 중...
        </div>
      </AppLayout>
    );
  }

  if (error || !submission) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-red-500 font-medium">{error || "제출 내역을 찾을 수 없습니다."}</p>
          <Button onClick={() => navigate(-1)}>뒤로 가기</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-neutral-800">풀이 결과 상세</h1>
          <Button variant="outline" onClick={() => navigate(`/problems/${problemId}`)}>
            문제로 이동
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">상태</span>
            <span className={`text-lg font-bold ${submission.status === '정답' ? 'text-green-500' : 'text-red-500'}`}>
              {submission.status}
            </span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">언어</span>
            <span className="text-lg font-bold text-neutral-700">{submission.language}</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">시간</span>
            <span className="text-lg font-bold text-neutral-700">{submission.executionTime} ms</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">메모리</span>
            <span className="text-lg font-bold text-neutral-700">{submission.memoryUsage} KB</span>
          </Card>
        </div>

        <Card title={`제출 코드 - ${submission.problemTitle}`}>
          <div className="relative group">
            <pre className="p-4 bg-neutral-900 text-neutral-100 rounded-md overflow-x-auto text-sm font-mono leading-relaxed min-h-[300px]">
              <code>{submission.code}</code>
            </pre>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(submission.code);
                  alert("코드가 복사되었습니다.");
                }}
                className="px-2 py-1 bg-neutral-700 text-white text-[10px] rounded hover:bg-neutral-600"
              >
                복사
              </button>
            </div>
          </div>
        </Card>

        <div className="flex justify-center pt-4">
          <Button onClick={() => navigate(-1)}>목록으로 돌아가기</Button>
        </div>
      </div>
    </AppLayout>
  );
}
