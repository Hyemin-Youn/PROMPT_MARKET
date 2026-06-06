import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { PromptDetailPage } from "./pages/PromptDetailPage.jsx";
import { LibraryPage } from "./pages/LibraryPage.jsx";
import { AuthModal } from "./components/auth/AuthModal.jsx";

// 내부 컴포넌트에서 라우팅 훅(useNavigate 등)을 사용하기 위해 AppContent로 분리합니다.
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 로그인 상태를 로컬스토리지(JWT 토큰 기반 가정)와 연동
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token"); // 토큰 존재 여부로 초기값 설정
  });

  const [authModal, setAuthModal] = useState(null);
  const [purchasedPrompts, setPurchasedPrompts] = useState([]);

  // 2. 앱 로드 시 로컬스토리지에 토큰이 있다면 사용자 데이터나 구매 목록을 불러오는 로직 (예시)
  useEffect(() => {
    if (isLoggedIn) {
      // 실제 프로젝트에서는 여기서 API를 호출해 구매 목록을 채워넣는 것이 좋습니다.
      // 현재는 예시로 로컬스토리지나 빈 배열을 유지합니다.
      const savedPurchases = localStorage.getItem("purchasedPrompts");
      if (savedPurchases) {
        setPurchasedPrompts(JSON.parse(savedPurchases));
      }
    }
  }, [isLoggedIn]);

  // 구매 목록 변경 시 로컬스토리지에 저장 (새로고침 유지용)
  useEffect(() => {
    if (purchasedPrompts.length > 0) {
      localStorage.setItem("purchasedPrompts", JSON.stringify(purchasedPrompts));
    }
  }, [purchasedPrompts]);

  // 네비게이션 가드 (인증이 필요한 페이지 접근 제어)
  const handleProtectedNavigate = (path) => {
    if (!isLoggedIn) {
      setAuthModal("login");
      return;
    }
    navigate(path);
  };

  // 단건 구매 처리
  const handlePurchase = (promptId) => {
    if (!isLoggedIn) {
      setAuthModal("login");
      return;
    }
    setPurchasedPrompts((prev) => {
      const updated = prev.includes(promptId) ? prev : [...prev, promptId];
      return updated;
    });
    navigate("/library");
  };

  const handleAuthSuccess = (token) => {
    // 백엔드에서 받은 JWT 토큰을 로컬스토리지에 저장 (인증 성공 시 토큰을 넘겨준다고 가정)
    localStorage.setItem("token", token || "mock-jwt-token");
    setIsLoggedIn(true);
    setAuthModal(null);
  };

  const handleLogout = () => {
    // 로컬스토리지 비우기 및 상태 초기화
    localStorage.removeItem("token");
    localStorage.removeItem("purchasedPrompts");
    setIsLoggedIn(false);
    setPurchasedPrompts([]);
    navigate("/");
  };

  // 조건부 푸터 노출 (현재 경로가 메인('/')일 때만)
  const showFooter = location.pathname === "/";

  return (
      <div
          className="min-h-screen flex flex-col"
          style={{
            background: "#0b0b12",
            fontFamily: "'Inter', 'Pretendard', sans-serif",
          }}
      >
        <Navbar
            currentPage={location.pathname} // 현재 URL 경로를 전달
            onNavigate={(path) => {
              // 인증이 필요한 메뉴들 처리
              if (["/library", "/profile", "/favorites", "/settings"].includes(path)) {
                handleProtectedNavigate(path);
              } else {
                navigate(path);
              }
            }}
            isLoggedIn={isLoggedIn}
            purchaseCount={purchasedPrompts.length}
            onOpenLogin={() => setAuthModal("login")}
            onOpenSignup={() => setAuthModal("signup")}
            onLogout={handleLogout}
        />

        <main className="flex-1">
          <Routes>
            {/* 메인 페이지 */}
            <Route
                path="/"
                element={
                  <HomePage
                      onSelectPrompt={(id) => navigate(`/detail/${id}`)}
                      purchasedPrompts={purchasedPrompts}
                  />
                }
            />

            {/* 상세 페이지 (동적 파라미터 :id 사용) */}
            <Route
                path="/detail/:id"
                element={
                  <PromptDetailPageWrapper
                      onPurchase={handlePurchase}
                      isLoggedIn={isLoggedIn}
                      purchasedPrompts={purchasedPrompts}
                  />
                }
            />

            {/* 라이브러리 및 마이페이지 계열 (인증 가드 적용) */}
            {["/library", "/profile", "/favorites", "/settings"].map((path) => (
                <Route
                    key={path}
                    path={path}
                    element={
                      isLoggedIn ? (
                          <LibraryPage
                              purchasedPrompts={purchasedPrompts}
                              onLogout={handleLogout}
                              onSelectPrompt={(id) => navigate(`/detail/${id}`)}
                          />
                      ) : (
                          <Navigate to="/" replace />
                      )
                    }
                />
            ))}

            {/* 잘못된 경로 접근 시 홈으로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {showFooter && <Footer />}

        {authModal && (
            <AuthModal
                mode={authModal}
                onClose={() => setAuthModal(null)}
                onSuccess={handleAuthSuccess} // 여기에 토큰을 인자로 전달해야 합니다.
                onSwitchMode={setAuthModal}
            />
        )}
      </div>
  );
};

const PromptDetailPageWrapper = ({ onPurchase, isLoggedIn, purchasedPrompts }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
      <PromptDetailPage
          promptId={id}
          onBack={() => navigate(-1)} // 이전 페이지로 이동
          onPurchase={onPurchase}
          isLoggedIn={isLoggedIn}
          isPurchased={purchasedPrompts.includes(id)}
      />
  );
};

// 최상위 App 컴포넌트에서 Router로 감싸줍니다.
const App = () => {
  return (
      <Router>
        <AppContent />
      </Router>
  );
};

export default App;
