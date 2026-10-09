import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orbit — Your city, on your terms",
  description:
    "Book your next ride with Orbit. Rider and driver dashboards, ride tracking and receipts.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
