import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../app/AppLayout.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { problemApi } from "../../api/problemApi";

export default function ProblemCreate() {
  const navigate = useNavigate();
  const { id } = useParams(); // id가 있으면 수정 모드
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    inputDescription: "",
    outputDescription: "",
    sampleInput: "",
    sampleOutput: "",
    constraints: "",
    timeLimit: 1000,
    memoryLimit: 256,
    difficulty_id: 1 // 1: Easy, 2: Medium, 3: Hard
  });

  useEffect(() => {
    if (isEditMode) {
      // 수정 모드라면 기존 데이터 불러오기
      async function fetchProblem() {
        try {
          const response = await problemApi.getProblemDetail(id);
          const data = response.data;
          setFormData({
            ...data,
            difficulty_id: data.difficultyName === "EASY" ? 1 : data.difficultyName === "MEDIUM" ? 2 : 3
          });
        } catch (err) {
          console.error("문제 정보 로딩 실패", err);
        }
      }
      fetchProblem();
    }
  }, [isEditMode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await problemApi.updateProblem(id, formData);
        alert("문제가 수정되었습니다.");
      } else {
        await problemApi.createProblem(formData);
        alert("문제가 생성되었습니다.");
      }
      navigate("/problems/auth");
    } catch (err) {
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <AppLayout showMenu={true}>
      <div className="max-w-4xl mx-auto rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-6">{isEditMode ? "문제 수정" : "새 문제 생성"}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1 ml-1">문제 제목</label>
              <Input name="title" value={formData.title} onChange={handleChange} required placeholder="예: 두 수의 합" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 ml-1">난이도</label>
              <select 
                name="difficulty_id" 
                value={formData.difficulty_id} 
                onChange={handleChange}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value={1}>Easy (브론즈~실버)</option>
                <option value={2}>Medium (골드)</option>
                <option value={3}>Hard (플래티넘 이상)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1 ml-1">시간 제한 (ms)</label>
                <Input type="number" name="timeLimit" value={formData.timeLimit} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1 ml-1">메모리 제한 (MB)</label>
                <Input type="number" name="memoryLimit" value={formData.memoryLimit} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1 ml-1">문제 설명</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={5}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 resize-y"
              placeholder="문제를 자세히 설명해주세요."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 ml-1">입력 조건</label>
              <textarea name="inputDescription" value={formData.inputDescription} onChange={handleChange} rows={3} className="w-full rounded-xl border border-neutral-200 p-3 text-sm outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 ml-1">출력 조건</label>
              <textarea name="outputDescription" value={formData.outputDescription} onChange={handleChange} rows={3} className="w-full rounded-xl border border-neutral-200 p-3 text-sm outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 ml-1">예제 입력</label>
              <textarea name="sampleInput" value={formData.sampleInput} onChange={handleChange} rows={3} className="w-full rounded-xl border border-neutral-200 p-3 text-sm font-mono bg-neutral-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 ml-1">예제 출력</label>
              <textarea name="sampleOutput" value={formData.sampleOutput} onChange={handleChange} rows={3} className="w-full rounded-xl border border-neutral-200 p-3 text-sm font-mono bg-neutral-50" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="ghost" type="button" onClick={() => navigate(-1)}>취소</Button>
            <Button variant="solid" type="submit">{isEditMode ? "수정 완료" : "문제 생성"}</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
