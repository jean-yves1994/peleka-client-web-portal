"use client";
import Link from "next/link";
import { ArrowUpRight, Filter, Plus, Search } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";
import { useEffect, useState } from "react";
const statusLabel = (s) => String(s || "").replaceAll("_", " ").replace(/\b\w/g, (m) => m.toUpperCase());
export default function Shipments() {
  const [rows, setRows] = useState([]), [q, setQ] = useState(""), [status, setStatus] = useState(""), [loading, setLoading] = useState(true);
  async function load() { setLoading(true); try { const r = await api.shipments(`pageSize=100${status ? `&status=${status}` : ""}`); setRows(r?.data || r?.items || []); } catch (e) {} finally { setLoading(false); } }
  useEffect(() => { load(); }, [status]);
  const filtered = rows.filter((s) => `${s.tracking_number} ${s.pickup_address} ${s.delivery_address}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="page-title-row"><div><div className="page-kicker">DELIVERIES</div><h1>Your shipments</h1><p>Every shipment you've created, in one place.</p></div><Link href="/dashboard/shipments/new" className="button button-orange"><Plus size={17} /> New shipment</Link></div>
      <div className="panel table-panel">
        <div className="toolbar"><div className="search-box"><Search size={17} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tracking number or address" /></div><div className="select-wrap"><Filter size={16} /><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{["pending_payment","awaiting_assignment","assigned","rider_en_route_to_pickup","picked_up","in_transit","out_for_delivery","delivered","cancelled"].map((x) => <option key={x} value={x}>{statusLabel(x)}</option>)}</select></div></div>
        {loading ? <div className="empty-state">Loading…</div> : filtered.length === 0 ? <div className="empty-state"><strong>No shipments found</strong><span>Try another search or create a shipment.</span></div> : (
          <div className="table-scroll"><table><thead><tr><th>Shipment</th><th>Route</th><th>Status</th><th>Payment</th><th>Total</th><th></th></tr></thead><tbody>{filtered.map((s) => <tr key={s.id}><td><Link className="table-link" href={`/dashboard/shipments/${s.id}`}>{s.tracking_number}</Link><small>{new Date(s.created_at).toLocaleDateString()}</small></td><td><span>{s.pickup_city || "—"} → {s.delivery_city || "—"}</span></td><td><span className={`status status-${s.status}`}>{statusLabel(s.status)}</span></td><td>{s.payment_status === "paid" ? <span className="paid">Paid</span> : <span className="unpaid">{s.customer_type === "premier" ? "Invoice" : "Payment due"}</span>}</td><td><strong>{formatCurrency(s.total_price)}</strong></td><td><Link href={`/dashboard/shipments/${s.id}`}><ArrowUpRight size={17} /></Link></td></tr>)}</tbody></table></div>
        )}
      </div>
    </div>
  );
}
