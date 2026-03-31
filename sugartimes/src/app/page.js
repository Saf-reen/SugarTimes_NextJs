import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import PricingCard from "@/components/PricingCard";
import { mockArticles, mockMarketPrices, mockMagazines } from "@/lib/mockData";
import { ArrowRight, TrendingUp, TrendingDown, Minus, ChevronRight, BarChart2 } from "lucide-react";

async function getHomeData() {
  return {
    trending: mockArticles.filter((a) => a.trending).slice(0, 3),
    latest: mockArticles.slice(0, 8),
    markets: mockMarketPrices.slice(0, 5),
    magazines: mockMagazines.slice(0, 3),
  };
}

const plans = [
  { name: "Free", icon: "📰", price: 0, period: "month", description: "Basic access for casual readers", popular: false, cta: "Get Started", features: ["5 articles/month", "Market overview", "Newsletter"] },
  { name: "Basic", icon: "⭐", price: 299, period: "month", description: "For industry professionals", popular: false, cta: "Subscribe Now", features: ["Unlimited articles", "Full market data", "Policy updates", "Email alerts"] },
  { name: "Premium", icon: "🚀", price: 799, period: "month", description: "Complete industry intelligence", popular: true, cta: "Go Premium", features: ["Everything in Basic", "All magazines", "WhatsApp alerts", "Analytics dashboard", "Priority support", "Downloadable reports"] },
];

