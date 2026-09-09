"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Check, Loader2, MapPin, X } from "lucide-react";
import { api } from "@/lib/api";

const VerificationMap = dynamic(() => import("./LocationVerificationMap"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 320, display: "grid", placeItems: "center" }}>Loading map…</div>,
});

export default function LocationVerification({
  open,
  label,
  candidate,
  inputText,
  onCancel,
  onConfirm,
}) {
  const initial = useMemo(() => ({
    lat: Number(candidate?.lat ?? candidate?.latitude),
    lng: Number(candidate?.lng ?? candidate?.longitude),
  }), [candidate]);
  const [point, setPoint] = useState(initial);
  const [resolved, setResolved] = useState(candidate || null);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPoint(initial);
    setResolved(candidate || null);
    setError("");
  }, [initial.lat, initial.lng, candidate]);

  if (!open) return null;

  async function resolvePoint(nextPoint) {
    setPoint(nextPoint);
    setResolving(true);
    setError("");
    try {
      const r = await api.reverseLocation(nextPoint.lat, nextPoint.lng);
      const data = r?.data || r || {};
      setResolved({
        ...candidate,
        ...data,
        lat: nextPoint.lat,
        lng: nextPoint.lng,
        source: "search_then_pin",
        verification_required: false,
      });
    } catch (e) {
      setResolved((current) => ({
        ...current,
        lat: nextPoint.lat,
        lng: nextPoint.lng,
        source: "search_then_pin",
        verification_required: false,
      }));
      setError(e.message || "We could not refresh the address for this pin. You can still confirm the exact point.");
    } finally {
      setResolving(false);
    }
  }

  function confirm() {
    if (!Number.isFinite(point.lat) || !Number.isFinite(point.lng)) {
      setError("Please place the pin on a valid location.");
      return;
    }
    onConfirm({
      ...resolved,
      lat: point.lat,
      lng: point.lng,
      input_text: inputText,
      confirmed_by_user: true,
      source: "search_then_pin",
      verification_required: false,
    });
  }

  return (
    <div className="location-verification-overlay" role="dialog" aria-modal="true" aria-label={`Verify ${label}`}>
      <div className="location-verification-modal">
        <div className="location-verification-head">
          <div>
            <div className="location-verification-kicker"><MapPin size={14} /> Exact location</div>
            <h3>Confirm {label.toLowerCase()}</h3>
            <p>Move the pin to the exact pickup or delivery point. Pricing will use the confirmed coordinates.</p>
          </div>
          <button type="button" className="location-verification-close" onClick={onCancel} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="location-verification-map-wrap">
          <VerificationMap
            latitude={point.lat}
            longitude={point.lng}
            onPointChange={resolvePoint}
          />
        </div>

        <div className="location-verification-summary">
          <div>
            <strong>{resolved?.address || resolved?.formatted_address || resolved?.name || inputText || "Selected location"}</strong>
            <span>{[resolved?.sector, resolved?.district, resolved?.city].filter(Boolean).join(" · ")}</span>
          </div>
          <div className="location-verification-coords">
            <span>{point.lat.toFixed(6)}</span>
            <span>{point.lng.toFixed(6)}</span>
          </div>
        </div>

        {error && <div className="location-verification-error">{error}</div>}

        <div className="location-verification-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn-primary" onClick={confirm} disabled={resolving}>
            {resolving ? <><Loader2 size={16} className="spin" /> Updating…</> : <><Check size={16} /> Confirm exact location</>}
          </button>
        </div>
      </div>
    </div>
  );
}
