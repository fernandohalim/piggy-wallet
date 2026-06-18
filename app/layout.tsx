import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Piggy Wallet",
  description: "A simple offline-first expense tracker.",
  appleWebApp: {
    capable: true,
    title: "Piggy Wallet",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E9F6E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
