"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, KeyRound, Mail, Phone } from "lucide-react";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
export default function Forgot() {
  const [identifier, setIdentifier] = useState(""),
    [step, setStep] = useState("identifier"),
    [code, setCode] = useState(""),
    [resetToken, setResetToken] = useState(""),
    [busy, setBusy] = useState(false),
    [msg, setMsg] = useState(""),
    [err, setErr] = useState("");
  const searchParams = useSearchParams();
  const redirectTarget =
    searchParams.get("redirect") || "/dashboard";

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const r = await api.forgot(identifier),
        d = r?.data || r;
      if (identifier.includes("@")) {
        setMsg(
          "If an account exists, a password reset email has been sent. Check your inbox.",
        );
        setStep("sent");
      } else {
        setMsg(
          "If an account exists, a verification code has been sent to the phone number.",
        );
        setStep("phone");
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function verify(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const r = await api.verifyPhoneReset(identifier, code),
        d = r?.data || r;
      setResetToken(d.reset_token);
      setStep("reset");
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-page single">
      <div className="auth-panel full-panel">
        <Link href="/" className="mobile-auth-brand brand">
          PELEKA<span>.</span>
        </Link>
        <div className="auth-box">
          <Link href={`/login?redirect=${encodeURIComponent(redirectTarget)}`} className="back-link">
            <ArrowLeft size={15} /> Back to sign in
          </Link>
          {step === "identifier" && (
            <>
              <div className="auth-symbol">
                <KeyRound size={22} />
              </div>
              <div className="section-kicker">ACCOUNT RECOVERY</div>
              <h2>Forgot your password?</h2>
              <p>
                Enter the email or phone number connected to your Peleka
                account.
              </p>
              <form onSubmit={submit}>
                <label className="field">
                  <span>Email or phone</span>
                  <div className="input-with-icon">
                    <Mail size={17} />
                    <input
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      placeholder="you@example.com or 078…"
                    />
                  </div>
                </label>
                {err && <div className="form-error">{err}</div>}
                <button className="button button-dark full" disabled={busy}>
                  {busy ? "Sending…" : "Continue"} <ArrowRight size={16} />
                </button>
              </form>
            </>
          )}
          {step === "sent" && (
            <div className="success-copy">
              <div className="auth-symbol success">
                <Mail size={22} />
              </div>
              <div className="section-kicker">CHECK YOUR EMAIL</div>
              <h2>Reset link sent.</h2>
              <p>{msg}</p>
              <Link href={`/login?redirect=${encodeURIComponent(redirectTarget)}`} className="button button-dark full">
                Back to sign in
              </Link>
            </div>
          )}
          {step === "phone" && (
            <>
              <div className="auth-symbol">
                <Phone size={22} />
              </div>
              <div className="section-kicker">PHONE VERIFICATION</div>
              <h2>Enter your code.</h2>
              <p>{msg}</p>
              <form onSubmit={verify}>
                <label className="field">
                  <span>6-digit code</span>
                  <input
                    className="code-input"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    required
                    inputMode="numeric"
                    placeholder="000000"
                  />
                </label>
                {err && <div className="form-error">{err}</div>}
                <button className="button button-dark full" disabled={busy}>
                  {busy ? "Verifying…" : "Verify code"} <ArrowRight size={16} />
                </button>
              </form>
            </>
          )}
          {step === "reset" && <ResetForm token={resetToken} />}
        </div>
      </div>
    </main>
  );
}
function ResetForm({ token }) {
  const [pw, setPw] = useState(""),
    [cpw, setCpw] = useState(""),
    [busy, setBusy] = useState(false),
    [err, setErr] = useState(""),
    [done, setDone] = useState(false);
  async function submit(e) {
    e.preventDefault();
    if (pw !== cpw) return setErr("Passwords do not match.");
    setBusy(true);
    try {
      await api.resetPassword(token, pw);
      setDone(true);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (done)
    return (
      <div className="success-copy">
        <div className="auth-symbol success">
          <KeyRound size={22} />
        </div>
        <div className="section-kicker">PASSWORD UPDATED</div>
        <h2>You're all set.</h2>
        <p>Your password has been changed. Sign in with your new password.</p>
        <Link href={`/login?redirect=${encodeURIComponent(redirectTarget)}`} className="button button-dark full">
          Sign in
        </Link>
      </div>
    );
  return (
    <>
      <div className="auth-symbol">
        <KeyRound size={22} />
      </div>
      <div className="section-kicker">NEW PASSWORD</div>
      <h2>Create a new password.</h2>
      <p>Use at least 8 characters with a letter and a number.</p>
      <form onSubmit={submit}>
        <label className="field">
          <span>New password</span>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Confirm password</span>
          <input
            type="password"
            value={cpw}
            onChange={(e) => setCpw(e.target.value)}
            required
          />
        </label>
        {err && <div className="form-error">{err}</div>}
        <button className="button button-orange full" disabled={busy}>
          {busy ? "Updating…" : "Reset password"} <ArrowRight size={16} />
        </button>
      </form>
    </>
  );
}
