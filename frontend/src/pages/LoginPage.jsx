import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Zap, Github, AlertCircle } from "lucide-react";
import { login as apiLogin } from "../api/auth.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const BgDecor = () => (
  <>
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 700, height: 320, borderRadius: "70%", background: "radial-gradient(ellipse, rgba(124,58,237,0.45), transparent)", filter: "blur(90px)" }} />
      <div style={{ position: "absolute", top: "-15%", right: "-10%", width: 600, height: 280, borderRadius: "70%", background: "radial-gradient(ellipse, rgba(167,139,250,0.35), transparent)", filter: "blur(90px)" }} />
      <div style={{ position: "absolute", bottom: "5%", left: "30%", width: 500, height: 200, borderRadius: "70%", background: "radial-gradient(ellipse, rgba(124,58,237,0.20), transparent)", filter: "blur(80px)" }} />
    </div>
  </>
);

export const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "", remember: false });
  const [showPw, setShowPw]   = useState(false);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.email)                            e.email    = "이메일을 입력하세요";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email    = "올바른 이메일 형식이 아닙니다";
    if (!form.password)                         e.password = "비밀번호를 입력하세요";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await apiLogin(form.email, form.password);
      onLoginSuccess();
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "이메일 또는 비밀번호가 올바르지 않습니다";
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `${API_BASE}/oauth2/authorization/${provider}`; // Spring Security OAuth2 표준 경로
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#0b0b12", position: "relative" }}>
      <BgDecor />

      <div className="w-full max-w-md" style={{ position: "relative", zIndex: 1 }}>
        {/* 로고 */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <Zap size={17} className="text-white" />
          </div>
          <span className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
            Prompt<span style={{ color: "var(--brand-violet-light)" }}>Mart</span>
          </span>
        </Link>

        {/* 카드 */}
        <div className="rounded-2xl p-8" style={{ background: "var(--card)", border: "1px solid var(--border-lg)" }}>
          <h1 className="font-semibold mb-1" style={{ color: "var(--foreground)", fontSize: "1.25rem" }}>로그인</h1>
          <p className="text-sm mb-7" style={{ color: "var(--muted-foreground)" }}>
            계정에 로그인하여 프롬프트를 이용하세요
          </p>

          {/* OAuth 버튼 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => handleOAuth("google")}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
              style={{ border: "1px solid var(--border-md)", color: "var(--foreground)" }}
            >
              <GoogleIcon /> Google
            </button>
            <button
              onClick={() => handleOAuth("github")}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
              style={{ border: "1px solid var(--border-md)", color: "var(--foreground)" }}
            >
              <Github size={16} /> GitHub
            </button>
          </div>

          {/* 구분선 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "var(--border-sm)" }} />
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>이메일로 로그인</span>
            <div className="flex-1 h-px" style={{ background: "var(--border-sm)" }} />
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* 이메일 */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                이메일
              </label>
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all"
                style={{
                  background: "var(--muted)",
                  border: `1px solid ${errors.email ? "var(--destructive)" : "var(--border-md)"}`,
                }}
              >
                <Mail size={15} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                  placeholder="dev@example.com"
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: "var(--foreground)" }}
                />
              </div>
              {errors.email && (
                <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--destructive)" }}>
                  <AlertCircle size={11} /> {errors.email}
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                비밀번호
              </label>
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all"
                style={{
                  background: "var(--muted)",
                  border: `1px solid ${errors.password ? "var(--destructive)" : "var(--border-md)"}`,
                }}
              >
                <Lock size={15} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  placeholder="비밀번호 입력"
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: "var(--foreground)" }}
                />
                <button type="button" onClick={() => setShowPw(p => !p)} className="shrink-0">
                  {showPw
                    ? <EyeOff size={14} style={{ color: "var(--muted-foreground)" }} />
                    : <Eye    size={14} style={{ color: "var(--muted-foreground)" }} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--destructive)" }}>
                  <AlertCircle size={11} /> {errors.password}
                </p>
              )}
            </div>

            {/* 로그인 상태 유지 / 비밀번호 찾기 */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={e => set("remember", e.target.checked)}
                  className="accent-violet-600"
                />
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>로그인 상태 유지</span>
              </label>
              <button type="button" className="text-xs hover:underline" style={{ color: "var(--brand-violet-light)" }}>
                비밀번호 찾기
              </button>
            </div>

            {/* 서버 에러 */}
            {errors.submit && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                style={{
                  background: "var(--destructive-bg-subtle)",
                  border: "1px solid var(--destructive-border-sm)",
                  color: "var(--destructive)",
                }}
              >
                <AlertCircle size={14} className="shrink-0" />
                {errors.submit}
              </div>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "var(--gradient-primary)" }}
            >
              {loading ? "로그인 중…" : "로그인"}
            </button>
          </form>

          {/* 회원가입 링크 */}
          <p className="text-center text-sm mt-6" style={{ color: "var(--muted-foreground)" }}>
            계정이 없으신가요?{" "}
            <Link to="/signup" className="font-medium hover:underline" style={{ color: "var(--brand-violet-light)" }}>
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
