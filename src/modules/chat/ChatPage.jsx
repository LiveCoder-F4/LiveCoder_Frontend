import { useEffect, useState, useRef } from "react";
import AppLayout from "../../app/AppLayout.jsx";
import { friendApi } from "../../api/friendApi";

export default function ChatPage() {
  const [messages, setMessages] = useState([]); // 전체 쪽지 내역
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  
  const scrollRef = useRef(null); // 스크롤용 ref

  // 메시지 업데이트 시 스크롤 하단 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 친구 목록 및 초기 메시지 로드
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const friendRes = await friendApi.getFriends();
        const friendList = friendRes.data || [];
        setFriends(friendList);
        
        if (friendList.length > 0) {
          setSelectedFriend(friendList[0]);
        }
      } catch (err) {
        console.error("초기 데이터를 불러오는데 실패했습니다.", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // 선택된 친구와의 대화 내역 가져오기
  const fetchChatHistory = async () => {
    if (!selectedFriend) return;
    try {
      const [receivedRes, sentRes] = await Promise.all([
        friendApi.getReceivedMessages(),
        friendApi.getSentMessages()
      ]);

      // 선택된 친구와 주고받은 메시지만 필터링
      const filteredMessages = [
        ...(receivedRes.data || [])
          .filter(m => m.senderId === selectedFriend.userId)
          .map(m => ({ ...m, isMine: false })),
        ...(sentRes.data || [])
          .filter(m => m.receiverId === selectedFriend.userId)
          .map(m => ({ ...m, isMine: true }))
      ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // 과거 -> 최신 순

      setMessages(filteredMessages);
    } catch (err) {
      console.error("대화 내역 조회 실패:", err);
    }
  };

  useEffect(() => {
    fetchChatHistory();
    // 5초마다 자동 갱신 (선택사항)
    const interval = setInterval(fetchChatHistory, 5000);
    return () => clearInterval(interval);
  }, [selectedFriend]);

  const handleSend = async () => {
    if (!inputText.trim() || !selectedFriend) return;
    
    try {
      await friendApi.sendMessage(selectedFriend.userId, inputText);
      setInputText("");
      // 전송 후 즉시 내역 갱신
      fetchChatHistory();
    } catch (err) {
      alert("쪽지 전송에 실패했습니다.");
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
        {/* 대화창 */}
        <div className="flex flex-col gap-4">
          <div 
            ref={scrollRef}
            className="rounded-[2.5rem] border border-neutral-200 bg-white p-10 h-[550px] overflow-y-auto shadow-2xl shadow-neutral-100/50 custom-scrollbar flex flex-col gap-6"
          >
            <h2 className="text-[10px] font-bold text-neutral-400 mb-2 uppercase tracking-[0.2em] border-b border-neutral-50 pb-4">
              Conversation with {selectedFriend?.nickname || "..."}
            </h2>
            
            <div className="flex flex-col gap-6">
              {messages.length > 0 ? (
                messages.map((msg, idx) => (
                  <div 
                    key={msg.messageId || idx} 
                    className={`flex flex-col max-w-[75%] ${msg.isMine ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <div className={`p-5 rounded-[2rem] text-sm leading-relaxed shadow-sm transition-all hover:scale-[1.02] ${
                      msg.isMine 
                        ? 'bg-neutral-900 text-white rounded-tr-none shadow-indigo-100/20' 
                        : 'bg-neutral-100 text-neutral-800 rounded-tl-none border border-neutral-200'
                    }`}>
                      {msg.content}
                    </div>
                    <div className="text-[9px] mt-2 font-bold text-neutral-300 uppercase tracking-tighter">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-neutral-300 italic gap-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center text-2xl">💬</div>
                  <p className="text-sm font-medium tracking-tight">이전 대화 기록이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-4 bg-white p-4 rounded-[2rem] border border-neutral-200 shadow-xl shadow-neutral-100/30">
            <input 
              type="text" 
              className="flex-1 px-8 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 bg-neutral-50 text-sm transition-all border border-transparent focus:border-indigo-100"
              placeholder={selectedFriend ? `${selectedFriend.nickname}님에게 전송할 내용...` : "친구를 먼저 선택하세요"}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend} 
              disabled={!selectedFriend || !inputText.trim()}
              className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:grayscale disabled:hover:translate-y-0"
            >
              보내기
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
