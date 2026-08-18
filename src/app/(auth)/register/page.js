"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, saveAuth, saveUser } from "@/lib/api";
export default function Register() {
  const [f, setF] = useState({
      full_name: "",
      email: "",
      confirm_email: "",
      phone: "",
      confirm_phone: "",
      password: "",
      confirm_password: "",
    }),
    [err, setErr] = useState(""),
    [busy, setBusy] = useState(false),
    router = useRouter(),
    searchParams = useSearchParams();

  const redirectTarget = () => {
    const value = searchParams.get("redirect") || "/dashboard";
    return value.startsWith("/") ? value : "/dashboard";
  };

  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (!f.email && !f.phone)
      return setErr("Enter at least an email or phone number.");
    if (f.email !== f.confirm_email)
      return setErr("Email addresses do not match.");
    if (f.phone && f.phone !== f.confirm_phone)
      return setErr("Phone numbers do not match.");
    if (f.password !== f.confirm_password)
      return setErr("Passwords do not match.");
    setBusy(true);
    try {
      const r = await api.register(f),
        d = r?.data || r;
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
          <div className="section-kicker">JOIN PELEKA</div>
          <h1>
            Ship from
            <br />
            <em>your desk.</em>
          </h1>
          <p>
            Create deliveries, follow shipments and manage your account from one
            clean workspace.
          </p>
        </div>
        <span>Your account is active immediately after registration.</span>
      </div>
      <div className="auth-panel">
        <Link href="/" className="mobile-auth-brand brand">
          PELEKA<span>.</span>
        </Link>
        <div className="auth-box wide">
          <div className="section-kicker">CREATE ACCOUNT</div>
          <h2>Let's get you moving.</h2>
          <p>
            Email or phone is required. Confirm contact details and password
            before creating your account.
          </p>
          <form onSubmit={submit}>
            <label className="field">
              <span>Full name</span>
              <div className="input-with-icon">
                <UserRound size={17} />
                <input
                  value={f.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  required
                />
              </div>
            </label>
            <div className="two-col">
              <Field
                icon={Mail}
                label="Email"
                value={f.email}
                onChange={(v) => set("email", v)}
                type="email"
              />
              <Field
                icon={Mail}
                label="Confirm email"
                value={f.confirm_email}
                onChange={(v) => set("confirm_email", v)}
                type="email"
              />
              <Field
                icon={Phone}
                label="Phone"
                value={f.phone}
                onChange={(v) => set("phone", v)}
              />
              <Field
                icon={Phone}
                label="Confirm phone"
                value={f.confirm_phone}
                onChange={(v) => set("confirm_phone", v)}
              />
              <Field
                icon={LockKeyhole}
                label="Password"
                value={f.password}
                onChange={(v) => set("password", v)}
                type="password"
              />
              <Field
                icon={LockKeyhole}
                label="Confirm password"
                value={f.confirm_password}
                onChange={(v) => set("confirm_password", v)}
                type="password"
              />
            </div>
            {err && <div className="form-error">{err}</div>}
            <button className="button button-orange full" disabled={busy}>
              {busy ? "Creating account…" : "Create account"}{" "}
              <ArrowRight size={16} />
            </button>
          </form>
          <p className="auth-bottom">
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(
                searchParams.get("redirect") || "/dashboard",
              )}`}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
function Field({ icon: Icon, label, value, onChange, type = "text" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-with-icon">
        <Icon size={17} />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={label !== "Email" && label !== "Phone" ? false : true}
        />
      </div>
    </label>
  );
}
