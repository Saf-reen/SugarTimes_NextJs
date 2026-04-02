"use client";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isTakeoverPage = pathname === "/about";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 font-sans" suppressHydrationWarning>
        <AuthProvider>
          {!isTakeoverPage && <Navbar />}
          <main className={isTakeoverPage ? "min-h-screen grow flex flex-col" : "grow flex flex-col"}>{children}</main>
          {!isTakeoverPage && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
