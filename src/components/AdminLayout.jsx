"use client";
import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, FileText, BookOpen, Settings, LogOut, ChevronRight, Shield, Mail, ArrowLeft, TrendingUp } from "lucide-react";

const coreItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Enquiries", href: "/admin/enquiries", icon: Mail },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
];

const specializedItems = [
  { label: "Magazines", href: "/admin/magazines", icon: BookOpen },
  { label: "Market Rates", href: "/admin/markets", icon: TrendingUp },
  { label: "Video Gallery", href: "/admin/videos", icon: FileText },
];

const newsItems = [
  { label: "All Articles", href: "/admin/articles", icon: FileText },
  { label: "Trending News", href: "/admin/articles?trending=true", icon: TrendingUp },
  { label: "Sugar Industry", href: "/admin/articles?category=Sugar+Industry+News", icon: ChevronRight },
  { label: "Ethanol", href: "/admin/articles?category=Ethanol", icon: ChevronRight },
  { label: "Molasses", href: "/admin/articles?category=Molasses", icon: ChevronRight },
  { label: "Market Trends", href: "/admin/articles?category=Market+Trends", icon: ChevronRight },
  { label: "Agriculture", href: "/admin/articles?category=Agriculture", icon: ChevronRight },
  { label: "International Trade", href: "/admin/articles?category=International+Trade", icon: ChevronRight },
  { label: "Interviews", href: "/admin/articles?category=Interviews", icon: ChevronRight },
  { label: "Environmental Impact", href: "/admin/articles?category=Environmental+Impact", icon: ChevronRight },
  { label: "Technology", href: "/admin/articles?category=Technology", icon: ChevronRight },
  { label: "Sugarcane Dept", href: "/admin/articles?category=Sugarcane+Department", icon: ChevronRight },
  { label: "Sugar Diet", href: "/admin/articles?category=Sugar+Diet", icon: ChevronRight },
  { label: "Sugar Food", href: "/admin/articles?category=Sugar+Food", icon: ChevronRight },
];

// Nav items extracted to separate component to use useSearchParams safely
function SidebarNav({ renderNavLink, handleLogout }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const NavSection = ({ title, items }) => (
    <div className="mb-6">
      <h3 className="px-4 mb-2 text-[10px] font-black uppercase tracking-widest text-emerald-400/50">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => {
           const isActive = pathname === item.href || (item.href.includes('?') && pathname + "?" + searchParams.toString() === item.href);
           return renderNavLink(item, isActive);
        })}
      </div>
    </div>
  );

  return (
    <nav className="flex-1 px-4 py-8 overflow-y-auto custom-scrollbar">
      <NavSection title="Core Management" items={coreItems} />
      <NavSection title="Specialized Content" items={specializedItems} />
      <NavSection title="News Sections" items={newsItems} />

      <div className="pt-4 mt-6 border-t border-emerald-800/50">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-emerald-100 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="text-emerald-400/70" />
          Back to Site
        </Link>
        <button
           onClick={handleLogout}
           className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-red-200 hover:bg-red-900/20 transition-colors mt-2"
        >
           <LogOut size={16} className="text-red-400/70" />
           Sign Out
        </button>
      </div>
    </nav>
  );
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/login");
  };

  const renderNavLink = ({ label, href, icon: Icon }, isActive) => {
    return (
      <Link
        key={href}
        href={href}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${isActive
            ? "bg-white/10 text-white shadow-sm border border-white/5"
            : "text-emerald-100 hover:bg-white/5 hover:text-white"
          }`}
      >
        <Icon size={16} className={isActive ? "text-emerald-300" : "text-emerald-400/70"} />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f3ec] flex font-sans">
      <aside className="w-64 bg-[#1b5e20] text-white flex flex-col shrink-0 shadow-xl z-20 sticky top-0 h-screen">
        <div className="p-6 pb-8 border-b border-emerald-800/50">
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-3xl tracking-tight text-white mb-1">
              Sugartimes
            </h1>
            <p className="text-xs text-emerald-200/70 tracking-wide uppercase">Admin Panel</p>
          </div>
        </div>

        <Suspense fallback={<div className="p-8 text-emerald-200/50 text-xs text-center">Loading Nav...</div>}>
          <SidebarNav renderNavLink={renderNavLink} handleLogout={handleLogout} />
        </Suspense>
      </aside>

      {/* Content Area */}
      <div className="flex-1 overflow-auto flex flex-col items-stretch">
        <header className="px-10 py-8">
          <h2 className="text-3xl font-serif text-slate-800 font-bold capitalize">
            {pathname.split("/").pop().replace(/-/g, " ")}
          </h2>
        </header>

        <main className="px-10 pb-10 flex-1">{children}</main>
      </div>
    </div>
  );
}

