"use client";
import { useState, useEffect } from "react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import { videosAPI } from "@/lib/api";
import { Play, Loader2, Video as VideoIcon } from "lucide-react";

export default function VideoGallery() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await videosAPI.getAll();
        setVideos(data);
        if (data.length > 0) setSelectedVideo(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : (url || null);
  };

  const getThumbnailUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg` : null;
  };

  return (
    <div className="bg-[#fcfcf9] pb-20">
      <main className="max-w-7xl mx-auto px-6 py-6">
        <header className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-2xl">
              <VideoIcon className="text-green-600 w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Sugar Times  <span className="text-green-600">Video Gallery </span></h1>
          <p className="text-slate-500 max-w-xl mx-auto">Explore exclusive documentaries, expert interviews, and the latest technology updates from the sugar industry.</p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 size={40} className="animate-spin text-green-500" /></div>
        ) : videos.length > 0 ? (
          <div className="space-y-12">
            {/* Featured Video */}
            <section className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 p-3 mb-16">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-inner">
                <iframe
                  className="w-full h-full"
                  src={selectedVideo ? getEmbedUrl(selectedVideo.videoUrl) : null}
                  title={selectedVideo?.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4 flex justify-between items-center bg-slate-50/50">
                <div>
                  <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full mb-1 inline-block">NOW PLAYING</span>
                  <h2 className="text-xl font-black text-slate-900 line-clamp-1">{selectedVideo?.title}</h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">CATEGORY</p>
                  <p className="text-xs font-black text-green-600 uppercase">{selectedVideo?.category}</p>
                </div>
              </div>
            </section>

            {/* Video List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((v) => (
                <button
                  key={v._id}
                  onClick={() => {
                    setSelectedVideo(v);
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                  }}
                  className={`flex flex-col text-left group transition-all duration-300 ${selectedVideo?._id === v._id ? "ring-2 ring-green-500 rounded-3xl p-2 bg-green-50" : "hover:scale-[1.02]"}`}
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 bg-slate-200">
                    <img
                      src={getThumbnailUrl(v?.videoUrl)}
                      alt={v?.title || "Video thumbnail"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="text-white fill-white" size={32} />
                    </div>
                  </div>
                  <div className="px-2">
                    <p className="text-[10px] font-bold text-green-600 uppercase mb-1">{v.category}</p>
                    <h3 className="font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-green-700 transition-colors">{v.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <VideoIcon size={64} className="text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">No videos found. Check back later!</h3>
          </div>
        )}
      </main>
    </div>
  );
}
