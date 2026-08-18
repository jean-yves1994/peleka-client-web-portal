"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Save, UserRound } from "lucide-react";
export default function Settings() {
  const [u, setU] = useState({}),
    [msg, setMsg] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    api
      .me()
      .then((x) => setU(x?.data?.user || x?.user || {}))
      .catch(() => {});
  }, []);
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const r = await api.profile({ full_name: u.full_name, phone: u.phone });
      setU(r?.data?.user || r?.user || u);
      setMsg("Profile updated.");
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <div className="page-title-row">
        <div>
          <div className="page-kicker">ACCOUNT</div>
          <h1>Profile & security</h1>
          <p>Keep your customer information up to date.</p>
        </div>
      </div>
      <section className="panel settings-panel">
        <div className="form-section-head">
          <div className="form-icon">
            <UserRound size={19} />
          </div>
          <div>
            <h2>Personal information</h2>
            <p>Email and phone are managed as your account identifiers.</p>
          </div>
        </div>
        <form onSubmit={save}>
          <div className="two-col">
            <label className="field">
              <span>Full name</span>
              <input
                value={u.full_name || ""}
                onChange={(e) => setU({ ...u, full_name: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Phone</span>
              <input
                value={u.phone || ""}
                onChange={(e) => setU({ ...u, phone: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Email</span>
              <input value={u.email || ""} disabled />
            </label>
          </div>
          {msg && <div className="success-note">{msg}</div>}
          <button className="button button-dark" disabled={busy}>
            <Save size={16} />
            {busy ? "Saving…" : "Save changes"}
          </button>
        </form>
      </section>
    </div>
  );
}
