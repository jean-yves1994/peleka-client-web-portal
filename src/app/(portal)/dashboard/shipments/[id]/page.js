"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Image as ImageIcon,
  MapPinned,
  Phone,
  Truck,
} from "lucide-react";
import { api } from "@/lib/api";
const label = (s) =>
  String(s || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
const money = (n, c = "RWF") =>
  new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: c,
    maximumFractionDigits: 0,
  }).format(Number(n || 0));
export default function Detail() {
  const { id } = useParams();
  const [data, setData] = useState(null),
    [loading, setLoading] = useState(true),
    [payPhone, setPayPhone] = useState(""),
    [paying, setPaying] = useState(false),
    [msg, setMsg] = useState("");
  async function load() {
    try {
      setData(await api.shipment(id));
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [id]);
  async function pay() {
    setPaying(true);
    try {
      const r = await api.initiatePayment(id, payPhone || undefined);
      window.location.href = `/dashboard/shipments/${id}/payment?payment=${r?.data?.payment_id || r?.payment_id}`;
    } catch (e) {
      setMsg(e.message);
    } finally {
      setPaying(false);
    }
  }
  if (loading)
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  if (!data?.shipment)
    return <div className="empty-state">{msg || "Shipment not found"}</div>;
  const s = data.shipment,
    billing = data.customer_billing,
    unpaid = data.payments?.length
      ? data.payments.every((p) => p.status !== "paid")
      : true,
    premier =
      billing?.customer_type === "premier" || billing?.contract_customer;
  return (
    <div>
      <Link href="/dashboard/shipments" className="back-link">
        <ArrowLeft size={15} /> Back to shipments
      </Link>
      <div className="detail-head">
        <div>
          <div className="page-kicker">{s.tracking_number}</div>
          <h1>
            {s.pickup_city || "Pickup"} <span>→</span>{" "}
            {s.delivery_city || "Delivery"}
          </h1>
          <p>Created {new Date(s.created_at).toLocaleString()}</p>
        </div>
        <span className={`status big status-${s.status}`}>
          {label(s.status)}
        </span>
      </div>
      <div className="detail-grid">
        <div className="detail-main">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Shipment journey</h2>
                <p>Every status update from Peleka.</p>
              </div>
              <Link
                href={`/dashboard/track?id=${s.id}`}
                className="button button-dark"
              >
                <MapPinned size={16} /> Track live
              </Link>
            </div>
            <div className="timeline">
              {(data.status_history || []).map((h, i) => (
                <div className="timeline-row" key={h.id || i}>
                  <div
                    className={`timeline-dot ${i === (data.status_history || []).length - 1 ? "current" : ""}`}
                  >
                    {i === data.status_history.length - 1 ? (
                      <Truck size={12} />
                    ) : (
                      <CheckCircle2 size={12} />
                    )}
                  </div>
                  <div>
                    <strong>{label(h.to_status)}</strong>
                    <span>{h.note || "Status updated"}</span>
                    <small>{new Date(h.created_at).toLocaleString()}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Proof of delivery</h2>
                <p>Photos captured at pickup and delivery.</p>
              </div>
            </div>
            <div className="proof-grid">
              {(data.proofs || []).map((p) => (
                <a
                  className="proof"
                  href={p.file_url}
                  target="_blank"
                  key={p.id}
                >
                  <img src={p.file_url} alt={p.kind} />
                  <div>
                    <ImageIcon size={14} />
                    {label(p.kind)}
                  </div>
                </a>
              ))}
              {!(data.proofs || []).length && (
                <div className="muted-box">
                  Proof photos will appear here when captured.
                </div>
              )}
            </div>
          </section>
        </div>
        <aside className="detail-side">
          <section className="panel">
            <div className="section-kicker">PAYMENT</div>
            <div className="detail-total">
              {money(s.total_price, s.currency || "RWF")}
            </div>
            <div className="billing-note">
              {premier ? "Premier invoice" : "Standard shipment"} ·{" "}
              {unpaid ? "Outstanding" : "Paid"}
            </div>
            {unpaid && (
              <>
                <input
                  className="standalone-input"
                  value={payPhone}
                  onChange={(e) => setPayPhone(e.target.value)}
                  placeholder="Mobile Money phone (e.g. 078…)"
                />
                <button
                  className="button button-orange full"
                  disabled={paying}
                  onClick={pay}
                >
                  {paying ? "Starting payment…" : "Pay with Mobile Money"}{" "}
                  <CreditCard size={16} />
                </button>
              </>
            )}
          </section>
          <section className="panel">
            <div className="section-kicker">RECIPIENT</div>
            <h3>{s.recipient_name}</h3>
            <p className="muted">{s.recipient_phone}</p>
            <Link
              href={`/dashboard/shipments/${s.id}/contact`}
              className="quick-action compact"
            >
              <Phone size={16} />
              <div>
                <strong>Contact details</strong>
                <span>View permitted contact information</span>
              </div>
            </Link>
          </section>
        </aside>
      </div>
      {msg && <div className="toast-error">{msg}</div>}
    </div>
  );
}
