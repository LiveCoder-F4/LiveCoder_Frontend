import { useEffect, useState } from "react";
import AppLayout from "../../app/AppLayout.jsx";
import { friendApi } from "../../api/friendApi";

export default function ChatPage() {
  const [sentHistory, setSentHistory] = useState([]); // 보낸 쪽지 임시 저장
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFriends() {
      try {
        setLoading(true);
        const friendRes = await friendApi.getFriends();
        // 백엔드 FriendResponse는 userId, nickname 필드를 가짐
        const friendList = friendRes.data || [];
        setFriends(friendList);
        if (friendList.length > 0) setSelectedFriend(friendList[0]);
      } catch (err) {
        console.error("친구 목록을 불러오는데 실패했습니다.", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFriends();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || !selectedFriend) return;
    
    try {
      const response = await friendApi.sendMessage(selectedFriend.userId, inputText);
      
      // 보낸 메시지를 로컬 히스토리에 추가 (현재 백엔드에 목록 조회 API가 없으므로)
      const newMessage = {
        id: response.data.messageId || Date.now(),
        content: inputText,
        receiverNickname: selectedFriend.nickname,
        sentAt: new Date().toLocaleTimeString(),
        status: "SENT"
      };
      
      setSentHistory(prev => [newMessage, ...prev]);
      setInputText("");
      alert(`${selectedFriend.nickname}님에게 쪽지를 보냈습니다.`);
    } catch (err) {
      alert("쪽지 전송에 실패했습니다. (친구 관계 여부를 확인해주세요)");
      console.error("전송 에러:", err);
    }
  };

  if (loading) {
    return (
      <AppLayout showMenu={false}>
        <div className="flex items-center justify-center h-64 text-neutral-400">친구 목록을 불러오는 중...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showMenu={false}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">쪽지 보내기</h1>
          <p className="text-xs text-neutral-500 mt-1">친구들에게 실시간 쪽지를 보내보세요.</p>
        </div>
        <a href="/me" className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-bold hover:bg-neutral-50 transition shadow-sm">마이페이지로 돌아가기</a>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr,300px]">
        {/* 쪽지 목록 및 대화창 */}
        <div className="flex flex-col gap-4">
          <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 h-[450px] overflow-y-auto shadow-xl shadow-neutral-100/50 custom-scrollbar">
            <h2 className="text-[11px] font-bold text-neutral-400 mb-6 uppercase tracking-widest">방금 보낸 쪽지 (임시 기록)</h2>
            <div className="space-y-4">
              {sentHistory.length > 0 ? (
                sentHistory.map(msg => (
                  <div key={msg.id} className="p-5 rounded-2xl bg-neutral-900 text-white self-end ml-auto max-w-[80%] shadow-lg shadow-indigo-100/20 animate-slide-in">
                    <div className="text-[10px] font-bold mb-1 opacity-70">To. {msg.receiverNickname}</div>
                    <div className="text-sm leading-relaxed">{msg.content}</div>
                    <div className="text-[10px] mt-3 opacity-50 text-right">{msg.sentAt}</div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400 italic gap-3">
                  <span className="text-3xl">✉️</span>
                  <p className="text-sm">친구를 선택하고 쪽지를 전송해보세요.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm">
            <input 
              type="text" 
              className="flex-1 px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 bg-neutral-50 text-sm transition-all"
              placeholder={selectedFriend ? `${selectedFriend.nickname}님에게 전송할 내용...` : "친구를 먼저 선택하세요"}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend} 
              disabled={!selectedFriend || !inputText.trim()}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:bg-neutral-400"
            >
              전송
            </button>
          </div>
        </div>

        {/* 친구 목록 사이드바 */}
        <aside className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-100/50 h-fit">
          <h2 className="text-[11px] font-bold text-neutral-400 mb-6 uppercase tracking-widest">친구 목록 ({friends.length})</h2>
          <ul className="space-y-3">
            {friends.length > 0 ? (
              friends.map(friend => (
                <li 
                  key={friend.userId} 
                  onClick={() => setSelectedFriend(friend)}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                    selectedFriend?.userId === friend.userId 
                      ? 'bg-indigo-50 border border-indigo-100 shadow-sm' 
                      : 'hover:bg-neutral-50 border border-transparent'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 grid place-items-center text-indigo-600 font-bold text-sm">
                    {friend.nickname.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-800">{friend.nickname}</span>
                    <span className="text-[10px] text-neutral-400 font-medium">Friend since {new Date(friend.friendsSince).toLocaleDateString()}</span>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center py-10 text-xs text-neutral-400 italic">친구가 없습니다.</p>
            )}
          </ul>
        </aside>
      </div>
    </AppLayout>
  );
}
