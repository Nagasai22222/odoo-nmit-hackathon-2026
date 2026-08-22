import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dayflow HRMS - Human Resource Management System",
  description: "Every workday, perfectly aligned. Digitized HR operations, attendance, leaves, and payroll.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
