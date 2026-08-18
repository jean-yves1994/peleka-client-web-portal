import Link from "next/link";
import { ArrowRight, MapPin, PackageCheck, Route, ShieldCheck, Truck } from "lucide-react";

const features = [
  { icon: Route, title: "Real-time tracking", text: "Follow every active shipment from pickup to delivery." },
  { icon: PackageCheck, title: "Simple shipping", text: "Create a shipment in minutes with location search and instant pricing." },
  { icon: ShieldCheck, title: "Proof of delivery", text: "Pickup and delivery photos keep your shipment journey accountable." },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <Link href="/" className="brand">PELEKA<span>.</span></Link>
        <nav className="desktop-nav">
          <a href="#services">Services</a>
          <a href="#how">How it works</a>
          <a href="#tracking">Tracking</a>
        </nav>
        <div className="header-actions">
          <Link href="/login" className="text-button">Sign in</Link>
          <Link href="/register" className="button button-dark">Create account <ArrowRight size={16}/></Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot"/> Kigali's delivery partner</div>
          <h1>Move anything.<br/><em>We'll get it there.</em></h1>
          <p className="hero-lead">Reliable pickup and delivery for people and businesses. Create shipments, follow riders and keep every delivery in one place.</p>
          <div className="hero-actions">
            <Link href="/dashboard/shipments/new" className="button button-orange">Start shipping <ArrowRight size={17}/></Link>
            <Link href="/track" className="button button-ghost">Track a shipment</Link>
          </div>
          <div className="hero-trust"><ShieldCheck size={16}/> Secure customer portal <span/> Live shipment visibility</div>
        </div>
        <div className="hero-visual">
          <div className="visual-glow"/>
          <div className="fleet-card">
            <div className="fleet-top"><span>PELEKA / LIVE</span><span className="live-dot">● LIVE</span></div>
            <div className="map-art">
              <div className="map-grid"/>
              <div className="road r1"/><div className="road r2"/><div className="road r3"/>
              <div className="route-line"/>
              <div className="pin pin-a"><MapPin size={17}/></div>
              <div className="pin pin-b"><Truck size={18}/></div>
              <div className="pin pin-c"><MapPin size={17}/></div>
              <div className="map-label label-a">Pickup</div>
              <div className="map-label label-b">Rider is here</div>
              <div className="map-label label-c">Delivery</div>
            </div>
            <div className="fleet-bottom">
              <div><small>ACTIVE SHIPMENT</small><strong>PKL-000284</strong></div>
              <div className="eta"><small>ETA</small><strong>24 min</strong></div>
            </div>
          </div>
          <div className="float-stat"><span className="stat-icon"><PackageCheck size={16}/></span><div><strong>98.4%</strong><small>successful deliveries</small></div></div>
        </div>
      </section>

      <section className="metric-strip">
        <div><strong>One portal</strong><span>for your entire delivery journey</span></div>
        <div><strong>Live</strong><span>shipment visibility</span></div>
        <div><strong>Photo</strong><span>proof at pickup & delivery</span></div>
        <div><strong>RWF</strong><span>transparent pricing</span></div>
      </section>

      <section id="services" className="section">
        <div className="section-kicker">Everything you need</div>
        <div className="section-heading"><h2>Shipping without the logistics headache.</h2><p>Built around the same Peleka delivery experience you already use on mobile, now optimized for a larger screen.</p></div>
        <div className="feature-grid">
          {features.map(({icon: Icon, title, text}) => <article className="feature-card" key={title}><div className="feature-icon"><Icon size={21}/></div><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section id="how" className="dark-section">
        <div className="section-kicker light">HOW PELEKA WORKS</div>
        <h2>From location to doorstep.</h2>
        <div className="steps">
          {[
            ["01","Choose locations","Search for pickup and delivery locations or use your current location."],
            ["02","Create shipment","Add recipient details, parcel information and review your price."],
            ["03","Pay or use your plan","Standard shipments are paid before assignment. Premier customers can be billed later."],
            ["04","Track & receive","Watch the shipment move and see pickup/delivery proof when completed."]
          ].map(([n,t,d]) => <div className="step" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}
        </div>
      </section>

      <section id="tracking" className="track-cta">
        <div><div className="section-kicker">SHIPMENT TRACKING</div><h2>Know where it is.<br/>Know what's next.</h2></div>
        <Link href="/track" className="button button-light">Track with a number <ArrowRight size={17}/></Link>
      </section>

      <footer><Link href="/" className="brand">PELEKA<span>.</span></Link><p>Delivery that moves with you.</p><div><Link href="/login">Customer portal</Link><Link href="/track">Track shipment</Link></div></footer>
    </main>
  );
}
