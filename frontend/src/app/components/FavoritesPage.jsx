import { useState } from "react";
import { Heart, Star, Download, Trash2, Code2, Crown } from "lucide-react";

const FAVORITES = [
  { id: 1, title: "RESTful API 설계 프롬프트 템플릿",  category: "백엔드",    price: 15000, rating: 4.9, reviews: 128, downloads: 234, seller: "김개발",   isPremium: true,  tags: ["GPT-4", "Claude 3"] },
  { id: 2, title: "React 컴포넌트 리팩토링 가이드",    category: "프론트엔드", price: 12000, rating: 4.7, reviews: 89,  downloads: 156, seller: "박프론트",  isPremium: false, tags: ["GPT-4"] },
  { id: 3, title: "Docker + K8s 인프라 구성 프롬프트", category: "DevOps",    price: 18000, rating: 4.8, reviews: 67,  downloads: 198, seller: "이데브옵스", isPremium: true,  tags: ["Claude 3"] },
  { id: 4, title: "보안 취약점 분석 프롬프트",         category: "보안",      price: 20000, rating: 4.9, reviews: 43,  downloads: 120, seller: "한시큐",    isPremium: true,  tags: ["Claude 3"] },
];

export const FavoritesPage = ({ onSelectPrompt }) => {
  const [items, setItems] = useState(FAVORITES);
  const [removed, setRemoved] = useState(null);

  const handleRemove = (id) => {
    setRemoved(id);
    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== id));
      setRemoved(null);
    }, 300);
  };

  return (
    <div className="min-h-screen pb-16" style={{ background: "var(--background)" }}>
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--destructive-bg-subtle)" }}>
            <Heart size={16} fill="var(--destructive)" style={{ color: "var(--destructive)" }} />
          </div>
          <div>
            <h1 className="font-semibold" style={{ color: "var(--foreground)", fontSize: "1.1rem" }}>찜 목록</h1>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>저장한 프롬프트 {items.length}개</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--card)" }}>
              <Heart size={28} style={{ color: "var(--muted-foreground)" }} />
            </div>
            <p className="font-medium" style={{ color: "var(--foreground)" }}>찜한 프롬프트가 없습니다</p>
            <p className="text-sm text-center" style={{ color: "var(--muted-foreground)" }}>마음에 드는 프롬프트에 ♡를 눌러 저장하세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map(item => (
              <div key={item.id} className="rounded-xl overflow-hidden transition-all"
                style={{ background: "var(--card)", border: "1px solid var(--border-sm)", opacity: removed === item.id ? 0 : 1, transform: removed === item.id ? "scale(0.96)" : "scale(1)", transition: "all 0.3s ease" }}>
                <div className="h-24 flex items-center justify-center relative" style={{ background: "var(--muted)" }}>
                  <Code2 size={24} style={{ color: "var(--brand-violet-light)", opacity: 0.4 }} />
                  {item.isPremium && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: "var(--gold-bg)", color: "var(--brand-gold)", border: "1px solid var(--gold-border-sm)" }}>
                      <Crown size={9} /> 프리미엄
                    </span>
                  )}
                  <button onClick={() => handleRemove(item.id)} className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: "var(--destructive-bg-subtle)" }} title="찜 해제">
                    <Trash2 size={12} style={{ color: "var(--destructive)" }} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium mb-1 leading-snug" style={{ color: "var(--foreground)" }}>{item.title}</p>
                  <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>{item.seller} · {item.category}</p>
                  <div className="flex items-center gap-2 mb-3">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-xs" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                      <span className="flex items-center gap-1"><Star size={11} fill="var(--brand-gold)" style={{ color: "var(--brand-gold)" }} /> {item.rating}</span>
                      <span className="flex items-center gap-1"><Download size={11} /> {item.downloads}</span>
                    </div>
                    <span className="font-semibold text-sm" style={{ color: "var(--brand-violet-light)" }}>{item.price.toLocaleString()}원</span>
                  </div>
                  <button onClick={() => onSelectPrompt(item.id)} className="w-full py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ background: "var(--primary)" }}>
                    자세히 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
