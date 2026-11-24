import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-display" });

export const metadata: Metadata = {
  title: {
    default: "GH Pvt Ltd — Design, Social, Web & IT",
    template: "%s · GH Pvt Ltd",
  },
  description:
    "GH Pvt Ltd handles how a company looks and how it runs online — graphic design, social media management and marketing, website development and management, IT and software development, from one team.",
  openGraph: {
    title: "GH Pvt Ltd — Design, Social, Web & IT",
    description: "Design and systems for companies that have outgrown DIY.",
    images: [{ url: "/brand/gh-lockup-navy-1000.png", width: 1000, height: 1000, alt: "GH Pvt Ltd" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
