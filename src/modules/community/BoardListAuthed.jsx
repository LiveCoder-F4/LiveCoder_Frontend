import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AppLayout from "../../app/AppLayout.jsx";
import { communityApi } from "../../api/communityApi";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

export default function BoardListAuthed() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category") || "INFO";
  const initialKeyword = searchParams.get("keyword") || "";
  const initialSort = searchParams.get("sort") || "latest";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [sortBy, setSortBy] = useState(initialSort);

  // ✅ 실제 권한 체크 (localStorage의 userRole 사용)
  const isAdmin = localStorage.getItem("userRole") === "ADMIN";

  const boardNames = {
    NOTICE: "공지사항",
    QUESTION: "질문 게시판",
    INFO: "정보 공유 게시판"
  };

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      let response;
      
      if (initialKeyword) {
        // 검색어가 있을 경우 검색 API 호출
        response = await communityApi.searchPosts(initialKeyword, 0, 20, initialSort);
      } else {
        // 검색어가 없을 경우 기존 카테고리별 조회
        response = await communityApi.getPostsByCategory(category, 0, 20, initialSort);
      }

      if (response.data && response.data.success) {
        setPosts(response.data.data.items || []);
      }
    } catch (err) {
      console.error("게시글 목록을 불러오는데 실패했습니다.", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [category, initialKeyword, initialSort]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = { category };
    if (keyword.trim()) params.keyword = keyword.trim();
    if (sortBy !== "latest") params.sort = sortBy;
    setSearchParams(params);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    const params = { category };
    if (keyword.trim()) params.keyword = keyword.trim();
    if (newSort !== "latest") params.sort = newSort;
    setSearchParams(params);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  // ✅ 공지사항 여부와 관리자 권한에 따른 글쓰기 버튼 표시 여부
  const canCreatePost = category !== 'NOTICE' || isAdmin;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-xl shadow-neutral-100/50 overflow-hidden">
          {/* 헤더 섹션 */}
          <div className="px-8 py-8 border-b border-neutral-50 bg-neutral-50/30 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">{boardNames[category] || "커뮤니티"}</h2>
              <p className="text-xs text-neutral-400 mt-2 font-medium">
                {category === 'NOTICE' ? '🚀 서비스의 중요 소식을 가장 먼저 확인하세요.' : '💡 지식을 나누고 동료들과 함께 성장하는 공간입니다.'}
              </p>
            </div>
            {canCreatePost && (
              <Button onClick={() => navigate(`/posts/create?category=${category}`)} className="px-6 py-2.5 font-bold shadow-lg shadow-indigo-100 transition-transform hover:scale-105 active:scale-95">
                {category === 'NOTICE' ? '공지 작성' : '새 글 쓰기'}
              </Button>
            )}
          </div>

          {/* 검색 및 필터 섹션 */}
          <div className="px-8 py-4 bg-white border-b border-neutral-50 flex flex-wrap gap-4 items-center justify-between">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
              <Input 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="제목으로 검색..."
                className="flex-1"
              />
              <Button type="submit" variant="outline" className="px-4">검색</Button>
            </form>

            <div className="flex gap-2">
              {[
                { label: "최신순", value: "latest" },
                { label: "조회순", value: "views" },
                { label: "좋아요순", value: "likes" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                    sortBy === option.value 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-neutral-100">
            {loading ? (
              <div className="p-20 text-center text-neutral-400">로딩 중...</div>
            ) : posts.length > 0 ? (
              posts.map(post => (
                <div 
                  key={post.postId} 
                  className="p-5 hover:bg-neutral-50/80 transition-all cursor-pointer group"
                  onClick={() => navigate(`/posts/${post.postId}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-neutral-800 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <span className="text-xs text-neutral-400 font-medium">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 text-sm">
                    <div className="flex items-center gap-1.5 text-neutral-600">
                      <span className="text-xs opacity-60">👤</span>
                      <span className="font-medium">{post.nickname}</span>
                    </div>
                    <div className="flex items-center gap-4 text-neutral-400">
                      <span className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                        💬 {post.commentCount}
                      </span>
                      <span className="flex items-center gap-1 hover:text-red-500 transition-colors">
                        ❤️ {post.likeCount}
                      </span>
                      <span className="flex items-center gap-1">
                        👁️ {post.viewCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center text-neutral-400 font-light italic">
                {initialKeyword ? `"${initialKeyword}"에 대한 검색 결과가 없습니다.` : "등록된 게시글이 없습니다. 첫 번째 글의 주인공이 되어보세요!"}
              </div>
            )}
          </div>

          <div className="p-6 bg-neutral-50/30 border-t border-neutral-100 flex justify-center gap-3">
            <Button variant="outline" className="text-sm" onClick={() => navigate('/community/auth')}>
              목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}