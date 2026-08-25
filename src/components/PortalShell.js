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
  Menu,
  Package,
  Plus,
  ReceiptText,
  Settings2,
  X,
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
  const path = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

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

  useEffect(() => {
    setMobileNav(false);
  }, [path]);

  async function logout() {
    try {
      await api.logout(localStorage.getItem("peleka_refresh_token"));
    } catch {}
    clearAuth();
    router.replace("/login");
  }

  if (!user) {
    return <div className="loading-screen"><div className="spinner" /></div>;
  }

  return (
    <div className="portal">
      <div
        className={`mobile-nav-backdrop ${mobileNav ? "open" : ""}`}
        onClick={() => setMobileNav(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar ${mobileNav ? "mobile-open" : ""}`}>
        <div className="sidebar-mobile-head">
          <Link href="/" className="brand portal-brand">PELEKA<span>.</span></Link>
          <button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <Link href="/" className="brand portal-brand desktop-brand">PELEKA<span>.</span></Link>
        <div className="side-label">CUSTOMER PORTAL</div>
        <nav className="side-nav">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={path === href || (href !== "/dashboard" && path.startsWith(href)) ? "active" : ""}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="side-bottom">
          <Link href="/dashboard/shipments/new" className="side-new">
            <Plus size={17} /> <span>New shipment</span>
          </Link>
          <button className="side-logout" onClick={logout}>
            <LogOut size={17} /> <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="portal-main">
        <header className="portal-top">
          <div className="top-left">
            <button className="mobile-menu-button" onClick={() => setMobileNav(true)} aria-label="Open menu">
              <Menu size={20} />
            </button>
            <div className="mobile-brand">PELEKA<span>.</span></div>
          </div>
          <div className="top-actions">
            <Link href="/dashboard/notifications" className="icon-button"><Bell size={18} /></Link>
            <button className="profile-menu" onClick={() => setOpen(!open)}>
              <CircleUserRound size={19} />
              <span className="profile-name">{user.full_name || "Customer"}</span>
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
