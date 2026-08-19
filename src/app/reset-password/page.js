"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, KeyRound } from "lucide-react";
import { api } from "@/lib/api";

function Inner() {
  const sp = useSearchParams();
  const token = sp.get("token") || "";

  const [pw, setPw] = useState("");
  const [cpw, setCpw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setErr("");

    if (!token) {
      return setErr("This reset link is missing its token.");
    }

    if (pw !== cpw) {
      return setErr("Passwords do not match.");
    }

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

  return (
    <main className="auth-page single">
      <div className="auth-panel full-panel">
        <div className="auth-box">
          <div className="auth-symbol">
            <KeyRound size={22} />
          </div>

          <div className="section-kicker">
            {done ? "PASSWORD UPDATED" : "RESET PASSWORD"}
          </div>

          <h2>{done ? "Your password is reset." : "Create a new password."}</h2>

          <p>
            {done
              ? "Your Peleka account is ready. Sign in again with your new password."
              : "Choose a new password for your Peleka account."}
          </p>

          {done ? (
            <Link href="/login" className="button button-dark full">
              Sign in
            </Link>
          ) : (
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
          )}
        </div>
      </div>
    </main>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
