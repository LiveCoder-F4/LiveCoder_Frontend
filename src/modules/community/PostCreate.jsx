import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom"; // ✅ useSearchParams 추가
import AppLayout from "../../app/AppLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import { communityApi } from "../../api/communityApi";

export default function PostCreate() {
  const { id } = useParams(); 
  const [searchParams] = useSearchParams(); // ✅ 추가
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const isEditMode = !!id;
  
  // ✅ 임시 관리자 체크
  const isAdmin = userId === "1";
  const initialCategory = searchParams.get("category") || "INFO";
  
  const [formData, setFormData] = useState({
    title: "",
    category: initialCategory, // ✅ 초기값 설정
    content: ""
  });
  const [files, setFiles] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      async function fetchPostForEdit() {
        try {
          const response = await communityApi.getPostDetail(id);
          if (response.data && response.data.success) {
            const post = response.data.data;
            setFormData({
              title: post.title,
              category: post.category || "INFO",
              content: post.content
            });
          }
        } catch (err) {
          console.error("게시글 정보를 불러오는데 실패했습니다.", err);
          alert("게시글 정보를 불러오는데 실패했습니다.");
        }
      }
      fetchPostForEdit();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      if (isEditMode) {
        const response = await communityApi.updatePost(id, formData);
        if (response.data && response.data.success) {
          alert("게시글이 성공적으로 수정되었습니다.");
          navigate(`/posts/${id}`);
        }
      } else {
        // ✅ 공지사항 작성 (관리자 전용 API 호출)
        if (formData.category === 'NOTICE' && isAdmin) {
          const response = await communityApi.createNotice({
            ...formData,
            userId: parseInt(userId || "1")
          });
          if (response.data && response.data.success) {
            alert("공지사항이 등록되었습니다.");
            navigate(`/posts/${response.data.data.postId}`);
          }
          return;
        }

        // 파일 포함 여부에 따른 처리 (기존 로직)
        if (files.length > 0) {
          const data = new FormData();
          data.append("title", formData.title);
          data.append("content", formData.content);
          data.append("category", formData.category);
          data.append("userId", userId || "1");
          
          files.forEach(file => {
            data.append("files", file);
          });

          const response = await communityApi.createPostWithFiles(data);
          if (response.data && response.data.success) {
            alert("게시글이 성공적으로 등록되었습니다.");
            const newPostId = response.data.data.postId;
            navigate(`/posts/${newPostId}`);
          }
        } else {
          const postData = {
            ...formData,
            userId: parseInt(userId || "1")
          };
          const response = await communityApi.createPost(postData);
          if (response.data && response.data.success) {
            alert("게시글이 성공적으로 등록되었습니다.");
            const newPostId = response.data.data.postId;
            navigate(`/posts/${newPostId}`);
          }
        }
      }
    } catch (err) {
      console.error("게시글 작업에 실패했습니다.", err);
      alert(err.response?.data?.message || "작업 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neutral-800">
            {isEditMode ? "게시글 수정" : (formData.category === 'NOTICE' ? "🚀 공지사항 작성" : "새 게시글 작성")}
          </h1>
          <Button variant="outline" onClick={() => navigate(-1)}>취소</Button>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6 p-2">
            {/* ✅ 카테고리 선택 (관리자이거나 수정 모드가 아닐 때) */}
            {(!isEditMode && (isAdmin || formData.category !== 'NOTICE')) && (
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">카테고리</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all text-sm font-medium"
                >
                  <option value="INFO">정보 공유</option>
                  <option value="QUESTION">질문</option>
                  {isAdmin && <option value="NOTICE">🚀 공지사항</option>}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">제목</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="제목을 입력하세요"
                className="w-full text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">내용</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="내용을 상세히 적어주세요."
                rows={15}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm leading-relaxed"
                required
              />
            </div>

            {!isEditMode && formData.category !== 'NOTICE' && (
              <div className="p-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                <label className="block text-sm font-bold text-neutral-600 mb-3">파일 첨부</label>
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileChange}
                  className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
                />
                {files.length > 0 && (
                  <ul className="mt-4 space-y-1">
                    {files.map((file, idx) => (
                      <li key={idx} className="text-xs text-neutral-500 flex items-center gap-2">
                        📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="px-8 py-2.5 text-base font-bold shadow-lg shadow-indigo-100">
                {loading ? "처리 중..." : (isEditMode ? "게시글 수정하기" : (formData.category === 'NOTICE' ? "공지 등록하기" : "게시글 등록하기"))}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
