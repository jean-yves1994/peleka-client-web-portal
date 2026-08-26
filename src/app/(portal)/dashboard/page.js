"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  PackageCheck,
  Plus,
  WalletCards,
  MapPinned,
  Truck,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";
import { useEffect, useState } from "react";

const statusLabel = (s) =>
  String(s || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

export default function Dashboard() {
  const [shipments, setShipments] = useState([]),
    [billing, setBilling] = useState(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([api.shipments("pageSize=5"), api.billing()])
      .then(([s, b]) => {
        setShipments(s?.data || s?.items || []);
        setBilling(b);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  const active = shipments.filter(
    (s) => !["delivered", "cancelled", "returned"].includes(s.status),
  ).length;
  return (
    <div>
      <div className="page-title-row">
        <div>
          <div className="page-kicker">CUSTOMER PORTAL</div>
          <h1>Good to see you.</h1>
          <p>Manage your deliveries from one place.</p>
        </div>
        <Link href="/dashboard/shipments/new" className="button button-orange">
          <Plus size={17} /> New shipment
        </Link>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon orange"><PackageCheck size={19} /></div>
          <small>ACTIVE SHIPMENTS</small><strong>{active}</strong>
          <span>currently moving or assigned</span>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon brown"><Clock3 size={19} /></div>
          <small>RECENT DELIVERIES</small>
          <strong>{shipments.filter((s) => s.status === "delivered").length}</strong>
          <span>in this view</span>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><WalletCards size={19} /></div>
          <small>OUTSTANDING</small>
          <strong>{formatCurrency(billing?.outstanding_balance)}</strong>
          <span>{billing?.customer_type === "premier" ? "Premier invoice balance" : "standard account"}</span>
        </div>
      </div>
      <div className="content-grid">
        <section className="panel large">
          <div className="panel-head"><div><h2>Recent shipments</h2><p>Your latest delivery activity.</p></div><Link href="/dashboard/shipments">View all <ArrowUpRight size={15} /></Link></div>
          {loading ? <div className="empty-state">Loading shipments…</div> : shipments.length === 0 ? (
            <div className="empty-state"><PackageCheck size={30} /><strong>No shipments yet</strong><span>Create your first delivery to get started.</span><Link href="/dashboard/shipments/new" className="button button-dark">Create shipment</Link></div>
          ) : (
            <div className="shipment-list">
              {shipments.map((s) => (
                <Link href={`/dashboard/shipments/${s.id}`} key={s.id} className="shipment-row">
                  <div className="shipment-mark"><TruckIcon /></div>
                  <div className="shipment-main"><strong>{s.tracking_number}</strong><span>{s.pickup_city || "Pickup"} <b>→</b> {s.delivery_city || "Delivery"}</span></div>
                  <div className="shipment-status"><span className={`status status-${s.status}`}>{statusLabel(s.status)}</span><small>{formatCurrency(s.total_price)}</small></div>
                  <ArrowUpRight size={17} />
                </Link>
              ))}
            </div>
          )}
        </section>
        <section className="panel quick">
          <div className="panel-head"><div><h2>Quick actions</h2><p>Common tasks.</p></div></div>
          <Link href="/dashboard/shipments/new" className="quick-action"><Plus size={19} /><div><strong>Create shipment</strong><span>Get a quote and book delivery</span></div><ArrowUpRight size={15} /></Link>
          <Link href="/dashboard/track" className="quick-action"><MapPinned size={19} /><div><strong>Track shipment</strong><span>See active deliveries</span></div><ArrowUpRight size={15} /></Link>
        </section>
      </div>
    </div>
  );
}
function TruckIcon() { return <Truck size={18} />; }
