"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [-1.9441, 30.0619];

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, Math.max(map.getZoom(), 16), { animate: true });
  }, [map, position]);
  return null;
}

function ClickHandler({ onMove }) {
  useMapEvents({ click: (event) => onMove([event.latlng.lat, event.latlng.lng]) });
  return null;
}

export default function LocationVerificationMap({
  initialLat,
  initialLng,
  label = "Location",
  onConfirm,
  onCancel,
  disabled = false,
}) {
  const initial = useMemo(() => {
    const lat = Number(initialLat);
    const lng = Number(initialLng);
    return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : DEFAULT_CENTER;
  }, [initialLat, initialLng]);
  const [position, setPosition] = useState(initial);
  const [busy, setBusy] = useState(false);

  useEffect(() => setPosition(initial), [initial]);

  async function confirm() {
    if (disabled || busy) return;
    setBusy(true);
    try {
      await onConfirm({ lat: position[0], lng: position[1] });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="location-verification">
      <div className="location-verification-head">
        <div>
          <strong>Confirm {label.toLowerCase()}</strong>
          <p>Move the pin to the exact pickup/delivery point. The final pin is used for routing and pricing.</p>
        </div>
        <button type="button" className="location-verification-close" onClick={onCancel} disabled={disabled || busy} aria-label="Close">
          ×
        </button>
      </div>

      <div className="location-verification-map">
        <MapContainer center={position} zoom={16} scrollWheelZoom>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Recenter position={position} />
          <ClickHandler onMove={setPosition} />
          <Marker
            position={position}
            icon={markerIcon}
            draggable={!disabled && !busy}
            eventHandlers={{ dragend: (event) => {
              const p = event.target.getLatLng();
              setPosition([p.lat, p.lng]);
            } }}
          />
        </MapContainer>
      </div>

      <div className="location-verification-actions">
        <span>Exact point: {position[0].toFixed(6)}, {position[1].toFixed(6)}</span>
        <div>
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={disabled || busy}>Cancel</button>
          <button type="button" className="btn-primary" onClick={confirm} disabled={disabled || busy}>
            {busy ? "Verifying…" : "Confirm exact location"}
          </button>
        </div>
      </div>
    </div>
  );
}
