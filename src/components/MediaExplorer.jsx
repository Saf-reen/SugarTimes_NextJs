"use client";
import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import { mediaAPI } from "@/lib/api";

export default function MediaExplorer({ isOpen, onClose, onSelect }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("");

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data } = await mediaAPI.getAll();
      setFiles(data.files || []);
    } catch (err) {
      console.error("Failed to fetch files", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchFiles();
  }, [isOpen]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const { data } = await mediaAPI.upload(formData);
      fetchFiles();
      setSelectedUrl(data.url);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase italic">Media Explorer</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Upload or select media from your device library</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100 shadow-sm"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <label htmlFor="file-upload" className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#1b5e20] hover:bg-green-50/50 transition-all group relative overflow-hidden">
               <input id="file-upload" type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
               {uploading ? <Loader2 size={24} className="animate-spin text-[#1b5e20]" /> : <Upload size={24} className="text-slate-300 group-hover:text-[#1b5e20] transition-colors" />}
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#1b5e20]">{uploading ? "Uploading..." : "New Device File"}</span>
            </label>

            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-square rounded-3xl bg-slate-50 animate-pulse" />
              ))
            ) : (
              files.map((file, idx) => (
                <div key={idx} 
                  onClick={() => setSelectedUrl(file.url)}
                  className={`aspect-square rounded-3xl overflow-hidden border-2 cursor-pointer transition-all relative group
                    ${selectedUrl === file.url ? "border-[#1b5e20] ring-4 ring-green-100" : "border-slate-50 hover:border-slate-200"}`}>
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  {selectedUrl === file.url && (
                    <div className="absolute inset-0 bg-green-900/10 flex items-center justify-center backdrop-blur-[1px]">
                      <CheckCircle2 size={32} className="text-white fill-green-600 drop-shadow-md" />
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[8px] text-white font-bold truncate">{file.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Cancel</button>
          <button 
            disabled={!selectedUrl}
            onClick={() => { onSelect(selectedUrl); onClose(); }} 
            className="px-8 py-3 bg-[#1b5e20] hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-green-900/20 transition-all disabled:opacity-40 active:scale-95">
            Select Asset
          </button>
        </div>
      </div>
    </div>
  );
}
