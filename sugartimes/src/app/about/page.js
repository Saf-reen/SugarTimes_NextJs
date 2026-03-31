import Link from "next/link";

export const metadata = { title: "About – Sugartimes" };

const team = [
  { name: "Anil Sharma", role: "Editor-in-Chief", img: "https://i.pravatar.cc/150?img=11" },
  { name: "Priya Mehta", role: "Markets Analyst", img: "https://i.pravatar.cc/150?img=47" },
  { name: "Rajesh Patel", role: "Policy Correspondent", img: "https://i.pravatar.cc/150?img=12" },
  { name: "Sunita Rao", role: "Agriculture Reporter", img: "https://i.pravatar.cc/150?img=48" },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-14">
        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">About Us</span>
        <h1 className="text-4xl font-black text-slate-900 mt-4 mb-4">India&apos;s Sugar Industry Intelligence Platform</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Sugartimes has been serving the sugar industry since 2010, providing accurate, timely, and actionable intelligence to mills, farmers, traders, and policymakers.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
        {[["15+", "Years of Service"], ["10,000+", "Subscribers"], ["500+", "Articles/Year"], ["24", "Magazine Issues/Year"]].map(([val, label]) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
            <p className="text-3xl font-black text-amber-500 mb-1">{val}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
        <div className="bg-slate-900 text-white rounded-2xl p-8">
          <h2 className="text-xl font-black mb-3">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed">To empower every stakeholder in India&apos;s sugar value chain with accurate, timely, and actionable intelligence — from the cane field to the global market.</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-8">
          <h2 className="text-xl font-black text-slate-900 mb-3">Our Vision</h2>
          <p className="text-slate-600 leading-relaxed">To be the most trusted and comprehensive platform for sugar industry intelligence in South Asia, driving informed decision-making at every level.</p>
        </div>
      </div>

      {/* Team */}
      <div className="mb-14">
        <h2 className="text-2xl font-black text-slate-900 text-center mb-8">Our Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {team.map((member) => (
            <div key={member.name} className="bg-white rounded-2xl border border-slate-100 p-5 text-center hover:shadow-sm transition-all">
              <img src={member.img} alt={member.name} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover" />
              <p className="font-bold text-slate-900 text-sm">{member.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-black mb-2">Join the Sugartimes Community</h2>
        <p className="text-slate-300 mb-6">Subscribe today and stay ahead in the sugar industry</p>
        <Link href="/subscription" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">View Plans</Link>
      </div>
    </div>
  );
}
