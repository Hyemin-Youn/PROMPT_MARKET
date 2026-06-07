import { useState } from "react";
import { X, Eye, EyeOff, Zap, Github, Mail, Lock, User, CheckCircle2, AlertCircle } from "lucide-react";

const Field = ({ icon: Icon, label, name, type = "text", placeholder, right, value, onChange, error }) => (
    <div>
      <label className="block text-xs mb-1.5 font-medium" style={{ color: "var(--muted-foreground)" }}>{label}</label>
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: "var(--muted)", border: `1px solid ${error ? "var(--destructive)" : "var(--border-md)"}` }}>
        <Icon size={15} style={{ color: "var(--muted-foreground)" }} />
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
               className="flex-1 bg-transparent outline-none text-sm" style={{ color: "var(--foreground)" }} />
        {right}
      </div>
      {error && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--destructive)" }}><AlertCircle size={11} />{error}</p>}
    </div>
);

export const AuthModal = ({ mode, onClose, onSuccess, onSwitchMode }) => {
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: "", password: "", passwordConfirm: "", name: "", nickname: "" });
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState({ terms: false, privacy: false, marketing: false });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validateLogin = () => {
    const e = {};
    if (!form.email) e.email = "이메일을 입력하세요";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "올바른 이메일 형식이 아닙니다";
    if (!form.password) e.password = "비밀번호를 입력하세요";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSignup1 = () => {
    const e = {};
    if (!form.email) e.email = "이메일을 입력하세요";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "올바른 이메일 형식이 아닙니다";
    if (!form.password) e.password = "비밀번호를 입력하세요";
    else if (form.password.length < 8) e.password = "비밀번호는 8자 이상이어야 합니다";
    if (form.password !== form.passwordConfirm) e.passwordConfirm = "비밀번호가 일치하지 않습니다";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSignup2 = () => {
    const e = {};
    if (!form.name) e.name = "이름을 입력하세요";
    if (!form.nickname) e.nickname = "닉네임을 입력하세요";
    else if (form.nickname.length < 2) e.nickname = "닉네임은 2자 이상이어야 합니다";
    if (!agreed.terms || !agreed.privacy) e.terms = "필수 약관에 동의해주세요";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLoginSubmit = () => { if (validateLogin()) onSuccess(null, form.email); };
  const handleSignupNext = () => {
    if (step === 1 && validateSignup1()) setStep(2);
    else if (step === 2 && validateSignup2()) setStep(3);
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "var(--background-overlay)", backdropFilter: "blur(4px)" }}>
        <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border-lg)" }}>
          <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid var(--border-xs)" }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>
              Prompt<span style={{ color: "var(--brand-violet-light)" }}>Mart</span>
            </span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <X size={16} style={{ color: "var(--muted-foreground)" }} />
            </button>
          </div>

          <div className="px-6 py-6">
            {mode === "login" && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-semibold mb-1" style={{ color: "var(--foreground)", fontSize: "1.1rem" }}>로그인</h2>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>계정에 로그인하여 프롬프트를 이용하세요</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all hover:bg-white/5" style={{ border: "1px solid var(--border-md)", color: "var(--foreground)" }}>
                      <Github size={15} /> GitHub
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all hover:bg-white/5" style={{ border: "1px solid var(--border-md)", color: "var(--foreground)" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      Google
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ background: "var(--border-sm)" }} />
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>또는</span>
                    <div className="flex-1 h-px" style={{ background: "var(--border-sm)" }} />
                  </div>
                  <div className="space-y-3">
                    <Field icon={Mail} label="이메일" name="email" type="email" placeholder="dev@example.com"
                           value={form.email} onChange={e => set("email", e.target.value)} error={errors.email} />
                    <Field icon={Lock} label="비밀번호" name="password" type={showPw ? "text" : "password"} placeholder="비밀번호 입력"
                           value={form.password} onChange={e => set("password", e.target.value)} error={errors.password}
                           right={<button onClick={() => setShowPw(!showPw)} className="shrink-0">{showPw ? <EyeOff size={14} style={{ color: "var(--muted-foreground)" }} /> : <Eye size={14} style={{ color: "var(--muted-foreground)" }} />}</button>} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-violet-600" />
                      <span style={{ color: "var(--muted-foreground)" }}>로그인 상태 유지</span>
                    </label>
                    <button className="hover:underline" style={{ color: "var(--brand-violet-light)" }}>비밀번호 찾기</button>
                  </div>
                  <button onClick={handleLoginSubmit} className="w-full py-2.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90" style={{ background: "var(--gradient-primary)" }}>로그인</button>
                  <p className="text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                    계정이 없으신가요?{" "}
                    <button onClick={() => onSwitchMode("signup")} className="font-medium hover:underline" style={{ color: "var(--brand-violet-light)" }}>회원가입</button>
                  </p>
                </div>
            )}

            {mode === "signup" && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      {[1, 2, 3].map(s => (
                          <div key={s} className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
                                 style={step >= s ? { background: "var(--primary)", color: "#fff" } : { background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border-md)" }}>
                              {step > s ? <CheckCircle2 size={14} /> : s}
                            </div>
                            {s < 3 && <div className="flex-1 h-px w-8" style={{ background: step > s ? "var(--primary)" : "var(--border-md)" }} />}
                          </div>
                      ))}
                      <span className="text-xs ml-1" style={{ color: "var(--muted-foreground)" }}>
                    {step === 1 ? "계정 정보" : step === 2 ? "프로필 설정" : "완료"}
                  </span>
                    </div>
                    {step === 1 && <h2 className="font-semibold" style={{ color: "var(--foreground)", fontSize: "1.1rem" }}>계정 만들기</h2>}
                    {step === 2 && <h2 className="font-semibold" style={{ color: "var(--foreground)", fontSize: "1.1rem" }}>프로필 설정</h2>}
                  </div>

                  {step === 1 && (
                      <div className="space-y-3">
                        <Field icon={Mail} label="이메일" name="email" type="email" placeholder="dev@example.com"
                               value={form.email} onChange={e => set("email", e.target.value)} error={errors.email} />
                        <Field icon={Lock} label="비밀번호" name="password" type={showPw ? "text" : "password"} placeholder="8자 이상 입력"
                               value={form.password} onChange={e => set("password", e.target.value)} error={errors.password}
                               right={<button onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={14} style={{ color: "var(--muted-foreground)" }} /> : <Eye size={14} style={{ color: "var(--muted-foreground)" }} />}</button>} />
                        {form.password && (
                            <div className="flex gap-1">
                              {[form.password.length >= 8, /[A-Z]/.test(form.password), /[0-9]/.test(form.password), /[^A-Za-z0-9]/.test(form.password)].map((ok, i) => (
                                  <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ background: ok ? "var(--primary)" : "var(--muted)" }} />
                              ))}
                            </div>
                        )}
                        <Field icon={Lock} label="비밀번호 확인" name="passwordConfirm" type={showPwConfirm ? "text" : "password"} placeholder="비밀번호 재입력"
                               value={form.passwordConfirm} onChange={e => set("passwordConfirm", e.target.value)} error={errors.passwordConfirm}
                               right={<button onClick={() => setShowPwConfirm(!showPwConfirm)}>{showPwConfirm ? <EyeOff size={14} style={{ color: "var(--muted-foreground)" }} /> : <Eye size={14} style={{ color: "var(--muted-foreground)" }} />}</button>} />
                      </div>
                  )}

                  {step === 2 && (
                      <div className="space-y-3">
                        <Field icon={User} label="이름" name="name" placeholder="홍길동"
                               value={form.name} onChange={e => set("name", e.target.value)} error={errors.name} />
                        <Field icon={User} label="닉네임" name="nickname" placeholder="dev_nickname"
                               value={form.nickname} onChange={e => set("nickname", e.target.value)} error={errors.nickname} />
                        <div className="space-y-2 pt-1">
                          {[
                            { key: "terms",     label: "이용약관 동의",               required: true  },
                            { key: "privacy",   label: "개인정보 처리방침 동의",       required: true  },
                            { key: "marketing", label: "마케팅 정보 수신 동의 (선택)", required: false },
                          ].map(({ key, label, required }) => (
                              <label key={key} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={agreed[key] || false} onChange={e => setAgreed(a => ({ ...a, [key]: e.target.checked }))} className="accent-violet-600" />
                                <span className="text-sm" style={{ color: "var(--foreground)" }}>
                          {label}{required && <span style={{ color: "var(--destructive)" }}> *</span>}
                        </span>
                              </label>
                          ))}
                          {errors.terms && <p className="text-xs flex items-center gap-1" style={{ color: "var(--destructive)" }}><AlertCircle size={11} />{errors.terms}</p>}
                        </div>
                      </div>
                  )}

                  {step === 3 && (
                      <div className="flex flex-col items-center gap-4 py-4">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "var(--primary-bg-lg)" }}>
                          <CheckCircle2 size={32} style={{ color: "var(--primary)" }} />
                        </div>
                        <div className="text-center">
                          <h3 className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>가입 완료!</h3>
                          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                            <span style={{ color: "var(--brand-violet-light)" }}>{form.nickname || form.name}</span>님, PromptMart에 오신 걸 환영합니다
                          </p>
                        </div>
                        <button onClick={() => onSuccess(null, form.email)} className="w-full py-2.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90" style={{ background: "var(--gradient-primary)" }}>시작하기</button>
                      </div>
                  )}

                  {step < 3 && (
                      <>
                        <button onClick={handleSignupNext} className="w-full py-2.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90" style={{ background: "var(--gradient-primary)" }}>
                          {step === 1 ? "다음" : "가입 완료"}
                        </button>
                        {step === 1 && (
                            <p className="text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                              이미 계정이 있으신가요?{" "}
                              <button onClick={() => onSwitchMode("login")} className="font-medium hover:underline" style={{ color: "var(--brand-violet-light)" }}>로그인</button>
                            </p>
                        )}
                        {step === 2 && (
                            <button onClick={() => setStep(1)} className="w-full text-sm text-center hover:underline" style={{ color: "var(--muted-foreground)" }}>이전으로</button>
                        )}
                      </>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}