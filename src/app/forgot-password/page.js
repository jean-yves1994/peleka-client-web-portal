"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowLeft, ArrowRight, KeyRound, Mail, Phone } from "lucide-react";
import { api } from "@/lib/api";

function ForgotContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [identifier, setIdentifier] = useState("");
  const [method, setMethod] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("request");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const isEmail = identifier.trim().includes("@");

  async function requestReset(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const r = await api.forgot(identifier.trim());
      const data = r?.data || r;
      const selectedMethod = data?.method || (isEmail ? "email" : "phone");
      setMethod(selectedMethod);

      if (selectedMethod === "phone") {
        setStep("verify");
      } else {
        setStep("sent");
      }
    } catch (e) {
      setErr(e.message || "Unable to start password recovery.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e) {
    e.preventDefault();
    setErr("");
    if (!/^\d{6}$/.test(code.trim())) {
      setErr("Enter the 6-digit verification code.");
      return;
    }

    setBusy(true);
    try {
      const r = await api.verifyPhoneReset(identifier.trim(), code.trim());
      const data = r?.data || r;
      if (!data?.reset_token) throw new Error("Verification succeeded but no reset token was returned.");
      window.location.href = `/reset-password?token=${encodeURIComponent(data.reset_token)}&redirect=${encodeURIComponent(redirect)}`;
    } catch (e) {
      setErr(e.message || "Unable to verify the code.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page single">
      <div className="auth-panel full-panel">
        <div className="auth-box">
          <Link href="/login" className="back-link">
            <ArrowLeft size={15} /> Back to sign in
          </Link>

          <div className="auth-symbol">
            <KeyRound size={22} />
          </div>

          <div className="section-kicker">
            {step === "request" ? "ACCOUNT RECOVERY" : step === "verify" ? "VERIFY PHONE" : "CHECK YOUR EMAIL"}
          </div>

          <h2>
            {step === "request"
              ? "Forgot your password?"
              : step === "verify"
                ? "Enter your verification code."
                : "Recovery instructions sent."}
          </h2>

          <p>
            {step === "request"
              ? "Enter the email address or phone number linked to your Peleka account."
              : step === "verify"
                ? `We sent a 6-digit code to ${identifier.trim()}. Enter it below to continue.`
                : "If an account exists for that email address, you will receive a secure password reset link. The link expires in 60 minutes."}
          </p>

          {step === "request" && (
            <form onSubmit={requestReset}>
              <label className="field">
                <span>Email or phone</span>
                <div className="input-with-icon">
                  {isEmail ? <Mail size={17} /> : <Phone size={17} />}
                  <input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    minLength={3}
                    placeholder="you@example.com or 078…"
                    autoComplete="username"
                  />
                </div>
              </label>

              {err && <div className="form-error">{err}</div>}

              <button className="button button-orange full" disabled={busy}>
                {busy ? "Sending…" : "Continue"} <ArrowRight size={16} />
              </button>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={verifyCode}>
              <label className="field">
                <span>6-digit code</span>
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  maxLength={6}
                  placeholder="000000"
                />
              </label>

              {err && <div className="form-error">{err}</div>}

              <button className="button button-orange full" disabled={busy || code.length !== 6}>
                {busy ? "Verifying…" : "Verify code"} <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="auth-link"
                onClick={() => { setStep("request"); setCode(""); setErr(""); }}
                disabled={busy}
              >
                Use a different email or phone
              </button>
            </form>
          )}

          {step === "sent" && (
            <>
              <div className="auth-symbol" style={{ marginTop: 20 }}>
                <Mail size={22} />
              </div>
              <p>
                Check your inbox for the Peleka password reset email. Open the link in that email to create a new password.
              </p>
              <Link href="/login" className="button button-dark full">
                Return to sign in <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ForgotPassword() {
  return (
    <Suspense fallback={null}>
      <ForgotContent />
    </Suspense>
  );
}
