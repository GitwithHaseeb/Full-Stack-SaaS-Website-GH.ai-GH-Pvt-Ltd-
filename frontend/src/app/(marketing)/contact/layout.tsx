import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a conversation with GH Pvt Ltd founders Muhammad Haseeb and Ghania Tanveer.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
