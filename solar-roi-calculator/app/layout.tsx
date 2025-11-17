import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Solar Panel ROI Calculator 2024",
  description: "Calculate your solar panel investment return and savings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
