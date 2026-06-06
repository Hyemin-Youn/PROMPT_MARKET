import { Zap } from "lucide-react";

export const Footer = () => {
  return (
      <footer
          className="border-t mt-16"
          style={{ background: "#0b0b12", borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* 💡 sm-cols-3 오타를 sm:grid-cols-3으로 수정하여 가로 배치 완료 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {/* 브랜드 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--primary)" }}
                >
                  <Zap size={14} className="text-white" />
                </div>
                <span
                    className="font-semibold"
                    style={{ color: "var(--foreground)" }}
                >
                Prompt<span style={{ color: "var(--brand-violet-light)" }}>Mart</span>
              </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                개발자를 위한 AI 프롬프트 마켓.<br />
                검증된 프롬프트를 구매하고 판매하세요.
              </p>
            </div>

            {/* 서비스 */}
            <div>
              <p className="text-sm font-medium mb-3" style={{ color: "var(--foreground)" }}>
                서비스
              </p>
              <ul className="space-y-2">
                {["프롬프트 마켓", "프롬프트 등록", "내 구매 내역", "회원가입"].map((item) => (
                    <li key={item}>
                      <button
                          className="text-xs hover:opacity-80 transition-opacity"
                          style={{ color: "var(--muted-foreground)" }}
                      >
                        {item}
                      </button>
                    </li>
                ))}
              </ul>
            </div>

            {/* 지원 — 이제 서비스 오른쪽에 예쁘게 배치됩니다 */}
            <div>
              <p className="text-sm font-medium mb-3" style={{ color: "var(--foreground)" }}>
                지원
              </p>
              <ul className="space-y-2">
                {["이용약관", "개인정보 처리방침", "공지사항", "문의하기"].map((item) => (
                    <li key={item}>
                      <button
                          className="text-xs hover:opacity-80 transition-opacity"
                          style={{ color: "var(--muted-foreground)" }}
                      >
                        {item}
                      </button>
                    </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 하단 */}
          <div
              className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2"
              style={{ borderTop: "1px solid var(--border-xs)" }}
          >
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              © 2026 PromptMart. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              멋쟁이사자처럼 백엔드 과정 응용프로젝트 팀 1조원 · AI 프롬프트 마켓 플랫폼
            </p>
          </div>
        </div>
      </footer>
  );
}
