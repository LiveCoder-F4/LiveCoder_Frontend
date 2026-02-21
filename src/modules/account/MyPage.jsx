import { useEffect, useState } from "react";
import AppLayout from "../../app/AppLayout.jsx";
import { userApi } from "../../api/userApi";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

export default function MyPage() {
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    username: "",
    nickname: "",
    email: "",
    bio: "",
    githubUrl: "",
    tier: "Silver", // 등급 시스템은 아직 백엔드에 없어 임시 고정
    nextTierExp: 75
  });

  const [editForm, setEditForm] = useState({
    nickname: "",
    bio: "",
    githubUrl: ""
  });

  useEffect(() => {
    async function fetchUserData() {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const response = await userApi.getUser(userId);
        const data = response.data;
        setUser({
          ...user,
          username: data.username,
          nickname: data.nickname,
          email: data.email,
          bio: data.bio || "자기소개가 없습니다.",
          githubUrl: data.githubUrl || ""
        });
        setEditForm({
          nickname: data.nickname,
          bio: data.bio || "",
          githubUrl: data.githubUrl || ""
        });
      } catch (err) {
        console.error("사용자 정보를 불러오는데 실패했습니다.", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await userApi.updateUser(userId, editForm);
      const updatedUser = response.data;
      
      setUser(prev => ({
        ...prev,
        nickname: updatedUser.nickname,
        bio: updatedUser.bio || "자기소개가 없습니다.",
        githubUrl: updatedUser.githubUrl || ""
      }));
      
      // localStorage 업데이트
      localStorage.setItem("nickname", updatedUser.nickname);
      
      setIsEditing(false);
      alert("사용자 정보가 성공적으로 수정되었습니다.");
    } catch (err) {
      console.error("정보 수정 실패", err);
      alert("정보 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <AppLayout showMenu={false}>
        <div className="flex items-center justify-center h-64 text-neutral-400 font-light">
          사용자 정보를 불러오는 중...
        </div>
      </AppLayout>
    );
  }

  if (!userId) {
    return (
      <AppLayout showMenu={false}>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-neutral-500 italic">로그인이 필요한 페이지입니다.</p>
          <Button onClick={() => window.location.href = "/login"}>로그인하러 가기</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showMenu={false}>
      <div className="mb-6 flex items-center justify-center gap-3">
        <a href="/chat" className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 transition shadow-sm">쪽지함</a>
        <a href="/lobby" className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 transition shadow-sm">참여 중인 배틀</a>
      </div>

      <div className="max-w-2xl mx-auto rounded-[2rem] border border-neutral-200 bg-white p-10 shadow-xl shadow-neutral-100/50">
        {/* 프로필 헤더 */}
        <div className="flex items-center gap-8 mb-10 pb-10 border-b border-neutral-100">
          <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-4xl text-white shadow-lg shadow-indigo-100">
            {user.nickname.charAt(0)}
          </div>
          <div className="space-y-1">
            {isEditing ? (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">닉네임</label>
                <Input 
                  name="nickname"
                  value={editForm.nickname}
                  onChange={handleInputChange}
                  className="text-xl font-bold py-1 px-3 border-indigo-200"
                />
              </div>
            ) : (
              <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">{user.nickname}</h1>
            )}
            <p className="text-neutral-400 font-medium">{user.email}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full border border-indigo-100 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Tier: {user.tier}
            </div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">자기소개</label>
            {isEditing ? (
              <textarea 
                name="bio"
                value={editForm.bio}
                onChange={handleInputChange}
                className="w-full p-4 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed transition-all min-h-[120px]"
                placeholder="나를 소개하는 글을 써보세요."
              />
            ) : (
              <p className="text-neutral-700 bg-neutral-50/50 p-5 rounded-2xl border border-neutral-100 text-sm leading-relaxed">
                {user.bio}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">GitHub Repository</label>
            {isEditing ? (
              <Input 
                name="githubUrl"
                value={editForm.githubUrl}
                onChange={handleInputChange}
                className="border-neutral-200"
                placeholder="https://github.com/username"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-400 font-bold">link.</span>
                <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-medium hover:underline transition-all">
                  {user.githubUrl || "등록된 주소가 없습니다."}
                </a>
              </div>
            )}
          </div>
          
          <div className="pt-6 space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">다음 등급까지 진행도</label>
              <span className="text-xs font-bold text-indigo-600">{user.nextTierExp}%</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${user.nextTierExp}%` }}></div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-12 flex justify-center gap-4">
          {isEditing ? (
            <>
              <Button variant="outline" className="px-10 py-3.5 rounded-2xl font-bold" onClick={() => setIsEditing(false)}>취소</Button>
              <Button className="px-10 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-100" onClick={handleUpdate}>저장하기</Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              className="px-12 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-transform"
            >
              정보 수정하기
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
