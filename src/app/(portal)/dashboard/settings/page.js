"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Eye, EyeOff, LockKeyhole, Save, UserRound } from "lucide-react";
export default function Settings() {
  const [u, setU] = useState({}),
    [msg, setMsg] = useState(""),
    [busy, setBusy] = useState(false),
    [passwords, setPasswords] = useState({ current_password: "", new_password: "", confirm_password: "" }),
    [passwordBusy, setPasswordBusy] = useState(false),
    [passwordMsg, setPasswordMsg] = useState(""),
    [passwordErr, setPasswordErr] = useState(""),
    [showPasswords, setShowPasswords] = useState({ current: false, next: false, confirm: false });
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
  async function changePassword(e) {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordErr("");
    if (!passwords.current_password) return setPasswordErr("Enter your current password.");
    if (passwords.new_password.length < 8 || !/[A-Za-z]/.test(passwords.new_password) || !/[0-9]/.test(passwords.new_password)) {
      return setPasswordErr("New password must be at least 8 characters and include a letter and a number.");
    }
    if (passwords.new_password !== passwords.confirm_password) return setPasswordErr("New password and confirmation do not match.");
    setPasswordBusy(true);
    try {
      const r = await api.changePassword({ current_password: passwords.current_password, new_password: passwords.new_password });
      setPasswords({ current_password: "", new_password: "", confirm_password: "" });
      setPasswordMsg(r?.data?.message || r?.message || "Password updated successfully.");
    } catch (e) {
      setPasswordErr(e.message || "Unable to change password.");
    } finally { setPasswordBusy(false); }
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
      <section className="panel settings-panel">
        <div className="form-section-head">
          <div className="form-icon"><LockKeyhole size={19} /></div>
          <div><h2>Password & security</h2><p>Change your password to keep your account secure.</p></div>
        </div>
        <form onSubmit={changePassword}>
          {passwordMsg && <div className="success-note">{passwordMsg}</div>}
          {passwordErr && <div className="error-note">{passwordErr}</div>}
          <div className="two-col">
            <label className="field"><span>Current password</span><div className="password-field"><input required type={showPasswords.current ? "text" : "password"} value={passwords.current_password} onChange={(e)=>setPasswords({...passwords,current_password:e.target.value})} autoComplete="current-password" /><button type="button" className="password-toggle" onClick={()=>setShowPasswords({...showPasswords,current:!showPasswords.current})} aria-label={showPasswords.current?"Hide password":"Show password"}>{showPasswords.current?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label><label className="field"><span>New password</span><div className="password-field"><input required type={showPasswords.next ? "text" : "password"} value={passwords.new_password} onChange={(e)=>setPasswords({...passwords,new_password:e.target.value})} autoComplete="new-password" /><button type="button" className="password-toggle" onClick={()=>setShowPasswords({...showPasswords,next:!showPasswords.next})} aria-label={showPasswords.next?"Hide password":"Show password"}>{showPasswords.next?<EyeOff size={17}/>:<Eye size={17}/>}</button></div><small>Minimum 8 characters, including a letter and a number.</small></label><label className="field"><span>Confirm new password</span><div className="password-field"><input required type={showPasswords.confirm ? "text" : "password"} value={passwords.confirm_password} onChange={(e)=>setPasswords({...passwords,confirm_password:e.target.value})} autoComplete="new-password" /><button type="button" className="password-toggle" onClick={()=>setShowPasswords({...showPasswords,confirm:!showPasswords.confirm})} aria-label={showPasswords.confirm?"Hide password":"Show password"}>{showPasswords.confirm?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
          </div>
          <button className="button button-dark" disabled={passwordBusy}><LockKeyhole size={16}/>{passwordBusy ? "Updating…" : "Change password"}</button>
        </form>
      </section>
    </div>
  );
}
