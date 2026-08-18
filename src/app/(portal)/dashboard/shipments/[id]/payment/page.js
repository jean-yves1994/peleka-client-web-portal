"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, LoaderCircle, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
export default function Payment() {
  const { id } = useParams(),
    sp = useSearchParams();
  const pid = sp.get("payment");
  const [p, setP] = useState(null),
    [err, setErr] = useState("");
  useEffect(() => {
    let timer;
    async function check() {
      try {
        const x = await api.payment(pid);
        setP(x?.data || x);
        if ((x?.data || x)?.status === "paid") {
          clearInterval(timer);
        }
      } catch (e) {
        setErr(e.message);
      }
    }
    if (pid) {
      check();
      timer = setInterval(check, 3000);
    }
    return () => clearInterval(timer);
  }, [pid]);
  return (
    <div className="center-page">
      <div className="payment-card">
        <div
          className={`payment-icon ${p?.status === "paid" ? "success" : ""}`}
        >
          {p?.status === "paid" ? (
            <CheckCircle2 size={30} />
          ) : (
            <LoaderCircle size={30} className="spin" />
          )}
        </div>
        <div className="section-kicker">PELEKA PAYMENT</div>
        <h1>
          {p?.status === "paid"
            ? "Payment confirmed"
            : "Approve payment on your phone"}
        </h1>
        <p>
          {p?.status === "paid"
            ? "Your shipment is now being prepared for assignment."
            : "Check your Mobile Money phone and approve the payment request. This page will update automatically."}
        </p>
        {err && <div className="form-error">{err}</div>}
        <Link
          href={`/dashboard/shipments/${id}`}
          className="button button-dark"
        >
          <ArrowLeft size={16} /> Back to shipment
        </Link>
      </div>
    </div>
  );
}
