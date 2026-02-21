import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../app/AppLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import NewsList from "../../components/complex/NewsList.jsx";
import { homeApi } from "../../api/homeApi";

export default function HomeGuest() {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState({
    news: [],
    recommendedPosts: [],
    recentSolved: []
  });

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const response = await homeApi.getHomeData(1);
        console.log("홈 데이터 응답:", response.data);
        
        if (response.data && response.data.success) {
          // HomeApiResponse.data 가 HomeResponse 객체
          const homeResponse = response.data.data;
          setHomeData({
            news: homeResponse.news || [],
            recommendedPosts: homeResponse.recommendedPosts || [],
            recentSolved: homeResponse.recentSolved || []
          });
        }
      } catch (err) {
        console.error("홈 데이터를 불러오는데 실패했습니다.", err);
      }
    }
    fetchHomeData();
  }, []);

  return (
    <AppLayout>
      <div className='grid gap-6 md:grid-cols-3'>
        <Card title='관련 뉴스'>
          <NewsList items={homeData.news} />
          <div className="mt-4 pt-3 border-t border-neutral-50 text-right">
            <button onClick={() => navigate('/news')} className="text-[11px] font-bold text-indigo-500 hover:text-indigo-700 hover:underline flex items-center justify-end gap-1 ml-auto transition-all">
              뉴스 전체보기 <span className="text-sm">→</span>
            </button>
          </div>
        </Card>
        <Card title='추천 게시글'>
          <ul className="space-y-2">
            {homeData.recommendedPosts && homeData.recommendedPosts.length > 0 ? (
              homeData.recommendedPosts.map((post, idx) => (
                <li key={idx} className="text-sm truncate hover:underline cursor-pointer flex justify-between items-center" onClick={() => navigate(`/posts/${post.postId}`)}>
                  <span>{post.title}</span>
                  <span className="text-[10px] text-neutral-400">{post.nickname}</span>
                </li>
              ))
            ) : (
              <div className="text-sm text-neutral-400 py-4 text-center">추천 글이 없습니다.</div>
            )}
          </ul>
        </Card>
        <Card title='최근 푼 문제'>
          <ul className="space-y-2">
            {homeData.recentSolved && homeData.recentSolved.length > 0 ? (
              homeData.recentSolved.map((item, idx) => (
                <li key={idx} className="text-sm flex justify-between items-center">
                  <span>• {item.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">{item.difficulty}</span>
                </li>
              ))
            ) : (
              <div className="text-sm text-neutral-400 py-4 text-center">최근 풀이 기록이 없습니다.</div>
            )}
          </ul>
        </Card>
      </div>
    </AppLayout>
  );
}