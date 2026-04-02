import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black">S</span>
            </div>
            <span className="text-white font-black text-lg">Sugar<span className="text-amber-400">times</span></span>
          </div>
          <p className="text-sm text-slate-400 mb-4">India&apos;s premier platform for sugar industry intelligence — news, markets, policy, and more.</p>
          <div className="flex gap-3">
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-amber-500 transition-colors text-xs font-bold text-slate-300">𝕏</a>
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-amber-500 transition-colors"><ExternalLink size={16} /></a>
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-amber-500 transition-colors text-xs font-bold text-slate-300">▶</a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[["News", "/news"], ["Markets", "/markets"], ["Policy", "/policy"], ["Agriculture", "/agriculture"], ["Magazines", "/magazines"]].map(([label, href]) => (
              <li key={href}><Link href={href} className="hover:text-amber-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {[["About Us", "/about"], ["Contact", "/contact"], ["Subscription", "/subscription"], ["Dashboard", "/dashboard"], ["Admin", "/admin/login"]].map(([label, href]) => (
              <li key={href}><Link href={href} className="hover:text-amber-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 text-amber-400 shrink-0" /><span>123 Sugar House, New Delhi – 110001</span></li>
            <li className="flex items-center gap-2"><Phone size={15} className="text-amber-400 shrink-0" /><span>+91 98765 43210</span></li>
            <li className="flex items-center gap-2"><Mail size={15} className="text-amber-400 shrink-0" /><span>info@sugartimes.com</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-500">
        © 2026 Sugartimes. All rights reserved. | Prototype – Backend integration pending.
      </div>
    </footer>
  );
}
