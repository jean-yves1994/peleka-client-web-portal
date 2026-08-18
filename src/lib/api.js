const BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api").replace(/\/$/, "");

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("peleka_access_token");
}
export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("peleka_refresh_token");
}
export function saveAuth(data) {
  if (typeof window === "undefined") return;
  if (data?.access_token) localStorage.setItem("peleka_access_token", data.access_token);
  if (data?.refresh_token) localStorage.setItem("peleka_refresh_token", data.refresh_token);
}
export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("peleka_access_token");
  localStorage.removeItem("peleka_refresh_token");
  localStorage.removeItem("peleka_user");
}
export function saveUser(user) {
  if (typeof window === "undefined") return;
  localStorage.setItem("peleka_user", JSON.stringify(user));
}
export function getSavedUser() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem("peleka_user") || "null"); } catch { return null; }
}
async function request(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.body instanceof FormData ? {} : {"Content-Type":"application/json"}), ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers, cache: "no-store" });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const message = data?.error?.message || data?.message || data?.error || `Request failed (${res.status})`;
    const err = new Error(message); err.status = res.status; err.data = data; throw err;
  }
  return data;
}
export const api = {
  login: (body) => request("/auth/login", {method:"POST", body:JSON.stringify(body)}),
  register: (body) => request("/auth/register", {method:"POST", body:JSON.stringify(body)}),
  refresh: (refresh_token) => request("/auth/refresh", {method:"POST", body:JSON.stringify({refresh_token})}),
  logout: (refresh_token) => request("/auth/logout", {method:"POST", body:JSON.stringify({refresh_token})}),
  forgot: (identifier) => request("/auth/forgot-password", {method:"POST", body:JSON.stringify({identifier})}),
  verifyPhoneReset: (phone, code) => request("/auth/password-reset/phone/verify", {method:"POST", body:JSON.stringify({phone,code})}),
  resetPassword: (token,password) => request("/auth/reset-password", {method:"POST", body:JSON.stringify({token,password})}),
  me: () => request("/me"),
  shipments: (params="") => request(`/shipments${params ? `?${params}` : ""}`),
  shipment: (id) => request(`/shipments/${id}`),
  quote: (body) => request("/shipments/quote",{method:"POST",body:JSON.stringify(body)}),
  createShipment: (body) => request("/shipments",{method:"POST",body:JSON.stringify(body)}),
  cancelShipment: (id, reason) => request(`/shipments/${id}/cancel`,{method:"POST",body:JSON.stringify({reason})}),
  track: (id) => request(`/shipments/${id}/track`),
  publicTrack: (number) => request(`/track/${encodeURIComponent(number)}`),
  contact: (id) => request(`/shipments/${id}/contact`),
  rating: (id, score, comment) => request(`/shipments/${id}/rating`,{method:"POST",body:JSON.stringify({score,comment})}),
  searchLocations: (q, lat, lng) => request(`/locations/search?q=${encodeURIComponent(q)}${lat != null ? `&lat=${lat}`:""}${lng != null ? `&lng=${lng}`:""}`),
  reverseLocation: (lat,lng) => request(`/locations/reverse?lat=${lat}&lng=${lng}`),
  initiatePayment: (shipment_id, phone) => request("/payments/paypack/initiate",{method:"POST",body:JSON.stringify({shipment_id,phone})}),
  payment: (id) => request(`/payments/${id}`),
  billing: () => request("/me/billing"),
  profile: (body) => request("/me",{method:"PATCH",body:JSON.stringify(body)}),
  notifications: () => request("/me/notifications"),
  complaints: (body) => request("/complaints",{method:"POST",body:JSON.stringify(body)})
};
