import { useEffect, useState } from "react";
import AppLayout from "../../app/AppLayout.jsx";
import { authApi } from "../../api/authApi";

export default function MyPage() {
  const [user, setUser] = useState({
    nickname: localStorage.getItem("nickname") || "로그인 필요",
    email: "test@example.com",
    bio: "안녕하세요! 코딩 실력을 쌓고 있는 개발자입니다.",
    githubUrl: "https://github.com/tester",
    tier: "Silver",
    nextTierExp: 75
  });

  const handleUpdate = async () => {
    alert("사용자 정보가 성공적으로 수정되었습니다.");
  };

  return (
    <AppLayout showMenu={false}>
      <div className="mb-6 flex items-center justify-center gap-3">
        <a href="/chat" className="rounded-lg border px-4 py-2 text-sm hover:bg-neutral-50 transition">쪽지함</a>
        <a href="/lobby" className="rounded-lg border px-4 py-2 text-sm hover:bg-neutral-50 transition">참여 중인 배틀</a>
      </div>

      <div className="max-w-2xl mx-auto rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b">
          <div className="w-24 h-24 rounded-full bg-neutral-200 grid place-items-center text-3xl">👤</div>
          <div>
            <h1 className="text-2xl font-bold">{user.nickname}</h1>
            <p className="text-neutral-500">{user.email}</p>
            <div className="mt-2 inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">TIER: {user.tier}</div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1">자기소개</label>
            <p className="text-neutral-800 bg-neutral-50 p-3 rounded-xl">{user.bio}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1">GitHub</label>
            <a href={user.githubUrl} className="text-blue-600 hover:underline">{user.githubUrl}</a>
          </div>
          
          <div className="pt-4">
            <label className="block text-sm font-medium text-neutral-500 mb-2">다음 등급까지 진행도 ({user.nextTierExp}%)</label>
            <div className="w-full bg-neutral-100 rounded-full h-3">
              <div className="bg-neutral-900 h-3 rounded-full" style={{ width: `${user.nextTierExp}%` }}></div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button 
            onClick={handleUpdate}
            className="rounded-xl bg-neutral-900 text-white px-8 py-3 font-semibold hover:bg-neutral-800 transition"
          >
            정보 수정하기
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
