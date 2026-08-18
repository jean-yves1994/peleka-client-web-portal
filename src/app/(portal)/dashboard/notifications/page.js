"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Bell } from "lucide-react";
export default function Notifications() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api
      .notifications()
      .then((x) => setItems(x?.data || x?.items || []))
      .catch(() => {});
  }, []);
  return (
    <div>
      <div className="page-title-row">
        <div>
          <div className="page-kicker">NOTIFICATIONS</div>
          <h1>Updates</h1>
          <p>Shipment and account notifications.</p>
        </div>
      </div>
      <div className="panel">
        {items.length ? (
          items.map((n) => (
            <div className="notification-row" key={n.id}>
              <div className="feature-icon">
                <Bell size={17} />
              </div>
              <div>
                <strong>{n.title}</strong>
                <p>{n.body}</p>
                <small>{new Date(n.created_at).toLocaleString()}</small>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Bell size={30} />
            <strong>No notifications</strong>
            <span>You're all caught up.</span>
          </div>
        )}
      </div>
    </div>
  );
}
