import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail, Lock, Eye, EyeOff, User, Zap, Github,
  AlertCircle, CheckCircle2, ArrowLeft, RotateCcw,
} from "lucide-react";
import { sendCode, verifyEmail as apiVerifyEmail, signup as apiSignup } from "../api/auth.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

/* ─── 공통: 구글 아이콘 ─── */
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

/* ─── 배경 장식 ─── */
const BgDecor = () => (
  <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
    <div style={{ position: "absolute", top: "-10%", left: "-5%",  width: 700, height: 320, borderRadius: "70%", background: "radial-gradient(ellipse, rgba(124,58,237,0.45), transparent)", filter: "blur(90px)" }} />
    <div style={{ position: "absolute", top: "-15%", right: "-10%", width: 600, height: 280, borderRadius: "70%", background: "radial-gradient(ellipse, rgba(167,139,250,0.35), transparent)", filter: "blur(90px)" }} />
    <div style={{ position: "absolute", bottom: "5%", left: "30%", width: 500, height: 200, borderRadius: "70%", background: "radial-gradient(ellipse, rgba(124,58,237,0.20), transparent)", filter: "blur(80px)" }} />
  </div>
);

/* ─── 비밀번호 강도 계산 ─── */
const getPwStrength = (pw) => [
  pw.length >= 8,
  /[A-Z]/.test(pw),
  /[0-9]/.test(pw),
  /[^A-Za-z0-9]/.test(pw),
];
const strengthColor = (scores) => {
  const n = scores.filter(Boolean).length;
  if (n <= 1) return "var(--destructive)";
  if (n === 2) return "var(--brand-gold)";
  if (n === 3) return "#22c55e";
  return "var(--success)";
};
const strengthLabel = (scores) => {
  const n = scores.filter(Boolean).length;
  if (n <= 1) return "약함";
  if (n === 2) return "보통";
  if (n === 3) return "강함";
  return "매우 강함";
};

/* ─── 이메일 OTP 6자리 입력 ─── */
const OtpInput = ({ value, onChange }) => {
  const LEN = 6;
  const refs = useRef([]);

  const digits = value.padEnd(LEN, "").split("").slice(0, LEN);

  const focus = (idx) => refs.current[idx]?.focus();

  const handleChange = (idx, raw) => {
    const num = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = num;
    onChange(next.join("").trimEnd());
    if (num && idx < LEN - 1) focus(idx + 1);
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        const next = [...digits];
        next[idx] = "";
        onChange(next.join("").trimEnd());
      } else if (idx > 0) {
        focus(idx - 1);
      }
    }
    if (e.key === "ArrowLeft"  && idx > 0)       focus(idx - 1);
    if (e.key === "ArrowRight" && idx < LEN - 1) focus(idx + 1);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LEN);
    onChange(pasted);
    focus(Math.min(pasted.length, LEN - 1));
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length: LEN }).map((_, idx) => (
        <input
          key={idx}
          ref={el => { refs.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[idx] || ""}
          onChange={e => handleChange(idx, e.target.value)}
          onKeyDown={e => handleKeyDown(idx, e)}
          onFocus={e => e.target.select()}
          className="text-center text-xl font-semibold rounded-lg outline-none transition-all"
          style={{
            width: 46, height: 54,
            background: "var(--muted)",
            border: `1.5px solid ${digits[idx] ? "var(--primary)" : "var(--border-md)"}`,
            color: "var(--foreground)",
            boxShadow: digits[idx] ? "0 0 0 3px var(--primary-bg-sm)" : "none",
          }}
        />
      ))}
    </div>
  );
};

/* ─── 단계 표시 바 ─── */
const StepBar = ({ step, total = 3 }) => (
  <div className="flex items-center gap-2 mb-6">
    {Array.from({ length: total }).map((_, i) => {
      const s = i + 1;
      const done    = step > s;
      const current = step === s;
      return (
        <div key={s} className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all"
            style={
              done    ? { background: "var(--success)",             color: "#fff" } :
              current ? { background: "var(--primary)",             color: "#fff" } :
                        { background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border-md)" }
            }
          >
            {done ? <CheckCircle2 size={13} /> : s}
          </div>
          {s < total && (
            <div className="w-8 h-px transition-all" style={{ background: done ? "var(--primary)" : "var(--border-md)" }} />
          )}
        </div>
      );
    })}
    <span className="text-xs ml-1" style={{ color: "var(--muted-foreground)" }}>
      {step === 1 ? "계정 정보" : step === 2 ? "프로필 설정" : "이메일 인증"}
    </span>
  </div>
);

