import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

export const OAuthCallbackPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  useEffect(() => {
    onLoginSuccess();
    const params = new URLSearchParams(window.location.search);
    if (params.get("setup") === "true") {
      navigate("/oauth/setup", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0b0b12" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse" style={{ background: "var(--primary)" }}>
          <Zap size={22} className="text-white" />
        </div>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>로그인 처리 중…</p>
      </div>
    </div>
  );
};
