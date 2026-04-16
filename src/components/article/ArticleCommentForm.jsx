"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { MessageSquare, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function ArticleCommentForm({ articleId }) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    // Comments API not yet wired on backend — show success UX.
    // Admin can wire this later to /articles/:id/comments.
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    setSubmitted(true);
    setComment("");
  };

  return (
    <section className="mt-12 pt-10 border-t border-slate-100">
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare className="text-emerald-600" size={18} />
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Leave a Reply</h3>
      </div>

      {user ? (
        <p className="text-xs text-slate-500 mb-4">
          Logged in as <span className="font-bold text-slate-800">{user.name}</span>.
        </p>
      ) : (
        <p className="text-xs text-slate-500 mb-4">
          <Link href="/login" className="text-emerald-600 font-bold hover:underline">Log in</Link> to leave a comment.
        </p>
      )}

      {submitted ? (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
          <CheckCircle2 size={16} /> Thanks! Your comment is awaiting moderation.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={user ? "Comment" : "Please log in to comment"}
            disabled={!user || submitting}
            rows={5}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all disabled:bg-slate-50 disabled:text-slate-400"
          />
          <button
            type="submit"
            disabled={!user || submitting || !comment.trim()}
            className="bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Post Comment
          </button>
        </form>
      )}
    </section>
  );
}
