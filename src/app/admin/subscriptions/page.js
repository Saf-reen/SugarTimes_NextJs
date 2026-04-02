"use client";
import AdminLayout from "@/components/AdminLayout";
import { mockUsers } from "@/lib/mockData";
import { Edit, RefreshCw, Plus } from "lucide-react";

const subscriptions = mockUsers.map((u, i) => ({
  ...u,
  plan: u.plan,
  start: "2026-01-01",
  end: i % 3 === 0 ? "2026-03-31" : "2027-01-01",
  amount: u.plan === "Premium" ? 799 : u.plan === "Basic" ? 299 : 0,
}));

export default function AdminSubscriptions() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Subscriptions</h1>
          <p className="text-slate-500 text-sm mt-1">Manage user plans and expiry</p>
        </div>
        <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Assign Plan
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[["Premium Users", "1,243", "bg-green-50 border-green-100 text-green-700"], ["Basic Users", "892", "bg-blue-50 border-blue-100 text-blue-700"], ["Free Users", "2,686", "bg-slate-50 border-slate-200 text-slate-600"]].map(([label, val, cls]) => (
          <div key={label} className={`rounded-2xl border p-5 ${cls}`}>
            <p className="text-2xl font-black">{val}</p>
            <p className="text-sm font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">User</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Plan</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Start Date</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">End Date</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600">Amount</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="border-t border-slate-50 hover:bg-slate-50/50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{sub.name}</p>
                    <p className="text-xs text-slate-400">{sub.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sub.plan === "Premium" ? "bg-green-100 text-green-700" : sub.plan === "Basic" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{sub.start}</td>
                  <td className="px-5 py-4 text-slate-500">{sub.end}</td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-900">₹{sub.amount}/mo</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sub.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={14} /></button>
                      <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><RefreshCw size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
