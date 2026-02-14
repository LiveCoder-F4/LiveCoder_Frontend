import { useEffect, useState } from "react";
import AppLayout from "../../app/AppLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import { homeApi } from "../../api/homeApi";

export default function HomeGuest() {
  const [homeData, setHomeData] = useState({
    news: [],
    recommendedPosts: [],
    recentSolved: []
  });

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const response = await homeApi.getHomeData(1);
        if (response.data.status === "OK") {
          setHomeData(response.data.data);
        }
      } catch (err) {
        console.error("홈 데이터를 불러오는데 실패했습니다.", err);
      }
    }
    fetchHomeData();
  }, []);

  return (
    <AppLayout right={<a href='/login' className='rounded-lg border px-4 py-2 text-sm hover:bg-neutral-50'>로그인</a>}>
      <div className='grid gap-6 md:grid-cols-3'>
        <Card title='관련 뉴스'>
          <ul className="space-y-2">
            {homeData.news.map((item, idx) => (
              <li key={idx} className="text-sm border-b pb-1 last:border-0">
                <div className="font-semibold">{item.title}</div>
                <div className="text-neutral-500 text-xs">{item.content}</div>
              </li>
            ))}
          </ul>
        </Card>
        <Card title='추천 게시글'>
          <ul className="space-y-2">
            {homeData.recommendedPosts.map((post, idx) => (
              <li key={idx} className="text-sm truncate hover:underline cursor-pointer">
                {post.title}
              </li>
            ))}
          </ul>
        </Card>
        <Card title='최근 푼 문제'>
          <ul className="space-y-2">
            {homeData.recentSolved.map((item, idx) => (
              <li key={idx} className="text-sm">
                • {item.problemTitle}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppLayout>
  );
}