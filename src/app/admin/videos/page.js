"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { videosAPI } from "@/lib/api";
import { Plus, Trash2, Loader2, X, Save, Video as VideoIcon } from "lucide-react";

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", videoUrl: "", category: "Sugar Info" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchVideos(); }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const { data } = await videosAPI.getAll();
      setVideos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await videosAPI.create(form);
      setShowForm(false);
      setForm({ title: "", videoUrl: "", category: "Sugar Info" });
      fetchVideos();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add video");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this video?")) return;
    try {
      await videosAPI.delete(id);
      setVideos((prev) => prev.filter((v) => (v._id || v.id) !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  const getYoutubeThumb = (url) => {
     if (!url) return "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300";
     try {
        const id = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
        return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
     } catch {
        return "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300";
     }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <VideoIcon className="text-green-600" />
            Video Gallery
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage video content on the portal</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Add Video
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900 text-lg">Add Video Link</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Video Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Sugar Industry Documentary"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">YouTube URL / Link</label>
                <input required value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white">
                   <option value="Sugar Info">Sugar Info</option>
                   <option value="Ethanol">Ethanol</option>
                   <option value="Technology">Technology</option>
                </select>
              </div>
              <button type="submit" disabled={saving}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Saving..." : "Publish Video"}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-green-500" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.map((v) => (
            <div key={v._id || v.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-sm transition-all group relative">
              <div className="relative h-40 bg-slate-100">
                <img src={getYoutubeThumb(v.videoUrl)} alt={v.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                   <div className="bg-white/90 p-2 rounded-full shadow-lg">
                      <VideoIcon size={24} className="text-green-600" />
                   </div>
                </div>
              </div>
              <div className="p-4">
                 <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-3">{v.title}</h3>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{v.category}</span>
                    <button onClick={() => handleDelete(v._id || v.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                      <Trash2 size={16} />
                    </button>
                 </div>
              </div>
            </div>
          ))}
          {videos.length === 0 && (
             <div className="col-span-full py-20 text-center text-slate-400">No videos found. Upload your first video link above.</div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
