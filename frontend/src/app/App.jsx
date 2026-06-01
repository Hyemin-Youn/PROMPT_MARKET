import { useState } from "react";
import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { HomePage } from "./components/HomePage.jsx";
import { PromptDetailPage } from "./components/PromptDetailPage.jsx";
import { LibraryPage } from "./components/LibraryPage.jsx";
import { AuthModal } from "./components/AuthModal.jsx";


const App = () => {
  const [page, setPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authModal, setAuthModal] = useState(null);

  // 구독 방식 X → 구매한 프롬프트 ID 목록으로 관리
  const [purchasedPrompts, setPurchasedPrompts] = useState([]);
  const [selectedPromptId, setSelectedPromptId] = useState(null);

  const handleNavigate = (p) => {
    if (
        (p === "library" || p === "profile" || p === "favorites" || p === "settings") &&
        !isLoggedIn
    ) {
      setAuthModal("login");
      return;
    }
    setPage(p);
  };

  const handleSelectPrompt = (id) => {
    setSelectedPromptId(id);
    setPage("detail");
  };

  // 단건 구매 처리
  const handlePurchase = (promptId) => {
    if (!isLoggedIn) {
      setAuthModal("login");
      return;
    }
    setPurchasedPrompts((prev) =>
        prev.includes(promptId) ? prev : [...prev, promptId]
    );
    setPage("library");
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setAuthModal(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPurchasedPrompts([]);
    setPage("home");
  };

  const showFooter = page === "home";

  return (
      <div
          className="min-h-screen flex flex-col"
          style={{
            background: "var(--background)",
            fontFamily: "'Inter', 'Pretendard', sans-serif",
          }}
      >
        <Navbar
            currentPage={page}
            onNavigate={handleNavigate}
            isLoggedIn={isLoggedIn}
            purchaseCount={purchasedPrompts.length}
            onOpenLogin={() => setAuthModal("login")}
            onOpenSignup={() => setAuthModal("signup")}
            onLogout={handleLogout}
        />

        <main className="flex-1">
          {page === "home" && (
              <HomePage
                  onSelectPrompt={handleSelectPrompt}
                  purchasedPrompts={purchasedPrompts}
              />
          )}

          {page === "detail" && (
              <PromptDetailPage
                  promptId={selectedPromptId}
                  onBack={() => setPage("home")}
                  onPurchase={handlePurchase}
                  isLoggedIn={isLoggedIn}
                  isPurchased={
                      selectedPromptId !== null &&
                      purchasedPrompts.includes(selectedPromptId)
                  }
              />
          )}

          {(page === "library" || page === "profile" || page === "favorites" || page === "settings") &&
              isLoggedIn && (
                  <LibraryPage
                      purchasedPrompts={purchasedPrompts}
                      onLogout={handleLogout}
                      onSelectPrompt={handleSelectPrompt}
                  />
              )}
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
}

export default App;
