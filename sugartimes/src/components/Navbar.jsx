"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
  { label: "Markets", href: "/markets" },
  { label: "Policy", href: "/policy" },
  { label: "Agriculture", href: "/agriculture" },
  { label: "Magazines", href: "/magazines" },
  { label: "Subscription", href: "/subscription" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top bar */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 flex justify-between items-center">
        <span>🇮🇳 India&apos;s Premier Sugar Industry Platform</span>
        <div className="flex gap-4">
          {isAdmin && <Link href="/admin/dashboard" className="hover:text-amber-400 transition-colors">Admin</Link>}
          {!user
            ? <Link href="/login" className="hover:text-amber-400 transition-colors">Login</Link>
            : <span className="text-slate-300">Hi, {user.name?.split(" ")?.[0]}</span>
          }
          <Link href="/subscription" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">Subscribe</Link>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-lg">S</span>
          </div>
          <div>
            <span className="text-xl font-black text-slate-900">Sugar</span>
            <span className="text-xl font-black text-amber-500">times</span>
            <div className="text-[10px] text-slate-500 leading-none -mt-0.5">Sugar Industry Intelligence</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === link.href ? "bg-amber-50 text-amber-600" : "text-slate-600 hover:text-amber-600 hover:bg-amber-50"}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors">
            <Search size={18} />
          </button>

          {user ? (
            <div className="relative hidden sm:block">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:border-amber-400 transition-colors text-sm font-medium text-slate-700">
                <User size={15} />
                {user.name?.split(" ")?.[0]}
                <ChevronDown size={13} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-slate-100 shadow-lg py-1 z-50">
                  <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                    <User size={14} /> Dashboard
                  </Link>
                  {isAdmin && (
                    <Link href="/admin/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                      ⚙️ Admin Panel
                    </Link>
                  )}
                  <hr className="my-1 border-slate-100" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden sm:flex items-center gap-1 p-2 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors">
              <User size={18} />
            </Link>
          )}

          <Link href="/subscription" className="hidden sm:block bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Subscribe
          </Link>
          <button className="lg:hidden p-2 rounded-md text-slate-600" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-slate-100 px-4 py-3 bg-white">
          <div className="max-w-2xl mx-auto relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input autoFocus type="text" placeholder="Search news, markets, policies..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${pathname === link.href ? "bg-amber-50 text-amber-600" : "text-slate-700 hover:bg-amber-50 hover:text-amber-600"}`}>
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            {user
              ? <button onClick={handleLogout} className="flex-1 text-center py-2 border border-red-200 rounded-lg text-sm font-medium text-red-500">Logout</button>
              : <Link href="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">Login</Link>
            }
            <Link href="/subscription" onClick={() => setOpen(false)} className="flex-1 text-center py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold">Subscribe</Link>
          </div>
        </div>
      )}
    </header>
  );
}
