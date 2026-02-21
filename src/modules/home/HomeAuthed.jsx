import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../app/AppLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import NewsList from "../../components/complex/NewsList.jsx";
import { homeApi } from "../../api/homeApi";

export default function HomeAuthed() {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState({
    news: [],
    recommendedPosts: [],
    recentSolved: []
  });
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const response = await homeApi.getHomeData(userId || 1);
        console.log("인증 홈 데이터 응답:", response.data);
        
        if (response.data && response.data.success) {
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
  }, [userId]);

  return (
    <AppLayout>
      <div className='grid gap-6 md:grid-cols-3'>
        <Card title='사이트 최근 소식'>
          <NewsList items={homeData.news} />
          <div className="mt-4 pt-3 border-t border-neutral-50 text-right">
            <button onClick={() => navigate('/news')} className="text-[11px] font-bold text-indigo-500 hover:text-indigo-700 hover:underline flex items-center justify-end gap-1 ml-auto transition-all">
              뉴스 전체보기 <span className="text-sm">→</span>
            </button>
          </div>
        </Card>

        <Card title='커뮤니티 추천 글'>
          <ul className="space-y-2">
            {homeData.recommendedPosts && homeData.recommendedPosts.length > 0 ? (
              homeData.recommendedPosts.map((post, idx) => (
                <li key={idx} className="text-sm truncate hover:underline cursor-pointer flex justify-between items-center" onClick={() => navigate(`/posts/${post.postId}`)}>
                  <span>{post.title}</span>
                  <span className="text-[10px] text-neutral-400">{post.nickname}</span>
                </li>
              ))
            ) : (
              <div className='h-40 flex items-center justify-center text-neutral-400 text-sm font-light'>게시글이 없습니다.</div>
            )}
          </ul>
        </Card>

        <Card title='최근 성공한 문제'>
          <ul className="space-y-2">
            {homeData.recentSolved && homeData.recentSolved.length > 0 ? (
              homeData.recentSolved.map((item, idx) => (
                <li 
                  key={idx} 
                  className="text-sm flex justify-between items-center hover:underline cursor-pointer"
                  onClick={() => navigate(`/problems/${item.problemId}/submissions/${item.submissionId}`)}
                >
                  <span>• {item.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-50 text-green-600 font-medium">
                    {item.difficulty}
                  </span>
                </li>
              ))
            ) : (
              <div className='h-40 flex items-center justify-center text-neutral-400 text-sm font-light'>성공한 풀이 기록이 없습니다.</div>
            )}
          </ul>
        </Card>
      </div>
    </AppLayout>
  );
}
