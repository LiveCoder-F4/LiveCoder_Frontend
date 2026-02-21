import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AppLayout from "../../app/AppLayout.jsx";
import { communityApi } from "../../api/communityApi";
import Button from "../../components/ui/Button.jsx";

export default function BoardListAuthed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category") || "INFO";
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const boardNames = {
    NOTICE: "공지사항",
    QUESTION: "질문 게시판",
    INFO: "정보 공유 게시판"
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await communityApi.getPostsByCategory(category);
        if (response.data && response.data.success) {
          setPosts(response.data.data.items);
        }
      } catch (err) {
        console.error("게시글 목록을 불러오는데 실패했습니다.", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [category]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-neutral-800">{boardNames[category] || "커뮤니티"}</h2>
              <p className="text-xs text-neutral-500 mt-1">
                {category === 'NOTICE' ? '중요 소식을 전해드립니다.' : '함께 지식을 나누고 성장하세요.'}
              </p>
            </div>
            {category !== 'NOTICE' && (
              <Button onClick={() => navigate('/posts/create')} className="px-5 py-2">
                글쓰기
              </Button>
            )}
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
                등록된 게시글이 없습니다. 첫 번째 글의 주인공이 되어보세요!
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