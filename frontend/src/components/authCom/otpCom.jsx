import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ─── Skeleton helpers (unchanged) ─────────────────────────────────────────────
function Skeleton({ width = "100%", height = "48px", radius = "12px", style = {} }) {
  return (
    <div
      className="sk"
      style={{ width, height, borderRadius: radius, display: "block", ...style }}
    />
  );
}

function FieldSkeleton() {
  return (
    <div style={{ marginBottom: "18px" }}>
      <Skeleton width="100px" height="12px" radius="4px" style={{ marginBottom: "6px" }} />
      <Skeleton width="100%" height="44px" radius="10px" />
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="page-wrapper">
      <div className="two-col-layout">
        <div className="promo-col">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <Skeleton width="36px" height="36px" radius="50%" />
            <Skeleton width="80px" height="20px" radius="4px" />
          </div>
          <Skeleton width="220px" height="32px" radius="8px" style={{ marginBottom: "14px" }} />
          <Skeleton width="300px" height="16px" radius="6px" style={{ marginBottom: "8px" }} />
          <Skeleton width="280px" height="16px" radius="6px" style={{ marginBottom: "30px" }} />
          {[1, 2, 3].map(i => (
            <Skeleton key={i} width="180px" height="18px" radius="6px" style={{ marginBottom: "10px" }} />
          ))}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px", alignItems: "center" }}>
            <Skeleton width="60px" height="30px" radius="50%" />
            <Skeleton width="60px" height="30px" radius="50%" />
            <Skeleton width="60px" height="30px" radius="50%" />
            <Skeleton width="120px" height="14px" radius="4px" />
          </div>
        </div>
        <div className="form-col">
          <div className="form-card">
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <Skeleton width="160px" height="24px" radius="6px" style={{ margin: "0 auto 8px" }} />
              <Skeleton width="200px" height="14px" radius="5px" style={{ margin: "0 auto" }} />
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} width="48px" height="56px" radius="12px" />
              ))}
            </div>
            <Skeleton width="100%" height="50px" radius="12px" style={{ marginTop: "4px" }} />
            <Skeleton width="180px" height="13px" radius="5px" style={{ margin: "20px auto 0" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Spinner({ size = 18, color = "#fff" }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation: "spin 0.75s linear infinite", flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity="0.25" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export const OtpCom = ({
  handleSubmit,
  handleChange,   // parent expects (event, index)
  apiError,
  data,           // { otp: array of 6 digits (strings) }
  error,          // { otp: string }
  loading,
}) => {
  const [pageReady, setPageReady] = useState(
    typeof document !== "undefined" && document.readyState === "complete"
  );
  const inputRefs = useRef([]);

  useEffect(() => {
    if (pageReady) return;
    if (document.readyState === "complete") {
      setPageReady(true);
      return;
    }
    const onReady = () => {
      if (document.readyState === "complete") setPageReady(true);
    };
    document.addEventListener("readystatechange", onReady);
    const t = setTimeout(() => setPageReady(true), 1500);
    return () => {
      document.removeEventListener("readystatechange", onReady);
      clearTimeout(t);
    };
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleDigitChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    // Build a synthetic event that matches what the parent expects
    const syntheticEvent = {
      target: { value },
    };
    // Call parent's handleChange with (event, index)
    handleChange(syntheticEvent, index);

    // Auto-advance to next input if a digit was entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length === 6) {
      // Fill each digit and call handleChange for each
      for (let i = 0; i < 6; i++) {
        const syntheticEvent = {
          target: { value: pasted[i] },
        };
        handleChange(syntheticEvent, i);
      }
      // Focus the last input
      inputRefs.current[5]?.focus();
      e.preventDefault();
    }
  };

  // ─── Styles (same as before) ────────────────────────────────────────────────
  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }

    :root {
      --bg-page:        #f8fafc;
      --bg-card:        #ffffff;
      --bg-input:       #f1f5f9;
      --bg-input-focus: #ffffff;
      --bg-avatar:      #eef2ff;
      --bg-error:       #fef2f2;
      --bg-overlay:     rgba(255,255,255,0.7);
      --bg-overlay-card:#ffffff;
      --bg-social:      #f8fafc;
      --bg-social-hover:#f1f5f9;

      --border-card:    #e9eef3;
      --border-input:   #e2e8f0;
      --border-focus:   #6366f1;
      --border-avatar:  #c7d2fe;
      --border-error:   #f87171;
      --border-api-err: #fecaca;
      --border-social:  #e2e8f0;

      --text-heading:   #0f172a;
      --text-body:      #334155;
      --text-muted:     #64748b;
      --text-hint:      #94a3b8;
      --text-accent:    #4f46e5;
      --text-accent-h:  #4338ca;
      --text-link:      #6366f1;
      --text-error:     #dc2626;
      --text-api-err:   #b91c1c;
      --text-overlay:   #1e293b;
      --text-social:    #334155;

      --shadow-card:    0 20px 60px -12px rgba(79,70,229,0.15), 0 4px 18px rgba(0,0,0,0.05);
      --shadow-btn:     0 4px 14px rgba(79,70,229,0.35);
      --shadow-btn-h:   0 6px 20px rgba(79,70,229,0.45);
      --shadow-overlay: 0 20px 60px rgba(0,0,0,0.15);

      --sk-from:        #e2e8f0;
      --sk-via:         #f1f5f9;
      --focus-ring:     rgba(99,102,241,0.25);
      --focus-ring-err: rgba(248,113,113,0.18);

      --gradient-promo: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
      --gradient-btn:   linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg-page:        #0f172a;
        --bg-card:        #1e293b;
        --bg-input:       #334155;
        --bg-input-focus: #1e293b;
        --bg-avatar:      #312e81;
        --bg-error:       #2a1218;
        --bg-overlay:     rgba(15,23,42,0.8);
        --bg-overlay-card:#1e293b;
        --bg-social:      #334155;
        --bg-social-hover:#475569;

        --border-card:    #334155;
        --border-input:   #475569;
        --border-focus:   #818cf8;
        --border-avatar:  #6366f1;
        --border-error:   #b54545;
        --border-api-err: #7f2e2e;
        --border-social:  #475569;

        --text-heading:   #f8fafc;
        --text-body:      #cbd5e1;
        --text-muted:     #94a3b8;
        --text-hint:      #64748b;
        --text-accent:    #818cf8;
        --text-accent-h:  #a5b4fc;
        --text-link:      #a5b4fc;
        --text-error:     #f87171;
        --text-api-err:   #fca5a5;
        --text-overlay:   #f8fafc;
        --text-social:    #cbd5e1;

        --shadow-card:    0 20px 60px -12px rgba(0,0,0,0.6);
        --shadow-btn:     0 4px 14px rgba(99,102,241,0.3);
        --shadow-btn-h:   0 6px 20px rgba(99,102,241,0.4);
        --shadow-overlay: 0 20px 60px rgba(0,0,0,0.7);

        --sk-from:        #1e293b;
        --sk-via:         #334155;
        --focus-ring:     rgba(129,140,248,0.25);
        --focus-ring-err: rgba(185,68,68,0.25);

        --gradient-promo: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
        --gradient-btn:   linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      }
    }

    .page-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 24px;
      background: var(--bg-page);
      transition: background 0.3s;
    }

    .two-col-layout {
      display: flex;
      gap: 0;
      width: 100%;
      max-width: 1120px;
      min-height: 600px;
      background: var(--bg-card);
      border-radius: 32px;
      box-shadow: var(--shadow-card);
      overflow: hidden;
      border: 1px solid var(--border-card);
      transition: background 0.3s, border-color 0.3s;
    }

    .promo-col {
      flex: 1;
      padding: 56px 44px;
      background: var(--gradient-promo);
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      overflow: hidden;
      transition: background 0.3s;
    }
    .promo-col::after {
      content: '';
      position: absolute;
      top: -40%;
      right: -20%;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: rgba(99,102,241,0.08);
      filter: blur(60px);
      pointer-events: none;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 32px;
      position: relative;
      z-index: 1;
    }
    .brand-logo .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: var(--text-accent);
      border-radius: 12px;
      color: #fff;
      flex-shrink: 0;
    }
    .brand-logo .logo-icon svg {
      width: 22px;
      height: 22px;
      stroke-width: 2.5;
    }
    .brand-logo .logo-text {
      font-size: 22px;
      font-weight: 700;
      color: var(--text-heading);
      letter-spacing: -0.02em;
    }
    .brand-logo .logo-text span {
      color: var(--text-accent);
    }

    .promo-col .tagline h2 {
      font-size: 30px;
      font-weight: 700;
      color: var(--text-heading);
      letter-spacing: -0.02em;
      line-height: 1.2;
      margin-bottom: 12px;
      position: relative;
      z-index: 1;
    }
    .promo-col .tagline p {
      font-size: 16px;
      color: var(--text-muted);
      line-height: 1.7;
      margin-bottom: 32px;
      max-width: 90%;
      position: relative;
      z-index: 1;
    }
    .promo-col .feature-list {
      list-style: none;
      padding: 0;
      margin: 0 0 32px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      position: relative;
      z-index: 1;
    }
    .promo-col .feature-list li {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 15px;
      font-weight: 500;
      color: var(--text-body);
    }
    .promo-col .feature-list .check-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      background: var(--text-accent);
      border-radius: 50%;
      flex-shrink: 0;
      color: #fff;
    }
    .promo-col .feature-list .check-icon svg {
      width: 12px;
      height: 12px;
      stroke-width: 3;
    }

    .trusted-section {
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
      z-index: 1;
    }
    .avatar-stack {
      display: flex;
    }
    .avatar-stack .av {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid var(--bg-card);
      margin-right: -8px;
      background: var(--bg-avatar);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: var(--text-accent);
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .avatar-stack .av:last-child { margin-right: 0; }
    .trusted-text {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-muted);
    }
    .trusted-text span {
      color: var(--text-heading);
    }

    .form-col {
      flex: 1;
      max-width: 480px;
      padding: 40px 36px;
      display: flex;
      align-items: center;
    }
    .form-card {
      width: 100%;
    }

    .form-header {
      text-align: center;
      margin-bottom: 28px;
    }
    .form-header h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-heading);
      letter-spacing: -0.02em;
    }
    .form-header .sub {
      font-size: 14px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .otp-container {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-bottom: 20px;
    }
    .otp-input {
      width: 48px;
      height: 56px;
      text-align: center;
      font-size: 24px;
      font-weight: 700;
      border: 1.5px solid var(--border-input);
      border-radius: 12px;
      background: var(--bg-input);
      color: var(--text-body);
      outline: none;
      transition: all 0.15s ease;
      font-family: inherit;
    }
    .otp-input:focus {
      border-color: var(--border-focus);
      background: var(--bg-input-focus);
      box-shadow: 0 0 0 4px var(--focus-ring);
    }
    .otp-input.input-error {
      border-color: var(--border-error) !important;
    }
    .otp-input.input-error:focus {
      box-shadow: 0 0 0 4px var(--focus-ring-err) !important;
    }

    .api-error {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: var(--bg-error);
      border: 1px solid var(--border-api-err);
      color: var(--text-api-err);
      font-size: 13.5px;
      padding: 12px 14px;
      border-radius: 12px;
      margin-bottom: 20px;
      font-weight: 500;
    }

    .field-error {
      display: flex;
      align-items: flex-start;
      gap: 5px;
      color: var(--text-error);
      font-size: 12px;
      margin-top: 5px;
      font-weight: 500;
      justify-content: center;
      margin-bottom: 8px;
    }

    .submit-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px 20px;
      margin-top: 8px;
      background: var(--gradient-btn);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.01em;
      transition: all 0.15s ease;
      box-shadow: var(--shadow-btn);
      font-family: inherit;
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-btn-h);
    }
    .submit-btn:active:not(:disabled) { transform: translateY(0); }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    .submit-overlay {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-overlay);
      backdrop-filter: blur(6px);
    }
    .submit-overlay-card {
      background: var(--bg-overlay-card);
      border-radius: 20px;
      padding: 32px 48px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      border: 1px solid var(--border-card);
      box-shadow: var(--shadow-overlay);
    }
    .submit-overlay-text {
      font-size: 15px;
      color: var(--text-overlay);
      font-weight: 600;
    }

    .footer-text {
      text-align: center;
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 24px;
    }
    .footer-text a {
      color: var(--text-link);
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
    }
    .footer-text a:hover {
      text-decoration: underline;
    }

    @keyframes shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position:  600px 0; }
    }
    .sk {
      background: linear-gradient(90deg, var(--sk-from) 25%, var(--sk-via) 50%, var(--sk-from) 75%);
      background-size: 600px 100%;
      animation: shimmer 1.4s infinite linear;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 820px) {
      .two-col-layout {
        flex-direction: column;
        max-width: 480px;
        min-height: auto;
        border-radius: 24px;
      }
      .promo-col {
        padding: 32px 28px;
        text-align: center;
        align-items: center;
      }
      .promo-col .tagline p { max-width: 100%; }
      .promo-col .feature-list { align-items: center; }
      .promo-col::after { display: none; }
      .brand-logo { align-self: flex-start; }
      .form-col {
        max-width: 100%;
        padding: 28px 20px;
      }
      .trusted-section { flex-direction: column; }
      .otp-input {
        width: 42px;
        height: 50px;
        font-size: 20px;
      }
    }
    @media (max-width: 480px) {
      .promo-col { padding: 24px 16px; }
      .form-col { padding: 20px 16px; }
      .promo-col .tagline h2 { font-size: 24px; }
      .brand-logo { align-self: center; }
      .otp-container { gap: 6px; }
      .otp-input {
        width: 36px;
        height: 44px;
        font-size: 18px;
      }
    }
  `;

  // ─── Render ──────────────────────────────────────────────────────────────────
  if (!pageReady) {
    return (
      <>
        <style>{STYLES}</style>
        <PageSkeleton />
      </>
    );
  }

  // Ensure data.otp is an array (if it's a string, split it)
  const otpArray = Array.isArray(data.otp) ? data.otp : (data.otp || "").split("");

  return (
    <>
      <style>{STYLES}</style>

      <div className="page-wrapper">
        {loading && (
          <div className="submit-overlay" role="status" aria-live="polite">
            <div className="submit-overlay-card">
              <Spinner size={36} color="var(--text-accent)" />
              <p className="submit-overlay-text">Verifying your code…</p>
            </div>
          </div>
        )}

        <div className="two-col-layout">
          {/* ─── Left column ─── */}
          <div className="promo-col">
            <div className="brand-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </div>
              <span className="logo-text">Post<span>ly</span></span>
            </div>

            <div className="tagline">
              <h2>One last step</h2>
              <p>We've sent a 6‑digit verification code to your email. Enter it below to confirm your account.</p>
            </div>
            <ul className="feature-list">
              <li>
                <span className="check-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Secure &amp; encrypted
              </li>
              <li>
                <span className="check-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Instant verification
              </li>
              <li>
                <span className="check-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Join the community
              </li>
            </ul>
            <div className="trusted-section">
              <div className="avatar-stack">
                <div className="av" style={{ background: '#dbeafe', color: '#2563eb' }}>JD</div>
                <div className="av" style={{ background: '#fce7f3', color: '#db2777' }}>SK</div>
                <div className="av" style={{ background: '#d1fae5', color: '#059669' }}>ML</div>
              </div>
              <p className="trusted-text">
                Trusted by <span>3,400+</span> creators
              </p>
            </div>
          </div>

          {/* ─── Right column: OTP form ─── */}
          <div className="form-col">
            <div
              className="form-card"
              style={{ opacity: loading ? 0.55 : 1, transition: "opacity 0.2s" }}
            >
              <div className="form-header">
                <h1>Verify your email</h1>
                <p className="sub">Enter the 6‑digit code sent to your inbox</p>
              </div>

              {apiError && (
                <div className="api-error" role="alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{apiError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate onPaste={handlePaste}>
                <div className="otp-container">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={otpArray[index] || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 1) {
                          handleDigitChange(index, val);
                        }
                      }}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                      className={`otp-input${error?.otp ? " input-error" : ""}`}
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>

                {error?.otp && (
                  <p className="field-error">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, marginTop: "1px" }}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    {error.otp}
                  </p>
                )}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading
                    ? (<><Spinner size={18} color="#fff" />Verifying…</>)
                    : "Verify OTP"}
                </button>
              </form>

              <p className="footer-text">
                Didn’t receive the code?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); /* your resend logic here */ }}>
                  Resend OTP
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};