import { useState } from "react";
import { Star, Download, TrendingUp, Code2, ArrowRight, ShoppingCart, Search } from "lucide-react";

const CATEGORIES = ["전체", "백엔드", "프론트엔드", "DevOps", "코드 리뷰", "마케팅/영업", "데이터", "보안"];

const PROMPTS = [
  { id: 1, title: "RESTful API 설계 프롬프트 템플릿",  category: "백엔드",     price: 15000, rating: 4.9, reviews: 128, downloads: 234, seller: "김개발",   tags: ["GPT-4", "Claude 3"] },
  { id: 2, title: "React 컴포넌트 리팩토링 가이드",    category: "프론트엔드", price: 12000, rating: 4.7, reviews: 89,  downloads: 156, seller: "박프론트",  tags: ["GPT-4"] },
  { id: 3, title: "Docker + K8s 인프라 구성 프롬프트", category: "DevOps",     price: 18000, rating: 4.8, reviews: 67,  downloads: 198, seller: "이데브옵스", tags: ["Claude 3", "GPT-4"] },
  { id: 4, title: "코드 리뷰 자동화 프롬프트 세트",   category: "코드 리뷰",  price: 9000,  rating: 4.6, reviews: 201, downloads: 312, seller: "최리뷰",    tags: ["GPT-3.5"] },
  { id: 5, title: "SQL 쿼리 최적화 프롬프트",          category: "백엔드",     price: 11000, rating: 4.5, reviews: 54,  downloads: 87,  seller: "정디비",    tags: ["GPT-4"] },
  { id: 6, title: "보안 취약점 분석 프롬프트",         category: "보안",       price: 20000, rating: 4.9, reviews: 43,  downloads: 120, seller: "한시큐",    tags: ["Claude 3"] },
];

export const HomePage = ({ onSelectPrompt, purchasedPrompts }) => {
  const [activeCategory, setActiveCategory] = useState("전체");

  const filtered = activeCategory === "전체"
    ? PROMPTS
    : PROMPTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Hero */}
      <section className="relative px-4 pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 -left-10 w-[600px] h-[300px] rounded-full opacity-45" style={{ background: "var(--gradient-hero)" }} />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-2xl">
            <h1 className="mb-3" style={{ fontSize: "2.25rem", fontWeight: 700, color: "#1e3a5f", lineHeight: 1.2 }}>
              개발자를 위한<br />
              <span style={{ color: "var(--brand-violet-light)" }}>AI 프롬프트 마켓</span>
            </h1>
            <p className="mb-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
              1,200여 개의 검증된 개발자용 AI 프롬프트<br />
              GPT &amp; Claude Gemini 등 모든 AI 모델 지원
            </p>
            <div className="flex items-center gap-2 p-3 rounded-xl max-w-xl" style={{ background: "var(--card)", border: "1px solid var(--border-lg)" }}>
              <Search size={16} style={{ color: "#ffffff" }} />
              <input className="flex-1 bg-transparent outline-none text-sm" style={{ color: "#ffffff" }} placeholder="예) API 설계, 코드 리뷰, Docker..." />
              <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-white" style={{ background: "var(--primary)" }}>검색</button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured 배너 */}
      <section className="px-4 mb-10">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--gradient-card)", border: "1px solid var(--border-md)" }}>
            <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} style={{ color: "var(--brand-violet-light)" }} />
                  <span className="text-xs font-medium" style={{ color: "var(--brand-violet-light)" }}>이번 주 베스트</span>
                </div>
                <h2 className="mb-1" style={{ color: "var(--foreground)", fontWeight: 600 }}>실전에서 검증된 프롬프트</h2>
                <p className="text-sm" style={{ color: "#ffffff" }}>현직 개발자들이 사용하는 고품질 AI 프롬프트 — 원하는 것만 골라서 구매하세요</p>
              </div>
              <button onClick={() => onSelectPrompt(1)} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ background: "var(--primary)" }}>
                프롬프트 둘러보기 <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 탭 */}
      <section className="px-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className="shrink-0 px-4 py-1.5 rounded-full text-sm transition-all"
                style={activeCategory === cat ? { background: "var(--primary)", color: "#fff" } : { background: "var(--muted)", color: "#ffffff", border: "1px solid var(--border-sm)" }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 프롬프트 카드 목록 */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: "#1e3a5f" }}>인기 프롬프트</h2>
            <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{filtered.length}개</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(prompt => {
              const isPurchased = purchasedPrompts.includes(prompt.id);
              return (
                <button key={prompt.id} onClick={() => onSelectPrompt(prompt.id)} className="text-left rounded-xl overflow-hidden transition-all hover:scale-[1.01]"
                  style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                  <div className="h-32 flex items-center justify-center relative" style={{ background: "var(--secondary)" }}>
                    <div className="absolute inset-0 opacity-30" style={{ background: "repeating-linear-gradient(45deg, transparent, transparent 10px, var(--primary-bg-xs) 10px, var(--primary-bg-xs) 20px)" }} />
                    <div className="relative flex flex-col items-center gap-1 opacity-60">
                      <Code2 size={28} style={{ color: "var(--brand-violet-light)" }} />
                      <span className="text-xs font-mono" style={{ color: "var(--brand-violet-light)" }}>{prompt.category}</span>
                    </div>
                    {isPurchased ? (
                      <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: "var(--success-bg-subtle)", color: "var(--success)", border: "1px solid var(--success-border)" }}>✓ 구매완료</span>
                    ) : (
                      <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: "var(--primary-bg-md)", color: "var(--brand-violet-light)", border: "1px solid var(--border-md)" }}>
                        <ShoppingCart size={10} /> 구매 가능
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium leading-snug mb-2" style={{ color: "var(--foreground)" }}>{prompt.title}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      {prompt.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded text-xs" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                        <span className="flex items-center gap-1"><Star size={11} style={{ color: "var(--brand-gold)" }} fill="var(--brand-gold)" />{prompt.rating}</span>
                        <span className="flex items-center gap-1"><Download size={11} /> {prompt.downloads}</span>
                      </div>
                      <span className="font-semibold text-sm" style={{ color: isPurchased ? "var(--success)" : "var(--brand-violet-light)" }}>
                        {isPurchased ? "보기" : `${prompt.price.toLocaleString()}원`}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
