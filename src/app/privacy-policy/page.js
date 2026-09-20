import Link from "next/link";

const styles = {
  page: { minHeight: "100vh", background: "#f7f9fc", color: "#172033", fontFamily: "Arial, sans-serif" },
  header: { maxWidth: "1100px", margin: "0 auto", padding: "28px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  brand: { fontSize: "24px", fontWeight: 800, color: "#172033", textDecoration: "none", letterSpacing: "0.5px" },
  backLink: { color: "#2747aa", textDecoration: "none", fontWeight: 600 },
  article: { maxWidth: "900px", margin: "0 auto", padding: "48px 24px 80px", background: "#fff", borderRadius: "18px", boxShadow: "0 8px 30px rgba(23,32,51,0.06)" },
  kicker: { color: "#2747aa", fontSize: "12px", fontWeight: 800, letterSpacing: "1.5px", marginBottom: "10px" },
  title: { fontSize: "44px", lineHeight: 1.1, margin: "0 0 18px" },
  intro: { fontSize: "18px", lineHeight: 1.7, color: "#536078", margin: "0 0 10px" },
  updated: { fontSize: "14px", color: "#7a8498", marginBottom: "28px" },
  notice: { display: "flex", flexDirection: "column", gap: "6px", padding: "18px 20px", borderRadius: "12px", background: "#eef4ff", marginBottom: "36px", lineHeight: 1.6 },
  section: { marginTop: "32px" },
  heading: { fontSize: "22px", margin: "0 0 12px", lineHeight: 1.3 },
  body: { fontSize: "16px", lineHeight: 1.75, color: "#4d586d" },
  inlineLink: { color: "#2747aa", fontWeight: 600 },
  footer: { maxWidth: "1100px", margin: "0 auto", padding: "28px 24px 48px", display: "flex", justifyContent: "space-between", gap: "20px", color: "#7a8498", fontSize: "14px" },
};

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
      <p>Peleka can use your device&apos;s location when you choose the current-location feature. You can also search for and manually select pickup and delivery locations. Shipment locations are stored as addresses and latitude/longitude coordinates because they are required to provide delivery services. The app does not continuously collect your device location in the background.</p>
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
      <p>The reviewed customer app does not use advertising or analytics SDKs and does not collect contacts, microphone recordings, camera photos for shipment creation, SMS contents, call history, health information, or installed-app lists. The Android project contains an SMS permission declaration that is not used by the current customer-app code; this permission should be removed before the Play Store release unless a future feature genuinely requires it.</p>
    ),
  },
  {
    title: "6. Data Security",
    body: (
      <p>Production API communication is configured to use HTTPS. Authentication tokens are stored using the app&apos;s secure storage mechanism, and the backend stores passwords as password hashes rather than plaintext passwords. Access to shipment and contact information is controlled by account role and shipment ownership.</p>
    ),
  },
  {
    title: "7. Data Retention",
    body: (
      <p>Peleka retains account, shipment, payment, audit, and related records for as long as reasonably necessary to operate the service, resolve disputes, prevent fraud and abuse, maintain transaction records, and meet legal obligations. Some records may therefore remain after a shipment is completed.</p>
    ),
  },
  {
    title: "8. Account and Data Deletion",
    body: (
      <p>You can request deletion of your Peleka account and associated personal data at any time through our dedicated <Link href="/delete-account" style={styles.inlineLink}>Account and Data Deletion page</Link>. The page provides a clear deletion-request pathway and the privacy contact needed to submit the request. We will process deletion requests subject to legitimate retention requirements, such as security, fraud prevention, dispute resolution, completed transaction records, or legal and regulatory obligations.</p>
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
      <p>For privacy questions, account deletion requests, or other data requests, contact <a href="mailto:covenantsgroupstech@gmail.com" style={styles.inlineLink}>covenantsgroupstech@gmail.com</a>. You can also use our <Link href="/delete-account" style={styles.inlineLink}>Account and Data Deletion page</Link> to submit a deletion request.</p>
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
        <p style={styles.intro}>This Privacy Policy explains how Peleka collects, uses, stores, and shares information when you use the Peleka customer mobile application, customer portal, and related delivery services.</p>
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
