import type { Metadata } from "next";
import { DM_Sans, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Inside AI — Learn How Models Think",
  description:
    "A calm, interactive journey through a simulated AI mind. Watch your words travel from understanding to reply—built for curiosity, not jargon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-accent="sage"
      className={`${fraunces.variable} ${dmSans.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full bg-void text-[var(--text)] antialiased">{children}</body>
    </html>
  );
}
