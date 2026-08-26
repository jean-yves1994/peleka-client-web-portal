"use client";

import { Suspense, useEffect, useState } from "react";
import { Truck, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import ShipmentMap from "@/components/ShipmentMap";

function TrackContent() {
  const sp = useSearchParams();
  const [id, setId] = useState(sp.get("id") || "");
  const [number, setNumber] = useState(sp.get("number") || "");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      let shipmentId = id;

      if (!shipmentId && number.trim()) {
        const result = await api.shipments(
          `tracking_number=${encodeURIComponent(number.trim())}`,
        );
        const shipments = result?.data || result?.items || [];
        const shipment = Array.isArray(shipments)
          ? shipments.find(
              (item) =>
                String(item.tracking_number || "").toUpperCase() ===
                number.trim().toUpperCase(),
            )
          : null;

        if (!shipment?.id) {
          throw new Error("Shipment not found in your account");
        }

        shipmentId = shipment.id;
        setId(shipmentId);
      }

      if (!shipmentId) return;

      const result = await api.track(shipmentId);
      setData(result?.data || result);
      setErr("");
    } catch (e) {
      setData(null);
      setErr(e.message || "Unable to load shipment tracking.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!id) return;
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div>
      <div className="page-title-row">
        <div>
          <div className="page-kicker">LIVE TRACKING</div>
          <h1>Follow your shipment.</h1>
          <p>Rider location refreshes automatically while the shipment is active.</p>
        </div>
        <button className="button button-dark" onClick={load} disabled={loading}>
          <RefreshCw size={16} /> {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="track-search panel">
        <input
          value={number}
          onChange={(e) => {
            setNumber(e.target.value);
            setId("");
            setData(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Enter your tracking number"
        />
        <button
          className="button button-orange"
          type="button"
          onClick={load}
          disabled={!number.trim() || loading}
        >
          {loading ? "Tracking…" : "Track number"}
        </button>
      </div>

      {data ? (
        <div className="tracking-map">
          <ShipmentMap
            pickup={data.shipment?.pickup_lat ? { lat: Number(data.shipment.pickup_lat), lng: Number(data.shipment.pickup_lng) } : null}
            rider={data.rider_last_location ? { lat: Number(data.rider_last_location.lat), lng: Number(data.rider_last_location.lng) } : null}
            delivery={data.shipment?.delivery_lat ? { lat: Number(data.shipment.delivery_lat), lng: Number(data.shipment.delivery_lng) } : null}
          />
        </div>
      ) : (
        <div className="empty-state panel">
          <Truck size={32} />
          <strong>Choose a shipment to track</strong>
          <span>Open a shipment and select Track live, or enter one of your tracking numbers above.</span>
        </div>
      )}

      {err && <div className="form-error">{err}</div>}
    </div>
  );
}

export default function Track() {
  return (
    <Suspense fallback={null}>
      <TrackContent />
    </Suspense>
  );
}
