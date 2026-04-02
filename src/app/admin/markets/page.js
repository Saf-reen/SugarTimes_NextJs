"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { marketsAPI } from "@/lib/api";
import { Plus, Trash2, Loader2, X, Save, TrendingUp } from "lucide-react";

export default function AdminMarkets() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ state: "", commodity: "Sugarcane", price: "", unit: "per quintal" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchMarkets(); }, []);

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const { data } = await marketsAPI.getAll();
      setMarkets(Array.isArray(data) ? data : []);
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
      await marketsAPI.create(form);
      setShowForm(false);
      setForm({ state: "", commodity: "Sugarcane", price: "", unit: "per quintal" });
      fetchMarkets();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add market rate");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this market rate?")) return;
    try {
      await marketsAPI.delete(id);
      setMarkets((prev) => prev.filter((m) => (m._id || m.id) !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <TrendingUp className="text-green-600" />
            Live State Rates
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage current market prices by state</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Add New Rate
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900 text-lg">Add State Rate</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">State Name</label>
                <input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                  placeholder="e.g. Maharashtra"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Commodity</label>
                  <input required value={form.commodity} onChange={(e) => setForm({ ...form, commodity: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Price</label>
                  <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="2500"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              </div>
              <button type="submit" disabled={saving}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Saving..." : "Save Rate"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-green-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">State</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">Commodity</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">Price</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">Unit</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {markets.map((m) => (
                  <tr key={m._id || m.id} className="border-t border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-800">{m.state}</td>
                    <td className="px-6 py-4 text-slate-600">{m.commodity}</td>
                    <td className="px-6 py-4 text-slate-900 font-black">₹{m.price}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{m.unit}</td>
                    <td className="px-6 py-4 text-left">
                       <button onClick={() => handleDelete(m._id || m.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                          <Trash2 size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
                {markets.length === 0 && (
                   <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-slate-400">No market rates found. Add your first state rate above.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
