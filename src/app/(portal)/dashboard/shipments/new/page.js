"use client";
import { useEffect, useRef, useState } from "react";
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
}) {
  const [results, setResults] = useState([]),
    [busy, setBusy] = useState(false),
    [searchError, setSearchError] = useState("");
  const skipNextSearch = useRef(false);
  useEffect(() => {
    const q = value.trim();
    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      setResults([]);
      setBusy(false);
      setSearchError("");
      return;
    }
    if (q.length < 2) {
      setResults([]);
      setSearchError("");
      return;
    }
    const t = setTimeout(async () => {
      setBusy(true);
      try {
        const r = await api.searchLocations(q);
        const items = r?.data || r || [];
        setResults(Array.isArray(items) ? items : []);
        setSearchError(items.length ? "" : "No locations found. Try a landmark, street, district, or nearby place.");
      } catch (e) {
        setResults([]);
        setSearchError(e.message || "Location search is temporarily unavailable.");
      } finally {
        setBusy(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="location-box">
      <label>{label} <b className="required-mark">*</b></label>
      <div className="input-with-icon">
        <Search size={17} />
        <input
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search an address or place"
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
      {busy && <div className="location-results">Searching…</div>}
      {!busy && searchError && results.length === 0 && (
        <div className="location-search-message">{searchError}</div>
      )}
      {results.length > 0 && (
        <div className="location-results">
          {results.slice(0, 6).map((p, i) => (
            <button
              type="button"
              key={p.place_id || i}
              onClick={() => {
                skipNextSearch.current = true;
                onSelect(p);
                setResults([]);
                setSearchError("");
              }}
            >
              <MapPin size={15} />
              <span>
                <strong>{p.description || p.address || p.name}</strong>
                <small>{p.city || p.formatted_address || ""}</small>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
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
  const [quote, setQuote] = useState(null),
    [quoteBusy, setQuoteBusy] = useState(false),
    [createBusy, setCreateBusy] = useState(false),
    [message, setMessage] = useState("");
  const quoteRequestRef = useRef(0);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
    // Any change makes the previous quote stale. The server will recalculate
    // again when the shipment is actually created.
    setQuote(null);
  }

  function setLocationText(prefix, value) {
    setForm((f) => ({
      ...f,
      [`${prefix}_address`]: value,
      [`${prefix}_city`]: "",
      [`${prefix}_lat`]: null,
      [`${prefix}_lng`]: null,
    }));
    setQuote(null);
  }

  function validateForm() {
    const required = [
      ["Sender name", form.sender_name],
      ["Sender phone", form.sender_phone],
      ["Recipient name", form.recipient_name],
      ["Recipient phone", form.recipient_phone],
      ["Pickup location", form.pickup_address],
      ["Delivery location", form.delivery_address],
      ["Parcel description", form.parcel_description],
    ];
    const missing = required.find(([, value]) => !String(value || "").trim());
    if (missing) {
      setMessage(`${missing[0]} is required.`);
      return false;
    }
    if (form.pickup_lat == null || form.pickup_lng == null) {
      setMessage("Select a pickup location from the search results or use your current location.");
      return false;
    }
    if (form.delivery_lat == null || form.delivery_lng == null) {
      setMessage("Select a delivery location from the search results or use your current location.");
      return false;
    }
    const weight = Number(form.parcel_weight_kg);
    if (!Number.isFinite(weight) || weight <= 0) {
      setMessage("Parcel weight must be greater than 0 kg.");
      return false;
    }
    return true;
  }
  function selectLocation(prefix, p) {
    const lat = Number(p.lat);
    const lng = Number(p.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setMessage("That location did not return valid coordinates. Please choose another result.");
      return;
    }
    setForm((f) => ({
      ...f,
      [`${prefix}_address`]:
        p.description || p.formatted_address || p.address || p.name || "",
      [`${prefix}_city`]: p.city || "",
      [`${prefix}_lat`]: lat,
      [`${prefix}_lng`]: lng,
    }));
    setQuote(null);
    setMessage("");
  }
  async function current(prefix) {
    if (!navigator.geolocation)
      return setMessage("Location access is not available in this browser.");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const p = await api.reverseLocation(
            pos.coords.latitude,
            pos.coords.longitude,
          );
          selectLocation(prefix, {
            ...p,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        } catch {
          setMessage("We couldn't identify your current location.");
        }
      },
      () =>
        setMessage(
          "Please allow location access to use your current position.",
        ),
    );
  }
  async function refreshQuote(showErrors = true) {
    if (form.pickup_lat == null || form.pickup_lng == null || form.delivery_lat == null || form.delivery_lng == null) {
      setQuote(null);
      return;
    }

    const requestId = ++quoteRequestRef.current;
    setQuoteBusy(true);
    if (showErrors) setMessage("");

    try {
      const q = await api.quote({
        pickup_lat: form.pickup_lat,
        pickup_lng: form.pickup_lng,
        delivery_lat: form.delivery_lat,
        delivery_lng: form.delivery_lng,
        pickup_city: form.pickup_city || undefined,
        delivery_city: form.delivery_city || undefined,
        discount_code: form.discount_code.trim() || undefined,
      });
      if (requestId !== quoteRequestRef.current) return;
      setQuote(q?.data || q);
    } catch (e) {
      if (requestId !== quoteRequestRef.current) return;
      setQuote(null);
      if (showErrors) setMessage(e.message || "Unable to calculate the current quote.");
    } finally {
      if (requestId === quoteRequestRef.current) setQuoteBusy(false);
    }
  }

  // Live pricing: after any form change, wait briefly for typing to settle and
  // ask the backend for a fresh quote. The create endpoint recalculates again.
  useEffect(() => {
    if (form.pickup_lat == null || form.delivery_lat == null) {
      setQuote(null);
      setQuoteBusy(false);
      return;
    }
    const timer = setTimeout(() => refreshQuote(false), 500);
    return () => clearTimeout(timer);
    // Form fields intentionally appear here because price/discount/location
    // state must never be allowed to display an old quote.
  }, [
    form.sender_name, form.sender_phone, form.recipient_name, form.recipient_phone,
    form.pickup_address, form.pickup_city, form.pickup_lat, form.pickup_lng,
    form.pickup_notes, form.delivery_address, form.delivery_city, form.delivery_lat,
    form.delivery_lng, form.delivery_notes, form.parcel_description, form.parcel_category,
    form.parcel_weight_kg, form.parcel_declared_value, form.is_fragile, form.discount_code,
  ]);

  async function create() {
    setMessage("");
    if (!validateForm()) return;
    if (!quote) {
      await refreshQuote(true);
      return;
    }

    setCreateBusy(true);
    try {
      const body = {
        ...form,
        parcel_weight_kg: Number(form.parcel_weight_kg || 1),
        parcel_declared_value: form.parcel_declared_value
          ? Number(form.parcel_declared_value)
          : undefined,
        discount_code: form.discount_code.trim() || undefined,
      };
      // Backend recalculates distance and price from coordinates. No quote
      // value from the browser is sent or trusted.
      const r = await api.createShipment(body);
      const s = r?.data || r;
      window.location.href =
        s.payment_required === false
          ? `/dashboard/shipments/${s.id}`
          : `/dashboard/shipments/${s.id}?pay=1`;
    } catch (e) {
      setMessage(e.message || "Unable to create shipment.");
    } finally {
      setCreateBusy(false);
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
              <div className="form-icon">
                <MapPin size={19} />
              </div>
              <div>
                <h2>Route</h2>
                <p>Search a place or use your current location.</p>
              </div>
            </div>
            <LocationBox
              label="Pickup location"
              value={form.pickup_address}
              onChange={(v) => setLocationText("pickup", v)}
              onSelect={(p) => selectLocation("pickup", p)}
              onCurrent={() => current("pickup")}
            />
            <LocationBox
              label="Delivery location"
              value={form.delivery_address}
              onChange={(v) => setLocationText("delivery", v)}
              onSelect={(p) => selectLocation("delivery", p)}
              onCurrent={() => current("delivery")}
            />
            <div className="two-col">
              <Field
                label="Pickup notes"
                value={form.pickup_notes}
                onChange={(v) => set("pickup_notes", v)}
                placeholder="Gate, floor, landmark…"
              />
              <Field
                label="Delivery notes"
                value={form.delivery_notes}
                onChange={(v) => set("delivery_notes", v)}
                placeholder="Gate, floor, landmark…"
              />
            </div>
          </section>
          <section className="panel form-section">
            <div className="form-section-head">
              <div className="form-icon">
                <UserRound size={19} />
              </div>
              <div>
                <h2>Recipient</h2>
                <p>Who should receive the shipment?</p>
              </div>
            </div>
            <div className="two-col">
              <Field
                required
                label="Sender name"
                value={form.sender_name}
                onChange={(v) => set("sender_name", v)}
              />
              <Field
                required
                label="Sender phone"
                value={form.sender_phone}
                onChange={(v) => set("sender_phone", v)}
              />
              <Field
                required
                label="Recipient name"
                value={form.recipient_name}
                onChange={(v) => set("recipient_name", v)}
              />
              <Field
                required
                label="Recipient phone"
                value={form.recipient_phone}
                onChange={(v) => set("recipient_phone", v)}
              />
            </div>
          </section>
          <section className="panel form-section">
            <div className="form-section-head">
              <div className="form-icon">
                <Package size={19} />
              </div>
              <div>
                <h2>Parcel</h2>
                <p>Basic information for the rider.</p>
              </div>
            </div>
            <div className="two-col">
              <Field
                required
                label="Description"
                value={form.parcel_description}
                onChange={(v) => set("parcel_description", v)}
                placeholder="e.g. Documents, clothes, electronics"
              />
              <Field
                label="Category"
                value={form.parcel_category}
                onChange={(v) => set("parcel_category", v)}
                placeholder="Optional"
              />
              <Field
                label="Weight (kg)"
                type="number"
                value={form.parcel_weight_kg}
                onChange={(v) => set("parcel_weight_kg", v)}
              />
              <Field
                label="Declared value (RWF)"
                type="number"
                value={form.parcel_declared_value}
                onChange={(v) => set("parcel_declared_value", v)}
              />
            </div>
            <label className="check-row">
              <input
                type="checkbox"
                checked={form.is_fragile}
                onChange={(e) => set("is_fragile", e.target.checked)}
              />
              <span>
                <strong>Fragile parcel</strong>
                <small>We'll flag this shipment for careful handling.</small>
              </span>
            </label>
          </section>
        </div>
        <aside className="quote-side">
          <div className="panel quote-panel">
            <div className="section-kicker">DELIVERY QUOTE</div>
            <h2>Know your price before you book.</h2>
            {quote ? (
              <>
                <div className="quote-total">
                  <small>TOTAL</small>
                  <strong>
                    {money(quote.total_price, quote.currency || "RWF")}
                  </strong>
                </div>
                <div className="quote-lines">
                  <span>
                    Distance <b>{Number(quote.distance_km || 0).toFixed(2)} km</b>
                  </span>
                  <span>
                    Driving time <b>{Number(quote.duration_minutes || 0).toFixed(0)} min</b>
                  </span>
                  <span>
                    Distance source <b>{quote.distance_source === "osrm" ? "Verified road route" : "Temporary estimate"}</b>
                  </span>
                  <span>
                    Subtotal{" "}
                    <b>{money(quote.subtotal, quote.currency || "RWF")}</b>
                  </span>
                  {Number(quote.discount_amount) > 0 && (
                    <span>
                      Discount{" "}
                      <b>
                        -{money(quote.discount_amount, quote.currency || "RWF")}
                      </b>
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="quote-placeholder">
                <Tag size={22} />
                <span>Complete your locations, then calculate the quote.</span>
              </div>
            )}
            <Field
              label="Discount code"
              value={form.discount_code}
              onChange={(v) => set("discount_code", v)}
              placeholder="Optional"
            />
            {quoteBusy && (
              <div className="quote-live-status">Updating live quote…</div>
            )}
            {quote && quote.distance_source !== "osrm" && !quoteBusy && (
              <div className="quote-warning">Driving distance is not verified yet. We will not create a billable shipment until the road distance can be confirmed.</div>
            )}
            <button
              className="button button-dark full"
              onClick={create}
              disabled={createBusy || quoteBusy || !quote || quote.distance_source !== "osrm"}
            >
              {createBusy
                ? "Creating shipment…"
                : quoteBusy
                  ? "Updating price…"
                  : "Create shipment"}{" "}
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
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && " *"}
      </span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
      />
    </label>
  );
}
