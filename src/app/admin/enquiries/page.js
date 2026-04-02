"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { adminAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/admin/login");
      return;
    }
    if (isAdmin) fetchEnquiries();
  }, [user, isAdmin, authLoading]);

  const fetchEnquiries = async () => {
    try {
      const { data } = await adminAPI.getEnquiries();
      setEnquiries(data);
    } catch (err) {
      toast.error("Failed to load enquiries");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this enquiry?")) return;
    try {
      await adminAPI.deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
      toast.success("Enquiry deleted");
    } catch (err) {
      toast.error("Failed to delete enquiry");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await adminAPI.updateEnquiryStatus(id, newStatus);
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: data.status } : e))
      );
      toast.success(`Marked as ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const statusColor = (status) => {
    if (status === "unread") return "bg-green-100 text-green-800";
    if (status === "read") return "bg-blue-100 text-blue-800";
    return "bg-green-700 text-white"; // resolved
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-green-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Enquiries</h1>
        <p className="text-slate-500 text-sm mt-1">
          Contact form submissions from users — {enquiries.length} total
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#fcfbf7] border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Contact No.</th>
                <th className="px-6 py-4 w-1/3">Message</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No enquiries yet. They will appear here when users submit the contact form.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{enq.fullName}</td>
                    <td className="px-6 py-4 text-slate-500">{enq.email}</td>
                    <td className="px-6 py-4 text-slate-500">{enq.contactNo}</td>
                    <td
                      className="px-6 py-4 text-slate-500 truncate max-w-xs"
                      title={enq.commentsOrMessage}
                    >
                      {enq.commentsOrMessage}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={enq.status || "unread"}
                        onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer outline-none ${statusColor(
                          enq.status || "unread"
                        )}`}
                      >
                        <option value="unread">unread</option>
                        <option value="read">read</option>
                        <option value="resolved">resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(enq._id)}
                        className="text-red-500 hover:text-red-700 font-medium text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
