"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ReceiptText, WalletCards } from "lucide-react";
const money = (n, c = "RWF") =>
  new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: c,
    maximumFractionDigits: 0,
  }).format(Number(n || 0));
export default function Billing() {
  const [b, setB] = useState(null);
  useEffect(() => {
    api
      .billing()
      .then((x) => setB(x?.data || x))
      .catch(() => {});
  }, []);
  return (
    <div>
      <div className="page-title-row">
        <div>
          <div className="page-kicker">BILLING</div>
          <h1>Payments & balance</h1>
          <p>Review your Peleka shipment charges and outstanding balance.</p>
        </div>
      </div>
      <div className="billing-hero panel">
        <div>
          <div className="section-kicker">
            {b?.customer_type === "premier"
              ? "PREMIER ACCOUNT"
              : "STANDARD ACCOUNT"}
          </div>
          <h2>{money(b?.outstanding_balance)}</h2>
          <p>Current outstanding balance</p>
        </div>
        <div className="billing-icon">
          <WalletCards size={26} />
        </div>
      </div>
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Shipment billing history</h2>
            <p>Latest charges and payment states.</p>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Shipment</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(b?.shipment_history || []).map((s) => (
                <tr key={s.id}>
                  <td>{s.tracking_number}</td>
                  <td>{String(s.status || "").replaceAll("_", " ")}</td>
                  <td>
                    {s.payment_status === "paid" ? (
                      <span className="paid">Paid</span>
                    ) : (
                      <span className="unpaid">
                        {b?.customer_type === "premier" ? "Outstanding" : "Due"}
                      </span>
                    )}
                  </td>
                  <td>
                    <strong>{money(s.total_price, s.currency || "RWF")}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
