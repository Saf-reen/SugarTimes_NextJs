"use client";
import AdminLayout from "@/components/AdminLayout";
import { mockMagazines } from "@/lib/mockData";
import { Plus, Edit, Trash2, Upload, Eye } from "lucide-react";

export default function AdminMagazines() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Magazines</h1>
          <p className="text-slate-500 text-sm mt-1">Upload and manage magazine issues</p>
        </div>
        <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Upload size={16} /> Upload Issue
        </button>
      </div>

      {/* Upload area */}
      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center mb-6 hover:border-amber-400 transition-colors cursor-pointer bg-white">
        <Upload size={32} className="text-slate-300 mx-auto mb-3" />
        <p className="font-semibold text-slate-600 mb-1">Drag & drop magazine PDF here</p>
        <p className="text-sm text-slate-400">or click to browse files</p>
        <button className="mt-4 bg-amber-500 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-amber-600 transition-colors">Browse Files</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockMagazines.map((mag) => (
          <div key={mag.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-sm transition-all">
            <div className="relative h-44 overflow-hidden">
              <img src={mag.cover} alt={mag.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2">
                {mag.premium
                  ? <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Premium</span>
                  : <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Free</span>
                }
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-1">{mag.title}</h3>
              <p className="text-xs text-slate-400 mb-3">{mag.pages} pages · {mag.date}</p>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-2 border border-slate-200 rounded-lg hover:border-amber-400 hover:text-amber-600 transition-colors">
                  <Eye size={12} /> Preview
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={14} /></button>
                <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