/* ─── 공용 필드 ─── */
const Field = ({ label, name, type = "text", placeholder, value, onChange, error, icon: Icon, right, disabled }) => (
  <div>
    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>{label}</label>
    <div
      className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all"
      style={{
        background: disabled ? "var(--sidebar)" : "var(--muted)",
        border: `1px solid ${error ? "var(--destructive)" : "var(--border-md)"}`,
      }}
    >
      {Icon && <Icon size={15} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent outline-none text-sm disabled:cursor-not-allowed"
        style={{ color: disabled ? "var(--muted-foreground)" : "var(--foreground)" }}
      />
      {right}
    </div>
    {error && (
      <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--destructive)" }}>
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);

/* ═══════════════════════════════════════════
   메인 컴포넌트
═══════════════════════════════════════════ */
export const SignupPage = () => {
  const navigate = useNavigate();

  const [step, setStep]   = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  /* 폼 데이터 */
  const [form, setForm] = useState({
    email: "", password: "", passwordConfirm: "",
    name: "", nickname: "",
  });
  const [agreed, setAgreed]   = useState({ terms: false, privacy: false, marketing: false });
  const [showPw, setShowPw]   = useState(false);
  const [showPwC, setShowPwC] = useState(false);

  /* OTP */
  const [otp, setOtp]             = useState("");
  const [otpError, setOtpError]   = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const pwStrength = getPwStrength(form.password);

  /* 쿨다운 타이머 */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown(c => c - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  /* ── 유효성 검사 ── */
  const validateStep1 = () => {
    const e = {};
    if (!form.email)                               e.email           = "이메일을 입력하세요";
    else if (!/\S+@\S+\.\S+/.test(form.email))    e.email           = "올바른 이메일 형식이 아닙니다";
    if (!form.password)                            e.password        = "비밀번호를 입력하세요";
    else if (form.password.length < 8)             e.password        = "비밀번호는 8자 이상이어야 합니다";
    if (form.password !== form.passwordConfirm)    e.passwordConfirm = "비밀번호가 일치하지 않습니다";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.name)                              e.name     = "이름을 입력하세요";
    if (!form.nickname)                          e.nickname = "닉네임을 입력하세요";
    else if (form.nickname.length < 2)           e.nickname = "닉네임은 2자 이상이어야 합니다";
    if (!agreed.terms || !agreed.privacy)        e.terms    = "필수 약관에 동의해주세요";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Step 1 → 2 ── */
  const handleNextStep1 = () => {
    if (validateStep1()) setStep(2);
  };

  /* ── Step 2 → 3: 인증 코드 발송 ── */
  const handleNextStep2 = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      await sendCode({ email: form.email, password: form.password, name: form.name, nickname: form.nickname });
      setResendCooldown(60);
      setStep(3);
    } catch (err) {
      const msg = err.response?.data?.message || "이메일 전송에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다.";
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  /* ── 인증코드 재전송 ── */
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await sendCode({ email: form.email, password: form.password, name: form.name, nickname: form.nickname });
      setResendCooldown(60);
      setOtp("");
      setOtpError("");
    } catch {
      setOtpError("재전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  /* ── Step 3: OTP 검증 → 회원가입 완료 ── */
  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setOtpError("6자리 인증코드를 모두 입력해주세요");
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      /* 1) 이메일 인증 코드 확인 */
      await apiVerifyEmail(form.email, otp);

      /* 2) 최종 회원가입 */
      await apiSignup({
        email:           form.email,
        password:        form.password,
        name:            form.name,
        nickname:        form.nickname,
        marketingAgreed: agreed.marketing,
      });

      /* 3) 성공 → 로그인 페이지로 이동 */
      setStep(4);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setOtpError(err.response?.data?.message || "인증에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  /* ── OAuth ── */
  const handleOAuth = (provider) => {
    window.location.href = `${API_BASE}/oauth2/authorization/${provider}`;
  };

  /* ═══ 렌더 ═══ */
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#0b0b12", position: "relative" }}>
      <BgDecor />

      <div className="w-full max-w-md" style={{ position: "relative", zIndex: 1 }}>
        {/* 로고 */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <Zap size={17} className="text-white" />
          </div>
          <span className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
            Prompt<span style={{ color: "var(--brand-violet-light)" }}>Mart</span>
          </span>
        </Link>

        <div className="rounded-2xl p-8" style={{ background: "var(--card)", border: "1px solid var(--border-lg)" }}>

          {/* ───────── Step 1: 계정 정보 ───────── */}
          {step === 1 && (
            <>
              <StepBar step={1} />
              <h1 className="font-semibold mb-1" style={{ color: "var(--foreground)", fontSize: "1.2rem" }}>계정 만들기</h1>
              <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
                이메일과 비밀번호로 계정을 생성하세요
              </p>

              {/* OAuth */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button onClick={() => handleOAuth("google")} className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-white/5" style={{ border: "1px solid var(--border-md)", color: "var(--foreground)" }}>
                  <GoogleIcon /> Google
                </button>
                <button onClick={() => handleOAuth("github")} className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-white/5" style={{ border: "1px solid var(--border-md)", color: "var(--foreground)" }}>
                  <Github size={16} /> GitHub
                </button>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px" style={{ background: "var(--border-sm)" }} />
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>이메일로 가입</span>
                <div className="flex-1 h-px" style={{ background: "var(--border-sm)" }} />
              </div>

              <div className="space-y-4">
                <Field icon={Mail} label="이메일" name="email" type="email" placeholder="dev@example.com"
                  value={form.email} onChange={v => set("email", v)} error={errors.email} />

                <div>
                  <Field icon={Lock} label="비밀번호" name="password" type={showPw ? "text" : "password"} placeholder="8자 이상 입력"
                    value={form.password} onChange={v => set("password", v)} error={errors.password}
                    right={
                      <button type="button" onClick={() => setShowPw(p => !p)} className="shrink-0">
                        {showPw ? <EyeOff size={14} style={{ color: "var(--muted-foreground)" }} /> : <Eye size={14} style={{ color: "var(--muted-foreground)" }} />}
                      </button>
                    }
                  />
                  {/* 비밀번호 강도 */}
                  {form.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {pwStrength.map((ok, i) => (
                          <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ background: ok ? strengthColor(pwStrength) : "var(--muted)" }} />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: strengthColor(pwStrength) }}>
                        강도: {strengthLabel(pwStrength)}
                      </p>
                    </div>
                  )}
                </div>

                <Field icon={Lock} label="비밀번호 확인" name="passwordConfirm" type={showPwC ? "text" : "password"} placeholder="비밀번호 재입력"
                  value={form.passwordConfirm} onChange={v => set("passwordConfirm", v)} error={errors.passwordConfirm}
                  right={
                    <button type="button" onClick={() => setShowPwC(p => !p)} className="shrink-0">
                      {showPwC ? <EyeOff size={14} style={{ color: "var(--muted-foreground)" }} /> : <Eye size={14} style={{ color: "var(--muted-foreground)" }} />}
                    </button>
                  }
                />
              </div>

              <button onClick={handleNextStep1} className="w-full py-2.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90 mt-6" style={{ background: "var(--gradient-primary)" }}>
                다음
              </button>
              <p className="text-center text-sm mt-4" style={{ color: "var(--muted-foreground)" }}>
                이미 계정이 있으신가요?{" "}
                <Link to="/login" className="font-medium hover:underline" style={{ color: "var(--brand-violet-light)" }}>로그인</Link>
              </p>
            </>
          )}

          {/* ───────── Step 2: 프로필 설정 ───────── */}
          {step === 2 && (
            <>
              <StepBar step={2} />
              <h1 className="font-semibold mb-1" style={{ color: "var(--foreground)", fontSize: "1.2rem" }}>프로필 설정</h1>
              <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
                서비스에서 사용할 이름과 닉네임을 입력해주세요
              </p>

              <div className="space-y-4">
                <Field icon={User} label="이름" placeholder="홍길동"
                  value={form.name} onChange={v => set("name", v)} error={errors.name} />
                <Field icon={User} label="닉네임" placeholder="dev_nickname (2자 이상)"
                  value={form.nickname} onChange={v => set("nickname", v)} error={errors.nickname} />

                {/* 약관 동의 */}
                <div className="space-y-2.5 pt-1">
                  {[
                    { key: "terms",     label: "이용약관 동의",               required: true  },
                    { key: "privacy",   label: "개인정보 처리방침 동의",       required: true  },
                    { key: "marketing", label: "마케팅 정보 수신 동의 (선택)", required: false },
                  ].map(({ key, label, required }) => (
                    <label key={key} className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreed[key] || false}
                        onChange={e => setAgreed(a => ({ ...a, [key]: e.target.checked }))}
                        className="accent-violet-600"
                      />
                      <span className="text-sm" style={{ color: "var(--foreground)" }}>
                        {label}
                        {required && <span style={{ color: "var(--destructive)" }}> *</span>}
                      </span>
                    </label>
                  ))}
                  {errors.terms && (
                    <p className="text-xs flex items-center gap-1" style={{ color: "var(--destructive)" }}>
                      <AlertCircle size={11} /> {errors.terms}
                    </p>
                  )}
                </div>

                {errors.submit && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm" style={{ background: "var(--destructive-bg-subtle)", border: "1px solid var(--destructive-border-sm)", color: "var(--destructive)" }}>
                    <AlertCircle size={14} className="shrink-0" /> {errors.submit}
                  </div>
                )}
              </div>

              <button onClick={handleNextStep2} disabled={loading} className="w-full py-2.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 mt-6" style={{ background: "var(--gradient-primary)" }}>
                {loading ? "처리 중…" : "가입 완료 및 인증 메일 발송"}
              </button>
              <button onClick={() => { setStep(1); setErrors({}); }} className="w-full text-sm text-center mt-3 hover:underline" style={{ color: "var(--muted-foreground)" }}>
                <ArrowLeft size={12} className="inline mr-1" /> 이전으로
              </button>
            </>
          )}

          {/* ───────── Step 3: 이메일 인증 ───────── */}
          {step === 3 && (
            <>
              <StepBar step={3} />
              <h1 className="font-semibold mb-1" style={{ color: "var(--foreground)", fontSize: "1.2rem" }}>이메일 인증</h1>
              <p className="text-sm mb-1" style={{ color: "var(--muted-foreground)" }}>
                아래 이메일로 발송된 6자리 인증코드를 입력해주세요
              </p>
              <p className="text-sm font-medium mb-6" style={{ color: "var(--brand-violet-light)" }}>
                {form.email}
              </p>

              {/* OTP 입력 */}
              <div className="mb-4">
                <OtpInput value={otp} onChange={setOtp} />
              </div>

              {/* 재전송 */}
              <div className="flex items-center justify-center gap-1 mb-5 text-sm">
                <span style={{ color: "var(--muted-foreground)" }}>코드를 받지 못하셨나요?</span>
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="flex items-center gap-1 font-medium transition-colors disabled:cursor-not-allowed"
                  style={{ color: resendCooldown > 0 ? "var(--muted-foreground)" : "var(--brand-violet-light)" }}
                >
                  <RotateCcw size={12} />
                  {resendCooldown > 0 ? `재전송 (${resendCooldown}s)` : "재전송"}
                </button>
              </div>

              {otpError && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm mb-4" style={{ background: "var(--destructive-bg-subtle)", border: "1px solid var(--destructive-border-sm)", color: "var(--destructive)" }}>
                  <AlertCircle size={14} className="shrink-0" /> {otpError}
                </div>
              )}

              <button onClick={handleVerifyOtp} disabled={loading || otp.length < 6} className="w-full py-2.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: "var(--gradient-primary)" }}>
                {loading ? "인증 중…" : "인증 완료"}
              </button>

              <p className="text-xs text-center mt-4" style={{ color: "var(--muted-foreground)" }}>
                인증 메일은 발송 후 10분간 유효합니다
              </p>
            </>
          )}

          {/* ───────── Step 4: 완료 ───────── */}
          {step === 4 && (
            <div className="flex flex-col items-center gap-5 py-6 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "var(--primary-bg-lg)" }}>
                <CheckCircle2 size={40} style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-1" style={{ color: "var(--foreground)" }}>가입 완료!</h2>
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  <span style={{ color: "var(--brand-violet-light)" }}>{form.nickname || form.name}</span>님,{" "}
                  PromptMart에 오신 걸 환영합니다 🎉
                </p>
              </div>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                잠시 후 자동으로 이동합니다…
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
