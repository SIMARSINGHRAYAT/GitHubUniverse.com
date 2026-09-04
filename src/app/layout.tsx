import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHubUniverse — Retro Terminal GitHub Discovery Platform",
  description: "A pixel-powered GitHub repository discovery, collection, bookmarking, and tracking platform.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#050508] text-white antialiased overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
