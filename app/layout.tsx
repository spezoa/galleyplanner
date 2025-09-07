import "@/src/styles/globals.css";
import type { ReactNode } from "react";

export const metadata = { title: "Galley Planner", description: "MVP starter" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container py-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Galley Planner</h1>
            <nav className="flex items-center gap-4 text-sm">
              <a href="/" className="underline">Home</a>
              <a href="/dashboard" className="underline">Dashboard</a>
              <a href="/catalog" className="underline">Catalog</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
