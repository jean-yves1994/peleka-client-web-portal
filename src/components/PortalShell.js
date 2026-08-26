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
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [signingOut, setSigningOut] = useState(false);

  const profileRef = useRef(null);
  const signingOutRef = useRef(false);

  /* ---------------------------------------------------------------
     Auth guard.
     `signingOutRef` stops this from firing a second, competing
     navigation while logout() is already redirecting.
     --------------------------------------------------------------- */
  useEffect(() => {
    if (signingOutRef.current) return;

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

  /* ---------------------------------------------------------------
     Reset ALL overlay state on route change.
     The drawer was already handled; the profile dropdown was not,
     so it survived navigation.
     --------------------------------------------------------------- */
  useEffect(() => {
    setMobileNav(false);
    setOpen(false);
  }, [path]);

  /* ---------------------------------------------------------------
     Lock background scroll while the drawer is open, and always
     release the lock on unmount so a stale `overflow: hidden`
     can't follow the user to the login page.
     --------------------------------------------------------------- */
  useEffect(() => {
    if (typeof document === "undefined") return;

    const { body } = document;
    const previous = body.style.overflow;

    if (mobileNav) body.style.overflow = "hidden";
    else body.style.overflow = previous || "";

    return () => {
      body.style.overflow = "";
    };
  }, [mobileNav]);

  /* ---------------------------------------------------------------
     Close the profile dropdown on outside click / Escape.
     Escape also closes the drawer.
     --------------------------------------------------------------- */
  useEffect(() => {
    if (typeof document === "undefined") return;

    function onPointerDown(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function onKeyDown(e) {
      if (e.key !== "Escape") return;
      setOpen(false);
      setMobileNav(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  /* ---------------------------------------------------------------
     Logout.
     Previously this awaited a network call BEFORE clearing anything,
     so an unreachable API left the drawer open and the UI unresponsive.
     Now: close overlays -> clear local auth -> redirect, and let the
     server-side revoke run in the background with a timeout.
     --------------------------------------------------------------- */
  const logout = useCallback(async () => {
    if (signingOutRef.current) return;
    signingOutRef.current = true;
    setSigningOut(true);

    setOpen(false);
    setMobileNav(false);
    if (typeof document !== "undefined") document.body.style.overflow = "";

    const refresh =
      typeof window !== "undefined"
        ? localStorage.getItem("peleka_refresh_token")
        : null;

    // Fire-and-forget so a hanging request can never block sign-out.
    if (refresh) {
      Promise.race([
        api.logout(refresh),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]).catch(() => {});
    }

    clearAuth();
    setUser(null);
    router.replace("/login");
  }, [router]);

  if (!user) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  const currentPath = path || "";

  return (
    <div className="portal">
      <div
        className={`mobile-nav-backdrop ${mobileNav ? "open" : ""}`}
        onClick={() => setMobileNav(false)}
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${mobileNav ? "mobile-open" : ""}`}
        aria-hidden={mobileNav ? undefined : "true"}
      >
        <div className="sidebar-mobile-head">
          <Link href="/" className="brand portal-brand">
            PELEKA<span>.</span>
          </Link>
          <button
            className="mobile-close"
            onClick={() => setMobileNav(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <Link href="/" className="brand portal-brand desktop-brand">
          PELEKA<span>.</span>
        </Link>

        <div className="side-label">CUSTOMER PORTAL</div>

        <nav className="side-nav">
          {nav.map(({ href, label, icon: Icon }) => {
            const active =
              currentPath === href ||
              (href !== "/dashboard" && currentPath.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                className={active ? "active" : ""}
                aria-current={active ? "page" : undefined}
                onClick={() => setMobileNav(false)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="side-bottom">
          <Link
            href="/dashboard/shipments/new"
            className="side-new"
            onClick={() => setMobileNav(false)}
          >
            <Plus size={17} /> <span>New shipment</span>
          </Link>
          <button
            className="side-logout"
            onClick={logout}
            disabled={signingOut}
          >
            <LogOut size={17} />{" "}
            <span>{signingOut ? "Signing out…" : "Sign out"}</span>
          </button>
        </div>
      </aside>

      <main className="portal-main">
        <header className="portal-top">
          <div className="top-left">
            <button
              className="mobile-menu-button"
              onClick={() => setMobileNav(true)}
              aria-label="Open menu"
              aria-expanded={mobileNav}
            >
              <Menu size={20} />
            </button>
            <div className="mobile-brand">
              PELEKA<span>.</span>
            </div>
          </div>

          <div className="top-actions" ref={profileRef}>
            <Link href="/dashboard/notifications" className="icon-button">
              <Bell size={18} />
            </Link>

            <button
              className="profile-menu"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-haspopup="menu"
            >
              <CircleUserRound size={19} />
              <span className="profile-name">
                {user.full_name || "Customer"}
              </span>
              <ChevronDown size={15} />
            </button>

            {open && (
              <div className="profile-dropdown" role="menu">
                <Link href="/dashboard/settings" onClick={() => setOpen(false)}>
                  Profile &amp; security
                </Link>
                <button onClick={logout} disabled={signingOut}>
                  {signingOut ? "Signing out…" : "Sign out"}
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="portal-content">{children}</div>
      </main>
    </div>
  );
}
