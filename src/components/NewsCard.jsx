import Link from "next/link";
import { Lock, TrendingUp, Calendar } from "lucide-react";

export default function NewsCard({ article, compact = false }) {
  const getImageUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800";
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${url}`;
  };

  return (
    <Link href={`/article/${article.id}`} className="group block bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className={`relative overflow-hidden ${compact ? "h-36" : "h-48"}`}>
        <img
          src={getImageUrl(article.image)}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            {article.category}
          </span>
          {article.trending && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp size={9} /> Hot
            </span>
          )}
          {article.premium && (
            <span className="bg-slate-900 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Lock size={9} /> Premium
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className={`font-semibold text-slate-800 group-hover:text-green-600 transition-colors leading-snug mb-2 ${compact ? "text-sm line-clamp-2" : "text-base line-clamp-2"}`}>
          {article.title}
        </h3>
        {!compact && <p className="text-sm text-slate-500 line-clamp-2 mb-3">{article.excerpt}</p>}
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Calendar size={11} />
          <span>{new Date(article.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
      </div>
    </Link>
  );
}
