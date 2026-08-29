import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHubUniverse — Retro Terminal GitHub Discovery Platform",
  description: "A pixel-powered GitHub repository discovery, collection, bookmarking, and tracking platform.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👾</text></svg>",
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
