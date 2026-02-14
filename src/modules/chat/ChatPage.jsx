import { useEffect, useState } from "react";
import AppLayout from "../../app/AppLayout.jsx";
import { friendApi } from "../../api/friendApi";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    async function fetchData() {
      const msgRes = await friendApi.getMessages();
      const friendRes = await friendApi.getFriends();
      setMessages(msgRes.data);
      setFriends(friendRes.data);
      if (friendRes.data.length > 0) setSelectedFriend(friendRes.data[0]);
    }
    fetchData();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || !selectedFriend) return;
    await friendApi.sendMessage(selectedFriend.id, inputText);
    alert(`${selectedFriend.nickname}님에게 쪽지를 보냈습니다!`);
    setInputText("");
  };

  return (
    <AppLayout showMenu={false}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">쪽지함</h1>
        <a href="/me" className="rounded-lg border px-4 py-2 text-sm hover:bg-neutral-50">마이페이지로 돌아가기</a>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr,300px]">
        {/* 쪽지 목록 및 대화창 */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border bg-white p-6 h-[400px] overflow-y-auto shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-400 mb-4 uppercase">최근 대화</h2>
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`p-4 rounded-2xl max-w-[80%] ${msg.sender === '나' ? 'bg-neutral-900 text-white self-end ml-auto' : 'bg-neutral-100 text-neutral-800'}`}>
                  <div className="text-xs font-bold mb-1">{msg.sender}</div>
                  <div className="text-sm">{msg.content}</div>
                  <div className="text-[10px] mt-2 opacity-50 text-right">{msg.time}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder={selectedFriend ? `${selectedFriend.nickname}님에게 답장하기...` : "친구를 선택하세요"}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-neutral-900 text-white px-6 py-3 rounded-xl font-bold">전송</button>
          </div>
        </div>

        {/* 친구 목록 사이드바 */}
        <aside className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-400 mb-4 uppercase">온라인 친구</h2>
          <ul className="space-y-3">
            {friends.map(friend => (
              <li 
                key={friend.id} 
                onClick={() => setSelectedFriend(friend)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${selectedFriend?.id === friend.id ? 'bg-neutral-100' : 'hover:bg-neutral-50'}`}
              >
                <div className={`w-2 h-2 rounded-full ${friend.status === 'ONLINE' ? 'bg-green-500' : 'bg-neutral-300'}`}></div>
                <span className="text-sm font-medium">{friend.nickname}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </AppLayout>
  );
}
