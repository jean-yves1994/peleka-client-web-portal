"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { MapPin, Truck, Navigation, RefreshCw } from "lucide-react";
import ShipmentMap from "@/components/ShipmentMap";

function TrackContent() {
  const sp = useSearchParams();

  const [id, setId] = useState(sp.get("id") || "");
  const [number, setNumber] = useState("");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  async function load() {
    try {
      let shipmentId = id;

      // Resolve shipment ID from tracking number when coming from search
      if (!shipmentId && number) {
        const result = await api.publicTrack(number);

        console.log("PUBLIC TRACK RESPONSE:", result);

        shipmentId = result.data?.shipment?.id;

        if (!shipmentId) {
          throw new Error("Shipment not found");
        }

        setId(shipmentId);
      }

      if (!shipmentId) return;

      const result = await api.track(shipmentId);

      console.log("TRACK RESPONSE:", result);

      setData(result.data);
      setErr("");
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    load();

    const t = setInterval(load, 10000);

    return () => clearInterval(t);
  }, [id, number]);

  return (
    <div>
      <div className="page-title-row">
        <div>
          <div className="page-kicker">LIVE TRACKING</div>

          <h1>Follow your shipment.</h1>

          <p>
            Rider location refreshes automatically while the shipment is active.
          </p>
        </div>

        <button className="button button-dark" onClick={load}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="track-search panel">
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter a tracking number for public tracking"
        />

        <a
          className="button button-orange"
          href={number ? `/track?number=${encodeURIComponent(number)}` : "#"}
        >
          Track number
        </a>
      </div>

      {data ? (
        <div className="tracking-map">
          <ShipmentMap
            pickup={
              data.shipment?.pickup_lat
                ? {
                    lat: Number(data.shipment.pickup_lat),
                    lng: Number(data.shipment.pickup_lng),
                  }
                : null
            }
            rider={
              data.rider_last_location
                ? {
                    lat: Number(data.rider_last_location.lat),
                    lng: Number(data.rider_last_location.lng),
                  }
                : null
            }
            delivery={
              data.shipment?.delivery_lat
                ? {
                    lat: Number(data.shipment.delivery_lat),
                    lng: Number(data.shipment.delivery_lng),
                  }
                : null
            }
          />
        </div>
      ) : (
        <div className="empty-state panel">
          <Truck size={32} />

          <strong>Choose a shipment to track</strong>

          <span>
            Open a shipment and select Track live, or use a tracking number
            above.
          </span>
        </div>
      )}

      {err && <div className="form-error">{err}</div>}
    </div>
  );
}

export default function Track() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
