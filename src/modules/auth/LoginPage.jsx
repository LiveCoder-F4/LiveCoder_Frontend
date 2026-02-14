// src/modules/auth/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { authApi } from "../../api/authApi";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-neutral-900 mb-2 tracking-tight">
            Live<span className="text-indigo-600">Coder</span>
          </h1>
          <p className="text-neutral-500">실시간 협업 코딩 플랫폼에 오신 것을 환영합니다.</p>
        </div>

        <div className="rounded-3xl border border-white/50 bg-white/80 backdrop-blur-xl p-8 shadow-xl shadow-indigo-100/50">
          {/* 탭 */}
          <div className="mb-8 grid grid-cols-2 rounded-xl bg-neutral-100 p-1.5">
            <button
              className={`rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                mode === "login" 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
              onClick={() => setMode("login")}
            >
              로그인
            </button>
            <button
              className={`rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                mode === "signup" 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
              onClick={() => setMode("signup")}
            >
              회원가입
            </button>
          </div>

          {mode === "login" ? <LoginForm /> : <SignupForm setMode={setMode} />}
        </div>
        
        <p className="mt-8 text-center text-xs text-neutral-400">
          © 2026 LiveCoder Team. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 실제 API 호출 흉내 (딜레이)
      await new Promise(r => setTimeout(r, 800));
      const response = await authApi.login(formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("nickname", response.data.nickname);
      navigate("/home/auth");
    } catch (err) {
      setError(err.response?.data?.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5 ml-1">이메일 또는 아이디</label>
        <Input 
          type="text" 
          placeholder="example@email.com" 
          required 
          value={formData.usernameOrEmail}
          onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5 ml-1">비밀번호</label>
        <Input 
          type="password" 
          placeholder="••••••••" 
          required 
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>
      
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}
      
      <Button variant="solid" className="w-full py-3 text-base" type="submit" disabled={loading}>
        {loading ? "로그인 중..." : "로그인하기"}
      </Button>
      
      <div className="text-center">
        <a href="#" className="text-sm text-neutral-500 hover:text-indigo-600 transition-colors">비밀번호를 잊으셨나요?</a>
      </div>
    </form>
  );
}

function SignupForm({ setMode }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    nickname: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      await authApi.register(formData);
      alert("회원가입이 완료되었습니다. 로그인해 주세요.");
      setMode("login");
    } catch (err) {
      setError(err.response?.data || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1 ml-1">아이디</label>
          <Input 
            type="text" 
            placeholder="user123" 
            required 
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1 ml-1">닉네임</label>
          <Input 
            type="text" 
            placeholder="코딩왕" 
            required 
            value={formData.nickname}
            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-700 mb-1 ml-1">이메일</label>
        <Input 
          type="email" 
          placeholder="example@email.com" 
          required 
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-700 mb-1 ml-1">비밀번호</label>
        <Input 
          type="password" 
          placeholder="6자 이상 입력" 
          required 
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
          {typeof error === 'string' ? error : "입력 정보를 확인해 주세요."}
        </div>
      )}

      <Button variant="solid" className="w-full py-3 text-base" type="submit" disabled={loading}>
        {loading ? "가입 처리 중..." : "회원가입 완료"}
      </Button>
    </form>
  );
}
