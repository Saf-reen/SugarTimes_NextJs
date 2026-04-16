export default function ArticleInlineAd({ ad }) {
  if (!ad) return null;
  const content = (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <span className="absolute top-3 right-3 z-10 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
        Advertisement
      </span>
      <img src={ad.image} alt={ad.title} className="w-full h-auto object-cover" />
      {ad.title && (
        <div className="px-4 py-3 text-center border-t border-slate-100">
          <p className="text-xs font-bold text-slate-600">{ad.title}</p>
        </div>
      )}
    </div>
  );
  return ad.link ? (
    <a href={ad.link} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
}
