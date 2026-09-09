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
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, Math.max(map.getZoom(), 16), { animate: true });
  }, [map, position]);
  return null;
}

function ClickHandler({ onMove, disabled }) {
  useMapEvents({
    click: (event) => {
      if (!disabled) onMove([event.latlng.lat, event.latlng.lng]);
    },
  });
  return null;
}

export default function LocationVerificationMap({ initialLat, initialLng, label = "Location", onConfirm, onCancel, disabled = false }) {
  const initial = useMemo(() => {
    const lat = Number(initialLat), lng = Number(initialLng);
    return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : DEFAULT_CENTER;
  }, [initialLat, initialLng]);
  const [position, setPosition] = useState(initial);
  const [busy, setBusy] = useState(false);

  useEffect(() => setPosition(initial), [initial]);

  function move(next) {
    if (disabled || busy) return;
    setPosition(next);
  }

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
    <div className="location-verification" style={{ width: "100%" }}>
      <div className="location-verification-head">
        <div>
          <strong>Set the exact {label.toLowerCase()}</strong>
          <p>Search results only set the starting point. Drag the pin or tap the map to the exact pickup/delivery point.</p>
        </div>
        <button type="button" className="location-verification-close" onClick={onCancel} disabled={disabled || busy} aria-label="Close">×</button>
      </div>

      <div className="location-verification-map" style={{ height: "min(55vh, 420px)", minHeight: 300, width: "100%", overflow: "hidden", borderRadius: 16 }}>
        <MapContainer center={position} zoom={16} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Recenter position={position} />
          <ClickHandler onMove={move} disabled={disabled || busy} />
          <Marker
            position={position}
            icon={markerIcon}
            draggable={!disabled && !busy}
            eventHandlers={{
              dragend: (event) => {
                const p = event.target.getLatLng();
                move([p.lat, p.lng]);
              },
            }}
          />
        </MapContainer>
      </div>

      <div className="location-verification-actions" style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 10 }}>
        <span>Pin: {position[0].toFixed(6)}, {position[1].toFixed(6)}</span>
        <span style={{ fontSize: 13, opacity: 0.75 }}>Drag the pin or tap the map</span>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={disabled || busy}>Cancel</button>
        <button type="button" className="btn-primary" onClick={confirm} disabled={disabled || busy}>{busy ? "Verifying…" : "Confirm exact location"}</button>
      </div>
    </div>
  );
}
