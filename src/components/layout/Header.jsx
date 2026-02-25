import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { friendApi } from "../../api/friendApi";
import { notificationApi } from "../../api/notificationApi";
import Button from "../ui/Button.jsx";

export default function Header({ right = null }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    isAuthenticated: false,
    nickname: "",
    userId: null
  });
  const [requestCount, setRequestCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nickname = localStorage.getItem("nickname");
    const userId = localStorage.getItem("userId");

    if (token) {
      setUser({
        isAuthenticated: true,
        nickname: nickname || "사용자",
        userId: userId
      });
      fetchRequestCount();
      fetchNotifications();
      
      // 알림 주기적 폴링 (5초로 단축하여 실시간성 강화)
      const interval = setInterval(() => {
        fetchNotifications();
        fetchRequestCount();
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setUser({
        isAuthenticated: false,
        nickname: "",
        userId: null
      });
    }
  }, []);

  const fetchRequestCount = async () => {
    try {
      const response = await friendApi.getReceivedRequests();
      setRequestCount(response.data.length);
    } catch (error) {
      console.error("친구 요청 조회 실패", error);
    }
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const response = await notificationApi.getUnreadNotifications();
      setNotifications(response.data || []);
      // console.log("알림 로드 완료:", response.data.length);
    } catch (error) {
      if (error.response?.status === 401) {
        // 인증 만료 시 처리 (필요한 경우)
      }
      console.error("알림 조회 실패:", error);
    }
  };

  const handleReadNotification = async (id, type) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => prev.filter(n => n.notificationId !== id));
      
      // 알림 타입에 따라 이동
      if (type === 'MESSAGE') {
        navigate('/chat');
      } else if (type === 'FRIEND_REQUEST') {
        navigate('/friends');
      }
      setShowNotifications(false);
    } catch (error) {
      console.error("알림 읽음 처리 실패", error);
    }
  };

  const handleReadAll = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications([]);
      setShowNotifications(false);
    } catch (error) {
      console.error("전체 알림 읽음 처리 실패", error);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("로그아웃 API 호출 실패", err);
    } finally {
      localStorage.clear();
      setUser({ isAuthenticated: false, nickname: "", userId: null });
      navigate("/login");
    }
  };

  const defaultRight = user.isAuthenticated ? (
    <div className='flex items-center gap-3 relative'>
      {/* 알림 드롭다운 버튼 */}
      <div className="relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className={`p-2 rounded-full transition-all ${showNotifications ? 'text-indigo-600 bg-indigo-50' : 'text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
          title="알림"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              {notifications.length}
            </span>
          )}
        </button>

        {/* 알림 드롭다운 레이어 */}
        {showNotifications && (
          <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl shadow-neutral-200/50 z-[100]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">알림</h3>
              <button 
                onClick={handleReadAll}
                className="text-[10px] font-bold text-indigo-600 hover:underline"
              >
                모두 읽음 처리
              </button>
            </div>
            
            <div className="max-h-80 overflow-y-auto space-y-2 custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div 
                    key={n.notificationId}
                    onClick={() => handleReadNotification(n.notificationId, n.type)}
                    className="group p-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-100 cursor-pointer transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${n.type === 'MESSAGE' ? 'bg-indigo-500' : 'bg-orange-500'}`} />
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-neutral-700 leading-snug group-hover:text-neutral-900">{n.content}</p>
                        <span className="text-[10px] text-neutral-400 font-medium">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <p className="text-xs text-neutral-400 italic">새로운 알림이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 친구 관리 아이콘 */}
      <button 
        onClick={() => navigate('/friends')}
        className="relative p-2 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
        title="친구 관리"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        {requestCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {requestCount}
          </span>
        )}
      </button>

      <span className="hidden sm:inline-block text-sm font-medium text-neutral-600">
        <span className="text-indigo-600 font-bold">{user.nickname}</span>님
      </span>
      <a href='/me' className='rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors'>
        마이페이지
      </a>
      <Button variant='outline' className="py-1.5 px-3 text-sm" onClick={handleLogout}>
        로그아웃
      </Button>
    </div>
  ) : (
    <a href='/login' className='rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-95'>
      로그인
    </a>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href={user.isAuthenticated ? "/home/auth" : "/"} className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-bold text-xl shadow-lg shadow-indigo-100 group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:scale-105">
            L
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-indigo-600 transition-colors">
            LiveCoder
          </span>
        </a>
        <div className="flex items-center gap-4">
          {right || defaultRight}
        </div>
      </div>
    </header>
  );
}