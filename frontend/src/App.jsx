import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes, Route, Navigate,
  useNavigate, useLocation, useParams,
} from "react-router-dom";
import { Navbar }              from "./components/layout/Navbar.jsx";
import { Footer }              from "./components/layout/Footer.jsx";
import { HomePage }            from "./pages/HomePage.jsx";
import { PromptDetailPage }    from "./pages/PromptDetailPage.jsx";
import { LibraryPage }         from "./pages/LibraryPage.jsx";
import { LoginPage }           from "./pages/LoginPage.jsx";
import { SignupPage }          from "./pages/SignupPage.jsx";
import { OAuthCallbackPage }   from "./pages/OAuthCallbackPage.jsx";
import { logout as apiLogout } from "./api/auth.js";

/* ─── 상세 페이지 래퍼 (useParams 사용) ─── */
const PromptDetailPageWrapper = ({ onPurchase, isLoggedIn, purchasedPrompts }) => {
  const { id }   = useParams();
  const navigate = useNavigate();
  return (
    <PromptDetailPage
      promptId={id}
      onBack={() => navigate(-1)}
      onPurchase={onPurchase}
      isLoggedIn={isLoggedIn}
      isPurchased={purchasedPrompts.includes(String(id))}
    />
  );
};

/* ─── 인증된 사용자만 접근 가능 ─── */
const PrivateRoute = ({ isLoggedIn, children }) =>
  isLoggedIn ? children : <Navigate to="/login" replace />;

/* ─── 이미 로그인된 사용자는 접근 차단 ─── */
const PublicOnlyRoute = ({ isLoggedIn, children }) =>
  isLoggedIn ? <Navigate to="/" replace /> : children;

/* ════════════════════════════════════
   AppContent
════════════════════════════════════ */
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* 쿠키 기반 인증이므로 localStorage에는 플래그만 저장 */
  const [isLoggedIn, setIsLoggedIn]             = useState(() => !!localStorage.getItem("isLoggedIn"));
  const [purchasedPrompts, setPurchasedPrompts] = useState([]);

  /* 로그인 상태일 때 구매 목록 복원 */
  useEffect(() => {
    if (!isLoggedIn) return;
    try {
      const saved = localStorage.getItem("purchasedPrompts");
      if (saved) setPurchasedPrompts(JSON.parse(saved));
    } catch { /* ignore */ }
  }, [isLoggedIn]);

  /* 구매 목록 변경 시 저장 */
  useEffect(() => {
    localStorage.setItem("purchasedPrompts", JSON.stringify(purchasedPrompts));
  }, [purchasedPrompts]);

  /* 로그인 성공 콜백 — 쿠키는 브라우저가 자동 저장, 플래그만 기록 */
  const handleLoginSuccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  /* 로그아웃 — 서버 쿠키 삭제 + 로컬 상태 초기화 */
  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch { /* 서버 요청 실패해도 로컬 정리는 진행 */ }
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("purchasedPrompts");
    setIsLoggedIn(false);
    setPurchasedPrompts([]);
    navigate("/");
  };

  /* 구매 처리 */
  const handlePurchase = (promptId) => {
    if (!isLoggedIn) { navigate("/login"); return; }
    setPurchasedPrompts(prev =>
      prev.includes(String(promptId)) ? prev : [...prev, String(promptId)]
    );
    navigate("/library");
  };

  /* 인증 필요 네비게이션 */
  const handleProtectedNavigate = (path) => {
    if (!isLoggedIn) { navigate("/login"); return; }
    navigate(path);
  };

  const showFooter = location.pathname === "/";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0b0b12", fontFamily: "'Inter', 'Pretendard', sans-serif" }}
    >
      <Navbar
        currentPage={location.pathname}
        onNavigate={(path) => {
          const protectedPaths = ["/library", "/profile", "/favorites", "/settings"];
          protectedPaths.includes(path) ? handleProtectedNavigate(path) : navigate(path);
        }}
        isLoggedIn={isLoggedIn}
        purchaseCount={purchasedPrompts.length}
        onOpenLogin={()  => navigate("/login")}
        onOpenSignup={() => navigate("/signup")}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        <Routes>
          {/* 공개 */}
          <Route path="/" element={
            <HomePage
              onSelectPrompt={(id) => navigate(`/detail/${id}`)}
              purchasedPrompts={purchasedPrompts}
            />
          } />
          <Route path="/detail/:id" element={
            <PromptDetailPageWrapper
              onPurchase={handlePurchase}
              isLoggedIn={isLoggedIn}
              purchasedPrompts={purchasedPrompts}
            />
          } />

          {/* 비로그인 전용 */}
          <Route path="/login" element={
            <PublicOnlyRoute isLoggedIn={isLoggedIn}>
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            </PublicOnlyRoute>
          } />
          <Route path="/signup" element={
            <PublicOnlyRoute isLoggedIn={isLoggedIn}>
              <SignupPage />
            </PublicOnlyRoute>
          } />

          {/* OAuth 로그인 콜백 — 백엔드가 쿠키 발급 후 여기로 리다이렉트 */}
          <Route path="/oauth2/callback" element={
            <OAuthCallbackPage onLoginSuccess={handleLoginSuccess} />
          } />

          {/* 로그인 필요 */}
          {["/library", "/profile", "/favorites", "/settings"].map((path) => (
            <Route key={path} path={path} element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <LibraryPage
                  purchasedPrompts={purchasedPrompts}
                  onLogout={handleLogout}
                  onSelectPrompt={(id) => navigate(`/detail/${id}`)}
                />
              </PrivateRoute>
            } />
          ))}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showFooter && <Footer />}
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
