"use client";

export default function BenefitCard({ emoji, title, description }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 p-5 md:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-bold text-slate-900 text-sm mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
