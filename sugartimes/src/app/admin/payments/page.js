import AdminLayout from "@/components/AdminLayout";
import { CheckCircle, Clock, XCircle } from "lucide-react";

const payments = [
  { id: "TXN001", user: "Rajesh Kumar", plan: "Premium", amount: 799, date: "2026-03-28", method: "UPI", status: "Success" },
  { id: "TXN002", user: "Priya Sharma", plan: "Basic", amount: 299, date: "2026-03-27", method: "Card", status: "Success" },
  { id: "TXN003", user: "Amit Patel", plan: "Premium", amount: 799, date: "2026-03-26", method: "Net Banking", status: "Pending" },
  { id: "TXN004", user: "Sunita Devi", plan: "Basic", amount: 299, date: "2026-03-25", method: "UPI", status: "Failed" },
  { id: "TXN005", user: "Vikram Singh", plan: "Premium", amount: 799, date: "2026-03-24", method: "Card", status: "Success" },
  { id: "TXN006", user: "Meena Gupta", plan: "Basic", amount: 299, date: "2026-03-23", method: "Wallet", status: "Success" },
];

const statusIcon = { Success: <CheckCircle size={14} className="text-green-500" />, Pending: <Clock size={14} className="text-amber-500" />, Failed: <XCircle size={14} className="text-red-500" /> };
const statusClass = { Success: "bg-green-100 text-green-700", Pending: "bg-amber-100 text-amber-700", Failed: "bg-red-100 text-red-600" };

export default function AdminPayments() {
  const total = payments.filter((p) => p.status === "Success").reduce((s, p) => s + p.amount, 0);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Payments</h1>
        <p className="text-slate-500 text-sm mt-1">Transaction history and revenue tracking</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[["Total Revenue", `₹${total.toLocaleString()}`, "text-green-600 bg-green-50"], ["Pending", payments.filter((p) => p.status === "Pending").length, "text-amber-600 bg-amber-50"], ["Failed", payments.filter((p) => p.status === "Failed").length, "text-red-600 bg-red-50"]].map(([label, val, cls]) => (
          <div key={label} className={`rounded-2xl border p-5 ${cls} border-current/20`}>
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
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Transaction ID</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">User</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Plan</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600">Amount</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Method</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Date</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-slate-50 hover:bg-slate-50/50">
                  <td className="px-5 py-4 font-mono text-xs text-slate-500">{p.id}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{p.user}</td>
                  <td className="px-5 py-4"><span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{p.plan}</span></td>
                  <td className="px-5 py-4 text-right font-bold text-slate-900">₹{p.amount}</td>
                  <td className="px-5 py-4 text-slate-500">{p.method}</td>
                  <td className="px-5 py-4 text-slate-500">{p.date}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${statusClass[p.status]}`}>
                      {statusIcon[p.status]}{p.status}
                    </span>
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
