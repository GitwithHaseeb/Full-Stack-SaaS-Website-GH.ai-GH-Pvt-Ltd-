import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email GH Pvt Ltd to start a conversation about design, social media, websites, IT or software.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
