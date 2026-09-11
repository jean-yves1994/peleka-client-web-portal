import Link from "next/link";

const PRIVACY_EMAIL = "covenantsgroupstech@gmail.com";

export const metadata = {
  title: "Delete Your Peleka Account",
  description: "Request deletion of your Peleka account and associated personal data.",
};

export default function DeleteAccountPage() {
  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/" style={styles.brand}>PELEKA<span>.</span></Link>
        <Link href="/privacy-policy" style={styles.backLink}>Privacy Policy</Link>
      </header>

      <article style={styles.article}>
        <div style={styles.kicker}>ACCOUNT &amp; DATA</div>
        <h1 style={styles.title}>Delete your Peleka account</h1>
        <p style={styles.intro}>
          If you want to delete your Peleka account and associated personal data, you can request deletion without signing in to the app.
        </p>

        <section style={styles.card}>
          <div style={styles.icon}>×</div>
          <h2 style={styles.cardTitle}>Request account deletion</h2>
          <p style={styles.body}>
            Send an email to our privacy contact from the email address associated with your Peleka account. Please include your full name and the email address or phone number registered to your Peleka account.
          </p>
          <a
            href={`mailto:${PRIVACY_EMAIL}?subject=Peleka%20Account%20Deletion%20Request`}
            style={styles.button}
          >
            Email deletion request
          </a>
          <p style={styles.email}>Privacy contact: {PRIVACY_EMAIL}</p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>What happens after you request deletion?</h2>
          <ol style={styles.list}>
            <li>We review the request and verify that it relates to the Peleka account identified in the request.</li>
            <li>We process the account deletion and remove personal data associated with the account where deletion is required.</li>
            <li>We may retain limited information where necessary for legitimate purposes such as completed transaction records, fraud prevention, security, dispute resolution, or legal and regulatory obligations. Any retained information remains subject to appropriate protection and is retained only as long as necessary.</li>
          </ol>
          <p style={styles.body}>
            If you have an active shipment, pending payment, unresolved complaint, or other transaction that requires completion or record retention, we may need to resolve or retain the relevant records before or after completing the deletion request. We will explain any material limitation to deletion.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>What should I include?</h2>
          <ul style={styles.list}>
            <li>Your full name</li>
            <li>The email address or phone number registered to your Peleka account</li>
            <li>A clear statement that you want your Peleka account and associated personal data deleted</li>
            <li>Optional: any additional information that can help us identify the account</li>
          </ul>
          <div style={styles.notice}>
            <strong>Do not send passwords, Mobile Money PINs, payment-card details, or other sensitive credentials.</strong>
            <span>We do not need these details to process an account deletion request.</span>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Need help?</h2>
          <p style={styles.body}>
            For privacy questions or help with a deletion request, contact {PRIVACY_EMAIL}. For more information about Peleka&apos;s data practices, read our <Link href="/privacy-policy" style={styles.inlineLink}>Privacy Policy</Link>.
          </p>
        </section>
      </article>

      <footer style={styles.footer}>
        <Link href="/" style={styles.brand}>PELEKA<span>.</span></Link>
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
  article: { maxWidth: 820, margin: "0 auto", padding: "70px 24px 100px" },
  kicker: { fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", color: "#a76220", marginBottom: 16 },
  title: { fontSize: "clamp(40px, 7vw, 68px)", lineHeight: 1.02, letterSpacing: "-0.05em", margin: 0 },
  intro: { maxWidth: 700, fontSize: 19, lineHeight: 1.7, color: "#625b57", margin: "28px 0 40px" },
  card: { padding: "30px", borderRadius: 20, background: "#fff", border: "1px solid #e5dfdb", boxShadow: "0 12px 35px rgba(23,19,19,0.05)" },
  icon: { width: 44, height: 44, borderRadius: 14, background: "#f3e7df", color: "#a76220", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, marginBottom: 18 },
  cardTitle: { fontSize: 25, margin: "0 0 12px", letterSpacing: "-0.02em" },
  body: { color: "#5f5955", fontSize: 16, lineHeight: 1.75, margin: "0 0 18px" },
  button: { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "13px 19px", borderRadius: 10, background: "#171313", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 14 },
  email: { color: "#817975", fontSize: 13, margin: "14px 0 0" },
  section: { padding: "34px 0", borderTop: "1px solid #e5dfdb", marginTop: 34 },
  heading: { fontSize: 23, lineHeight: 1.3, letterSpacing: "-0.02em", margin: "0 0 16px" },
  list: { color: "#5f5955", fontSize: 16, lineHeight: 1.75, paddingLeft: 24, margin: 0 },
  notice: { display: "flex", flexDirection: "column", gap: 6, padding: "18px 20px", marginTop: 22, borderRadius: 14, background: "#fff", border: "1px solid #e5dfdb", color: "#5f5955", fontSize: 14, lineHeight: 1.6 },
  inlineLink: { color: "#a76220", fontWeight: 700 },
  footer: { maxWidth: 1180, margin: "0 auto", padding: "28px 24px 44px", borderTop: "1px solid #e5dfdb", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, color: "#817975", fontSize: 13 },
};
