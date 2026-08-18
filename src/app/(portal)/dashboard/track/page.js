"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { MapPin, Truck, Navigation, RefreshCw } from "lucide-react";
export default function Track() {
  const sp = useSearchParams();
  const [id, setId] = useState(sp.get("id") || "");
  const [number, setNumber] = useState("");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  async function load() {
    if (!id) return;
    try {
      setData(await api.track(id));
      setErr("");
    } catch (e) {
      setErr(e.message);
    }
  }
  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [id]);
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
        <div className="tracking-layout">
          <div className="tracking-map">
            <div className="map-grid large" />
            <div className="route-line big" />
            <div className="track-pin start">
              <MapPin size={19} />
            </div>
            <div className="track-pin rider">
              <Truck size={19} />
            </div>
            <div className="track-pin end">
              <MapPin size={19} />
            </div>
            <div className="track-map-label start-label">Pickup</div>
            <div className="track-map-label rider-label">Rider</div>
            <div className="track-map-label end-label">Delivery</div>
          </div>
          <div className="panel tracking-info">
            <div className="section-kicker">TRACKING</div>
            <h2>{data.shipment?.tracking_number}</h2>
            <span className={`status big status-${data.shipment?.status}`}>
              {String(data.shipment?.status || "").replaceAll("_", " ")}
            </span>
            <div className="track-locations">
              <div>
                <MapPin size={17} />
                <span>
                  <small>Pickup</small>
                  {data.shipment?.pickup_city || "—"}
                </span>
              </div>
              <div>
                <Navigation size={17} />
                <span>
                  <small>Rider location</small>
                  {data.rider_last_location
                    ? `${Number(data.rider_last_location.lat).toFixed(5)}, ${Number(data.rider_last_location.lng).toFixed(5)}`
                    : "Not available yet"}
                </span>
              </div>
              <div>
                <MapPin size={17} />
                <span>
                  <small>Delivery</small>
                  {data.shipment?.delivery_city || "—"}
                </span>
              </div>
            </div>
          </div>
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
