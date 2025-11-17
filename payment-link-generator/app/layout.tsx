import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PayLink - Beautiful Payment Links for Creators",
  description: "Create beautiful payment links for your products and services in seconds. Accept one-time payments and subscriptions with ease.",
  keywords: ["payment links", "creators", "freelancers", "stripe", "payments", "subscriptions"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
