import Link from "next/link";

const sections = [
  {
    title: "1. Information We Collect",
    body: (
      <>
        <p>
          When you use Peleka, we may collect information that you provide directly,
          information generated when you use our services, and information needed to
          operate and secure the platform.
        </p>
        <ul>
          <li><strong>Account information:</strong> name, email address, phone number, and account credentials.</li>
          <li><strong>Shipment information:</strong> pickup and delivery locations, recipient details, parcel details, shipment status, and tracking information.</li>
          <li><strong>Location information:</strong> location information when you choose to use location-based features such as selecting your current pickup location.</li>
          <li><strong>Payment information:</strong> payment and transaction information needed to process shipment payments. Payment details may be processed by our payment service providers.</li>
          <li><strong>Support and communications:</strong> information you provide when contacting us or requesting assistance.</li>
          <li><strong>Technical information:</strong> information such as device, browser, application, network, and usage information that may be generated when you use Peleka.</li>
        </ul>
      </>
    ),
  },
  {
    title: "2. How We Use Your Information",
    body: (
      <>
        <p>We use information we collect to:</p>
        <ul>
          <li>Create and manage your Peleka account.</li>
          <li>Create, process, assign, track, and complete shipments.</li>
          <li>Provide shipment pricing, payment processing, and transaction records.</li>
          <li>Provide shipment tracking and delivery updates.</li>
          <li>Provide pickup and delivery services and proof of delivery.</li>
          <li>Respond to support requests and communicate about your account or shipments.</li>
          <li>Maintain the security, reliability, and performance of Peleka.</li>
          <li>Detect, prevent, and investigate fraud, abuse, or unauthorized activity.</li>
          <li>Comply with applicable legal and regulatory obligations.</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Location Information",
    body: (
      <p>
        Peleka may request access to your device location when you use a feature that
        needs it, such as choosing your current location for a shipment. Location access
        is used to provide the requested service and is not required for features that do
        not need location information. You can manage location permissions through your
        device settings.
      </p>
    ),
  },
  {
    title: "4. How We Share Information",
    body: (
      <>
        <p>
          We do not sell your personal information. We may share information when it is
          necessary to provide Peleka services or comply with applicable requirements,
          including with:
        </p>
        <ul>
          <li><strong>Delivery personnel and service providers:</strong> information needed to collect and deliver shipments.</li>
          <li><strong>Payment providers:</strong> information required to process and verify payments.</li>
          <li><strong>Technology and infrastructure providers:</strong> providers that help us host, secure, operate, and maintain the service.</li>
          <li><strong>Authorities or other parties when required:</strong> where disclosure is required by law or is necessary to protect rights, safety, or the integrity of the service.</li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Data Security",
    body: (
      <p>
        We use reasonable technical and organizational measures designed to protect your
        information against unauthorized access, loss, misuse, alteration, or disclosure.
        No internet-based service can guarantee absolute security, so you should also use
        a strong password and keep your account credentials confidential.
      </p>
    ),
  },
  {
    title: "6. Data Retention",
    body: (
      <p>
        We retain personal information for as long as reasonably necessary to provide our
        services, maintain business and transaction records, resolve disputes, prevent
        abuse, and meet legal or regulatory obligations. When information is no longer
        required, we may delete or anonymize it in accordance with our retention practices.
      </p>
    ),
  },
  {
    title: "7. Your Choices and Rights",
    body: (
      <p>
        Depending on applicable law, you may have rights to access, correct, update, or
        request deletion of your personal information, and to withdraw certain permissions
        such as device location access. You can also contact us if you have questions about
        how your information is used. Some information may need to be retained where we have
        a legal or legitimate reason to do so.
      </p>
    ),
  },
  {
    title: "8. Children's Privacy",
    body: (
      <p>
        Peleka is intended for general users of courier and delivery services and is not
        directed to children. We do not knowingly collect personal information from children
        in violation of applicable law.
      </p>
    ),
  },
  {
    title: "9. Third-Party Services",
    body: (
      <p>
        Peleka may use third-party services for functions such as payment processing,
        hosting, analytics, communications, maps, and other infrastructure. Those providers
        may process information according to their own privacy policies and the services they
        provide to Peleka.
      </p>
    ),
  },
  {
    title: "10. Changes to This Privacy Policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time as Peleka, our services, or
        applicable requirements change. The updated version will be published on this page
        with a revised effective date.
      </p>
    ),
  },
  {
    title: "11. Contact Us",
    body: (
      <p>
        If you have questions, requests, or concerns about this Privacy Policy or the way
        Peleka handles personal information, please contact Peleka through the customer
        support channels provided in the Peleka application or customer portal.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/" className="brand" style={styles.brand}>
          PELEKA<span>.</span>
        </Link>
        <Link href="/" style={styles.backLink}>
          Back to Peleka
        </Link>
      </header>

      <article style={styles.article}>
        <div style={styles.kicker}>LEGAL</div>
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.intro}>
          This Privacy Policy explains how Peleka collects, uses, shares, and protects
          information when you use the Peleka mobile application, customer portal, and
          related delivery services.
        </p>
        <p style={styles.updated}>Effective date: September 11, 2026</p>

        <div style={styles.notice}>
          <strong>Your privacy matters.</strong>
          <span>
            We collect information primarily to provide, secure, and improve your delivery
            experience. We do not sell your personal information.
          </span>
        </div>

        {sections.map((section) => (
          <section key={section.title} style={styles.section}>
            <h2 style={styles.heading}>{section.title}</h2>
            <div style={styles.body}>{section.body}</div>
          </section>
        ))}
      </article>

      <footer style={styles.footer}>
        <Link href="/" className="brand" style={styles.brand}>
          PELEKA<span>.</span>
        </Link>
        <span>Delivery that moves with you.</span>
      </footer>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f5",
    color: "#171313",
  },
  header: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "28px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    textDecoration: "none",
    color: "#171313",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    fontSize: 22,
  },
  backLink: {
    color: "#6f6864",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
  },
  article: {
    maxWidth: 860,
    margin: "0 auto",
    padding: "70px 24px 100px",
  },
  kicker: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.18em",
    color: "#a76220",
    marginBottom: 16,
  },
  title: {
    fontSize: "clamp(42px, 7vw, 72px)",
    lineHeight: 1,
    letterSpacing: "-0.05em",
    margin: 0,
  },
  intro: {
    maxWidth: 720,
    fontSize: 19,
    lineHeight: 1.7,
    color: "#625b57",
    margin: "28px 0 12px",
  },
  updated: {
    fontSize: 13,
    color: "#817975",
    marginBottom: 42,
  },
  notice: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    padding: "20px 22px",
    marginBottom: 48,
    borderRadius: 16,
    background: "#fff",
    border: "1px solid #e5dfdb",
    fontSize: 14,
    lineHeight: 1.6,
  },
  section: {
    padding: "30px 0",
    borderTop: "1px solid #e5dfdb",
  },
  heading: {
    fontSize: 23,
    lineHeight: 1.3,
    letterSpacing: "-0.02em",
    margin: "0 0 14px",
  },
  body: {
    color: "#5f5955",
    fontSize: 16,
    lineHeight: 1.75,
  },
  footer: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "28px 24px 44px",
    borderTop: "1px solid #e5dfdb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    color: "#817975",
    fontSize: 13,
  },
};
