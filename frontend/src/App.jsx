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
import { OAuthSetupPage }      from "./pages/OAuthSetupPage.jsx";
import { logout as apiLogout } from "./api/auth.js";
import { getMe, getPurchases, purchasePrompt } from "./api/users.js";

/* ─── 상세 페이지 래퍼 (useParams 사용) ─── */
const PromptDetailPageWrapper = ({ onPurchase, isLoggedIn, purchasedPrompts, currentUserId }) => {
  const { id }   = useParams();
  const navigate = useNavigate();
  return (
    <PromptDetailPage
      promptId={id}
      onBack={() => navigate(-1)}
      onPurchase={onPurchase}
      isLoggedIn={isLoggedIn}
      isPurchased={purchasedPrompts.includes(String(id))}
      currentUserId={currentUserId}
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
  const [isLoggedIn, setIsLoggedIn]   = useState(() => !!localStorage.getItem("isLoggedIn"));
  const [currentUser, setCurrentUser] = useState({ email: "", nickname: "", userId: null });
  const [purchasedPrompts, setPurchasedPrompts] = useState([]);

  /* 현재 유저 정보 조회 */
  const fetchCurrentUser = async () => {
    try {
      const res = await getMe();
      const d = res.data?.data || {};
      setCurrentUser({
        email:    d.email    || "",
        nickname: d.nickname || "",
        userId:   d.userId   || null,
      });
    } catch { /* ignore — cookie 없으면 401 */ }
  };

  /* 구매 목록 백엔드 동기화 */
  const syncPurchases = async () => {
    try {
      const res = await getPurchases();
      const items = res.data?.data || [];
      const ids = items.map(item => String(item.promptId || item.id || item));
      setPurchasedPrompts(ids);
    } catch {
      /* 백엔드 실패 시 localStorage 폴백 */
      try {
        const saved = localStorage.getItem("purchasedPrompts");
        if (saved) setPurchasedPrompts(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  };

  /* 로그인 상태일 때 유저 정보 + 구매 목록 복원 */
  useEffect(() => {
    if (!isLoggedIn) return;
    fetchCurrentUser();
    syncPurchases();
  }, []);

  /* 로그인 성공 콜백 — 쿠키는 브라우저가 자동 저장, 플래그만 기록 */
  const handleLoginSuccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    fetchCurrentUser();
    syncPurchases();
  };

  /* 로그아웃 — 서버 쿠키 삭제 + 로컬 상태 초기화 */
  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch { /* 서버 요청 실패해도 로컬 정리는 진행 */ }
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("purchasedPrompts");
    setIsLoggedIn(false);
    setCurrentUser({ email: "", nickname: "", userId: null });
    setPurchasedPrompts([]);
    navigate("/");
  };

  /* 구매 처리 — 백엔드 API 호출 후 로컬 상태 반영 */
  const handlePurchase = async (promptId) => {
    if (!isLoggedIn) { navigate("/login"); return; }
    try {
      await purchasePrompt(promptId);
      setPurchasedPrompts(prev =>
        prev.includes(String(promptId)) ? prev : [...prev, String(promptId)]
      );
      navigate("/library");
    } catch (err) {
      const msg = err.response?.data?.message || "구매에 실패했습니다. 다시 시도해주세요.";
      alert(msg);
    }
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
              currentUserId={currentUser.userId}
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
          {/* OAuth 신규 유저 닉네임 설정 */}
          <Route path="/oauth/setup" element={<OAuthSetupPage />} />

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
