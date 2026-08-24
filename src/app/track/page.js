"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, MapPin, PackageSearch } from "lucide-react";
import { api } from "@/lib/api";
const label = (s) =>
  String(s || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
function Inner() {
  const sp = useSearchParams();
  const [number, setNumber] = useState(sp.get("number") || "");
  const [data, setData] = useState(null),
    [err, setErr] = useState(""),
    [busy, setBusy] = useState(false);
  async function search() {
    if (!number.trim()) return;
    setBusy(true);
    try {
      const response = await api.publicTrack(number.trim());

      // The public tracking endpoint returns:
      // { success: true, data: { shipment, timeline } }
      // Unwrap the standard Peleka API response before rendering.
      setData(response?.data || response);
      setErr("");
    } catch (e) {
      setData(null);
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (number) search();
  }, []);
  return (
    <main className="public-page">
      <header className="public-header">
        <Link href="/" className="brand">
          PELEKA<span>.</span>
        </Link>
        <Link href="/login" className="button button-dark">
          Customer login
        </Link>
      </header>
      <div className="public-track">
        <div className="section-kicker">SHIPMENT TRACKING</div>
        <h1>Where is your shipment?</h1>
        <p>
          Enter your Peleka tracking number to see the latest delivery status.
        </p>
        <div className="public-search">
          <PackageSearch size={20} />
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="e.g. PKL-000123"
          />
          <button
            className="button button-orange"
            onClick={search}
            disabled={busy}
          >
            {busy ? "Searching…" : "Track"}
          </button>
        </div>
        {err && <div className="form-error">{err}</div>}
        {data && (
          <div className="public-result panel">
            <div className="public-result-head">
              <div>
                <small>TRACKING NUMBER</small>
                <h2>{data.shipment.tracking_number}</h2>
              </div>
              <span className={`status big status-${data.shipment.status}`}>
                {label(data.shipment.status)}
              </span>
            </div>
            <div className="public-route">
              <div>
                <MapPin size={19} />
                <span>
                  Pickup<strong>{data.shipment.pickup_city || "—"}</strong>
                </span>
              </div>
              <div className="route-divider" />
              <div>
                <MapPin size={19} />
                <span>
                  Delivery<strong>{data.shipment.delivery_city || "—"}</strong>
                </span>
              </div>
            </div>
            <div className="public-timeline">
              {(data.timeline || []).map((x, i) => (
                <div key={i}>
                  <span className="timeline-mini">
                    <CheckCircle2 size={13} />
                  </span>
                  <div>
                    <strong>{label(x.status)}</strong>
                    <small>{new Date(x.created_at).toLocaleString()}</small>
                    <p>{x.note || ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <Link href="/" className="back-link">
          <ArrowLeft size={15} /> Back to Peleka
        </Link>
      </div>
    </main>
  );
}
export default function Track() {
  return <Inner />;
}
