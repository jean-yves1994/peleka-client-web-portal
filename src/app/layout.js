import "./globals.css";

export const metadata = {
  title: "Peleka — Move anything. We'll get it there.",
  description: "Peleka customer portal for shipments, tracking and delivery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
