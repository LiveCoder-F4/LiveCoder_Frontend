import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../app/AppLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import { communityApi } from "../../api/communityApi";

export default function PostCreate() {
  const { id } = useParams(); // 수정 시 id가 있음
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: "",
    category: "INFO",
    content: ""
  });
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
    } catch (err) {
      console.error("게시글 작업에 실패했습니다.", err);
      alert("작업 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neutral-800">
            {isEditMode ? "게시글 수정" : "새 게시글 작성"}
          </h1>
          <Button variant="outline" onClick={() => navigate(-1)}>취소</Button>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6 p-2">
            {!isEditMode && (
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">카테고리</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all text-sm"
                >
                  <option value="INFO">정보 공유</option>
                  <option value="QUESTION">질문</option>
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
                className="w-full"
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

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="px-8 py-2.5 text-base font-bold shadow-lg shadow-indigo-100">
                {loading ? "처리 중..." : (isEditMode ? "게시글 수정하기" : "게시글 등록하기")}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
