"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Package,
  Plus,
  ReceiptText,
  Settings2,
  Truck,
} from "lucide-react";
import { clearAuth, getSavedUser, api } from "@/lib/api";
import { useEffect, useState } from "react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/shipments", label: "Shipments", icon: Package },
  { href: "/dashboard/track", label: "Live tracking", icon: MapPinned },
  { href: "/dashboard/billing", label: "Billing", icon: ReceiptText },
  { href: "/dashboard/settings", label: "Profile & security", icon: Settings2 },
];

export default function PortalShell({ children }) {
  const path = usePathname(),
    router = useRouter();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const u = getSavedUser();
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("peleka_access_token")
        : null;

    if (!u || !token) {
      const redirect = path || "/dashboard";
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    setUser(u);
  }, [path, router]);
  async function logout() {
    try {
      await api.logout(localStorage.getItem("peleka_refresh_token"));
    } catch {}
    clearAuth();
    router.replace("/login");
  }
  if (!user)
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  return (
    <div className="portal">
      <aside className="sidebar">
        <Link href="/" className="brand portal-brand">
          PELEKA<span>.</span>
        </Link>
        <div className="side-label">CUSTOMER PORTAL</div>
        <nav className="side-nav">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={
                path === href || (href != "/dashboard" && path.startsWith(href))
                  ? "active"
                  : ""
              }
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="side-bottom">
          <Link href="/dashboard/shipments/new" className="side-new">
            <Plus size={17} /> New shipment
          </Link>
          <button className="side-logout" onClick={logout}>
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>
      <main className="portal-main">
        <header className="portal-top">
          <div>
            <div className="mobile-brand">
              PELEKA<span>.</span>
            </div>
          </div>
          <div className="top-actions">
            <Link href="/dashboard/notifications" className="icon-button">
              <Bell size={18} />
            </Link>
            <button className="profile-menu" onClick={() => setOpen(!open)}>
              <CircleUserRound size={19} />
              <span>{user.full_name || "Customer"}</span>
              <ChevronDown size={15} />
            </button>
            {open && (
              <div className="profile-dropdown">
                <Link href="/dashboard/settings">Profile & security</Link>
                <button onClick={logout}>Sign out</button>
              </div>
            )}
          </div>
        </header>
        <div className="portal-content">{children}</div>
      </main>
    </div>
  );
}
