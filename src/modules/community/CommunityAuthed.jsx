import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../app/AppLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import { communityApi } from "../../api/communityApi";

export default function CommunityAuthed() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    notices: [],
    questions: [],
    info: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await communityApi.getSummary();
        if (response.data && response.data.success) {
          setSummary(response.data.data);
        }
      } catch (err) {
        console.error("커뮤니티 요약을 불러오는데 실패했습니다.", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  const PostItem = ({ post }) => (
    <li 
      className="text-sm py-2 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 cursor-pointer flex justify-between items-center transition-colors px-1 rounded"
      onClick={() => navigate(`/posts/${post.postId}`)}
    >
      <span className="truncate flex-1 font-medium text-neutral-700">{post.title}</span>
      <div className="flex items-center gap-2 ml-2 shrink-0">
        {post.commentCount > 0 && (
          <span className="text-[10px] text-indigo-500 font-bold">[{post.commentCount}]</span>
        )}
        <span className="text-[10px] text-neutral-400">{post.nickname}</span>
      </div>
    </li>
  );

  const BoardCard = ({ title, category, posts }) => (
    <Card title={title}>
      <ul className="space-y-1 min-h-[200px]">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostItem key={post.postId} post={post} />
          ))
        ) : (
          <div className="h-40 flex items-center justify-center text-neutral-400 text-sm font-light italic">
            게시글이 없습니다.
          </div>
        )}
      </ul>
      <div className="mt-4 pt-3 border-t border-neutral-50 text-right">
        <button 
          onClick={() => navigate(`/board/auth?category=${category}`)} 
          className="text-[11px] font-bold text-indigo-500 hover:text-indigo-700 hover:underline flex items-center justify-end gap-1 ml-auto transition-all"
        >
          {title} 더보기 <span className="text-sm">→</span>
        </button>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64 text-neutral-400">데이터를 불러오는 중...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className='grid gap-6 md:grid-cols-3'>
        <BoardCard title="공지사항" category="NOTICE" posts={summary.notices} />
        <BoardCard title="질문 게시판" category="QUESTION" posts={summary.questions} />
        <BoardCard title="정보 공유 게시판" category="INFO" posts={summary.info} />
      </div>
    </AppLayout>
  );
}