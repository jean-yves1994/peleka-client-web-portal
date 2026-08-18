"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail, Phone } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, saveAuth, saveUser } from "@/lib/api";
export default function Login() {
  const [identifier, setIdentifier] = useState(""),
    [password, setPassword] = useState(""),
    [err, setErr] = useState(""),
    [busy, setBusy] = useState(false),
    router = useRouter(),
    searchParams = useSearchParams();

  const redirectTarget = () => {
    const value = searchParams.get("redirect") || "/dashboard";
    return value.startsWith("/") ? value : "/dashboard";
  };

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const body = identifier.includes("@")
        ? { email: identifier.trim(), password }
        : { phone: identifier.trim(), password };
      const r = await api.login(body);
      const d = r?.data || r;
      saveAuth(d);
      saveUser(d.user);
      router.replace(redirectTarget());
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-page">
      <div className="auth-art">
        <Link href="/" className="brand">
          PELEKA<span>.</span>
        </Link>
        <div>
          <div className="section-kicker">CUSTOMER PORTAL</div>
          <h1>
            Delivery control,
            <br />
            <em>on your screen.</em>
          </h1>
          <p>
            Create shipments, manage deliveries and follow your rider without
            leaving your desk.
          </p>
        </div>
        <span>Move anything. We'll get it there.</span>
      </div>
      <div className="auth-panel">
        <Link href="/" className="mobile-auth-brand brand">
          PELEKA<span>.</span>
        </Link>
        <div className="auth-box">
          <div className="section-kicker">WELCOME BACK</div>
          <h2>Sign in</h2>
          <p>Use your email or phone and password.</p>
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
            <label className="field">
              <span>Password</span>
              <div className="input-with-icon">
                <LockKeyhole size={17} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Your password"
                />
              </div>
            </label>
            {err && <div className="form-error">{err}</div>}
            <button className="button button-dark full" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"} <ArrowRight size={16} />
            </button>
          </form>
          <Link
            className="auth-link"
            href={`/forgot-password?redirect=${encodeURIComponent(
              searchParams.get("redirect") || "/dashboard",
            )}`}
          >
            Forgot password?
          </Link>
          <div className="auth-divider">
            <span />
            or
            <span />
          </div>
          <p className="auth-bottom">
            New to Peleka?{" "}
            <Link
              href={`/register?redirect=${encodeURIComponent(
                searchParams.get("redirect") || "/dashboard",
              )}`}
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
