import NewsCard from "@/components/NewsCard";
import { mockArticles } from "@/lib/mockData";

export const metadata = { title: "Agriculture - Sugartimes" };

const agriArticles = mockArticles.filter((a) => a.category === "Agriculture");

export default function AgriculturePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Agriculture & Farming</h1>
        <p className="text-slate-500">Sugarcane cultivation, new varieties, irrigation, and field best practices</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: "☀️", label: "Season", value: "Rabi 2025-26", sub: "Crushing ongoing" },
          { icon: "🌧️", label: "Monsoon", value: "Above Normal", sub: "IMD Forecast 2026" },
          { icon: "🌿", label: "Acreage", value: "5.8 M Hectares", sub: "All-India estimate" },
          { icon: "📊", label: "Recovery", value: "10.8%", sub: "National average" },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
            <div className="text-2xl">{item.icon}</div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{item.label}</p>
              <p className="font-bold text-slate-900 text-sm">{item.value}</p>
              <p className="text-xs text-slate-400">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-8">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {agriArticles.slice(0, 2).map((a) => <NewsCard key={a.id} article={a} />)}
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Popular Cane Varieties</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Variety</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Region</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">Yield (T/Ha)</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">Recovery %</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Maturity</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Co-0238", "North India", "85-90", "11.2", "Early (10-11 months)"],
                    ["Co-86032", "South India", "90-100", "10.8", "Mid (12 months)"],
                    ["CoM-0265", "Maharashtra", "80-85", "11.5", "Early (10 months)"],
                    ["Co-C 671", "Tamil Nadu", "95-105", "10.5", "Late (14 months)"],
                    ["CoS-8436", "UP/Bihar", "75-80", "10.9", "Mid (12 months)"],
                  ].map(([v, r, y, rec, m]) => (
                    <tr key={v} className="border-t border-slate-50 hover:bg-green-50/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800">{v}</td>
                      <td className="px-4 py-3 text-slate-500">{r}</td>
                      <td className="px-4 py-3 text-right text-slate-700">{y}</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">{rec}%</td>
                      <td className="px-4 py-3 text-slate-500">{m}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">More Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockArticles.slice(0, 6).map((a) => <NewsCard key={a.id} article={a} compact />)}
          </div>
        </div>
        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 mb-3">🌱 Crop Calendar</h3>
            <div className="space-y-2 text-sm">
              {[["Planting (Adsali)", "Jul-Aug"], ["Planting (Suru)", "Oct-Nov"], ["Planting (Pre-seasonal)", "Jan-Feb"], ["Harvesting", "Oct-Apr"]].map(([act, period]) => (
                <div key={act} className="flex justify-between">
                  <span className="text-slate-600">{act}</span>
                  <span className="font-semibold text-green-700">{period}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-3">🔬 Research Bodies</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {["ICAR-IISR Lucknow", "NFCSF", "DSCRI Coimbatore", "VSICL Pune", "UPCSR Shahjahanpur"].map((b) => (
                <li key={b} className="hover:text-amber-600 cursor-pointer transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />{b}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 mb-2">💧 Irrigation Schemes</h3>
            <p className="text-sm text-slate-500 mb-3">Government subsidies for drip irrigation available</p>
            <button className="w-full bg-amber-500 text-white text-sm font-semibold py-2 rounded-lg hover:bg-amber-600 transition-colors">Learn More</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
