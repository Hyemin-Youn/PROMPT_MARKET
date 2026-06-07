import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { PromptDetailPage } from "./pages/PromptDetailPage.jsx";
import { LibraryPage } from "./pages/LibraryPage.jsx";
import { AuthModal } from "./components/auth/AuthModal.jsx";

const AppContent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // [수정] 처음에는 인증 확인이 끝나지 않았으므로 false로 시작하거나 '로딩 상태'를 둘 수 있습니다.
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [authModal, setAuthModal] = useState(null);
    const [purchasedPrompts, setPurchasedPrompts] = useState([]);

    // 인증 검사 프로세스가 완료되었는지 확인하는 상태 (깜빡임 방지용)
    const [isAuthChecking, setIsAuthChecking] = useState(true);

    // 🌟 [추가] 새로고침 시 백엔드 쿠키(JWT) 상태를 체크하는 로직
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // 백엔드의 현재 로그인 유저 정보 조회 API 호출 (엔드포인트는 팀 스펙에 맞게 수정 가능)
                const response = await fetch("http://localhost:8080/api/users/me", {
                    method: "GET",
                    credentials: "include", // 쿠키를 포함해서 전송
                });

                if (response.ok) {
                    const data = await response.json(); // 예: { email: "user@example.com" }
                    setIsLoggedIn(true);
                    setUserEmail(data.email || localStorage.getItem("userEmail") || "");
                    localStorage.setItem("userEmail", data.email || localStorage.getItem("userEmail"));
                } else {
                    // 쿠키가 만료되었거나 없는 경우 싹 다 초기화 (유령 로그인 방지)
                    handleLocalReset();
                }
            } catch (e) {
                console.error("인증 상태 확인 실패:", e);
                // 네트워크 에러 등이 나더라도 안전하게 로컬 데이터를 신뢰하지 않도록 처리 가능
                // 단, 서버가 잠시 꺼진 경우를 대비해 유연하게 처리하려면 유지할 수도 있습니다.
                if (!localStorage.getItem("userEmail")) {
                    handleLocalReset();
                }
            } finally {
                setIsAuthChecking(false); // 인증 검사 완료
            }
        };

        checkAuthStatus();
    }, []);

    // 중복 코드를 줄이기 위한 로컬 상태 초기화 함수
    const handleLocalReset = () => {
        localStorage.removeItem("purchasedPrompts");
        localStorage.removeItem("userEmail");
        setIsLoggedIn(false);
        setUserEmail("");
        setPurchasedPrompts([]);
    };

    useEffect(() => {
        if (isLoggedIn) {
            const savedPurchases = localStorage.getItem("purchasedPrompts");
            if (savedPurchases) setPurchasedPrompts(JSON.parse(savedPurchases));
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (purchasedPrompts.length > 0) {
            localStorage.setItem("purchasedPrompts", JSON.stringify(purchasedPrompts));
        }
    }, [purchasedPrompts]);

    const handleProtectedNavigate = (path) => {
        if (!isLoggedIn) { setAuthModal("login"); return; }
        navigate(path);
    };

    const handlePurchase = (promptId) => {
        if (!isLoggedIn) { setAuthModal("login"); return; }
        setPurchasedPrompts((prev) => prev.includes(promptId) ? prev : [...prev, promptId]);
        navigate("/library");
    };

    const handleAuthSuccess = (token, email) => {
        localStorage.setItem("userEmail", email || "");
        setIsLoggedIn(true);
        setUserEmail(email || "");
        setAuthModal(null);
    };

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/api/users/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {
            console.error("로그아웃 에러:", e);
        }
        handleLocalReset(); // 공통 초기화 함수 사용
        navigate("/");
    };

    const showFooter = location.pathname === "/";

    const libraryProps = {
        purchasedPrompts,
        onLogout: handleLogout,
        onSelectPrompt: (id) => navigate(`/detail/${id}`),
        userEmail,
    };

    // 🌟 [추가] 인증 상태를 확인하는 중에는 레이아웃 렌더링을 잠시 보류 (화면 깜빡임 유령 로그인 방지)
    if (isAuthChecking) {
        return <div className="min-h-screen" style={{ background: "#0b0b12" }} />;
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "#0b0b12", fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
            <Navbar
                currentPage={location.pathname}
                onNavigate={(path) => {
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
                userEmail={userEmail}
            />

            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<HomePage onSelectPrompt={(id) => navigate(`/detail/${id}`)} purchasedPrompts={purchasedPrompts} />} />
                    <Route path="/detail/:id" element={<PromptDetailPageWrapper onPurchase={handlePurchase} isLoggedIn={isLoggedIn} purchasedPrompts={purchasedPrompts} />} />

                    <Route path="/library"   element={isLoggedIn ? <LibraryPage {...libraryProps} initialNav="purchases" /> : <Navigate to="/" replace />} />
                    <Route path="/profile"   element={isLoggedIn ? <LibraryPage {...libraryProps} initialNav="profile"   /> : <Navigate to="/" replace />} />
                    <Route path="/favorites" element={isLoggedIn ? <LibraryPage {...libraryProps} initialNav="favorites" /> : <Navigate to="/" replace />} />
                    <Route path="/settings"  element={isLoggedIn ? <LibraryPage {...libraryProps} initialNav="settings"  /> : <Navigate to="/" replace />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            {showFooter && <Footer />}

            {authModal && (
                <AuthModal
                    mode={authModal}
                    onClose={() => setAuthModal(null)}
                    onSuccess={handleAuthSuccess}
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
            onBack={() => navigate(-1)}
            onPurchase={onPurchase}
            isLoggedIn={isLoggedIn}
            isPurchased={purchasedPrompts.includes(id)}
        />
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;