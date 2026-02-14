import { useEffect, useState } from "react";
import AppLayout from "../../app/AppLayout.jsx";
import { communityApi } from "../../api/communityApi";

export default function BoardListAuthed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await communityApi.getPosts();
      setPosts(response.data);
    }
    fetchPosts();
  }, []);

  return (
    <AppLayout right={
      <div className='flex items-center gap-2'>
        <a href='/me' className='rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50 transition'>마이페이지</a>
        <button onClick={() => { localStorage.clear(); window.location.href="/login"; }} className='rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50 transition'>로그아웃</button>
      </div>
    }>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">커뮤니티 게시판</h2>
          <button onClick={() => alert("글 작성 화면으로 이동합니다.")} className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-semibold">글쓰기</button>
        </div>

        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="border-b pb-4 last:border-0 hover:bg-neutral-50 p-2 rounded-xl transition cursor-pointer">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <span className="text-xs text-neutral-400">{post.createdAt}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <span>👤 {post.author}</span>
                <span>💬 {post.comments}</span>
                <span>❤️ {post.likes}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2">
          <button className="rounded-xl border py-3 text-sm font-medium hover:bg-neutral-50 transition">내가 쓴 글</button>
          <button onClick={() => window.history.back()} className="rounded-xl border py-3 text-sm font-medium hover:bg-neutral-50 transition">돌아가기</button>
        </div>
      </div>
    </AppLayout>
  );
}