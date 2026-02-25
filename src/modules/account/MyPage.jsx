import { useEffect, useState } from "react";
import AppLayout from "../../app/AppLayout.jsx";
import { userApi } from "../../api/userApi";
import { friendApi } from "../../api/friendApi";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Card from "../../components/ui/Card.jsx";

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
    tier: "Silver", 
    nextTierExp: 75,
    isSolvedPublic: true // ✅ 추가: 풀이 공개 여부
  });

  const [friends, setFriends] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [messages, setMessages] = useState([]); // ✅ 쪽지 내역 통합 상태

  const [editForm, setEditForm] = useState({
    nickname: "",
    bio: "",
    githubUrl: ""
  });

  // ✅ 보안 설정용 상태
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    newEmail: ""
  });

  const fetchUserData = async () => {
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
        githubUrl: data.githubUrl || "",
        isSolvedPublic: data.isSolvedPublic !== false
      });
      setEditForm({
        nickname: data.nickname,
        bio: data.bio || "",
        githubUrl: data.githubUrl || ""
      });
    } catch (err) {
      console.error("사용자 정보를 불러오는데 실패했습니다.", err);
    }
  };

  const fetchFriendData = async () => {
    try {
      const [friendsRes, receivedRes, sentRes, msgReceivedRes, msgSentRes] = await Promise.all([
        friendApi.getFriends(),
        friendApi.getReceivedRequests(),
        friendApi.getSentRequests(),
        friendApi.getReceivedMessages(),
        friendApi.getSentMessages()
      ]);
      setFriends(friendsRes.data || []);
      setReceivedRequests(receivedRes.data || []);
      setSentRequests(sentRes.data || []);
      
      // ✅ 받은 쪽지와 보낸 쪽지를 합쳐서 날짜순 정렬
      const allMessages = [
        ...(msgReceivedRes.data || []).map(m => ({ ...m, type: 'received' })),
        ...(msgSentRes.data || []).map(m => ({ ...m, type: 'sent' }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setMessages(allMessages);
    } catch (err) {
      console.error("정보를 불러오는데 실패했습니다.", err);
    }
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([fetchUserData(), fetchFriendData()]);
      setLoading(false);
    }
    init();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityForm(prev => ({ ...prev, [name]: value }));
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
      
      localStorage.setItem("nickname", updatedUser.nickname);
      setIsEditing(false);
      alert("사용자 정보가 성공적으로 수정되었습니다.");
    } catch (err) {
      console.error("정보 수정 실패", err);
      alert("정보 수정 중 오류가 발생했습니다.");
    }
  };

  // ✅ 보안 설정 핸들러
  const handleChangePassword = async () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert("새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    try {
      await userApi.changePassword(userId, {
        currentPassword: securityForm.currentPassword,
        newPassword: securityForm.newPassword
      });
      alert("비밀번호가 변경되었습니다.");
      setSecurityForm(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (err) {
      alert(err.response?.data || "비밀번호 변경 실패");
    }
  };

  const handleChangeEmail = async () => {
    try {
      await userApi.changeEmail(userId, { newEmail: securityForm.newEmail });
      alert("이메일이 변경되었습니다.");
      setUser(prev => ({ ...prev, email: securityForm.newEmail }));
    } catch (err) {
      alert(err.response?.data || "이메일 변경 실패");
    }
  };

  const handleSolvedToggle = async () => {
    const newStatus = !user.isSolvedPublic;
    try {
      await userApi.updateSolvedVisibility(userId, { isPublic: newStatus });
      setUser(prev => ({ ...prev, isSolvedPublic: newStatus }));
    } catch (err) {
      alert("설정 변경 실패");
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt("계정을 삭제하시려면 비밀번호를 입력해주세요.");
    if (!password) return;
    try {
      await userApi.deleteUser(userId, { password });
      alert("탈퇴 처리가 완료되었습니다.");
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data || "탈퇴 처리 실패");
    }
  };

  // 친구 관련 액션 핸들러
  const handleAcceptRequest = async (requestId) => {
    try {
      await friendApi.acceptRequest(requestId);
      alert("친구 요청을 수락했습니다.");
      fetchFriendData();
    } catch (err) {
      alert("요청 수락에 실패했습니다.");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await friendApi.rejectRequest(requestId);
      alert("친구 요청을 거절했습니다.");
      fetchFriendData();
    } catch (err) {
      alert("요청 거절에 실패했습니다.");
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await friendApi.cancelRequest(requestId);
      alert("친구 요청을 취소했습니다.");
      fetchFriendData();
    } catch (err) {
      alert("요청 취소에 실패했습니다.");
    }
  };

  const handleDeleteFriend = async (friendId) => {
    if (!window.confirm("정말로 친구를 삭제하시겠습니까?")) return;
    try {
      await friendApi.deleteFriend(friendId);
      alert("친구가 삭제되었습니다.");
      fetchFriendData();
    } catch (err) {
      alert("친구 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <AppLayout showMenu={false}>
        <div className="flex items-center justify-center h-64 text-neutral-400 font-light">
          데이터를 불러오는 중...
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

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 프로필 정보 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[2rem] border border-neutral-200 bg-white p-10 shadow-xl shadow-neutral-100/50">
            <div className="flex items-center gap-8 mb-10 pb-10 border-b border-neutral-100">
              <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-3xl text-white shadow-lg shadow-indigo-100">
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
                  Tier: {user.tier}
                </div>
              </div>
            </div>

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

            <div className="mt-10 flex justify-center gap-4">
              {isEditing ? (
                <>
                  <Button variant="outline" className="px-8" onClick={() => setIsEditing(false)}>취소</Button>
                  <Button className="px-8 shadow-lg shadow-indigo-100" onClick={handleUpdate}>저장하기</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="px-10 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-100">
                  정보 수정하기
                </Button>
              )}
            </div>
          </div>

          {/* ✅ 추가: 보안 및 개인정보 설정 섹션 */}
          <div className="rounded-[2rem] border border-neutral-200 bg-white p-10 shadow-xl shadow-neutral-100/50">
            <h2 className="text-xl font-bold text-neutral-800 mb-8 pb-4 border-b border-neutral-100">보안 및 개인정보 설정</h2>
            
            <div className="space-y-10">
              {/* 풀이 공개 여부 */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50/50 border border-neutral-100">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800">풀이 결과 공개</h3>
                  <p className="text-xs text-neutral-400 mt-1">내 성공한 풀이 기록을 다른 사람들에게 보여줍니다.</p>
                </div>
                <button 
                  onClick={handleSolvedToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${user.isSolvedPublic ? 'bg-indigo-600' : 'bg-neutral-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.isSolvedPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* 이메일 변경 */}
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">이메일 변경</label>
                <div className="flex gap-3">
                  <Input 
                    name="newEmail"
                    placeholder="새로운 이메일 주소"
                    value={securityForm.newEmail}
                    onChange={handleSecurityChange}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleChangeEmail} disabled={!securityForm.newEmail}>변경</Button>
                </div>
              </div>

              {/* 비밀번호 변경 */}
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">비밀번호 변경</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input 
                    type="password"
                    name="currentPassword"
                    placeholder="현재 비밀번호"
                    value={securityForm.currentPassword}
                    onChange={handleSecurityChange}
                  />
                  <Input 
                    type="password"
                    name="newPassword"
                    placeholder="새 비밀번호"
                    value={securityForm.newPassword}
                    onChange={handleSecurityChange}
                  />
                  <Input 
                    type="password"
                    name="confirmPassword"
                    placeholder="비밀번호 확인"
                    value={securityForm.confirmPassword}
                    onChange={handleSecurityChange}
                  />
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={handleChangePassword} disabled={!securityForm.newPassword}>비밀번호 업데이트</Button>
                </div>
              </div>
            </div>
          </div>

          {/* 위험 구역 */}
          <div className="p-8 border-2 border-dashed border-red-100 rounded-[2rem] bg-red-50/10 flex flex-col items-center gap-4">
            <div className="text-center">
              <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest">위험 구역</h3>
              <p className="text-xs text-neutral-400 mt-1">계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.</p>
            </div>
            <button 
              onClick={handleDeleteAccount}
              className="px-6 py-2 text-xs font-bold text-red-400 hover:text-red-600 hover:underline transition-all"
            >
              회원 탈퇴하기
            </button>
          </div>
        </div>

        {/* 오른쪽: 친구 관리 섹션 */}
        <div className="space-y-6">
          <Card title="친구 목록" className="h-fit">
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {friends.length > 0 ? (
                friends.map(friend => (
                  <div key={friend.userId} className="flex justify-between items-center p-3 rounded-xl bg-neutral-50/50 border border-neutral-100">
                    <span className="text-sm font-bold text-neutral-700">{friend.nickname}</span>
                    <button 
                      onClick={() => handleDeleteFriend(friend.userId)}
                      className="text-[10px] font-bold text-neutral-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-neutral-400 italic font-light">아직 친구가 없습니다.</p>
              )}
            </div>
          </Card>

          <Card title="받은 친구 요청" className="h-fit">
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {receivedRequests.length > 0 ? (
                receivedRequests.map(req => (
                  <div key={req.requestId} className="p-3 rounded-xl bg-indigo-50/30 border border-indigo-100/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-neutral-700">{req.requesterNickname}</span>
                      <span className="text-[9px] text-neutral-400">{new Date(req.requestedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAcceptRequest(req.requestId)}
                        className="flex-1 py-1.5 rounded-lg bg-indigo-500 text-white text-[10px] font-bold hover:bg-indigo-600 transition-colors"
                      >
                        수락
                      </button>
                      <button 
                        onClick={() => handleRejectRequest(req.requestId)}
                        className="flex-1 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-500 text-[10px] font-bold hover:bg-neutral-50 transition-colors"
                      >
                        거절
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-neutral-400 italic font-light">받은 요청이 없습니다.</p>
              )}
            </div>
          </Card>

          <Card title="보낸 친구 요청" className="h-fit">
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {sentRequests.length > 0 ? (
                sentRequests.map(req => (
                  <div key={req.requestId} className="flex justify-between items-center p-3 rounded-xl bg-neutral-50/50 border border-neutral-100">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-neutral-700">{req.receiverNickname}</span>
                      <span className="text-[9px] text-neutral-400">{req.status}</span>
                    </div>
                    <button 
                      onClick={() => handleCancelRequest(req.requestId)}
                      className="text-[10px] font-bold text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      취소
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-neutral-400 italic font-light">보낸 요청이 없습니다.</p>
              )}
            </div>
          </Card>

          {/* ✅ 추가: 최근 쪽지 내역 */}
          <Card title="최근 쪽지 내역" className="h-fit">
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {messages.length > 0 ? (
                messages.map(msg => (
                  <div key={msg.messageId} className={`p-3 rounded-xl border ${msg.type === 'received' ? 'bg-blue-50/30 border-blue-100/50' : 'bg-neutral-50 border-neutral-100'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.type === 'received' ? 'text-blue-500' : 'text-neutral-400'}`}>
                        {msg.type === 'received' ? 'Received' : 'Sent'}
                      </span>
                      <span className="text-[9px] text-neutral-400">{new Date(msg.createdAt).toLocaleString([], {month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-neutral-700">
                        {msg.type === 'received' ? msg.senderNickname : msg.receiverNickname}
                      </span>
                      <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-10 text-xs text-neutral-400 italic font-light">주고받은 쪽지가 없습니다.</p>
              )}
              {messages.length > 0 && (
                <div className="pt-2 text-center">
                  <a href="/friends" className="text-[10px] font-bold text-indigo-500 hover:underline">쪽지함 전체보기</a>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
