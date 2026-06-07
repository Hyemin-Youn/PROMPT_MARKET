import { useState, useEffect } from "react";
import { User, ShoppingBag, Heart, Settings, Copy, CheckCheck, ChevronRight, Download } from "lucide-react";
import { ProfilePage } from "./ProfilePage.jsx";
import { FavoritesPage } from "./FavoritesPage.jsx";
import { SettingsPage } from "./SettingsPage.jsx";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
    { icon: ShoppingBag, label: "구매 내역", key: "purchases" },
    { icon: User,        label: "프로필",    key: "profile" },
    { icon: Heart,       label: "찜 목록",   key: "favorites" },
    { icon: Settings,    label: "설정",      key: "settings" },
];

export const LibraryPage = ({ purchasedPrompts, onLogout, onSelectPrompt, userEmail, initialNav }) => {
    const [activeNav, setActiveNav] = useState(initialNav || "purchases");
    const [activePrompt, setActivePrompt] = useState(0);
    const [copied, setCopied] = useState(false);
    const [selectedExample, setSelectedExample] = useState(null);

    const navigate = useNavigate();

    // 🌟 백엔드에서 받아올 실제 구매한 프롬프트 목록 상태
    const [purchasedList, setPurchasedList] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPurchasedLibrary = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/purchases", {
                method: "GET",
                credentials: "include"
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                const data = jsonResponse.data || jsonResponse;
                setPurchasedList(Array.isArray(data) ? data : []);
            } else {
                console.error("구매 내역 로드 실패");
            }
        } catch (error) {
            console.error("라이브러리 통신 에러:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchasedLibrary();
    }, []);

    const currentPrompt = purchasedList[activePrompt] || null;

    const highlightVars = (text) => {
        if (!text) return "";
        return text.split(/(\[[A-Z_]+\])/g).map((part, i) =>
            /^\[[A-Z_]+\]$/.test(part)
                ? <span key={i} className="rounded px-0.5" style={{ background: "var(--gold-bg)", color: "var(--brand-gold)" }}>{part}</span>
                : <span key={i}>{part}</span>
        );
    };

    const handleCopy = () => {
        if (!currentPrompt || !currentPrompt.promptTemplate) return;
        navigator.clipboard.writeText(currentPrompt.promptTemplate);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    // '찜'한 프롬프트 상세 보기 메서드 (FavoritePage전용)
    const handleSelectPromptFromFavorites = (promptId) => {
        navigate(`/detail/${promptId}`);
    };

    return (
        <div className="min-h-screen flex" style={{ background: "var(--background)" }}>
            {/* 데스크톱 사이드바 */}
            <aside className="w-48 shrink-0 hidden md:flex flex-col gap-1 p-4 pt-8" style={{ background: "var(--sidebar)", borderRight: "1px solid var(--border-xs)" }}>
                <div className="flex items-center gap-2 px-2 py-3 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>
                        {userEmail ? userEmail[0].toUpperCase() : "U"}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{userEmail || "사용자"}</p>
                        {purchasedPrompts.length > 0 ? (
                            <span className="text-xs" style={{ color: "var(--brand-violet-light)" }}>유료회원</span>
                        ) : (
                            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>무료회원</span>
                        )}
                    </div>
                </div>
                {NAV_ITEMS.map(item => (
                    <button key={item.key} onClick={() => setActiveNav(item.key)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left"
                            style={activeNav === item.key ? { background: "var(--primary-bg-md)", color: "var(--brand-violet-light)" } : { color: "var(--muted-foreground)" }}>
                        <item.icon size={15} />{item.label}
                    </button>
                ))}
            </aside>

            {/* 모바일 하단 네비게이션 */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex" style={{ background: "var(--sidebar)", borderTop: "1px solid var(--border-sm)" }}>
                {NAV_ITEMS.map(item => (
                    <button key={item.key} onClick={() => setActiveNav(item.key)} className="flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-all"
                            style={{ color: activeNav === item.key ? "var(--brand-violet-light)" : "var(--muted-foreground)" }}>
                        <item.icon size={18} />{item.label}
                    </button>
                ))}
            </div>

            {/* 메인 콘텐츠 영역 */}
            <div className="flex-1 min-w-0 pb-20 md:pb-0">
                {activeNav === "purchases" && (
                    <div className="p-4 md:p-8 max-w-4xl">
                        <h1 className="mb-6 font-semibold" style={{ color: "var(--foreground)", fontSize: "1.1rem" }}>구매 내역</h1>

                        {loading && <p className="text-sm text-center py-4" style={{ color: "var(--muted-foreground)" }}>구매 내역을 불러오는 중입니다...</p>}

                        {!loading && purchasedList.length === 0 ? (
                            <div className="text-center py-12 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>구매한 프롬프트 내역이 존재하지 않습니다.</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 mb-8">
                                    {purchasedList.map((item, i) => (
                                        <button key={item.purchaseId || i} onClick={() => { setActivePrompt(i); setSelectedExample(null); }} className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all"
                                                style={{ background: "var(--card)", border: `1px solid ${activePrompt === i ? "var(--border-2xl)" : "var(--border-sm)"}`, boxShadow: activePrompt === i ? "0 0 15px var(--primary-bg-md)" : "none" }}>
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--secondary)" }}>
                                                <Download size={16} style={{ color: "var(--brand-violet-light)" }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{item.promptTitle}</p>
                                                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                                    {item.paidPrice ? `${item.paidPrice.toLocaleString()}원` : "구매완료"} · {item.purchasedAt ? item.purchasedAt.split('T')[0] : "이용 중"}
                                                </p>
                                            </div>
                                            <ChevronRight size={14} style={{ color: "var(--muted-foreground)" }} />
                                        </button>
                                    ))}
                                </div>

                                {currentPrompt && (
                                    <>
                                        <div className="rounded-xl overflow-hidden mb-4" style={{ border: "1px solid var(--border-md)" }}>
                                            <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border-xs)" }}>
                                                <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Prompt template</span>
                                                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-all"
                                                        style={{ background: copied ? "var(--success-bg-subtle)" : "var(--muted)", color: copied ? "var(--success)" : "var(--muted-foreground)", border: "1px solid var(--border-sm)" }}>
                                                    {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
                                                    {copied ? "복사됨" : "복사"}
                                                </button>
                                            </div>
                                            <div className="p-5" style={{ background: "var(--sidebar)" }}>
                                                <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed" style={{ color: "var(--secondary-foreground)" }}>
                                                    {highlightVars(currentPrompt.promptTemplate || "// 템플릿 내용이 없습니다.")}
                                                </pre>
                                            </div>
                                            <div className="px-5 py-4" style={{ background: "var(--card)", borderTop: "1px solid var(--border-xs)" }}>
                                                <p className="text-xs mb-2 font-medium" style={{ color: "var(--muted-foreground)" }}>Generation type</p>
                                                <div className="flex gap-2">
                                                    {(currentPrompt.generationTypes || ["Text to text", "Chat mode"]).map((t, i) => (
                                                        <button key={t} className="px-3 py-1 rounded-md text-xs transition-all" style={{ background: i === 0 ? "var(--primary)" : "var(--muted)", color: i === 0 ? "#fff" : "var(--muted-foreground)" }}>
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-xl overflow-hidden mb-4" style={{ border: "1px solid var(--border-sm)" }}>
                                            <div className="px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border-xs)" }}>
                                                <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Example prompts</span>
                                            </div>
                                            <div style={{ background: "var(--sidebar)" }}>
                                                {!currentPrompt.examplePrompts || currentPrompt.examplePrompts.length === 0 ? (
                                                    <p className="text-xs p-4 text-gray-500">등록된 참조 예시 프롬프트가 없습니다.</p>
                                                ) : (
                                                    currentPrompt.examplePrompts.map((ex, i) => (
                                                        <button key={i} onClick={() => setSelectedExample(selectedExample === i ? null : i)} className="w-full text-left p-4 transition-all hover:bg-white/5"
                                                                style={{ background: selectedExample === i ? "var(--primary-bg-xs)" : undefined, borderBottom: i < currentPrompt.examplePrompts.length - 1 ? "1px solid var(--border-xs)" : undefined }}>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm" style={{ color: "var(--secondary-foreground)" }}>{ex.label}</span>
                                                                <ChevronRight size={13} style={{ color: "var(--muted-foreground)", transform: selectedExample === i ? "rotate(90deg)" : undefined, transition: "transform 0.2s" }} />
                                                            </div>
                                                            {selectedExample === i && ex.vars && (
                                                                <div className="mt-3 space-y-1">
                                                                    {Object.entries(ex.vars).map(([k, v]) => (
                                                                        <div key={k} className="flex items-start gap-2 text-xs font-mono">
                                                                            <span style={{ color: "var(--brand-gold)" }}>[{k}]</span>
                                                                            <span style={{ color: "var(--muted-foreground)" }}>→</span>
                                                                            <span style={{ color: "var(--accent)" }}>{String(v)}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-sm)" }}>
                                            <div className="px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border-xs)" }}>
                                                <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Prompt instructions</span>
                                            </div>
                                            <div className="p-5 space-y-2" style={{ background: "var(--sidebar)" }}>
                                                <p className="text-xs font-medium mb-3" style={{ color: "var(--brand-violet-light)" }}>Tips</p>
                                                {!currentPrompt.tips || currentPrompt.tips.length === 0 ? (
                                                    <p className="text-xs text-gray-500">안내사항 지침이 비어있습니다.</p>
                                                ) : (
                                                    currentPrompt.tips.map((tip, i) => (
                                                        <div key={i} className="flex items-start gap-2 text-sm">
                                                            <span style={{ color: "var(--primary)" }}>•</span>
                                                            <span style={{ color: "var(--secondary-foreground)" }}>{tip}</span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}

                {activeNav === "profile"   && <ProfilePage isPremium={purchasedPrompts.length > 0} onUpgradePremium={() => {}} userEmail={userEmail} />}
                {activeNav === "favorites" && (
                    <FavoritesPage onSelectPrompt={handleSelectPromptFromFavorites} />
                )}
                {activeNav === "settings"  && <SettingsPage isPremium={purchasedPrompts.length > 0} onLogout={onLogout} onUpgradePremium={() => {}} userEmail={userEmail} />}
            </div>
        </div>
    );
};