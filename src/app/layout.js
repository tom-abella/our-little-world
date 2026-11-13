import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.URL || "http://localhost:3000");

const title = "Our Little World";
const description =
  "A tiny monthsary world built from all the months we've shared — walk through the gates and collect the memories inside.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: title,
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: title,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        type: "image/png",
        width: 1200,
        height: 630,
        alt: "Our Little World — a tiny monthsary world built from all the months we've shared.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
