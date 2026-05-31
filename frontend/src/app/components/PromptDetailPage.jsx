import { useState } from "react";
import { Star, Download, Heart, Share2, Lock, Code2, ChevronLeft, ShoppingCart, CheckCircle2 } from "lucide-react";

const SAMPLE_CODE = `GET /api/v1/users/{id}\nResponse: { "id": 1, "name": "홍길동", "email": "user@example.com" }`;

const GUIDE_STEPS = [
  "AI에게 구현하고자 하는 기능 설명",
  "프롬프트 템플릿에 세부 요구사항 입력",
  "생성된 API 스펙 검토 및 수정",
  "실제 코드에 적용",
];

const REVIEWS = [
  { name: "박백엔드", rating: 5, date: "2025-05-12", text: "실무에서 바로 써먹을 수 있는 프롬프트입니다. API 설계 시간이 확실히 줄었어요." },
  { name: "김스프링", rating: 5, date: "2025-05-08", text: "구성이 체계적이고 결과물 품질이 높습니다. 다음 버전도 기대됩니다." },
  { name: "이리액트", rating: 4, date: "2025-04-30", text: "구매하고 바로 적용했는데 정말 유용해요. 팀 전체에 공유했습니다." },
];

export function PromptDetailPage({ promptId, onBack, onPurchase, isLoggedIn, isPurchased }) {
  const [activeTab, setActiveTab] = useState("샘플");
  const [liked, setLiked] = useState(false);
  const [activeRating, setActiveRating] = useState("전체");

  const ratings = ["전체", "5점", "4점", "3점", "2점", "1점"];
  const PRICE = 15000;

  return (
      <div className="min-h-screen pb-16" style={{ background: "var(--background)" }}>
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <button onClick={onBack} className="flex items-center gap-1 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "var(--muted-foreground)" }}>
            <ChevronLeft size={16} /> 마켓으로 돌아가기
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* 왼쪽 콘텐츠 */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-2 gap-2 mb-6 rounded-xl overflow-hidden" style={{ height: 240 }}>
                <div className="flex items-center justify-center col-span-1 row-span-2" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <Code2 size={40} style={{ color: "var(--brand-violet-light)" }} />
                    <span className="font-mono text-xs" style={{ color: "var(--brand-violet-light)" }}>RESTful API</span>
                  </div>
                </div>
                <div className="flex items-center justify-center" style={{ background: "var(--muted)", border: "1px solid var(--border-xs)" }}>
                  <div className="opacity-40 font-mono text-xs" style={{ color: "var(--accent)" }}>{`{ json }`}</div>
                </div>
                <div className="flex items-center justify-center" style={{ background: "var(--secondary)", border: "1px solid var(--border-xs)" }}>
                  <div className="opacity-40 font-mono text-xs" style={{ color: "var(--primary)" }}>{`$ curl -X POST`}</div>
                </div>
              </div>

              <div className="flex gap-1 mb-6 p-1 rounded-lg" style={{ background: "var(--card)" }}>
                {["샘플", "사용 가이드", "리뷰"].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className="flex-1 py-2 rounded-md text-sm transition-all"
                            style={activeTab === tab ? { background: "var(--primary)", color: "#fff" } : { color: "var(--muted-foreground)" }}>
                      {tab}
                    </button>
                ))}
              </div>

              {activeTab === "샘플" && (
                  <div className="space-y-4">
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-sm)" }}>
                      <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border-xs)" }}>
                        <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>샘플 결과물</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-bg-subtle)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>무료 공개</span>
                      </div>
                      <div className="p-4" style={{ background: "var(--sidebar)" }}>
                        <pre className="text-sm font-mono overflow-x-auto" style={{ color: "var(--accent)" }}>{SAMPLE_CODE}</pre>
                      </div>
                      <div className="px-4 py-3" style={{ background: "var(--card)" }}>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>* 실제 프롬프트 전체 내용은 구매 후 확인할 수 있습니다.</p>
                      </div>
                    </div>

                    <div className="rounded-xl overflow-hidden relative" style={{ border: "1px solid var(--border-md)" }}>
                      <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border-xs)" }}>
                    <span className="flex items-center gap-2 text-sm font-medium" style={{ color: isPurchased ? "var(--success)" : "var(--brand-violet-light)" }}>
                      {isPurchased ? <CheckCircle2 size={14} /> : <Lock size={14} />}
                      {isPurchased ? "구매 완료 — 전체 프롬프트" : "구매 후 공개"}
                    </span>
                      </div>
                      <div className={`p-4 ${!isPurchased ? "blur-sm select-none" : ""}`} style={{ background: "var(--sidebar)" }}>
                    <pre className="text-sm font-mono" style={{ color: "var(--brand-violet-light)" }}>
{`당신은 숙련된 백엔드 아키텍트입니다.
아래 요구사항을 바탕으로 RESTful API를 설계하세요
- 서비스: {{service_name}}
- 주요 엔티티: {{entities}}
- 인증 방식: {{auth_type}}

[출력 형식]
1. 엔드포인트 목록 (HTTP 메서드 + 경로 + 설명)
2. 요청/응답 스키마 (JSON)
3. 에러 코드 정의`}
                    </pre>
                      </div>
                      {!isPurchased && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: "var(--background-overlay)" }}>
                            <Lock size={28} style={{ color: "var(--brand-violet-light)" }} />
                            <div className="text-center">
                              <p className="font-medium mb-1" style={{ color: "var(--foreground)" }}>구매 후 전체 내용을 확인할 수 있습니다</p>
                              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>실제 프롬프트 코드와 커스터마이징 가이드 포함</p>
                            </div>
                            <button onClick={() => onPurchase(promptId || 1)} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ background: "var(--primary)" }}>
                              <ShoppingCart size={14} /> {PRICE.toLocaleString()}원에 구매하기
                            </button>
                          </div>
                      )}
                    </div>
                  </div>
              )}

              {activeTab === "사용 가이드" && (
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-sm)" }}>
                    <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border-xs)" }}>
                      <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>사용 가이드</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-bg-subtle)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>무료 공개</span>
                    </div>
                    <div className="p-5 space-y-3" style={{ background: "var(--sidebar)" }}>
                      {GUIDE_STEPS.map((step, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold text-white" style={{ background: "var(--primary)" }}>{i + 1}</div>
                            <p className="text-sm pt-0.5" style={{ color: "var(--foreground)" }}>{step}</p>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {activeTab === "리뷰" && (
                  <div className="space-y-4">
                    <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium" style={{ color: "var(--foreground)" }}>128개 리뷰</span>
                        <span className="flex items-center gap-1 font-semibold" style={{ color: "var(--brand-gold)" }}>
                      <Star size={14} fill="var(--brand-gold)" /> 4.9
                    </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {ratings.map(r => (
                            <button key={r} onClick={() => setActiveRating(r)} className="px-3 py-1 rounded-full text-sm transition-all"
                                    style={activeRating === r ? { background: "var(--primary)", color: "#fff" } : { background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border-sm)" }}>
                              {r}
                            </button>
                        ))}
                      </div>
                    </div>
                    {REVIEWS.map((review, i) => (
                        <div key={i} className="rounded-xl p-4 space-y-2" style={{ background: "var(--card)", border: "1px solid var(--border-xs)" }}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>{review.name[0]}</div>
                            <div>
                              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{review.name}</p>
                              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{review.date}</p>
                            </div>
                            <div className="ml-auto flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, si) => (
                                  <Star key={si} size={12} fill={si < review.rating ? "var(--brand-gold)" : "none"} style={{ color: "var(--brand-gold)" }} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm" style={{ color: "var(--secondary-foreground)" }}>{review.text}</p>
                        </div>
                    ))}
                  </div>
              )}
            </div>

            {/* 우측 사이드바 */}
            <div className="lg:w-72 shrink-0">
              <div className="sticky top-20 rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border-md)" }}>
                <div className="p-5 space-y-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "var(--primary-bg-lg)", color: "var(--brand-violet-light)" }}>인기</span>
                  <h2 className="font-semibold leading-snug" style={{ color: "var(--foreground)" }}>RESTful API 설계 프롬프트 템플릿</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={13} fill="var(--brand-gold)" style={{ color: "var(--brand-gold)" }} />
                      ))}
                    </div>
                    <span className="text-sm font-medium" style={{ color: "var(--brand-gold)" }}>4.9</span>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>(128개 리뷰)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>김</div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>김개발</p>
                      <p className="text-xs flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}><Download size={10} /> 234회 다운로드</p>
                    </div>
                  </div>

                  {isPurchased ? (
                      <div className="rounded-lg p-4 text-center" style={{ background: "var(--success-bg-subtle)", border: "1px solid var(--success-border)" }}>
                        <CheckCircle2 size={24} className="mx-auto mb-2" style={{ color: "var(--success)" }} />
                        <p className="font-semibold text-sm" style={{ color: "var(--success)" }}>구매 완료</p>
                        <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>전체 프롬프트를 이용할 수 있습니다</p>
                      </div>
                  ) : (
                      <>
                        <div>
                          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{PRICE.toLocaleString()}원</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>단건 구매 · 영구 이용</p>
                        </div>
                        <button onClick={() => onPurchase(promptId || 1)} className="w-full py-2.5 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90" style={{ background: "var(--gradient-primary)" }}>
                          <ShoppingCart size={15} /> 구매하기
                        </button>
                      </>
                  )}

                  <div className="flex gap-2">
                    <button onClick={() => setLiked(!liked)} className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm transition-all hover:bg-white/5"
                            style={{ border: "1px solid var(--border-md)", color: liked ? "var(--destructive)" : "var(--muted-foreground)" }}>
                      <Heart size={14} fill={liked ? "var(--destructive)" : "none"} /> 찜
                    </button>
                    <button className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm transition-all hover:bg-white/5" style={{ border: "1px solid var(--border-md)", color: "var(--muted-foreground)" }}>
                      <Share2 size={14} /> 공유
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1 border-t" style={{ borderColor: "var(--border-xs)" }}>
                    {[["AI 모델", "GPT-4, Claude 3"], ["카테고리", "백엔드 개발"], ["파일 형식", "Markdown + JSON"]].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between text-xs">
                          <span style={{ color: "var(--muted-foreground)" }}>{k}:</span>
                          <span style={{ color: "var(--foreground)" }}>{v}</span>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
