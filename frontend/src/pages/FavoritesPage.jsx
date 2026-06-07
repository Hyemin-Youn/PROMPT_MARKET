import { useState, useEffect } from "react";
import { Heart, Star, Download, Trash2, Code2, Crown } from "lucide-react";

export const FavoritesPage = ({ onSelectPrompt }) => {
  const [items, setItems] = useState([]);
  const [removed, setRemoved] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLikedPrompts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/prompts/liked", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const result = await response.json();
          setItems(result.data || []);
        }
      } catch (error) {
        console.error("찜 목록 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLikedPrompts();
  }, []);

  const handleRemove = async (promptId) => {
    setRemoved(promptId);
    try {
      await fetch(`http://localhost:8080/api/prompts/${promptId}/likes`, {
        method: "POST",
        credentials: "include",
      });
      setTimeout(() => {
        setItems(prev => prev.filter(i => i.promptId !== promptId));
        setRemoved(null);
      }, 300);
    } catch (error) {
      console.error("찜 해제 실패:", error);
      setRemoved(null);
    }
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

          {loading && <p className="text-sm text-center py-4" style={{ color: "var(--muted-foreground)" }}>찜 목록을 불러오는 중입니다...</p>}

          {!loading && items.length === 0 ? (
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
                    <div key={item.promptId} className="rounded-xl overflow-hidden transition-all"
                         style={{ background: "var(--card)", border: "1px solid var(--border-sm)", opacity: removed === item.promptId ? 0 : 1, transform: removed === item.promptId ? "scale(0.96)" : "scale(1)", transition: "all 0.3s ease" }}>
                      <div className="h-24 flex items-center justify-center relative" style={{ background: "var(--muted)" }}>
                        <Code2 size={24} style={{ color: "var(--brand-violet-light)", opacity: 0.4 }} />
                        <button onClick={() => handleRemove(item.promptId)} className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                style={{ background: "var(--destructive-bg-subtle)" }} title="찜 해제">
                          <Trash2 size={12} style={{ color: "var(--destructive)" }} />
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-medium mb-1 leading-snug" style={{ color: "var(--foreground)" }}>{item.title}</p>
                        <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>{item.authorNickname}</p>
                        <button onClick={() => onSelectPrompt(item.promptId)} className="w-full py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ background: "var(--primary)" }}>
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