export default async function HomePage() {
  const { trending, latest, markets, magazines } = await getHomeData();
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-10">
            <span className="inline-block bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">India No.1 Sugar Industry Platform</span>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">Stay Ahead in the <span className="text-amber-400">Sugar Industry</span></h1>
            <p className="text-slate-300 text-lg mb-8">Real-time market prices, policy updates, agriculture insights, and industry magazines all in one place.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/subscription" className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2">Subscribe Now <ArrowRight size={16} /></Link>
              <Link href="/news" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-white/20">Browse News</Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trending.map((article) => (
              <Link key={article.id} href={`/article/${article.id}`} className="group bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl overflow-hidden transition-all">
                <img src={article.image} alt={article.title} className="w-full h-36 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="p-4">
                  <span className="text-amber-400 text-xs font-bold uppercase">{article.category}</span>
                  <h3 className="text-sm font-semibold mt-1 line-clamp-2 group-hover:text-amber-300 transition-colors">{article.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="bg-amber-500 text-white py-2 px-4 text-sm font-medium flex gap-6 overflow-hidden">
        <span>🔴 LIVE: Sugar M-30 Rs 3,450/qtl (+12)</span><span>|</span>
        <span>📊 Raw Sugar NY: 24.5c/lb</span><span>|</span>
        <span>🌾 FRP 2026-27: Rs 340/qtl</span><span>|</span>
        <span>📰 ISMA: 32 MT production forecast</span>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <section className="py-12">
          <div className="flex items-center justify-between mb-6">
            <div><h2 className="text-2xl font-black text-slate-900">Latest News</h2><p className="text-slate-500 text-sm mt-1">Breaking stories from the sugar industry</p></div>
            <Link href="/news" className="flex items-center gap-1 text-amber-600 font-semibold text-sm">View All <ChevronRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {latest.map((article) => (<NewsCard key={article.id} article={article} />))}
          </div>
        </section>
        <section className="py-12 border-t border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div><h2 className="text-2xl font-black text-slate-900">Market Insights</h2><p className="text-slate-500 text-sm mt-1">Live sugarcane prices across states</p></div>
            <Link href="/markets" className="flex items-center gap-1 text-amber-600 font-semibold text-sm">Full Markets <ChevronRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100"><tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">State</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Variety</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">Price</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">Change</th>
                  </tr></thead>
                  <tbody>
                    {markets.map((row, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-amber-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800">{row.state}</td>
                        <td className="px-4 py-3 text-slate-500">{row.variety}</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">Rs {row.price.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`flex items-center justify-end gap-1 font-semibold ${row.change > 0 ? "text-green-600" : row.change < 0 ? "text-red-500" : "text-slate-400"}`}>
                            {row.change > 0 ? <TrendingUp size={13} /> : row.change < 0 ? <TrendingDown size={13} /> : <Minus size={13} />}
                            {row.change > 0 ? "+" : ""}{row.change}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart2 size={16} className="text-amber-500" /> Price Trend</h3>
              <div className="space-y-3">
                {[["Oct 25", 3200, 60], ["Nov 25", 3280, 65], ["Dec 25", 3350, 70], ["Jan 26", 3400, 75], ["Feb 26", 3380, 72], ["Mar 26", 3450, 80]].map(([m, p, w]) => (
                  <div key={m} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-14">{m}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full" style={{ width: `${w}%` }} /></div>
                    <span className="text-xs font-semibold text-slate-700 w-14 text-right">Rs {p}</span>
                  </div>
                ))}
              </div>
              <Link href="/markets" className="mt-5 block text-center text-sm text-amber-600 font-semibold hover:underline">View Full Charts</Link>
            </div>
          </div>
        </section>
        <section className="py-12 border-t border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div><h2 className="text-2xl font-black text-slate-900">Policy Updates</h2><p className="text-slate-500 text-sm mt-1">Government directives affecting the sugar sector</p></div>
            <Link href="/policy" className="flex items-center gap-1 text-amber-600 font-semibold text-sm">All Policies <ChevronRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "FRP 2026-27 Fixed at Rs 340/qtl", tag: "CCEA", date: "Mar 1, 2026", color: "bg-blue-50 border-blue-100" },
              { title: "Ethanol Blending Target Raised to 20%", tag: "Ministry of Petroleum", date: "Feb 15, 2026", color: "bg-green-50 border-green-100" },
              { title: "Sugar Export Ban Lifted - 6 MT Allowed", tag: "DGFT", date: "Mar 10, 2026", color: "bg-amber-50 border-amber-100" },
            ].map((p, i) => (
              <Link key={i} href="/policy" className={`p-5 rounded-xl border ${p.color} hover:shadow-sm transition-all group`}>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{p.tag}</span>
                <h3 className="font-semibold text-slate-800 mt-2 mb-3 group-hover:text-amber-600 transition-colors">{p.title}</h3>
                <span className="text-xs text-slate-400">{p.date}</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="py-12 border-t border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div><h2 className="text-2xl font-black text-slate-900">Agriculture</h2><p className="text-slate-500 text-sm mt-1">Farming techniques, crop varieties, and field insights</p></div>
            <Link href="/agriculture" className="flex items-center gap-1 text-amber-600 font-semibold text-sm">Explore <ChevronRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockArticles.filter((a) => a.category === "Agriculture").slice(0, 2).map((article) => (<NewsCard key={article.id} article={article} />))}
          </div>
        </section>
        <section className="py-12 border-t border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div><h2 className="text-2xl font-black text-slate-900">Magazines</h2><p className="text-slate-500 text-sm mt-1">Monthly editions packed with industry analysis</p></div>
            <Link href="/magazines" className="flex items-center gap-1 text-amber-600 font-semibold text-sm">All Issues <ChevronRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {magazines.map((mag) => (
              <Link key={mag.id} href="/magazines" className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-all">
                <div className="relative h-52 overflow-hidden">
                  <img src={mag.cover} alt={mag.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {mag.premium && <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Premium</div>}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 group-hover:text-amber-600 transition-colors">{mag.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{mag.pages} pages</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="py-12 border-t border-slate-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Choose Your Plan</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Get full access to sugar industry intelligence. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (<PricingCard key={plan.name} plan={plan} />))}
          </div>
          <div className="text-center mt-6"><Link href="/subscription" className="text-amber-600 font-semibold text-sm hover:underline">Compare all features</Link></div>
        </section>
        <section className="py-12 border-t border-slate-100">
          <div className="text-center mb-10"><h2 className="text-3xl font-black text-slate-900 mb-3">Why Sugartimes?</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "📰", title: "Industry News", desc: "Daily updates from mills, markets, and government" },
              { icon: "📊", title: "Market Data", desc: "Real-time sugarcane prices across all major states" },
              { icon: "📋", title: "Policy Tracker", desc: "FRP, SAP, export policy all in one place" },
              { icon: "📚", title: "Digital Magazines", desc: "Monthly editions with deep industry analysis" },
            ].map((b, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 text-center hover:shadow-sm transition-all">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{b.title}</h3>
                <p className="text-sm text-slate-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="py-12 border-t border-slate-100 mb-4">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-black mb-3">Get Industry Updates in Your Inbox</h2>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">Join 10,000+ sugar industry professionals. Daily digest, weekly analysis.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap">Subscribe Free</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
