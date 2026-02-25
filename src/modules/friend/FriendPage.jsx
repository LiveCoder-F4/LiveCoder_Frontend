import React, { useState, useEffect } from 'react';
import { friendApi } from '../../api/friendApi';
import { userApi } from '../../api/userApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const FriendPage = () => {
  const [friends, setFriends] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('nickname'); // 'nickname' or 'username'
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'received', 'sent'
  const [messageTarget, setMessageTarget] = useState(null);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    fetchFriends();
    fetchRequests();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await friendApi.getFriends();
      setFriends(response.data);
    } catch (error) {
      console.error('친구 목록 조회 실패:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const received = await friendApi.getReceivedRequests();
      const sent = await friendApi.getSentRequests();
      setReceivedRequests(received.data);
      setSentRequests(sent.data);
    } catch (error) {
      console.error('친구 요청 조회 실패:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    try {
      let response;
      if (searchType === 'nickname') {
        response = await userApi.searchUserByNickname(searchTerm);
        setSearchResults(response.data);
      } else {
        response = await userApi.searchUserByUsername(searchTerm);
        setSearchResults(response.data ? [response.data] : []);
      }
      
      if (response.data.length === 0 || (searchType === 'username' && !response.data)) {
        alert('검색 결과가 없습니다.');
      }
    } catch (error) {
      alert('검색 중 오류가 발생했습니다.');
      setSearchResults([]);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await friendApi.sendFriendRequest(userId);
      alert('친구 요청을 보냈습니다.');
      fetchRequests();
    } catch (error) {
      alert(error.response?.data || '요청 실패');
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const response = await friendApi.acceptRequest(requestId);
      console.log('수락 응답:', response.data);
      alert('친구 요청을 수락했습니다.');
      fetchFriends();
      fetchRequests();
    } catch (error) {
      console.error('수락 실패 에러:', error);
      const errorMsg = error.response?.data || '수락 실패';
      alert(typeof errorMsg === 'string' ? errorMsg : '수락 실패 (알 수 없는 오류)');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await friendApi.rejectRequest(requestId);
      fetchRequests();
    } catch (error) {
      alert(error.response?.data || '거절 실패');
    }
  };

  const handleCancel = async (requestId) => {
    try {
      await friendApi.cancelRequest(requestId);
      fetchRequests();
    } catch (error) {
      alert(error.response?.data || '취소 실패');
    }
  };

  const handleDelete = async (friendId) => {
    if (!window.confirm('정말 친구를 삭제하시겠습니까?')) return;
    try {
      await friendApi.deleteFriend(friendId);
      fetchFriends();
    } catch (error) {
      alert('삭제 실패');
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;
    try {
      await friendApi.sendMessage(messageTarget.userId, messageContent);
      alert('쪽지를 보냈습니다.');
      setMessageTarget(null);
      setMessageContent('');
    } catch (error) {
      alert('쪽지 전송 실패');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-white">친구 관리</h1>

      {/* 검색 섹션 */}
      <Card className="mb-8 p-6 bg-slate-800 border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-white">친구 찾기</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <select 
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="bg-slate-900 border-slate-700 text-white rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="nickname">닉네임</option>
            <option value="username">아이디</option>
          </select>
          <Input
            placeholder={searchType === 'nickname' ? "닉네임 입력" : "아이디(username) 입력"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-slate-900 border-slate-700 text-white"
          />
          <Button type="submit" variant="primary">검색</Button>
        </form>
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            {searchResults.map(result => (
              <div key={result.userId} className="p-4 bg-slate-900 rounded-lg flex items-center justify-between border border-slate-700">
                <div>
                  <span className="font-bold text-white">{result.nickname}</span>
                  <span className="text-slate-400 text-sm ml-2">(@{result.username})</span>
                </div>
                <Button onClick={() => handleSendRequest(result.userId)} size="sm">요청 보내기</Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-slate-700 mb-6">
        <button
          className={`px-6 py-3 font-medium transition-colors ${activeTab === 'list' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setActiveTab('list')}
        >
          친구 목록 ({friends.length})
        </button>
        <button
          className={`px-6 py-3 font-medium transition-colors ${activeTab === 'received' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setActiveTab('received')}
        >
          받은 요청 ({receivedRequests.length})
        </button>
        <button
          className={`px-6 py-3 font-medium transition-colors ${activeTab === 'sent' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setActiveTab('sent')}
        >
          보낸 요청 ({sentRequests.length})
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="min-h-[300px]">
        {activeTab === 'list' && (
          <div className="grid gap-4">
            {friends.length === 0 ? (
              <p className="text-slate-500 text-center py-10">친구가 없습니다. 새로운 친구를 찾아보세요!</p>
            ) : (
              friends.map(friend => (
                <Card key={friend.userId} className="p-4 bg-slate-800 border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                      {friend.nickname[0]}
                    </div>
                    <div>
                      <div className="font-bold text-white">{friend.nickname}</div>
                      <div className="text-sm text-slate-400">{friend.bio || '안녕하세요!'}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setMessageTarget(friend)}>쪽지</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(friend.userId)}>삭제</Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'received' && (
          <div className="grid gap-4">
            {receivedRequests.length === 0 ? (
              <p className="text-slate-500 text-center py-10">받은 친구 요청이 없습니다.</p>
            ) : (
              receivedRequests.map(req => (
                <Card key={req.requestId} className="p-4 bg-slate-800 border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{req.requesterNickname}</span>님이 친구 요청을 보냈습니다.
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" onClick={() => handleAccept(req.requestId)}>수락</Button>
                    <Button variant="secondary" size="sm" onClick={() => handleReject(req.requestId)}>거절</Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'sent' && (
          <div className="grid gap-4">
            {sentRequests.length === 0 ? (
              <p className="text-slate-500 text-center py-10">보낸 친구 요청이 없습니다.</p>
            ) : (
              sentRequests.map(req => (
                <Card key={req.requestId} className="p-4 bg-slate-800 border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{req.receiverNickname}</span>님에게 요청을 보냈습니다.
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => handleCancel(req.requestId)}>취소</Button>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* 쪽지 모달 */}
      {messageTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 bg-slate-800 border-slate-700">
            <h3 className="text-xl font-bold mb-4 text-white">{messageTarget.nickname}님에게 쪽지 보내기</h3>
            <textarea
              className="w-full h-32 p-3 bg-slate-900 border border-slate-700 rounded-lg text-white mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="쪽지 내용을 입력하세요..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setMessageTarget(null)}>취소</Button>
              <Button variant="primary" onClick={handleSendMessage}>보내기</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FriendPage;
