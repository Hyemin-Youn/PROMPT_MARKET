import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, User, AlertCircle, CheckCircle2 } from "lucide-react";
import axiosInstance from "../api/axiosInstance.js";

export const OAuthSetupPage = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError]       = useState("");

  /* 현재 자동 생성된 닉네임 pre-fill */
  useEffect(() => {
    axiosInstance.get("/api/users/me")
      .then(res => setNickname(res.data?.data?.nickname || ""))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) { setError("닉네임을 입력해주세요"); return; }
    if (trimmed.length < 2) { setError("닉네임은 2자 이상이어야 합니다"); return; }
    if (trimmed.length > 20) { setError("닉네임은 20자 이하여야 합니다"); return; }

    setLoading(true);
    setError("");
    try {
      await axiosInstance.put("/api/users/profile", { nickname: trimmed });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "닉네임 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0b0b12", position: "relative" }}
    >
      {/* 배경 장식 */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 600, height: 280, borderRadius: "70%", background: "radial-gradient(ellipse, rgba(124,58,237,0.4), transparent)", filter: "blur(90px)" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "-5%", width: 500, height: 220, borderRadius: "70%", background: "radial-gradient(ellipse, rgba(167,139,250,0.3), transparent)", filter: "blur(80px)" }} />
      </div>

      <div className="w-full max-w-md" style={{ position: "relative", zIndex: 1 }}>
        {/* 로고 */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <Zap size={17} className="text-white" />
          </div>
          <span className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
            Prompt<span style={{ color: "var(--brand-violet-light)" }}>Mart</span>
          </span>
        </div>

        <div className="rounded-2xl p-8" style={{ background: "var(--card)", border: "1px solid var(--border-lg)" }}>
          {/* 헤더 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--primary-bg-md)" }}>
              <CheckCircle2 size={18} style={{ color: "var(--brand-violet-light)" }} />
            </div>
            <div>
              <h1 className="font-semibold" style={{ color: "var(--foreground)", fontSize: "1.15rem" }}>
                거의 다 됐어요!
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                사용할 닉네임을 설정해주세요
              </p>
            </div>
          </div>

          {fetching ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--primary)" }} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                  닉네임
                </label>
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                  style={{
                    background: "var(--muted)",
                    border: `1px solid ${error ? "var(--destructive)" : "var(--border-md)"}`,
                  }}
                >
                  <User size={15} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                  <input
                    type="text"
                    value={nickname}
                    onChange={e => { setNickname(e.target.value); setError(""); }}
                    placeholder="닉네임 입력 (2~20자)"
                    maxLength={20}
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color: "var(--foreground)" }}
                    autoFocus
                  />
                  <span className="text-xs shrink-0" style={{ color: "var(--muted-foreground)" }}>
                    {nickname.length}/20
                  </span>
                </div>
                {error && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--destructive)" }}>
                    <AlertCircle size={11} /> {error}
                  </p>
                )}
                <p className="text-xs mt-1.5" style={{ color: "var(--muted-foreground)" }}>
                  OAuth 계정 정보로 자동 생성된 닉네임이에요. 원하시면 변경하세요.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !nickname.trim()}
                className="w-full py-2.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--gradient-primary)" }}
              >
                {loading ? "저장 중…" : "시작하기"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
