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

    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
    const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail") || "");
    const [authModal, setAuthModal] = useState(null);
    const [purchasedPrompts, setPurchasedPrompts] = useState([]);

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
        localStorage.setItem("token", token || "mock-jwt-token");
        localStorage.setItem("userEmail", email || "");
        setIsLoggedIn(true);
        setUserEmail(email || "");
        setAuthModal(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("purchasedPrompts");
        localStorage.removeItem("userEmail");
        setIsLoggedIn(false);
        setUserEmail("");
        setPurchasedPrompts([]);
        navigate("/");
    };

    const showFooter = location.pathname === "/";

    const libraryProps = {
        purchasedPrompts,
        onLogout: handleLogout,
        onSelectPrompt: (id) => navigate(`/detail/${id}`),
        userEmail,
    };

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
