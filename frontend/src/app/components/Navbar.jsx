import { useState } from "react";
import { Search, Bell, ShoppingBag, Menu, X, Zap, LogIn } from "lucide-react";

export const Navbar = ({ currentPage, onNavigate, isLoggedIn, purchaseCount, onOpenLogin, onOpenSignup, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinkStyle = (page) => ({
    color: currentPage === page ? "var(--brand-violet-light)" : "var(--muted-foreground)",
  });

  return (
    <nav className="sticky top-0 z-50 border-b" style={{ background: "var(--sidebar)", borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
            Prompt<span style={{ color: "var(--brand-violet-light)" }}>Mart</span>
          </span>
        </button>

        <div className="flex-1 max-w-md hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          <Search size={14} style={{ color: "var(--muted-foreground)" }} />
          <input placeholder="프롬프트 검색..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: "var(--foreground)" }} />
        </div>

        <div className="hidden md:flex items-center gap-5 text-sm">
          <button onClick={() => onNavigate("home")} className="transition-colors" style={navLinkStyle("home")}>마켓</button>
          {isLoggedIn && (
            <button onClick={() => onNavigate("library")} className="transition-colors" style={navLinkStyle("library")}>구매 내역</button>
          )}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <>
              <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Bell size={16} style={{ color: "var(--muted-foreground)" }} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "var(--primary)" }} />
              </button>
              <button onClick={() => onNavigate("library")} className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                <ShoppingBag size={16} style={{ color: "var(--muted-foreground)" }} />
                {purchaseCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center text-white" style={{ background: "var(--primary)" }}>
                    {purchaseCount}
                  </span>
                )}
              </button>
            </>
          )}

          {isLoggedIn ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>윤</div>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-11 w-44 rounded-xl overflow-hidden shadow-xl z-50" style={{ background: "var(--card)", border: "1px solid var(--border-md)" }}>
                  {[
                    { label: "구매 내역",  action: () => { onNavigate("library");   setDropdownOpen(false); } },
                    { label: "프로필",     action: () => { onNavigate("profile");   setDropdownOpen(false); } },
                    { label: "찜 목록",    action: () => { onNavigate("favorites"); setDropdownOpen(false); } },
                    { label: "설정",       action: () => { onNavigate("settings");  setDropdownOpen(false); } },
                  ].map(({ label, action }) => (
                    <button key={label} onClick={action} className="w-full text-left px-4 py-2.5 text-sm transition-all hover:bg-white/5" style={{ color: "var(--foreground)" }}>{label}</button>
                  ))}
                  <div style={{ borderTop: "1px solid var(--border-sm)" }}>
                    <button onClick={() => { onLogout(); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm transition-all hover:bg-white/5" style={{ color: "var(--destructive)" }}>로그아웃</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={onOpenLogin} className="hidden sm:flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: "var(--foreground)" }}>
                <LogIn size={14} /> 로그인
              </button>
              <button onClick={onOpenSignup} className="text-sm px-3 py-1.5 rounded-lg font-medium text-white transition-all hover:opacity-90" style={{ background: "var(--primary)" }}>회원가입</button>
            </div>
          )}

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={18} style={{ color: "var(--foreground)" }} /> : <Menu size={18} style={{ color: "var(--foreground)" }} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3" style={{ background: "var(--sidebar)", borderTop: "1px solid var(--border-sm)" }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg mt-3" style={{ background: "var(--muted)" }}>
            <Search size={14} style={{ color: "var(--muted-foreground)" }} />
            <input placeholder="프롬프트 검색..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: "var(--foreground)" }} />
          </div>
          {["home", "library"].map(p => (
            <button key={p} onClick={() => { onNavigate(p); setMenuOpen(false); }} className="text-left py-2 text-sm" style={{ color: "var(--foreground)" }}>
              {p === "home" ? "프롬프트 마켓" : "구매 내역"}
            </button>
          ))}
          {!isLoggedIn && (
            <div className="flex gap-2 pt-1">
              <button onClick={() => { onOpenLogin(); setMenuOpen(false); }} className="flex-1 py-2 rounded-lg text-sm text-center" style={{ border: "1px solid var(--border-lg)", color: "var(--foreground)" }}>로그인</button>
              <button onClick={() => { onOpenSignup(); setMenuOpen(false); }} className="flex-1 py-2 rounded-lg text-sm text-center text-white" style={{ background: "var(--primary)" }}>회원가입</button>
            </div>
          )}
        </div>
      )}

      {dropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />}
    </nav>
  );
}
