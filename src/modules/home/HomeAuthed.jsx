import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../app/AppLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import { homeApi } from "../../api/homeApi";
import { authApi } from "../../api/authApi";

export default function HomeAuthed() {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState({
    news: [],
    recommendedPosts: [],
    recentSolved: []
  });
  const userId = localStorage.getItem("userId");
  const nickname = localStorage.getItem("nickname");

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const response = await homeApi.getHomeData(userId || 1);
        if (response.data.status === "OK") {
          setHomeData(response.data.data);
        }
      } catch (err) {
        console.error("홈 데이터를 불러오는데 실패했습니다.", err);
      }
    }
    fetchHomeData();
  }, [userId]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("로그아웃 실패", err);
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <AppLayout
      right={
        <div className='flex items-center gap-3'>
          <span className="text-sm font-medium">{nickname}님 환영합니다</span>
          <a href='/me' className='rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50'>마이페이지</a>
          <Button variant='outline' onClick={handleLogout}>로그아웃</Button>
        </div>
      }
    >
      <div className='grid gap-6 md:grid-cols-3'>
        <Card title='사이트 최근 소식'>
          <ul className="space-y-2">
            {homeData.news.length > 0 ? (
              homeData.news.map((item, idx) => (
                <li key={idx} className="text-sm border-b pb-1 last:border-0">
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-neutral-500 text-xs">{item.content}</div>
                </li>
              ))
            ) : (
              <div className='h-40 flex items-center justify-center text-neutral-400 text-sm'>소식이 없습니다.</div>
            )}
          </ul>
        </Card>

        <Card title='커뮤니티 최신 글'>
          <ul className="space-y-2">
            {homeData.recommendedPosts.length > 0 ? (
              homeData.recommendedPosts.map((post, idx) => (
                <li key={idx} className="text-sm truncate hover:underline cursor-pointer">
                  {post.title}
                </li>
              ))
            ) : (
              <div className='h-40 flex items-center justify-center text-neutral-400 text-sm'>게시글이 없습니다.</div>
            )}
          </ul>
        </Card>

        <Card title='최근 푼 문제'>
          <ul className="space-y-2">
            {homeData.recentSolved.length > 0 ? (
              homeData.recentSolved.map((item, idx) => (
                <li key={idx} className="text-sm flex justify-between items-center">
                  <span>{item.problemTitle}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${item.status === 'SOLVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.status}
                  </span>
                </li>
              ))
            ) : (
              <div className='h-40 flex items-center justify-center text-neutral-400 text-sm'>최근 풀이 기록이 없습니다.</div>
            )}
          </ul>
        </Card>
      </div>
    </AppLayout>
  );
}
