import { useState, useEffect } from "react";
import { User, Lock, Bell, ShoppingBag, Shield, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { getMe, updateProfile } from "../api/users.js";

export function SettingsPage({ isPremium, onLogout, onUpgradePremium, userEmail }) {
  const [activeSection, setActiveSection] = useState("account");
  const [showPw, setShowPw] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [accountForm, setAccountForm] = useState({
    nickname: "",
    email: userEmail || "",
  });
  const [notifications, setNotifications] = useState({ newComment: true, newFollower: true, purchase: true, promo: false, weekly: true });

  const handleSave = async () => {
    setSaveError("");
    try {
      await updateProfile(accountForm.nickname);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError(err.response?.data?.message || "저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const NAV = [
    { key: "account",      label: "계정 정보", icon: User       },
    { key: "security",     label: "보안",      icon: Lock       },
    { key: "notification", label: "알림 설정", icon: Bell       },
    { key: "subscription", label: "결제 관리", icon: ShoppingBag },
  ];

  const inputStyle = (disabled = false) => ({
    background: disabled ? "var(--sidebar)" : "var(--muted)",
    border:     "1px solid var(--border)",
    color:      disabled ? "var(--muted-foreground)" : "var(--foreground)",
  });

  useEffect(() => {
    getMe()
      .then(res => {
        const d = res.data?.data || {};
        setAccountForm({
          nickname: d.nickname || "",
          email:    d.email    || userEmail || "",
        });
      })
      .catch(() => {});
  }, []);

  return (
      <div className="min-h-screen pb-16" style={{ background: "var(--background)" }}>
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <h1 className="font-semibold mb-6" style={{ color: "var(--foreground)", fontSize: "1.1rem" }}>설정</h1>
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="sm:w-44 shrink-0">
              <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                {NAV.map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setActiveSection(key)} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left transition-all"
                            style={{ background: activeSection === key ? "var(--primary-bg)" : undefined, color: activeSection === key ? "var(--brand-violet-light)" : "var(--muted-foreground)", borderLeft: activeSection === key ? "2px solid var(--primary)" : "2px solid transparent" }}>
                      <Icon size={14} />{label}
                    </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-4">
              {activeSection === "account" && (
                  <>
                    <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                      <h2 className="text-sm font-medium mb-4" style={{ color: "var(--foreground)" }}>기본 정보</h2>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ background: "var(--gradient-profile)" }}>
                          {userEmail ? userEmail[0].toUpperCase() : "U"}
                        </div>
                        <button className="text-sm px-3 py-1.5 rounded-lg transition-all hover:bg-white/5" style={{ color: "var(--brand-violet-light)", border: "1px solid var(--border-lg)" }}>사진 변경</button>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: "닉네임", key: "nickname", placeholder: "닉네임",           disabled: false },
                          { label: "이메일", key: "email",    placeholder: "이메일",           disabled: true  },
                        ].map(({ label, key, placeholder, disabled }) => (
                            <div key={key}>
                              <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{label}</label>
                              <input value={accountForm[key] || ""} onChange={e => setAccountForm(f => ({ ...f, [key]: e.target.value }))}
                                     placeholder={placeholder} disabled={disabled} className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all" style={inputStyle(disabled)} />
                              {disabled && <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>이메일은 변경할 수 없습니다</p>}
                            </div>
                        ))}
                      </div>
                    </div>
                    {saveError && (
                      <p className="text-xs mb-2" style={{ color: "var(--destructive)" }}>{saveError}</p>
                    )}
                    <button onClick={handleSave} className="w-full py-2.5 rounded-lg font-medium text-white transition-all"
                            style={{ background: saved ? "var(--success)" : "var(--primary)" }}>
                      {saved ? "✓ 저장 완료" : "변경사항 저장"}
                    </button>
                    <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--destructive-border)" }}>
                      <h2 className="text-sm font-medium mb-1 flex items-center gap-2" style={{ color: "var(--destructive)" }}>
                        <AlertTriangle size={14} /> 계정 삭제
                      </h2>
                      <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.</p>
                      {!showDeleteConfirm ? (
                          <button onClick={() => setShowDeleteConfirm(true)} className="text-sm px-3 py-1.5 rounded-lg transition-all hover:bg-red-950/30" style={{ color: "var(--destructive)", border: "1px solid var(--destructive-border-sm)" }}>계정 삭제</button>
                      ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>정말 삭제하시겠습니까?</span>
                            <button className="text-sm px-3 py-1 rounded-lg" style={{ background: "var(--destructive)", color: "#fff" }}>삭제</button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="text-sm px-3 py-1 rounded-lg" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>취소</button>
                          </div>
                      )}
                    </div>
                  </>
              )}

              {activeSection === "security" && (
                  <div className="space-y-4">
                    <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                      <h2 className="text-sm font-medium mb-4" style={{ color: "var(--foreground)" }}>비밀번호 변경</h2>
                      <div className="space-y-3">
                        {["현재 비밀번호", "새 비밀번호", "새 비밀번호 확인"].map(label => (
                            <div key={label}>
                              <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{label}</label>
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                                <input type={showPw ? "text" : "password"} placeholder={label} className="flex-1 bg-transparent text-sm outline-none" style={{ color: "var(--foreground)" }} />
                                <button onClick={() => setShowPw(!showPw)}>
                                  {showPw ? <EyeOff size={14} style={{ color: "var(--muted-foreground)" }} /> : <Eye size={14} style={{ color: "var(--muted-foreground)" }} />}
                                </button>
                              </div>
                            </div>
                        ))}
                      </div>
                      <button className="mt-4 w-full py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--primary)" }}>비밀번호 변경</button>
                    </div>
                    <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                      <h2 className="text-sm font-medium mb-3" style={{ color: "var(--foreground)" }}>로그인 내역</h2>
                      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>로그인 내역 조회 기능은 준비 중입니다.</p>
                    </div>
                    <button onClick={onLogout} className="w-full py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-white/5" style={{ color: "var(--destructive)", border: "1px solid var(--destructive-border-sm)" }}>로그아웃</button>
                  </div>
              )}

              {activeSection === "notification" && (
                  <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                    <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border-xs)" }}>
                      <h2 className="text-sm font-medium" style={{ color: "var(--foreground)" }}>알림 설정</h2>
                    </div>
                    {[
                      { key: "newComment",  label: "새 댓글 알림",  desc: "내 프롬프트에 댓글이 달리면 알림" },
                      { key: "newFollower", label: "새 팔로워 알림", desc: "누군가 나를 팔로우하면 알림" },
                      { key: "purchase",    label: "구매 알림",      desc: "프롬프트 구매/판매 시 알림" },
                      { key: "promo",       label: "프로모션 알림",  desc: "할인 및 이벤트 정보 (선택)" },
                      { key: "weekly",      label: "주간 리포트",    desc: "매주 월요일 활동 요약 메일" },
                    ].map(({ key, label, desc }, i, arr) => (
                        <div key={key} className="flex items-center justify-between px-5 py-4" style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border-xs)" : undefined }}>
                          <div>
                            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{label}</p>
                            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{desc}</p>
                          </div>
                          <button onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                                  className="relative rounded-full transition-all shrink-0"
                                  style={{ background: notifications[key] ? "var(--primary)" : "var(--muted)", width: 36, height: 20 }}>
                            <div className="absolute top-0.5 rounded-full transition-all" style={{ width: 16, height: 16, background: "#fff", left: notifications[key] ? 18 : 2 }} />
                          </button>
                        </div>
                    ))}
                  </div>
              )}

              {activeSection === "subscription" && (
                  <div className="space-y-4">
                    <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: isPremium ? "var(--primary-bg-md)" : "var(--muted)" }}>
                          <ShoppingBag size={18} style={{ color: isPremium ? "var(--brand-violet-light)" : "var(--muted-foreground)" }} />
                        </div>
                        <div>
                          <h2 className="font-medium" style={{ color: "var(--foreground)" }}>{isPremium ? "유료회원" : "무료회원"}</h2>
                          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{isPremium ? "프롬프트 구매 이력이 있습니다" : "아직 구매한 프롬프트가 없습니다"}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: "프롬프트 마켓 열람",      free: true,  premium: true },
                          { label: "샘플 결과물 확인",         free: true,  premium: true },
                          { label: "사용 가이드 열람",         free: true,  premium: true },
                          { label: "프롬프트 전체 내용 열람",  free: false, premium: true },
                        ].map(({ label, free, premium }) => (
                            <div key={label} className="flex items-center gap-3 text-sm">
                              <span className="flex-1" style={{ color: "var(--secondary-foreground)" }}>{label}</span>
                              <span style={{ color: free ? "var(--success)" : "var(--muted-foreground)" }}>{free ? "✓" : "✗"}</span>
                              <span style={{ color: premium ? "var(--success)" : "var(--muted-foreground)" }}>{premium ? "✓" : "✗"}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                      <h2 className="text-sm font-medium mb-3" style={{ color: "var(--foreground)" }}>결제 수단</h2>
                      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>결제 수단 조회 기능은 준비 중입니다.</p>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}