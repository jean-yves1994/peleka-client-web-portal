"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, LoaderCircle, ArrowLeft, CreditCard } from "lucide-react";
import { api } from "@/lib/api";

export default function GuestPayment() {
  const [shipment, setShipment] = useState(null);
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [payment, setPayment] = useState(null);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("peleka_guest_shipment") || "null");
      if (!saved?.id || !saved?.guest_access_token) {
        setErr("Your guest shipment session has expired. Please create the shipment again.");
        return;
      }
      setShipment(saved);
    } catch { setErr("Unable to restore your shipment."); }
  }, []);

  useEffect(() => {
    if (!payment?.payment_id || !shipment?.guest_access_token || paid) return;
    const timer = setInterval(async () => {
      try {
        const r = await api.guestPayment(payment.payment_id, shipment.guest_access_token);
        const p = r?.data || r;
        setPayment(p);
        if (p.status === "paid") { setPaid(true); clearInterval(timer); }
        if (p.status === "failed") { setErr("Payment was not completed. You can try again."); clearInterval(timer); }
      } catch {}
    }, 3000);
    return () => clearInterval(timer);
  }, [payment?.payment_id, shipment?.guest_access_token, paid]);

  async function startPayment() {
    setErr("");
    if (!phone.trim()) { setErr("Enter the Mobile Money phone number."); return; }
    setBusy(true);
    try {
      const r = await api.initiateGuestPayment(shipment.id, phone.trim(), shipment.guest_access_token);
      setPayment(r?.data || r);
    } catch (e) { setErr(e.message || "Unable to start payment."); }
    finally { setBusy(false); }
  }

  if (!shipment) return <main className="center-page"><div className="payment-card"><h1>Guest payment</h1><p>{err || "Loading shipment…"}</p><Link href="/ship" className="button button-dark">Create shipment again</Link></div></main>;

  return <main className="center-page"><div className="payment-card">
    <div className={`payment-icon ${paid ? "success" : ""}`}>{paid ? <CheckCircle2 size={30}/> : <CreditCard size={30}/>}</div>
    <div className="section-kicker">PELEKA GUEST PAYMENT</div>
    <h1>{paid ? "Shipment created successfully" : "Pay for your shipment"}</h1>
    <p>{paid ? "Payment confirmed. Your shipment is awaiting rider assignment." : "Approve the Mobile Money request on your phone."}</p>
    <div className="panel" style={{padding:20,margin:"20px 0",textAlign:"left"}}><small>TRACKING NUMBER</small><h2>{shipment.tracking_number}</h2><strong>{new Intl.NumberFormat("en-RW",{style:"currency",currency:"RWF",maximumFractionDigits:0}).format(Number(shipment.total_price||0))}</strong></div>
    {!paid && <><label className="field"><span>Mobile Money phone</span><input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+250 7..." /></label><button className="button button-orange full" onClick={startPayment} disabled={busy}>{busy?"Starting payment…":"Pay securely"}</button></>}
    {err && <div className="form-error">{err}</div>}
    {payment?.status === "pending" && !paid && <p><LoaderCircle size={16} className="spin"/> Check your phone and approve the payment.</p>}
    {paid && <div style={{display:"grid",gap:10,marginTop:18}}><Link className="button button-orange" href={`/track?number=${encodeURIComponent(shipment.tracking_number)}&guest_access_token=${encodeURIComponent(shipment.guest_access_token)}`}>Track shipment</Link><Link className="button button-dark" href="/register">Create a Peleka account</Link></div>}
    <Link href="/ship" className="back-link" style={{display:"inline-flex",marginTop:18}}><ArrowLeft size={15}/> Back to shipping</Link>
  </div></main>;
}
