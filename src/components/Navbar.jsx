"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, User, LogOut, ChevronDown, Calendar, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { articlesAPI } from "@/lib/api";

const FacebookIcon = ({ size }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>);
const InstagramIcon = ({ size }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>);

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/about"},
  { label: "SUBSCRIBE", href: "/subscription" },
  {
    label: "SUGAR INDUSTRY NEWS",
    href: "/news",
    dropdown: [
      { label: "Sugarcane Department", href: "/news?category=Sugarcane+Department" },
      { label: "Molasses", href: "/news?category=Molasses" },
      { label: "Market Trends", href: "/news?category=Market+Trends" }
    ]
  },
  { label: "ETHANOL", href: "/news?category=Ethanol" },
  { label: "किसान", href: "/agriculture" },
  { 
    label: "HIGHLIGHT", 
    href: "#",
    dropdown: [
      { label: "International Trade", href: "/news?category=International+Trade" },
      { label: "Expert Interviews", href: "/news?category=Interviews" },
      { label: "Environmental Impact", href: "/news?category=Environmental+Impact" },
      { label: "Technology", href: "/news?category=Technology" }
    ]
  },
  { label: "VIDEO", href: "/videos" },
  { label: "CONTACT US", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [tickerArticles, setTickerArticles] = useState([]);
  const [today, setToday] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [globalSearch, setGlobalSearch] = useState("");

  const handleGlobalSearchSubmit = (e) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    router.push(`/news?search=${encodeURIComponent(globalSearch)}`);
    setSearchOpen(false);
    setGlobalSearch("");
  };

  useEffect(() => {
    setToday(new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));

    const fetchTicker = async () => {
      try {
        const res = await articlesAPI.getAll({ limit: 50 });
        const allArticles = Array.isArray(res.data?.articles) ? res.data.articles : (Array.isArray(res.data) ? res.data : []);
        // Prioritize trending articles, fallback to newest
        const trending = allArticles.filter(a => a.trending);
        setTickerArticles(trending.length > 0 ? trending : allArticles.slice(0, 12));
      } catch (err) {
        console.error("Failed to fetch ticker articles", err);
      }
    };
    fetchTicker();
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md font-sans">
      
      {/* Row 1: Tools & Branding (Centered Logo Layout) */}
      <div className="max-w-[1400px] mx-auto px-6 py-4 grid grid-cols-3 items-center bg-white border-b border-slate-50 relative h-20">
        
        {/* Left: Date Tools */}
        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-green-600" />
            <span className="border-b border-slate-200 pb-0.5">{today}</span>
          </div>
        </div>

        {/* Center: Branding Logo */}
        <div className="flex justify-center h-full items-center">
          <Link href="/" className="flex items-center gap-4 transition-all hover:scale-105 active:scale-95 group">
            <div className="w-14 h-14 bg-[#8bc34a] rounded-full flex items-center justify-center shadow-xl shadow-green-500/20 group-hover:shadow-green-500/40 transition-all">
              <svg viewBox="0 0 24 24" className="w-9 h-9 text-white fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s-2-5-2-10S12 2 12 2s2 5 2 10-2 10-2 10z"></path>
                <path d="M10 20s-2-2-2-5 2-5 2-5 2 2 2 5-2 5-2 5z"></path>
                <path d="M14 20s2-2 2-5-2-5-2-5-2 2-2 5 2 5 2 5z"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline leading-none">
                <span className="text-[32px] font-black text-[#142129] tracking-tighter">Sugar</span>
                <span className="text-[32px] font-black text-[#8bc34a] tracking-tighter ml-1.5">Times</span>
              </div>
              <span className="text-[11px] font-black tracking-[0.6em] text-[#142129] mt-1 uppercase opacity-80">MAGAZINE</span>
            </div>
          </Link>
        </div>

        {/* Right: Socials & Auth */}
        <div className="flex items-center justify-end gap-8">
          <div className="hidden sm:flex items-center gap-5 text-slate-600">
            <a href="https://facebook.com/sugartimes" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 hover:scale-125 transition-all duration-300"><FacebookIcon size={18} /></a>
            <a href="https://instagram.com/sugartimes" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 hover:scale-125 transition-all duration-300"><InstagramIcon size={18} /></a>
          </div>

          <div className="h-8 w-[1.5px] bg-slate-100 hidden sm:block"></div>

          <div className="flex items-center gap-4">
             {isAdmin && <Link href="/admin/dashboard" className="text-[11px] font-black text-slate-500 uppercase border-b-2 border-green-500 pb-0.5 tracking-wider hover:text-green-600 transition-colors">Admin</Link>}
             {user ? (
               <div className="relative">
                 <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2.5 text-[11px] font-bold text-slate-700 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
                   <User size={14} className="text-green-600" />
                   {user.name?.split(" ")[0]} <ChevronDown size={12} className={`transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                 </button>
                 {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-4 w-48 bg-white shadow-2xl rounded-2xl py-2 border border-slate-50 z-[999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      <Link href="/dashboard" className="block px-6 py-4 text-xs font-black text-slate-700 hover:bg-slate-50 border-l-4 border-transparent hover:border-green-500 transition-all uppercase tracking-widest">Dashboard</Link>
                      <button onClick={handleLogout} className="w-full text-left px-6 py-4 text-xs font-black text-red-500 hover:bg-red-50 border-l-4 border-transparent hover:border-red-500 transition-all uppercase tracking-widest">Logout</button>
                    </div>
                 )}
               </div>
             ) : (
               <Link href="/login" className="text-[11px] font-bold text-slate-700 uppercase tracking-widest border border-slate-200 px-5 py-2.5 rounded-full hover:bg-[#8bc34a] hover:text-white hover:border-[#8bc34a] transition-all">Login</Link>
             )}
          </div>
        </div>
      </div>

      {/* Row 2: Scrolling News Ticker */}
      <div className="bg-[#0b1c13] h-10 flex items-center overflow-hidden border-b border-green-900/30">
        <div className="max-w-[1400px] w-full mx-auto flex items-center h-full">
           <div className="bg-red-600 h-full flex items-center px-4 shrink-0 relative z-20 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
              <span className="text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap animate-pulse">Trending Now</span>
           </div>
           
           <div className="flex-1 overflow-hidden h-full flex items-center relative px-4">
              <div className="flex whitespace-nowrap animate-ticker group h-full items-center">
                {tickerArticles.length > 0 ? tickerArticles.concat(tickerArticles).map((article, idx) => (
                  <Link key={`${article._id}-${idx}`} href={`/article/${article._id}`} className="mx-8 text-[11px] font-black text-emerald-100/90 hover:text-green-400 transition-colors uppercase tracking-widest flex items-center gap-3">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>
                     {article.title}
                  </Link>
                )) : (
                  <span className="text-[11px] text-emerald-800 font-bold px-8 uppercase tracking-widest italic">Syncing global sugar markets...</span>
                )}
              </div>
           </div>
        </div>
      </div>

      {/* Row 3: Navigation Bar */}
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between bg-white border-t border-slate-50">
        <div className="hidden lg:flex flex-1 items-center h-full">
          <nav className="flex items-center gap-1.5 h-full">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group/navitem h-full flex items-center">
                <Link href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-black transition-all text-[12px] uppercase tracking-wide h-full flex items-center border-b-2 border-transparent ${pathname === link.href ? "text-green-600 border-green-500 bg-green-50/10" : "text-slate-800 hover:text-green-600"}`}>
                  {link.label}
                  {link.dropdown && <ChevronDown size={12} className="group-hover/navitem:rotate-180 transition-transform duration-300" />}
                </Link>
                
                {link.dropdown && (
                  <div className="absolute top-[calc(100%-1px)] left-0 mt-0 w-64 pt-0 opacity-0 invisible group-hover/navitem:opacity-100 group-hover/navitem:visible transition-all duration-300 z-50">
                    <div className="bg-white border-t-2 border-green-500 shadow-2xl flex flex-col py-1.5 translate-y-2 group-hover/navitem:translate-y-0 transition-transform duration-300 font-sans">
                      {link.dropdown.map((subItem) => (
                        <Link key={subItem.label} href={subItem.href}
                          onClick={() => setOpen(false)}
                          className="px-5 py-3 text-[12px] font-bold text-slate-600 hover:bg-green-50 hover:text-green-600 transition-all flex justify-between items-center group/sub">
                          {subItem.label}
                          <ArrowRight size={10} className="opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-slate-800 hover:text-green-600 transition-colors">
            <Search size={18} className="stroke-[2.5]" />
          </button>
          
          <div className="flex items-center gap-3">
            <Link href="/subscription" className="hidden sm:block bg-green-500 hover:bg-green-600 text-white text-[11px] font-black uppercase tracking-widest px-6 py-2.5 shadow-lg shadow-green-500/20 transition-all rounded-full">
              Subscribe
            </Link>
            <button className="lg:hidden p-2 text-slate-800" onClick={() => setOpen(!open)}>
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Global Search Overlay */}
      {searchOpen && (
        <div className="border-t border-slate-100 px-4 py-4 bg-white animate-in slide-in-from-top duration-300">
          <form onSubmit={handleGlobalSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input autoFocus type="text" placeholder="Search news, markets, ethanol..."
                value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:outline-none transition-all shadow-inner" />
            </div>
            <button type="submit" className="bg-green-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-green-600">Search</button>
            <button type="button" onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-white flex flex-col p-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-10">
             <span className="text-xl font-black text-slate-900 uppercase">Sugar<span className="text-green-500">Times</span></span>
             <button onClick={() => setOpen(false)}><X size={28} /></button>
          </div>
          <div className="flex flex-col gap-6 overflow-y-auto">
             {navLinks.map(link => (
                <div key={link.label}>
                   <Link href={link.href} onClick={() => setOpen(false)} className="text-lg font-black text-slate-800 uppercase tracking-wide">{link.label}</Link>
                   {link.dropdown && (
                      <div className="pl-4 mt-3 space-y-3 flex flex-col border-l-2 border-green-500">
                         {link.dropdown.map(s => (
                            <Link key={s.label} href={s.href} onClick={() => setOpen(false)} className="text-sm font-bold text-slate-500 uppercase">{s.label}</Link>
                         ))}
                      </div>
                   )}
                </div>
             ))}
          </div>
        </div>
      )}

    </header>
  );
}
