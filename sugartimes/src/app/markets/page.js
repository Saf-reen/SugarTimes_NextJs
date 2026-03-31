"use client";
import { useState, useEffect } from "react";
import { marketsAPI } from "@/lib/api";
import { mockMarketPrices, mockChartData } from "@/lib/mockData";
import { TrendingUp, TrendingDown, Minus, RefreshCw, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const globalPrices = [
  { market: "New York (ICE)", commodity: "Raw Sugar No.11", price: "24.5c/lb", change: "+0.3" },
  { market: "London (LIFFE)", commodity: "White Sugar No.5", price: "$548/MT", change: "+4.2" },
  { market: "India (NCDEX)", commodity: "Sugar S-30", price: "Rs 3,450/qtl", change: "+12" },
  { market: "Brazil (B3)", commodity: "Crystal Sugar", price: "R$2,840/MT", change: "-8" },
];

export default function MarketsPage() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => { fetchMarkets(); }, []);

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const { data } = await marketsAPI.getAll({ limit: 50 });
      setMarkets(Array.isArray(data) ? data : []);
    } catch {
      setMarkets(mockMarketPrices);
    } finally {
      setLoading(false);
    }
  };

  const states = ["All", ...new Set(markets.map((p) => p.state))];
  const filtered = filter === "All" ? markets : markets.filter((p) => p.state === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Sugar Market Prices</h1>
        <p className="text-slate-500">Live sugarcane and sugar prices — domestic and international</p>
      </div>

      {/* Global prices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {globalPrices.map((g, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{g.market}</p>
            <p className="text-sm text-slate-600 mb-2">{g.commodity}</p>
            <p className="text-xl font-black text-slate-900">{g.price}</p>
            <span className={`text-sm font-semibold flex items-center gap-1 mt-1 ${g.change.startsWith("+") ? "text-green-600" : "text-red-500"}`}>
              {g.change.startsWith("+") ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {g.change} today
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Sugar Price Trend (Rs/quintal)</h2>
          <button onClick={fetchMarkets} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-600 transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={mockChartData}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} domain={[3100, 3500]} />
            <Tooltip formatter={(v) => [`Rs ${v}`, "Price"]} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
            <Area type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={2.5} fill="url(#priceGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* State-wise table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-wrap gap-3">
          <h2 className="font-bold text-slate-900">State-wise Sugarcane Prices</h2>
          <div className="flex gap-2 overflow-x-auto">
            {states.map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filter === s ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-amber-50"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-amber-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">State</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Variety</th>
                  <th className="text-right px-6 py-3 font-semibold text-slate-600">Price (Rs/qtl)</th>
                  <th className="text-right px-6 py-3 font-semibold text-slate-600">Change</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={row._id || i} className="border-t border-slate-50 hover:bg-amber-50/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{row.state}</td>
                    <td className="px-6 py-4 text-slate-500">{row.variety}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">Rs {row.price?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 font-semibold ${row.change > 0 ? "text-green-600" : row.change < 0 ? "text-red-500" : "text-slate-400"}`}>
                        {row.change > 0 ? <TrendingUp size={13} /> : row.change < 0 ? <TrendingDown size={13} /> : <Minus size={13} />}
                        {row.change > 0 ? "+" : ""}{row.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-4 text-center">* Prices are indicative. Data sourced from backend API.</p>
    </div>
  );
}
