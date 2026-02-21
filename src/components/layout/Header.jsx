import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import Button from "../ui/Button.jsx";

export default function Header({ right = null }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    isAuthenticated: false,
    nickname: "",
    userId: null
  });

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
    } else {
      setUser({
        isAuthenticated: false,
        nickname: "",
        userId: null
      });
    }
  }, []);

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
    <div className='flex items-center gap-3'>
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