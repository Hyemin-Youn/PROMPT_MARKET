import { useState, useEffect } from "react";
import { Star, Download, Heart, Code2, ChevronLeft, ShoppingCart, CheckCircle2, ShieldAlert, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PromptDetailPage = ({ promptId, onBack, onPurchase, isLoggedIn, isPurchased }) => {
  const [activeTab, setActiveTab] = useState("샘플");
  const [liked, setLiked] = useState(false);
  const [activeRating, setActiveRating] = useState("전체");
  const navigate = useNavigate();
  const currentUserId = 1; // JWT 연동 전 임시값

  // 백엔드로부터 받아올 실제 프롬프트 정보 상태 객체
  const [promptData, setPromptData] = useState({
    title: "",
    category: "",
    price: 0,
    rating: 5.0,
    downloads: 0,
    seller: "",
    aiModel: "",
    fileFormat: "",
    sampleCode: "",
    guideSteps: [], // 백엔드에서 배열 형태로 넘겨준다고 가정
    content: "" // 구매 완료 시 열어줄 실제 프롬프트 내용
  });
  const isOwner = Number(promptData.userId) === currentUserId; //

  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportMeta, setReportMeta] = useState({ id: null, type: null });
  const [reportData, setReportData] = useState({ reason: "SPAM", detail: "" });

  const ratings = ["전체", "5점", "4점", "3점", "2점", "1점"];

  // 🌟 1. 프롬프트 기본 및 상세 정보 불러오기
  const fetchPromptDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/prompts/${promptId}`, {
        method: "GET",
        credentials: "include" // 세션/쿠키 기반 인증 대응
      });
      if (response.ok) {
        const data = await response.json();
        setPromptData(data);
      }
    } catch (error) {
      console.error("프롬프트 상세 정보 로드 에러:", error);
    }
  };

  // 2. 댓글 목록 불러오기
  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/prompts/${promptId}/comments`);
      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse && jsonResponse.data) {
          setReviews(jsonResponse.data);
        } else {
          setReviews([]);
        }
      } else {
        console.error("댓글 목록을 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("백엔드 연결 에러:", error);
    }
  };

  // 3. 댓글 생성 (쿠키 연동 수정)
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/prompts/${promptId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // localStorage 토큰 제거 후 쿠키 적용
        body: JSON.stringify({
          content: newComment
        }),
      });

      if (response.ok) {
        setNewComment("");
        fetchComments();
        alert("댓글이 등록되었습니다!");
      } else {
        alert("댓글 등록 실패");
      }
    } catch (error) {
      console.error("통신 에러:", error);
      alert("백엔드 서버와 통신할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 신고 모달 열기
  const openReportModal = (id, type) => {
    setReportMeta({ id, type });
    setIsReportModalOpen(true);
  };

  // 4. 신고 제출 API 호출 (쿠키 연동 수정)
  const handleReportSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // 쿠키 연동 추가
        body: JSON.stringify({
          targetId: reportMeta.id,
          reportTargetType: reportMeta.type,
          reason: reportData.reason,
          detail: reportData.detail
        }),
      });

      if (response.ok) {
        alert("신고가 정상적으로 접수되었습니다.");
        setIsReportModalOpen(false);
        setReportData({ reason: "SPAM", detail: "" });
      } else {
        alert("신고 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("신고 에러:", error);
    }
  };

  // 5. '찜하기' 여부 확인 (쿠키 연동 수정)
  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/prompts/${promptId}/is-liked`, {
        method: "GET",
        credentials: "include" // 쿠키 헤더 자동 포함
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) setLiked(result.data);
      }
    } catch (error) {
      console.error("찜 상태 확인 실패:", error);
    }
  };

  // 6. '찜하기' 토글 함수 (쿠키 연동 수정)
  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/prompts/${promptId}/likes`, {
        method: "POST",
        credentials: "include" // 쿠키 헤더 자동 포함
      });

      if (response.ok) {
        setLiked(!liked);
      }
    } catch (error) {
      console.error("찜하기 실패:", error);
    }
  };


  const handleDelete = async () => {

    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {

      const response = await fetch(
          `http://localhost:8080/api/prompts/${promptId}?userId=1`,
          {
            method: "DELETE",
            credentials: "include",
          }
      );

      if (!response.ok) {
        alert("삭제 실패");
        return;
      }

      alert("삭제되었습니다.");
      navigate("/");

    } catch (error) {
      console.error(error);
      alert("서버와 통신할 수 없습니다.");
    }
  };



  // 상세 페이지 진입 및 변경시 모든 정보 유기적 결합
  useEffect(() => {
    fetchPromptDetails();
    fetchComments();
    if (isLoggedIn) {
      checkLikeStatus();
    }
  }, [promptId, isLoggedIn]);

  return (
      <div className="min-h-screen pb-16" style={{ background: "var(--background)" }}>
        {isReportModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
                <h3 className="font-bold text-lg mb-4 text-gray-900">신고하기 ({reportMeta.type})</h3>
                <select
                    className="w-full mb-3 p-2 border rounded-lg text-gray-900 bg-white"
                    value={reportData.reason}
                    onChange={(e) => setReportData({...reportData, reason: e.target.value})}>
                  <option value="SPAM">스팸/광고</option>
                  <option value="ABUSE">욕설/비방</option>
                  <option value="COPYRIGHT">저작권 침해</option>
                  <option value="ETC">기타 사유</option>
                </select>
                <textarea
                    className="w-full p-2 border rounded-lg mb-4 h-24 text-gray-900 bg-white"
                    placeholder="상세 내용을 입력하세요."
                    value={reportData.detail}
                    onChange={(e) => setReportData({...reportData, detail: e.target.value})} />
                <div className="flex gap-2">
                  <button
                      onClick={() => setIsReportModalOpen(false)}
                      className="flex-1 py-2 bg-gray-100 rounded-lg text-sm text-gray-900">취소</button>
                  <button
                      onClick={handleReportSubmit}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm">제출하기</button>
                </div>
              </div>
            </div>
        )}

        <div className="max-w-7xl mx-auto px-4 pt-6">
          <button onClick={onBack} className="flex items-center gap-1 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "var(--muted-foreground)" }}>
            <ChevronLeft size={16} /> 마켓으로 돌아가기
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* 왼쪽 콘텐츠 영역 */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-2 gap-2 mb-6 rounded-xl overflow-hidden" style={{ height: 240 }}>
                <div className="flex items-center justify-center col-span-1 row-span-2" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <Code2 size0={40} style={{ color: "var(--brand-violet-light)" }} />
                    <span className="font-mono text-xs" style={{ color: "var(--brand-violet-light)" }}>{promptData.category || "Development"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center" style={{ background: "var(--muted)", border: "1px solid var(--border-xs)" }}>
                  <div className="opacity-40 font-mono text-xs" style={{ color: "var(--accent)" }}>{`{ JSON Схема }`}</div>
                </div>
                <div className="flex items-center justify-center" style={{ background: "var(--secondary)", border: "1px solid var(--border-xs)" }}>
                  <div className="opacity-40 font-mono text-xs" style={{ color: "var(--primary)" }}>{`$ Run AI Model`}</div>
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

              {/* 샘플 결과물 바딩 영역 */}
              {activeTab === "샘플" && (
                  <div className="space-y-4">
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-sm)" }}>
                      <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border-xs)" }}>
                        <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>샘플 결과물</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-bg-subtle)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>무료 공개</span>
                      </div>
                      <div className="p-4" style={{ background: "var(--sidebar)" }}>
                    <pre className="text-sm font-mono overflow-x-auto" style={{ color: "var(--accent)" }}>
                      {promptData.preview || "// 등록된 결과물 샘플이 없습니다."}
                    </pre>
                      </div>
                      <div className="px-4 py-3" style={{ background: "var(--card)" }}>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>* 실제 프롬프트 전체 내용은 구매 후 확인할 수 있습니다.</p>
                      </div>
                    </div>

                    {/* 구매 확인 블록 */}
                    <div className="rounded-xl overflow-hidden relative" style={{ border: "1px solid var(--border-md)" }}>
                      <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border-xs)" }}>
                    <span className="flex items-center gap-2 text-sm font-medium" style={{ color: isPurchased ? "var(--success)" : "var(--brand-violet-light)" }}>
                      {isPurchased ? <CheckCircle2 size={14} /> : <Lock size={14} />}
                      {isPurchased ? "구매 완료 — 전체 프롬프트 원본" : "구매 후 공개"}
                    </span>
                      </div>
                      <div className={`p-4 ${!isPurchased ? "blur-sm select-none" : ""}`} style={{ background: "var(--sidebar)" }}>
                    <pre className="text-sm font-mono" style={{ color: "var(--brand-violet-light)" }}>
                      {isPurchased ? promptData.content : `당신은 숙련된 AI 어시스턴트입니다.\n[구매 후 공개되는 영역입니다]\n- 파라미터 세팅 가이드라인 내장`}
                    </pre>
                      </div>
                      {!isPurchased && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: "var(--background-overlay)" }}>
                            <Lock size={28} style={{ color: "var(--brand-violet-light)" }} />
                            <div className="text-center">
                              <p className="font-medium mb-1" style={{ color: "var(--foreground)" }}>구매 후 전체 내용을 확인할 수 있습니다</p>
                              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>실제 프롬프트 코드와 마크다운 서식 동시 다운로드</p>
                            </div>
                            <button onClick={() => onPurchase(promptId)} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ background: "var(--primary)" }}>
                              <ShoppingCart size={14} /> {(promptData.price || 0).toLocaleString()}원에 구매하기
                            </button>
                          </div>
                      )}
                    </div>
                  </div>
              )}

              {/* 동적 사용 가이드 바인딩 영역 */}
              {activeTab === "사용 가이드" && (
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-sm)" }}>
                    <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border-xs)" }}>
                      <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>사용 가이드</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-bg-subtle)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>무료 공개</span>
                    </div>
                    <div className="p-5 space-y-3" style={{ background: "var(--sidebar)" }}>
                      {!promptData.guideSteps || promptData.guideSteps.length === 0 ? (
                          <p className="text-sm text-gray-500">작성된 상세 가이드 스텝이 없습니다.</p>
                      ) : (
                          promptData.guideSteps.map((step, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold text-white" style={{ background: "var(--primary)" }}>{i + 1}</div>
                                <p className="text-sm pt-0.5" style={{ color: "var(--foreground)" }}>{step}</p>
                              </div>
                          ))
                      )}
                    </div>
                  </div>
              )}

              {/* 리뷰 영역 */}
              {activeTab === "리뷰" && (
                  <div className="space-y-4">
                    <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium" style={{ color: "var(--foreground)" }}>{reviews.length}개 리뷰</span>
                        <span className="flex items-center gap-1 font-semibold" style={{ color: "var(--brand-gold)" }}>
                      <Star size={14} fill="var(--brand-gold)" /> {promptData.rating || "5.0"}
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

                      <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="리뷰 내용을 입력하세요."
                            className="flex-1 px-4 py-2 rounded-lg text-sm bg-transparent"
                            style={{ border: "1px solid var(--border-md)", color: "var(--foreground)" }}
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 shrink-0"
                                style={{ background: "var(--primary)" }}>
                          {loading ? "등록 중..." : "등록"}
                        </button>
                      </form>
                    </div>

                    {reviews.length === 0 ? (
                        <div className="text-center py-8 text-sm" style={{ color: "var(--muted-foreground)" }}>
                          등록된 리뷰가 없습니다.
                        </div>
                    ) : (
                        reviews.map((review, i) => (
                            <div key={review.id || i} className="rounded-xl p-4 space-y-2" style={{ background: "var(--card)", border: "1px solid var(--border-xs)" }}>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>
                                  {(review.username || "U")[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{review.username || "테스트유저"}</p>
                                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{review.createdAt ? review.createdAt.split('T')[0] : "방금 전"}</p>
                                </div>
                                <button onClick={() => openReportModal(review.id, "COMMENT")} className="ml-auto text-xs text-red-500 hover:underline">신고하기</button>
                                <div className="flex gap-0.5">
                                  {Array.from({ length: 5 }).map((_, si) => (
                                      <Star key={si} size={12} fill={si < (review.rating || 5) ? "var(--brand-gold)" : "none"} style={{ color: "var(--brand-gold)" }} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm" style={{ color: "var(--secondary-foreground)" }}>{review.content}</p>
                            </div>
                        ))
                    )}
                  </div>
              )}
            </div>

            {/* 우측 사이드바 영역 */}
            <div className="lg:w-72 shrink-0">
              <div className="sticky top-20 rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border-md)" }}>
                <div className="p-5 space-y-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "var(--primary-bg-lg)", color: "var(--brand-violet-light)" }}>인기</span>
                  <h2 className="font-semibold leading-snug" style={{ color: "var(--foreground)" }}>{promptData.title || "프롬프트 제목 로딩 중..."}</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={13} fill="var(--brand-gold)" style={{ color: "var(--brand-gold)" }} />
                      ))}
                    </div>
                    <span className="text-sm font-medium" style={{ color: "var(--brand-gold)" }}>{promptData.rating || "5.0"}</span>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>({reviews.length}개 리뷰)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>
                      {promptData.seller ? promptData.seller[0] : "P"}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{promptData.seller || "판매자"}</p>
                      <p className="text-xs flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}><Download size={10} /> {promptData.downloads || 0}회 다운로드</p>
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
                          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{(promptData.price || 0).toLocaleString()}원</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>단건 구매 · 영구 이용</p>
                        </div>
                        <button onClick={() => onPurchase(promptId)} className="w-full py-2.5 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90" style={{ background: "var(--gradient-primary)" }}>
                          <ShoppingCart size={15} /> 구매하기
                        </button>
                      </>
                  )}

                  <div className="flex gap-2">
                    <button
                        onClick={handleToggleLike}
                        className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm transition-all hover:bg-white/5"
                        style={{
                          border: "1px solid var(--border-md)",
                          color: liked ? "var(--destructive)" : "var(--muted-foreground)"
                        }}
                    >
                      <Heart size={14} fill={liked ? "var(--destructive)" : "none"} /> 찜
                    </button>
                    <button onClick={() => openReportModal(promptId, "PROMPT")} className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm" style={{ border: "1px solid var(--border-md)" }}>
                      <ShieldAlert size={14} /> 게시글 신고
                    </button>
                  </div>

                  {/* 수정 & 삭제 */}
                  {isOwner && (
                      <>
                        <button
                            onClick={() => navigate(`/prompts/edit/${promptId}`)}
                            className="w-full mt-2 py-2.5 rounded-lg font-medium text-white"
                            style={{ background: "#7c3aed" }}
                        >
                          수정하기
                        </button>

                        <button
                            onClick={handleDelete}
                            className="w-full mt-2 py-2.5 rounded-lg font-medium text-white"
                            style={{ background: "#dc2626" }}
                        >
                          삭제하기
                        </button>
                      </>
                  )}

                  <div className="space-y-1.5 pt-1 border-t" style={{ borderColor: "var(--border-xs)" }}>
                    {[["AI 모델", promptData.aiModel || "공통"], ["카테고리", promptData.category || "개발"], ["파일 형식", promptData.fileFormat || "Markdown"]].map(([k, v]) => (
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
};