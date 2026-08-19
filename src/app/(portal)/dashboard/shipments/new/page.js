"use client";
import { useEffect, useState } from "react";
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
    [busy, setBusy] = useState(false);
  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setBusy(true);
      try {
        const r = await api.searchLocations(q);
        setResults(r?.data || r || []);
      } catch {
      } finally {
        setBusy(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="location-box">
      <label>{label}</label>
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
      {results.length > 0 && (
        <div className="location-results">
          {results.slice(0, 6).map((p, i) => (
            <button
              type="button"
              key={p.place_id || i}
              onClick={() => {
                onSelect(p);
                setResults([]);
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
    sender_email: "",
    recipient_name: "",
    recipient_phone: "",
    recipient_email: "",
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
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function selectLocation(prefix, p) {
    setForm((f) => ({
      ...f,
      [`${prefix}_address`]:
        p.description || p.formatted_address || p.address || p.name || "",
      [`${prefix}_city`]: p.city || "",
      [`${prefix}_lat`]: Number(p.lat),
      [`${prefix}_lng`]: Number(p.lng),
    }));
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
  async function getQuote() {
    setMessage("");
    if (form.pickup_lat == null || form.delivery_lat == null)
      return setMessage(
        "Please select both pickup and delivery locations from the search results.",
      );
    setBusy(true);
    try {
      const q = await api.quote({
        pickup_lat: form.pickup_lat,
        pickup_lng: form.pickup_lng,
        delivery_lat: form.delivery_lat,
        delivery_lng: form.delivery_lng,
        pickup_city: form.pickup_city,
        delivery_city: form.delivery_city,
        discount_code: form.discount_code || undefined,
      });
      setQuote(q?.data || q);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function create() {
    setMessage("");
    if (!quote) return getQuote();
    setBusy(true);
    try {
      const body = {
        ...form,
        parcel_weight_kg: Number(form.parcel_weight_kg || 1),
        parcel_declared_value: form.parcel_declared_value
          ? Number(form.parcel_declared_value)
          : undefined,
        discount_code: form.discount_code || undefined,
      };
      const r = await api.createShipment(body);
      const s = r?.data || r;
      window.location.href =
        s.payment_required === false
          ? `/dashboard/shipments/${s.id}`
          : `/dashboard/shipments/${s.id}?pay=1`;
    } catch (e) {
      setMessage(e.message);
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
              onChange={(v) => set("pickup_address", v)}
              onSelect={(p) => selectLocation("pickup", p)}
              onCurrent={() => current("pickup")}
            />
            <LocationBox
              label="Delivery location"
              value={form.delivery_address}
              onChange={(v) => set("delivery_address", v)}
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
                    Distance{" "}
                    <b>{Number(quote.distance_km || 0).toFixed(1)} km</b>
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
            <button
              className="button button-dark full"
              onClick={quote ? create : getQuote}
              disabled={busy}
            >
              {busy
                ? "Working…"
                : quote
                  ? "Create shipment"
                  : "Calculate quote"}{" "}
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
