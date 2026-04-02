import { mockPolicies } from "@/lib/mockData";
import { FileText, ExternalLink, Calendar, Tag } from "lucide-react";

export const metadata = { title: "Policy – Sugartimes" };

const categories = ["All", "Central Government", "Ministry of Petroleum", "CCEA", "DGFT", "State Government", "Ministry of Agriculture"];

export default function PolicyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Sugar Policy Updates</h1>
        <p className="text-slate-500">Government directives, FRP/SAP announcements, export policies, and regulatory updates</p>
      </div>

      <div className="flex gap-8">
        {/* Main */}
        <div className="flex-1">
          {/* Category filters */}
          <div className="flex gap-2 flex-wrap mb-6">
            {categories.map((cat) => (
              <button key={cat} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${cat === "All" ? "bg-green-500 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-green-400"}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Policy cards */}
          <div className="space-y-4">
            {mockPolicies.map((policy) => (
              <div key={policy.id} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Tag size={10} />{policy.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={11} />{new Date(policy.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">{policy.title}</h3>
                    <p className="text-sm text-slate-500 mb-3">{policy.summary}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{policy.content}</p>
                  </div>
                  <div className="shrink-0">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <FileText size={20} className="text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex gap-3">
                  <button className="text-sm text-green-600 font-semibold hover:underline flex items-center gap-1">
                    Read Full Policy <ExternalLink size={12} />
                  </button>
                  <button className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Download PDF</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Key Rates</h3>
            <div className="space-y-3">
              {[["FRP 2026-27", "₹340/qtl"], ["UP SAP 2025-26", "₹375/qtl"], ["Ethanol (C-Heavy)", "₹56.35/L"], ["Ethanol (B-Heavy)", "₹60.73/L"], ["Export Quota", "6 MT"]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-bold text-slate-900">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 mb-2">📋 Policy Alert</h3>
            <p className="text-sm text-slate-600 mb-3">Get notified when new policies are announced</p>
            <button className="w-full bg-green-500 text-white text-sm font-semibold py-2 rounded-lg hover:bg-green-600 transition-colors">Enable Alerts</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Ministries</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {["Ministry of Food", "Ministry of Agriculture", "Ministry of Petroleum", "CCEA", "DGFT", "NITI Aayog"].map((m) => (
                <li key={m} className="hover:text-green-600 cursor-pointer transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />{m}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
