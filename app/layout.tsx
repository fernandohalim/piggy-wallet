import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});
const heading = Outfit({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  metadataBase: new URL("https://piggy-wallet-expense-tracker.vercel.app/"),
  title: "Piggy Wallet",
  description: "A simple offline-first expense tracker.",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    title: "Piggy Wallet",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Piggy Wallet",
    description: "A simple, offline-first expense tracker.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Piggy Wallet",
    description: "A simple, offline-first expense tracker.",
  },
};

export const viewport: Viewport = {
  themeColor: "#5B5BD6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${heading.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
