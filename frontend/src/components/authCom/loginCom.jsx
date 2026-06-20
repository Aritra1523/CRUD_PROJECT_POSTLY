import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ─── Skeleton helpers ──────────────────────────────────────────────────────────
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
        {/* Left skeleton */}
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
        {/* Right skeleton */}
        <div className="form-col">
          <div className="form-card">
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <Skeleton width="160px" height="24px" radius="6px" style={{ margin: "0 auto 8px" }} />
              <Skeleton width="200px" height="14px" radius="5px" style={{ margin: "0 auto" }} />
            </div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <Skeleton width="100%" height="44px" radius="10px" />
              <Skeleton width="100%" height="44px" radius="10px" />
            </div>
            <Skeleton width="240px" height="12px" radius="5px" style={{ margin: "0 auto 16px" }} />
            <FieldSkeleton />
            <FieldSkeleton />
            <Skeleton width="120px" height="12px" radius="4px" style={{ marginLeft: "auto", marginBottom: "20px" }} />
            <Skeleton width="100%" height="50px" radius="12px" style={{ marginTop: "4px" }} />
            <Skeleton width="200px" height="13px" radius="5px" style={{ margin: "20px auto 0" }} />
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

// ─── Field wrapper (with icon support) ─────────────────────────────────────────
function Field({ label, error, children, icon }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        {children}
      </div>
      {error && (
        <p className="field-error">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, marginTop: "1px" }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export const LoginCom = ({
  handleSubmit,
  apiError,
  user,
  handleChange,
  error,
  loading,
}) => {
  const [pageReady, setPageReady] = useState(
    typeof document !== "undefined" && document.readyState === "complete"
  );

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

  // ─── Inline styles (CSS) ──────────────────────────────────────────────────────
  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&display=swap');

    /* ── reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }

    /* ── colours (light) ── */
    :root {
      --bg-page:        #f8fafc;
      --bg-card:        #ffffff;
      --bg-input:       #f1f5f9;
      --bg-input-focus: #ffffff;
      --bg-file:        #f1f5f9;
      --bg-file-hover:  #e2e8f0;
      --bg-avatar:      #eef2ff;
      --bg-error:       #fef2f2;
      --bg-overlay:     rgba(255,255,255,0.7);
      --bg-overlay-card:#ffffff;
      --bg-social:      #f8fafc;
      --bg-social-hover:#f1f5f9;

      --border-card:    #e9eef3;
      --border-input:   #e2e8f0;
      --border-focus:   #6366f1;
      --border-file:    #cbd5e1;
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
      --text-file:      #475569;
      --text-overlay:   #1e293b;
      --text-social:    #334155;

      --shadow-card:    0 20px 60px -12px rgba(79,70,229,0.15), 0 4px 18px rgba(0,0,0,0.05);
      --shadow-btn:     0 4px 14px rgba(79,70,229,0.35);
      --shadow-btn-h:   0 6px 20px rgba(79,70,229,0.45);
      --shadow-overlay: 0 20px 60px rgba(0,0,0,0.15);
      --shadow-social:  0 1px 2px rgba(0,0,0,0.02);

      --sk-from:        #e2e8f0;
      --sk-via:         #f1f5f9;
      --focus-ring:     rgba(99,102,241,0.25);
      --focus-ring-err: rgba(248,113,113,0.18);

      --gradient-promo: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
      --gradient-btn:   linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    }

    /* ── colours (dark) ── */
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-page:        #0f172a;
        --bg-card:        #1e293b;
        --bg-input:       #334155;
        --bg-input-focus: #1e293b;
        --bg-file:        #334155;
        --bg-file-hover:  #475569;
        --bg-avatar:      #312e81;
        --bg-error:       #2a1218;
        --bg-overlay:     rgba(15,23,42,0.8);
        --bg-overlay-card:#1e293b;
        --bg-social:      #334155;
        --bg-social-hover:#475569;

        --border-card:    #334155;
        --border-input:   #475569;
        --border-focus:   #818cf8;
        --border-file:    #475569;
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
        --text-file:      #94a3b8;
        --text-overlay:   #f8fafc;
        --text-social:    #cbd5e1;

        --shadow-card:    0 20px 60px -12px rgba(0,0,0,0.6);
        --shadow-btn:     0 4px 14px rgba(99,102,241,0.3);
        --shadow-btn-h:   0 6px 20px rgba(99,102,241,0.4);
        --shadow-overlay: 0 20px 60px rgba(0,0,0,0.7);
        --shadow-social:  0 1px 2px rgba(0,0,0,0.1);

        --sk-from:        #1e293b;
        --sk-via:         #334155;
        --focus-ring:     rgba(129,140,248,0.25);
        --focus-ring-err: rgba(185,68,68,0.25);

        --gradient-promo: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
        --gradient-btn:   linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      }
    }

    /* ── page wrapper ── */
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

    /* ── left column (promo) ── */
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

    /* ── Logo ── */
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

    /* ── right column (form) ── */
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

    /* ── form header ── */
    .form-header {
      text-align: center;
      margin-bottom: 24px;
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
    .form-header .sub a {
      color: var(--text-link);
      font-weight: 600;
      text-decoration: none;
    }
    .form-header .sub a:hover {
      text-decoration: underline;
    }

    /* ── social buttons ── */
    .social-row {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }
    .social-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 0;
      background: var(--bg-social);
      border: 1px solid var(--border-social);
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-social);
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: inherit;
    }
    .social-btn:hover {
      background: var(--bg-social-hover);
      border-color: var(--border-focus);
      transform: translateY(-1px);
    }
    .social-btn.google:hover { background: #e8f0fe; border-color: #4285f4; }
    .social-btn.github:hover { background: #e5e7eb; border-color: #181717; }
    @media (prefers-color-scheme: dark) {
      .social-btn.google:hover { background: #1a2332; border-color: #4285f4; }
      .social-btn.github:hover { background: #2a2a2a; border-color: #8b8b8b; }
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 14px;
      color: var(--text-hint);
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 20px;
    }
    .divider::before,
    .divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: var(--border-input);
    }

    /* ── fields ── */
    .field { margin-bottom: 16px; }
    .field-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-body);
      margin-bottom: 5px;
      letter-spacing: 0.01em;
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 12px;
      display: flex;
      align-items: center;
      color: var(--text-hint);
      pointer-events: none;
    }
    .input-icon svg {
      width: 18px;
      height: 18px;
    }
    .input {
      width: 100%;
      padding: 10px 12px 10px 40px;
      border: 1.5px solid var(--border-input);
      border-radius: 10px;
      font-size: 14px;
      color: var(--text-body);
      background: var(--bg-input);
      outline: none;
      transition: all 0.15s ease;
      font-family: inherit;
      font-weight: 500;
    }
    .input::placeholder { color: var(--text-hint); font-weight: 400; }
    .input:focus {
      border-color: var(--border-focus);
      background: var(--bg-input-focus);
      box-shadow: 0 0 0 4px var(--focus-ring);
    }
    .input-error { border-color: var(--border-error) !important; }
    .input-error:focus { box-shadow: 0 0 0 4px var(--focus-ring-err) !important; }

    .field-error {
      display: flex;
      align-items: flex-start;
      gap: 5px;
      color: var(--text-error);
      font-size: 12px;
      margin-top: 5px;
      font-weight: 500;
    }

    .forgot-row {
      text-align: right;
      margin-bottom: 20px;
      margin-top: -4px;
    }
    .forgot-link {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-link);
      text-decoration: none;
      transition: opacity 0.15s;
    }
    .forgot-link:hover {
      opacity: 0.72;
      text-decoration: underline;
    }

    /* ── submit button ── */
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

    /* ── overlay ── */
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

    /* ── footer (sign up) ── */
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
    }
    .footer-text a:hover { text-decoration: underline; }

    /* ── api error ── */
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

    /* ── skeleton shimmer ── */
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

    /* ── responsive ── */
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
    }
    @media (max-width: 480px) {
      .two-col { grid-template-columns: 1fr; }
      .social-row { flex-direction: column; }
      .promo-col { padding: 24px 16px; }
      .form-col { padding: 20px 16px; }
      .promo-col .tagline h2 { font-size: 24px; }
      .brand-logo { align-self: center; }
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

  return (
    <>
      <style>{STYLES}</style>

      <div className="page-wrapper">
        {loading && (
          <div className="submit-overlay" role="status" aria-live="polite">
            <div className="submit-overlay-card">
              <Spinner size={36} color="var(--text-accent)" />
              <p className="submit-overlay-text">Signing you in…</p>
            </div>
          </div>
        )}

        <div className="two-col-layout">
          {/* ─── Left column: promotional content ─── */}
          <div className="promo-col">
            {/* ── Brand logo ── */}
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
              <h2>Join thousands of creators and content lovers</h2>
              <p>Your creative hub awaits. Build, share, and monetize your content with a community that gets it.</p>
            </div>
            <ul className="feature-list">
              <li>
                <span className="check-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Free to get started
              </li>
              <li>
                <span className="check-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                No credit card required
              </li>
              <li>
                <span className="check-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Cancel anytime
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

          {/* ─── Right column: login form ─── */}
          <div className="form-col">
            <div
              className="form-card"
              style={{ opacity: loading ? 0.55 : 1, transition: "opacity 0.2s" }}
            >
              {/* ── Form header ── */}
              <div className="form-header">
                <h1>Welcome back</h1>
                <p className="sub">
                  Don't have an account? <Link to="/">Create one</Link>
                </p>
              </div>

              {/* ── Social login ── */}
              <div className="social-row">
                <button type="button" className="social-btn google">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button type="button" className="social-btn github">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>

              <div className="divider">or continue with email</div>

              {/* ── API error ── */}
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

              <form onSubmit={handleSubmit} noValidate>
                <Field
                  label="Email address"
                  error={error.email}
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  }
                >
                  <input
                    className={`input${error.email ? " input-error" : ""}`}
                    type="email" name="email"
                    value={user.email} onChange={handleChange}
                    placeholder="you@example.com" autoComplete="email"
                  />
                </Field>

                <Field
                  label="Password"
                  error={error.password}
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  }
                >
                  <input
                    className={`input${error.password ? " input-error" : ""}`}
                    type="password" name="password"
                    value={user.password} onChange={handleChange}
                    placeholder="Enter your password" autoComplete="current-password"
                  />
                </Field>

                <div className="forgot-row">
                  <Link to="/forget-password" className="forgot-link">Forgot password?</Link>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading
                    ? (<><Spinner size={18} color="#fff" />Signing in…</>)
                    : "Login"}
                </button>
              </form>

              {/* ── Footer (sign up) ── */}
              <p className="footer-text">
                Don't have an account? <Link to="/">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};