"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Crosshair,
  MapPin,
  Package,
  Search,
  Tag,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

const money = (n, c = "RWF") =>
  new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: c,
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

function LocationBox({
  label,
  value,
  onChange,
  onSelect,
  onCurrent,
  disabled,
  deviceLocation,
}) {
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setBusy(true);
      setSearched(false);
      try {
        const r = await api.searchLocations(
          q,
          deviceLocation?.lat,
          deviceLocation?.lng,
        );
        const items = r?.data || r || [];
        if (!controller.signal.aborted) {
          setResults(Array.isArray(items) ? items : []);
          setSearched(true);
        }
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
          setSearched(true);
        }
      } finally {
        if (!controller.signal.aborted) setBusy(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [value, deviceLocation?.lat, deviceLocation?.lng]);

  return (
    <div className="location-box">
      <label>{label} *</label>
      <div className="input-with-icon">
        <Search size={17} />
        <input
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search a Peleka location or address"
          autoComplete="off"
        />
      </div>
      <button
        type="button"
        className="current-location"
        onClick={onCurrent}
        disabled={disabled}
      >
        <Crosshair size={15} /> Use my current location
      </button>

      {(busy || searched) && (
        <div className="location-results">
          {busy ? (
            <div className="location-result-message">Searching…</div>
          ) : results.length > 0 ? (
            results.slice(0, 8).map((p, i) => (
              <button
                type="button"
                key={p.place_id || p.id || i}
                onClick={() => {
                  onSelect(p);
                  setResults([]);
                  setSearched(false);
                }}
              >
                <MapPin size={15} />
                <span>
                  <strong>{p.name || p.address || "Location"}</strong>
                  <small>
                    {[p.sector, p.district, p.city, p.address]
                      .filter(Boolean)
                      .join(" · ")}
                  </small>
                  {p.source === "known" && <em>Peleka location</em>}
                </span>
              </button>
            ))
          ) : (
            <div className="location-result-message">
              No matching Peleka location found. Try a fuller address.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const quoteInputs = [
  "sender_name",
  "sender_phone",
  "recipient_name",
  "recipient_phone",
  "pickup_address",
  "pickup_city",
  "pickup_lat",
  "pickup_lng",
  "pickup_notes",
  "delivery_address",
  "delivery_city",
  "delivery_lat",
  "delivery_lng",
  "delivery_notes",
  "parcel_description",
  "parcel_category",
  "parcel_weight_kg",
  "parcel_declared_value",
  "is_fragile",
  "discount_code",
];

export default function NewShipment() {
  const [form, setForm] = useState({
    sender_name: "",
    sender_phone: "",
    recipient_name: "",
    recipient_phone: "",
    pickup_address: "",
    pickup_city: "",
    pickup_lat: null,
    pickup_lng: null,
    pickup_notes: "",
    delivery_address: "",
    delivery_city: "",
    delivery_lat: null,
    delivery_lng: null,
    delivery_notes: "",
    parcel_description: "",
    parcel_category: "",
    parcel_weight_kg: 1,
    parcel_declared_value: "",
    is_fragile: false,
    discount_code: "",
  });
  const [quote, setQuote] = useState(null);
  const [quoteKey, setQuoteKey] = useState("");
  const [quoteBusy, setQuoteBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [deviceLocation, setDeviceLocation] = useState(null);
  const quoteSequence = useRef(0);
  const firstRender = useRef(true);

  const currentFormKey = useMemo(
    () =>
      JSON.stringify(
        quoteInputs.reduce((acc, key) => {
          acc[key] = form[key];
          return acc;
        }, {}),
      ),
    [form],
  );

  const locationsReady =
    Number.isFinite(Number(form.pickup_lat)) &&
    Number.isFinite(Number(form.pickup_lng)) &&
    Number.isFinite(Number(form.delivery_lat)) &&
    Number.isFinite(Number(form.delivery_lng));

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
    setQuote(null);
    setQuoteKey("");
    setMessage("");
  }

  function setLocationText(prefix, value) {
    setForm((f) => ({
      ...f,
      [`${prefix}_address`]: value,
      // Never keep coordinates belonging to a previous address.
      [`${prefix}_lat`]: null,
      [`${prefix}_lng`]: null,
      [`${prefix}_city`]: "",
    }));
    setQuote(null);
    setQuoteKey("");
    setMessage("");
  }

  function selectLocation(prefix, p) {
    const lat = Number(p.lat ?? p.latitude);
    const lng = Number(p.lng ?? p.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setMessage("That location does not have valid coordinates. Please choose another result.");
      return;
    }

    setForm((f) => ({
      ...f,
      [`${prefix}_address`]:
        p.address || p.formatted_address || p.name || "",
      [`${prefix}_city`]: p.city || p.district || "",
      [`${prefix}_lat`]: lat,
      [`${prefix}_lng`]: lng,
    }));
    setQuote(null);
    setQuoteKey("");
    setMessage("");
  }

  function getDeviceLocationForSearch() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setDeviceLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => {},
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 300000 },
    );
  }

  useEffect(() => {
    getDeviceLocationForSearch();
  }, []);

  async function current(prefix) {
    if (!navigator.geolocation) {
      setMessage("Location access is not available in this browser.");
      return;
    }

    setMessage("");
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setDeviceLocation({ lat, lng });
          const p = await api.reverseLocation(lat, lng);
          selectLocation(prefix, {
            ...p?.data,
            lat,
            lng,
          });
        } catch (e) {
          setMessage(e.message || "We couldn't identify your current location.");
        } finally {
          setBusy(false);
        }
      },
      (err) => {
        setBusy(false);
        setMessage(
          err.code === 1
            ? "Please allow location access to use your current position."
            : "We couldn't read your current location. Please search for the location instead.",
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }

  async function requestQuote(key = currentFormKey) {
    if (!locationsReady) {
      setQuote(null);
      setQuoteKey("");
      return;
    }

    const sequence = ++quoteSequence.current;
    setQuoteBusy(true);

    try {
      const q = await api.quote({
        pickup_lat: Number(form.pickup_lat),
        pickup_lng: Number(form.pickup_lng),
        delivery_lat: Number(form.delivery_lat),
        delivery_lng: Number(form.delivery_lng),
        pickup_city: form.pickup_city || undefined,
        delivery_city: form.delivery_city || undefined,
        discount_code: form.discount_code.trim() || undefined,
      });
      const data = q?.data || q;
      if (sequence === quoteSequence.current) {
        setQuote(data);
        setQuoteKey(key);
      }
    } catch (e) {
      if (sequence === quoteSequence.current) {
        setQuote(null);
        setQuoteKey("");
        setMessage(e.message || "Unable to calculate the delivery quote.");
      }
    } finally {
      if (sequence === quoteSequence.current) setQuoteBusy(false);
    }
  }

  // A quote is refreshed whenever ANY shipment field changes. The backend only
  // prices fields that affect the fare, but keeping the quote synchronized with
  // the entire form prevents the UI from ever presenting an old quote.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setQuote(null);
    setQuoteKey("");
    setMessage("");

    if (!locationsReady) return;

    const timer = setTimeout(() => requestQuote(currentFormKey), 500);
    return () => clearTimeout(timer);
    // currentFormKey is intentionally the dependency: every field in quoteInputs
    // participates in the fingerprint.
  }, [currentFormKey, locationsReady]);

  function validateForm() {
    const required = [
      ["sender_name", "Sender name"],
      ["sender_phone", "Sender phone"],
      ["recipient_name", "Recipient name"],
      ["recipient_phone", "Recipient phone"],
      ["parcel_description", "Parcel description"],
    ];

    for (const [key, label] of required) {
      if (!String(form[key] ?? "").trim()) {
        return `${label} is required.`;
      }
    }

    if (!locationsReady) {
      return "Select both pickup and delivery locations from the search results, or use your current location.";
    }

    if (Number(form.pickup_lat) === Number(form.delivery_lat) && Number(form.pickup_lng) === Number(form.delivery_lng)) {
      return "Pickup and delivery locations must be different.";
    }

    if (Number(form.parcel_weight_kg) <= 0) {
      return "Parcel weight must be greater than 0 kg.";
    }

    if (form.parcel_declared_value !== "" && Number(form.parcel_declared_value) < 0) {
      return "Declared value cannot be negative.";
    }

    return null;
  }

  async function create() {
    setMessage("");
    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    // Do not allow a stale quote to be used as the UI's confirmation state.
    // The backend independently recalculates the authoritative amount anyway.
    if (!quote || quoteKey !== currentFormKey) {
      await requestQuote(currentFormKey);
      return;
    }

    setBusy(true);
    try {
      const body = {
        ...form,
        parcel_weight_kg: Number(form.parcel_weight_kg || 1),
        parcel_declared_value:
          form.parcel_declared_value !== ""
            ? Number(form.parcel_declared_value)
            : undefined,
        discount_code: form.discount_code.trim() || undefined,
      };
      const r = await api.createShipment(body);
      const s = r?.data || r;
      window.location.href =
        s.payment_required === false
          ? `/dashboard/shipments/${s.id}`
          : `/dashboard/shipments/${s.id}?pay=1`;
    } catch (e) {
      setMessage(e.message || "Unable to create shipment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="page-title-row">
        <div>
          <Link href="/dashboard/shipments" className="back-link">
            <ArrowLeft size={15} /> Shipments
          </Link>
          <h1>Create a shipment</h1>
          <p>Tell us where to pick up and where to deliver.</p>
        </div>
      </div>

      <div className="form-layout">
        <div className="form-main">
          <section className="panel form-section">
            <div className="form-section-head">
              <div className="form-icon"><MapPin size={19} /></div>
              <div>
                <h2>Route</h2>
                <p>Choose a Peleka location or search an address.</p>
              </div>
            </div>

            <LocationBox
              label="Pickup location"
              value={form.pickup_address}
              onChange={(v) => setLocationText("pickup", v)}
              onSelect={(p) => selectLocation("pickup", p)}
              onCurrent={() => current("pickup")}
              disabled={busy}
              deviceLocation={deviceLocation}
            />
            <LocationBox
              label="Delivery location"
              value={form.delivery_address}
              onChange={(v) => setLocationText("delivery", v)}
              onSelect={(p) => selectLocation("delivery", p)}
              onCurrent={() => current("delivery")}
              disabled={busy}
              deviceLocation={deviceLocation}
            />

            <div className="two-col">
              <Field label="Pickup notes" value={form.pickup_notes} onChange={(v) => set("pickup_notes", v)} placeholder="Gate, floor, landmark…" />
              <Field label="Delivery notes" value={form.delivery_notes} onChange={(v) => set("delivery_notes", v)} placeholder="Gate, floor, landmark…" />
            </div>
          </section>

          <section className="panel form-section">
            <div className="form-section-head">
              <div className="form-icon"><UserRound size={19} /></div>
              <div>
                <h2>People</h2>
                <p>Who is sending and receiving the shipment?</p>
              </div>
            </div>
            <div className="two-col">
              <Field required label="Sender name" value={form.sender_name} onChange={(v) => set("sender_name", v)} />
              <Field required label="Sender phone" value={form.sender_phone} onChange={(v) => set("sender_phone", v)} type="tel" />
              <Field required label="Recipient name" value={form.recipient_name} onChange={(v) => set("recipient_name", v)} />
              <Field required label="Recipient phone" value={form.recipient_phone} onChange={(v) => set("recipient_phone", v)} type="tel" />
            </div>
          </section>

          <section className="panel form-section">
            <div className="form-section-head">
              <div className="form-icon"><Package size={19} /></div>
              <div>
                <h2>Parcel</h2>
                <p>Basic information for the rider.</p>
              </div>
            </div>
            <div className="two-col">
              <Field required label="Description" value={form.parcel_description} onChange={(v) => set("parcel_description", v)} placeholder="e.g. Documents, clothes, electronics" />
              <Field label="Category" value={form.parcel_category} onChange={(v) => set("parcel_category", v)} placeholder="Optional" />
              <Field required label="Weight (kg)" type="number" min="0.01" step="0.01" value={form.parcel_weight_kg} onChange={(v) => set("parcel_weight_kg", v)} />
              <Field label="Declared value (RWF)" type="number" min="0" step="1" value={form.parcel_declared_value} onChange={(v) => set("parcel_declared_value", v)} />
            </div>
            <label className="check-row">
              <input type="checkbox" checked={form.is_fragile} onChange={(e) => set("is_fragile", e.target.checked)} />
              <span>
                <strong>Fragile parcel</strong>
                <small>We'll flag this shipment for careful handling.</small>
              </span>
            </label>
          </section>
        </div>

        <aside className="quote-side">
          <div className="panel quote-panel">
            <div className="section-kicker">LIVE DELIVERY QUOTE</div>
            <h2>Your price updates as you complete the shipment.</h2>

            {quote ? (
              <>
                <div className="quote-total">
                  <small>TOTAL</small>
                  <strong>{money(quote.total_price, quote.currency || "RWF")}</strong>
                </div>
                <div className="quote-lines">
                  <span>Distance <b>{Number(quote.distance_km || 0).toFixed(2)} km</b></span>
                  <span>Driving time <b>{Number(quote.duration_minutes || 0)} min</b></span>
                  <span>Subtotal <b>{money(quote.subtotal, quote.currency || "RWF")}</b></span>
                  {Number(quote.discount_amount) > 0 && (
                    <span>Discount <b>-{money(quote.discount_amount, quote.currency || "RWF")}</b></span>
                  )}
                </div>
              </>
            ) : (
              <div className="quote-placeholder">
                <Tag size={22} />
                <span>{locationsReady ? "Calculating your live quote…" : "Select both locations to calculate your live quote."}</span>
              </div>
            )}

            <Field label="Discount code" value={form.discount_code} onChange={(v) => set("discount_code", v)} placeholder="Optional" />

            {quoteBusy && <div className="quote-refresh">Updating quote…</div>}

            <button
              type="button"
              className="button button-dark full"
              onClick={create}
              disabled={busy || quoteBusy || !locationsReady || !quote || quoteKey !== currentFormKey}
            >
              {busy ? "Creating shipment…" : quoteBusy ? "Updating quote…" : "Create shipment"}
              <ArrowRight size={16} />
            </button>

            {message && <div className="form-error">{message}</div>}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
  step,
}) {
  return (
    <label className="field">
      <span>{label}{required && " *"}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        required={required}
        min={min}
        step={step}
      />
    </label>
  );
}
