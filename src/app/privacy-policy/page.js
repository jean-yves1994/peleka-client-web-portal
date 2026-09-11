import Link from "next/link";

const sections = [
  {
    title: "1. Information We Collect",
    body: (
      <>
        <p>Peleka collects information needed to create accounts, create and deliver shipments, process payments, provide tracking, and secure the service.</p>
        <ul>
          <li><strong>Account data:</strong> full name, email address and/or phone number, password credentials, account ID, and account status.</li>
          <li><strong>Profile data:</strong> profile image when provided, default address, and saved location coordinates.</li>
          <li><strong>Shipment data:</strong> sender and recipient names and phone numbers, pickup and delivery addresses and coordinates, notes, parcel description/category, dimensions, weight, declared value, scheduling information, tracking number, status, and delivery history.</li>
          <li><strong>Payment data:</strong> payment amount, currency, payment status, payment provider reference, payment phone number, and transaction records. Peleka does not receive or store your Mobile Money PIN.</li>
          <li><strong>Location data:</strong> device location when you choose the current-location feature, and precise pickup/delivery coordinates selected for shipments.</li>
          <li><strong>User-generated data:</strong> shipment notes, ratings/comments, and complaint information where those features are used.</li>
          <li><strong>Security and technical logs:</strong> IP address and user-agent information associated with authenticated actions, security events, and audit records.</li>
        </ul>
      </>
    ),
  },
  {
    title: "2. How We Use Your Information",
    body: (
      <ul>
        <li>Create and authenticate your Peleka account and maintain sessions.</li>
        <li>Calculate quotes and process shipments.</li>
        <li>Assign and coordinate delivery personnel.</li>
        <li>Provide shipment tracking and delivery status updates.</li>
        <li>Process Mobile Money payments and maintain payment records.</li>
        <li>Show pickup/delivery proof and shipment history.</li>
        <li>Provide customer support, handle complaints, and resolve delivery issues.</li>
        <li>Protect the platform, prevent fraud and abuse, and maintain audit records.</li>
        <li>Comply with applicable legal obligations.</li>
      </ul>
    ),
  },
  {
    title: "3. Location Information",
    body: (
      <p>
        Peleka can use your device&apos;s location when you choose the current-location feature. You can also search for and manually select pickup and delivery locations. Shipment locations are stored as addresses and latitude/longitude coordinates because they are required to provide delivery services. The app does not continuously collect your device location in the background.
      </p>
    ),
  },
  {
    title: "4. How Information Is Shared",
    body: (
      <>
        <p>We do not sell personal information. Information is shared only as needed to operate Peleka, complete a transaction, or meet legal requirements.</p>
        <ul>
          <li><strong>Delivery personnel:</strong> shipment information needed to collect and deliver a parcel, including relevant names, phone numbers, addresses, and locations.</li>
          <li><strong>Paypack:</strong> payment requests use the customer&apos;s payment phone number and transaction amount. Paypack processes the Mobile Money transaction on Peleka&apos;s behalf.</li>
          <li><strong>OpenStreetMap Nominatim:</strong> when Peleka cannot satisfy a location search from its own location database, the backend sends the search text and, when supplied, nearby coordinates to Nominatim to obtain geocoding results.</li>
          <li><strong>Cloud and infrastructure providers:</strong> providers such as hosting, database, and object-storage services process information on Peleka&apos;s behalf.</li>
          <li><strong>Authorities:</strong> information may be disclosed when legally required or necessary to protect users, the public, or the service.</li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Data We Do Not Collect Through the Customer App",
    body: (
      <p>
        The reviewed customer app does not use advertising or analytics SDKs and does not collect contacts, microphone recordings, camera photos for shipment creation, SMS contents, call history, health information, or installed-app lists. The Android project contains an SMS permission declaration that is not used by the current customer-app code; this permission should be removed before the Play Store release unless a future feature genuinely requires it.
      </p>
    ),
  },
  {
    title: "6. Data Security",
    body: (
      <p>
        Production API communication is configured to use HTTPS. Authentication tokens are stored using the app&apos;s secure storage mechanism, and the backend stores passwords as password hashes rather than plaintext passwords. Access to shipment and contact information is controlled by account role and shipment ownership.
      </p>
    ),
  },
  {
    title: "7. Data Retention",
    body: (
      <p>
        Peleka retains account, shipment, payment, audit, and related records for as long as reasonably necessary to operate the service, resolve disputes, prevent fraud and abuse, maintain transaction records, and meet legal obligations. Some records may therefore remain after a shipment is completed.
      </p>
    ),
  },
  {
    title: "8. Account and Data Deletion",
    body: (
      <p>
        The current reviewed customer app and backend do not yet expose a completed account-deletion workflow. This is a release-readiness gap: because Peleka allows account creation, Google Play requires an in-app deletion path and a working web resource through which users can request deletion of their account and associated data. Peleka must implement and verify this workflow before Play Store submission.
      </p>
    ),
  },
  {
    title: "9. Children&apos;s Privacy",
    body: (
      <p>Peleka is a general courier service and is not directed to children. We do not knowingly collect personal information from children in violation of applicable law.</p>
    ),
  },
  {
    title: "10. Changes to This Policy",
    body: (
      <p>We may update this Privacy Policy when Peleka&apos;s features, data practices, or legal obligations change. The effective date shown below will be updated when material changes are made.</p>
    ),
  },
  {
    title: "11. Privacy Contact",
    body: (
      <p>
        For privacy questions or requests, use the customer support/contact mechanism provided by Peleka. A dedicated public privacy contact should be added to this page before the Play Store submission so users have a clear way to submit privacy enquiries and deletion requests.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/" className="brand" style={styles.brand}>PELEKA<span>.</span></Link>
        <Link href="/" style={styles.backLink}>Back to Peleka</Link>
      </header>
      <article style={styles.article}>
        <div style={styles.kicker}>LEGAL</div>
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.intro}>
          This Privacy Policy explains how Peleka collects, uses, stores, and shares information when you use the Peleka customer mobile application, customer portal, and related delivery services.
        </p>
        <p style={styles.updated}>Effective date: September 11, 2026</p>
        <div style={styles.notice}>
          <strong>Peleka does not sell your personal information.</strong>
          <span>We use personal information primarily to provide courier, tracking, payment, security, and customer-service functions.</span>
        </div>
        {sections.map((section) => (
          <section key={section.title} style={styles.section}>
            <h2 style={styles.heading}>{section.title}</h2>
            <div style={styles.body}>{section.body}</div>
          </section>
        ))}
      </article>
      <footer style={styles.footer}>
        <Link href="/" className="brand" style={styles.brand}>PELEKA<span>.</span></Link>
        <span>Delivery that moves with you.</span>
      </footer>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f7f7f5", color: "#171313" },
  header: { maxWidth: 1180, margin: "0 auto", padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  brand: { textDecoration: "none", color: "#171313", fontWeight: 800, letterSpacing: "-0.04em", fontSize: 22 },
  backLink: { color: "#6f6864", textDecoration: "none", fontSize: 14, fontWeight: 600 },
  article: { maxWidth: 860, margin: "0 auto", padding: "70px 24px 100px" },
  kicker: { fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", color: "#a76220", marginBottom: 16 },
  title: { fontSize: "clamp(42px, 7vw, 72px)", lineHeight: 1, letterSpacing: "-0.05em", margin: 0 },
  intro: { maxWidth: 720, fontSize: 19, lineHeight: 1.7, color: "#625b57", margin: "28px 0 12px" },
  updated: { fontSize: 13, color: "#817975", marginBottom: 42 },
  notice: { display: "flex", flexDirection: "column", gap: 7, padding: "20px 22px", marginBottom: 48, borderRadius: 16, background: "#fff", border: "1px solid #e5dfdb", fontSize: 14, lineHeight: 1.6 },
  section: { padding: "30px 0", borderTop: "1px solid #e5dfdb" },
  heading: { fontSize: 23, lineHeight: 1.3, letterSpacing: "-0.02em", margin: "0 0 14px" },
  body: { color: "#5f5955", fontSize: 16, lineHeight: 1.75 },
  footer: { maxWidth: 1180, margin: "0 auto", padding: "28px 24px 44px", borderTop: "1px solid #e5dfdb", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, color: "#817975", fontSize: 13 },
};
