"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect } from "react";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function ShipmentMap({ pickup, rider, delivery }) {
  const center = rider ||
    pickup ||
    delivery || {
      lat: -1.9441,
      lng: 30.0619,
    };

  const route = [pickup, rider, delivery].filter(Boolean);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={{
        height: "600px",
        width: "100%",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {pickup && (
        <Marker position={[pickup.lat, pickup.lng]} icon={icon}>
          <Popup>Pickup location</Popup>
        </Marker>
      )}

      {rider && (
        <Marker position={[rider.lat, rider.lng]} icon={icon}>
          <Popup>Rider location</Popup>
        </Marker>
      )}

      {delivery && (
        <Marker position={[delivery.lat, delivery.lng]} icon={icon}>
          <Popup>Delivery location</Popup>
        </Marker>
      )}

      {route.length > 1 && (
        <Polyline positions={route.map((p) => [p.lat, p.lng])} />
      )}
    </MapContainer>
  );
}
