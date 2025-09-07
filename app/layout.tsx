import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "Galley Planner Starter",
  description: "Design and publish aircraft galley plans"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="w-full border-b bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
            <Link href="/" className="font-semibold">Galley Planner</Link>
            <Link href="/designer">Designer</Link>
            <Link href="/plans">Plans</Link>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
