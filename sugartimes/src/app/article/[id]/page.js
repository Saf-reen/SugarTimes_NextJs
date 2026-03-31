import { mockArticles } from "@/lib/mockData";
import NewsCard from "@/components/NewsCard";
import Link from "next/link";
import { Calendar, Tag, Lock, ArrowLeft, Bookmark, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return mockArticles.map((a) => ({ id: String(a.id) }));
}

export async function generateMetadata({ params }) {
  const article = mockArticles.find((a) => a.id === Number(params.id));
  return { title: article ? `${article.title} – Sugartimes` : "Article – Sugartimes" };
}

export default function ArticlePage({ params }) {
  const article = mockArticles.find((a) => a.id === Number(params.id));
  if (!article) notFound();

  const related = mockArticles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link href="/news" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-600 transition-colors mb-6">
        <ArrowLeft size={15} /> Back to News
      </Link>

      <div className="flex gap-8">
        {/* Article */}
        <article className="flex-1 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Tag size={10} />{article.category}
            </span>
            {article.premium && (
              <span className="bg-slate-900 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Lock size={10} /> Premium
              </span>
            )}
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar size={11} />{new Date(article.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-3xl font-black text-slate-900 leading-tight mb-4">{article.title}</h1>
          <p className="text-lg text-slate-500 mb-6 leading-relaxed">{article.excerpt}</p>

          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center text-sm font-bold text-amber-700">ST</div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Sugartimes Editorial</p>
              <p className="text-xs text-slate-400">Sugar Industry Desk</p>
            </div>
            <div className="ml-auto flex gap-2">
              <button className="p-2 rounded-lg border border-slate-200 hover:border-amber-400 hover:text-amber-600 transition-colors text-slate-500">
                <Bookmark size={15} />
              </button>
              <button className="p-2 rounded-lg border border-slate-200 hover:border-amber-400 hover:text-amber-600 transition-colors text-slate-500">
                <Share2 size={15} />
              </button>
            </div>
          </div>

          <img src={article.image} alt={article.title} className="w-full h-72 object-cover rounded-2xl mb-8" />

          {article.premium ? (
            <div>
              <p className="text-slate-700 leading-relaxed mb-6">{article.content.slice(0, 200)}...</p>
              <div className="bg-gradient-to-b from-transparent to-white relative -mt-8 pt-8">
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-8 text-center">
                  <Lock size={28} className="text-amber-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Premium Content</h3>
                  <p className="text-slate-500 text-sm mb-5">Subscribe to read the full article and access all premium content.</p>
                  <Link href="/subscription" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">View Plans</Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed text-base mb-4">{article.content}</p>
              <p className="text-slate-700 leading-relaxed text-base mb-4">
                Industry analysts are closely monitoring the situation as it develops. The implications for downstream industries, including confectionery, beverages, and pharmaceuticals, are significant. Stakeholders across the value chain are advised to stay updated with the latest developments.
              </p>
              <p className="text-slate-700 leading-relaxed text-base mb-4">
                The government has indicated that further policy measures may be announced in the coming weeks to address supply-demand imbalances. Sugar mills are urged to maintain transparent reporting and comply with all regulatory requirements.
              </p>
              <blockquote className="border-l-4 border-amber-500 pl-4 my-6 text-slate-600 italic">
                "The sugar industry is at a pivotal juncture. Collaborative efforts between mills, farmers, and the government are essential for sustainable growth." — Industry Expert
              </blockquote>
              <p className="text-slate-700 leading-relaxed text-base">
                For more detailed analysis and data, subscribers can access the full market report in the Sugartimes Premium section. Stay tuned for follow-up coverage.
              </p>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 mb-2">📬 Stay Updated</h3>
            <p className="text-sm text-slate-500 mb-3">Get daily sugar industry news in your inbox</p>
            <input type="email" placeholder="Your email" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <button className="w-full bg-amber-500 text-white text-sm font-semibold py-2 rounded-lg hover:bg-amber-600 transition-colors">Subscribe</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Related Articles</h3>
            <div className="space-y-3">
              {related.map((a) => (
                <Link key={a.id} href={`/article/${a.id}`} className="flex gap-3 group">
                  <img src={a.image} alt={a.title} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                  <p className="text-xs font-semibold text-slate-700 line-clamp-3 group-hover:text-amber-600 transition-colors">{a.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Related articles bottom */}
      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-5">More in {article.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((a) => <NewsCard key={a.id} article={a} compact />)}
          </div>
        </div>
      )}
    </div>
  );
}
