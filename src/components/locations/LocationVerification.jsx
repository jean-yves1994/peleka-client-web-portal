"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Check, Loader2, MapPin, X } from "lucide-react";
import { api } from "@/lib/api";

const VerificationMap = dynamic(() => import("./LocationVerificationMap"), {
  ssr: false,
  loading: () => <div className="location-verification-map-loading">Loading map…</div>,
});

export default function LocationVerification({ open, label, candidate, inputText, locationType, onCancel, onConfirm }) {
  const initial = useMemo(
    () => ({ lat: Number(candidate?.lat ?? candidate?.latitude), lng: Number(candidate?.lng ?? candidate?.longitude) }),
    [candidate]
  );
  const [point, setPoint] = useState(initial);
  const [resolved, setResolved] = useState(candidate || null);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPoint(initial);
    setResolved(candidate || null);
    setError("");
  }, [initial, candidate]);

  if (!open) return null;

  async function resolvePoint(nextPoint) {
    setPoint(nextPoint);
    setResolving(true);
    setError("");
    try {
      const r = await api.reverseLocation(nextPoint.lat, nextPoint.lng);
      const data = r?.data || r || {};
      setResolved({ ...candidate, ...data, lat: nextPoint.lat, lng: nextPoint.lng, source: "search_then_pin" });
    } catch (e) {
      setResolved((current) => ({ ...current, lat: nextPoint.lat, lng: nextPoint.lng, source: "search_then_pin" }));
      setError(e.message || "We could not refresh the address for this pin.");
    } finally {
      setResolving(false);
    }
  }

  async function confirm() {
    if (!Number.isFinite(point.lat) || !Number.isFinite(point.lng)) {
      setError("Please place the pin on a valid location.");
      return;
    }

    setResolving(true);
    setError("");
    try {
      const r = await api.verifyLocation({
        lat: point.lat,
        lng: point.lng,
        location_type: locationType,
        input_text: inputText,
      });
      const data = r?.data || r || {};
      onConfirm({
        ...resolved,
        ...data,
        lat: point.lat,
        lng: point.lng,
        input_text: inputText,
        confirmed_by_user: true,
        source: data.source || "gps_confirmed",
        verification_required: false,
      });
    } catch (e) {
      setError(e.message || "We could not verify this exact location. Please try again.");
    } finally {
      setResolving(false);
    }
  }

  return (
    <div className="location-verification-overlay" role="dialog" aria-modal="true" aria-label={`Verify ${label}`}>
      <div className="location-verification-modal">
        <div className="location-verification-modal-header">
          <div className="location-verification-title-wrap">
            <div className="location-verification-icon"><MapPin size={19} strokeWidth={2.4} /></div>
            <div>
              <div className="location-verification-eyebrow">EXACT LOCATION</div>
              <h3>Confirm {label.toLowerCase()}</h3>
              <p>Move the pin to the exact point. Your confirmed coordinates are used for routing and pricing.</p>
            </div>
          </div>
          <button type="button" className="location-verification-close" onClick={onCancel} disabled={resolving} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="location-verification-map-shell">
          <VerificationMap
            initialLat={point.lat}
            initialLng={point.lng}
            label={label}
            onPositionChange={resolvePoint}
            disabled={resolving}
          />
          <div className="location-verification-map-badge">
            <MapPin size={14} />
            <span>Drag pin or tap the map</span>
          </div>
        </div>

        <div className="location-verification-location-card">
          <div className="location-verification-location-icon"><MapPin size={17} /></div>
          <div className="location-verification-location-copy">
            <strong>{resolved?.address || resolved?.formatted_address || resolved?.name || inputText || "Selected location"}</strong>
            <span>{[resolved?.sector, resolved?.district, resolved?.city].filter(Boolean).join(" · ") || "Exact point selected on map"}</span>
          </div>
          <div className="location-verification-coordinates">
            <span>LAT <b>{point.lat.toFixed(6)}</b></span>
            <span>LNG <b>{point.lng.toFixed(6)}</b></span>
          </div>
        </div>

        {resolving && (
          <div className="location-verification-status">
            <Loader2 size={15} className="location-verification-spinner" /> Updating location…
          </div>
        )}
        {error && <div className="location-verification-error">{error}</div>}

        <div className="location-verification-footer">
          <button type="button" className="location-verification-cancel" onClick={onCancel} disabled={resolving}>Cancel</button>
          <button type="button" className="location-verification-confirm" onClick={confirm} disabled={resolving}>
            {resolving ? <><Loader2 size={16} className="location-verification-spinner" /> Verifying…</> : <><Check size={17} /> Confirm exact location</>}
          </button>
        </div>
      </div>

      <style jsx>{`
        .location-verification-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 23, 42, 0.62);
          backdrop-filter: blur(7px);
          -webkit-backdrop-filter: blur(7px);
          animation: locationModalFade 0.18s ease-out;
        }

        .location-verification-modal {
          width: min(900px, 100%);
          max-height: min(900px, calc(100vh - 40px));
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 24px;
          box-shadow: 0 30px 90px rgba(15, 23, 42, 0.28), 0 8px 30px rgba(15, 23, 42, 0.12);
        }

        .location-verification-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          padding: 22px 24px 18px;
          border-bottom: 1px solid #eef0f3;
        }

        .location-verification-title-wrap { display: flex; gap: 13px; min-width: 0; }
        .location-verification-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #fff1e2;
          color: #ff8508;
        }
        .location-verification-eyebrow {
          margin-bottom: 4px;
          color: #ff8508;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }
        .location-verification-modal h3 { margin: 0; color: #17191c; font-size: 21px; line-height: 1.2; font-weight: 850; }
        .location-verification-modal-header p { margin: 6px 0 0; color: #737982; font-size: 13px; line-height: 1.5; max-width: 650px; }
        .location-verification-close {
          width: 38px;
          height: 38px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border: 1px solid #e5e7eb;
          border-radius: 11px;
          background: #fff;
          color: #5d6570;
          cursor: pointer;
          transition: 0.18s ease;
        }
        .location-verification-close:hover { background: #f5f6f7; color: #17191c; }
        .location-verification-close:disabled { opacity: 0.5; cursor: not-allowed; }

        .location-verification-map-shell {
          position: relative;
          padding: 16px 18px 0;
          background: #f8fafc;
        }
        .location-verification-map-shell :global(.location-verification) { width: 100%; }
        .location-verification-map-shell :global(.location-verification-head) { display: none; }
        .location-verification-map-shell :global(.location-verification-map) {
          height: min(48vh, 430px) !important;
          min-height: 300px !important;
          border-radius: 17px !important;
          box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
        }
        .location-verification-map-shell :global(.location-verification-actions) { display: none !important; }
        .location-verification-map-shell :global(.leaflet-control-zoom) { border: 0 !important; box-shadow: 0 4px 16px rgba(15,23,42,.16) !important; }
        .location-verification-map-shell :global(.leaflet-control-zoom a) { color: #17191c !important; }
        .location-verification-map-badge {
          position: absolute;
          top: 28px;
          left: 30px;
          z-index: 500;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 11px;
          border: 1px solid rgba(255,255,255,.8);
          border-radius: 999px;
          background: rgba(255,255,255,.94);
          color: #3f4650;
          box-shadow: 0 5px 18px rgba(15,23,42,.13);
          font-size: 11px;
          font-weight: 750;
        }

        .location-verification-location-card {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 14px 18px 0;
          padding: 13px 14px;
          border: 1px solid #e7e9ed;
          border-radius: 15px;
          background: #fff;
        }
        .location-verification-location-icon {
          width: 35px;
          height: 35px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #fff7ef;
          color: #ff8508;
        }
        .location-verification-location-copy { min-width: 0; flex: 1; }
        .location-verification-location-copy strong { display: block; overflow: hidden; color: #252a31; font-size: 13px; white-space: nowrap; text-overflow: ellipsis; }
        .location-verification-location-copy span { display: block; margin-top: 3px; overflow: hidden; color: #7b828c; font-size: 11px; white-space: nowrap; text-overflow: ellipsis; }
        .location-verification-coordinates { display: flex; gap: 12px; flex: 0 0 auto; }
        .location-verification-coordinates span { color: #8a919b; font-size: 9px; font-weight: 800; letter-spacing: .8px; }
        .location-verification-coordinates b { display: block; margin-top: 2px; color: #3c434d; font-size: 11px; letter-spacing: 0; }

        .location-verification-status, .location-verification-error {
          margin: 10px 18px 0;
          padding: 9px 11px;
          border-radius: 10px;
          font-size: 12px;
        }
        .location-verification-status { display: flex; align-items: center; gap: 7px; color: #59616c; background: #f6f7f8; }
        .location-verification-error { color: #a33d2e; background: #fff1ef; border: 1px solid #ffd9d3; }
        .location-verification-spinner { animation: locationSpin .8s linear infinite; }

        .location-verification-footer {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          padding: 16px 18px 18px;
        }
        .location-verification-cancel, .location-verification-confirm {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 12px;
          padding: 0 17px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: .18s ease;
        }
        .location-verification-cancel { border: 1px solid #dfe2e6; background: #fff; color: #4d5560; }
        .location-verification-cancel:hover { background: #f6f7f8; }
        .location-verification-confirm { border: 1px solid #ff8508; background: #ff8508; color: #fff; box-shadow: 0 7px 18px rgba(255,133,8,.22); }
        .location-verification-confirm:hover { background: #ed7800; transform: translateY(-1px); }
        .location-verification-confirm:disabled, .location-verification-cancel:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        .location-verification-map-loading { height: min(48vh,430px); min-height: 300px; display: grid; place-items: center; border-radius: 17px; background: #eef2f5; color: #68717c; font-size: 13px; }

        @keyframes locationModalFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes locationSpin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .location-verification-overlay { padding: 10px; align-items: flex-end; }
          .location-verification-modal { max-height: calc(100vh - 20px); border-radius: 20px 20px 16px 16px; }
          .location-verification-modal-header { padding: 17px 16px 14px; }
          .location-verification-map-shell { padding: 12px 12px 0; }
          .location-verification-map-shell :global(.location-verification-map) { height: 48vh !important; min-height: 280px !important; }
          .location-verification-map-badge { top: 22px; left: 23px; }
          .location-verification-location-card { margin: 11px 12px 0; align-items: flex-start; }
          .location-verification-coordinates { display: none; }
          .location-verification-footer { padding: 12px; }
          .location-verification-cancel, .location-verification-confirm { flex: 1; padding: 0 11px; }
        }
      `}</style>
    </div>
  );
}
