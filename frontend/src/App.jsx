import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { PromptDetailPage }  from "./pages/PromptDetailPage.jsx";
import { LibraryPage } from "./pages/LibraryPage.jsx";
import { AuthModal } from "./components/auth/AuthModal.jsx";
import { PromptCreatePage } from "./pages/PromptCreatePage.jsx";
import { PromptEditPage } from "./pages/PromptEditPage.jsx";

const AppContent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [authModal, setAuthModal] = useState(null);
    const [purchasedPrompts, setPurchasedPrompts] = useState([]);
    const [isAuthChecking, setIsAuthChecking] = useState(true);

    // 새로고침 시 로그인 상태 확인
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/users/me", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const result = await response.json();
                    const email = result.data?.email || "";
                    setIsLoggedIn(true);
                    setUserEmail(email);
                    localStorage.setItem("userEmail", email);
                } else {
                    handleLocalReset();
                }
            } catch (e) {
                console.error("인증 상태 확인 실패:", e);
                if (!localStorage.getItem("userEmail")) handleLocalReset();
            } finally {
                setIsAuthChecking(false);
            }
        };
        checkAuthStatus();
    }, []);

    // 로그인 후 백엔드에서 구매 목록 조회
    useEffect(() => {
        if (isLoggedIn) {
            fetch("http://localhost:8080/api/purchases", {
                method: "GET",
                credentials: "include",
            })
                .then(res => res.ok ? res.json() : [])
                .then(data => {
                    const result = data.data || data;
                    if (Array.isArray(result)) {
                        setPurchasedPrompts(result.map(p => String(p.promptId)));
                    }
                })
                .catch(err => console.error("구매 목록 로드 실패:", err));
        }
    }, [isLoggedIn]);

    const handleLocalReset = () => {
        localStorage.removeItem("purchasedPrompts");
        localStorage.removeItem("userEmail");
        setIsLoggedIn(false);
        setUserEmail("");
        setPurchasedPrompts([]);
    };

    const handleProtectedNavigate = (path) => {
        if (!isLoggedIn) { setAuthModal("login"); return; }
        navigate(path);
    };

    const handlePurchase = async (promptId) => {
        if (!isLoggedIn) { setAuthModal("login"); return; }
        try {
            const response = await fetch("http://localhost:8080/api/purchases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ promptId: Number(promptId) }),
            });
            if (response.ok) {
                setPurchasedPrompts((prev) => prev.includes(String(promptId)) ? prev : [...prev, String(promptId)]);
                navigate("/library");
            } else {
                const data = await response.json();
                alert(data.message || "구매에 실패했습니다.");
            }
        } catch (error) {
            console.error("구매 에러:", error);
            alert("서버와 통신할 수 없습니다.");
        }
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
        handleLocalReset();
        navigate("/");
    };

    const showFooter = location.pathname === "/";

    const libraryProps = {
        purchasedPrompts,
        onLogout: handleLogout,
        onSelectPrompt: (id) => navigate(`/detail/${id}`),
        userEmail,
    };

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
                    <Route path="/prompts/new" element={<PromptCreatePage />} />
                    <Route path="/favorites" element={isLoggedIn ? <LibraryPage {...libraryProps} initialNav="favorites" /> : <Navigate to="/" replace />} />
                    <Route path="/settings"  element={isLoggedIn ? <LibraryPage {...libraryProps} initialNav="settings"  /> : <Navigate to="/" replace />} />
                    <Route path="/prompts/edit/:id" element={<PromptEditPage />} />
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