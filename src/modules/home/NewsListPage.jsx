import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../app/AppLayout.jsx";
import { homeApi } from "../../api/homeApi";
import Button from "../../components/ui/Button.jsx";

export default function NewsListPage() {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAllNews() {
      setLoading(true);
      try {
        const response = await homeApi.getAllNews(page, 15);
        if (response.data.success) {
          // Page 객체에서 content를 읽어옴
          setNewsData(response.data.data.content);
          setTotalPages(response.data.data.totalPages);
        }
      } catch (err) {
        console.error("뉴스 목록을 불러오는데 실패했습니다.", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllNews();
  }, [page]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">관련 뉴스</h1>
          <p className="mt-2 text-neutral-500">LiveCoder에서 제공하는 최신 IT 및 서비스 소식입니다.</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>← 뒤로가기</Button>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-neutral-400">소식을 불러오는 중입니다...</div>
        ) : newsData.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {newsData.map((item) => (
              <a 
                key={item.newsId} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex-1 pr-4">
                  <h3 className="text-lg font-semibold text-neutral-800 group-hover:text-indigo-600 transition-colors mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-neutral-400">
                    <span>{formatDate(item.publishedAt || item.createdAt)}</span>
                    <span className="w-1 h-1 bg-neutral-200 rounded-full"></span>
                    <span className="text-indigo-500 font-medium">상세보기</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 hidden md:block">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-neutral-400">뉴스가 아직 등록되지 않았습니다.</div>
        )}
      </div>

      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <Button 
            variant="outline" 
            disabled={page === 0} 
            onClick={() => setPage(p => p - 1)}
          >
            이전
          </Button>
          <span className="text-sm font-medium text-neutral-600">
            {page + 1} / {totalPages}
          </span>
          <Button 
            variant="outline" 
            disabled={page === totalPages - 1} 
            onClick={() => setPage(p => p + 1)}
          >
            다음
          </Button>
        </div>
      )}
    </AppLayout>
  );
}
